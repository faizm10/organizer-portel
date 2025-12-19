"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSelectedOrgIdFromCookie, getUserOrganizations } from "./org";

export type TaskStatus = "todo" | "doing" | "done";
export type TaskPriority = "low" | "medium" | "high";

export type TaskTeam = "tech" | "logistics" | "sponsorship" | "outreach";

export type Task = {
  id: string;
  org_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority | null;
  due_date: string | null;
  created_by: string;
  assigned_to: string | null;
  team: TaskTeam | null;
  created_at: string;
  updated_at: string;
};

export type CreateTaskInput = {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string;
  assigned_to?: string;
  team?: TaskTeam;
};

export type UpdateTaskInput = {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
  assigned_to?: string | null;
  team?: TaskTeam | null;
};

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Verifies that the user is a member of the given organization.
 * Uses the RPC function to avoid RLS recursion issues.
 */
async function verifyOrgMembership(
  userId: string,
  orgId: string,
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<boolean> {
  try {
    // Use RPC function to bypass RLS recursion
    const { data, error } = await supabase.rpc("get_user_organizations", {
      p_user_id: userId,
    });

    if (error) {
      console.error("[verifyOrgMembership] Error calling RPC:", error);
      // Fallback: try direct query (may fail with recursion)
      const { data: fallbackData } = await supabase
        .from("org_members")
        .select("org_id")
        .eq("user_id", userId)
        .eq("org_id", orgId)
        .limit(1);
      return (fallbackData?.length ?? 0) > 0;
    }

    // Check if any membership matches the orgId
    return (data || []).some((membership: any) => membership.org_id === orgId);
  } catch (error) {
    console.error("[verifyOrgMembership] Exception:", error);
    return false;
  }
}

/**
 * Gets the organization ID, either from parameter or cookie.
 */
async function getOrgId(
  userId: string,
  providedOrgId: string | undefined,
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<{ orgId: string; error?: string }> {
  try {
    if (providedOrgId) {
      const isMember = await verifyOrgMembership(userId, providedOrgId, supabase);
      if (!isMember) {
        return { orgId: "", error: "Not a member of the selected organization" };
      }
      return { orgId: providedOrgId };
    }

    const orgId = await getSelectedOrgIdFromCookie();
    if (!orgId) {
      return { orgId: "", error: "No organization selected" };
    }

    const isMember = await verifyOrgMembership(userId, orgId, supabase);
    if (!isMember) {
      return { orgId: "", error: "Not a member of the selected organization" };
    }

    return { orgId };
  } catch (error) {
    return { orgId: "", error: error instanceof Error ? error.message : "Failed to get organization" };
  }
}

/**
 * Lists all tasks for the current organization, optionally filtered by team.
 */
export async function listTasks(orgId?: string, team?: TaskTeam): Promise<ActionResult<Task[]>> {
  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    
    if (!authData.user) {
      return { success: false, error: "Authentication required" };
    }

    const { orgId: resolvedOrgId, error: orgError } = await getOrgId(authData.user.id, orgId, supabase);
    if (orgError || !resolvedOrgId) {
      return { success: false, error: orgError || "No organization selected" };
    }

    let query = supabase
      .from("tasks")
      .select("*")
      .eq("org_id", resolvedOrgId);
    
    if (team) {
      query = query.eq("team", team);
    }
    
    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      return { success: false, error: `Failed to fetch tasks: ${error.message}` };
    }

    return { success: true, data: (data ?? []) as Task[] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to list tasks",
    };
  }
}

/**
 * Gets a single task by ID.
 */
export async function getTask(
  taskId: string,
  orgId?: string
): Promise<ActionResult<Task>> {
  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    
    if (!authData.user) {
      return { success: false, error: "Authentication required" };
    }

    const { orgId: resolvedOrgId, error: orgError } = await getOrgId(authData.user.id, orgId, supabase);
    if (orgError || !resolvedOrgId) {
      return { success: false, error: orgError || "No organization selected" };
    }

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", taskId)
      .eq("org_id", resolvedOrgId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return { success: false, error: "Task not found" };
      }
      return { success: false, error: `Failed to fetch task: ${error.message}` };
    }

    return { success: true, data: data as Task };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get task",
    };
  }
}

/**
 * Creates a new task.
 */
export async function createTask(
  input: CreateTaskInput,
  orgId?: string
): Promise<ActionResult<Task>> {
  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    
    if (!authData.user) {
      return { success: false, error: "Authentication required" };
    }

    const { orgId: resolvedOrgId, error: orgError } = await getOrgId(authData.user.id, orgId, supabase);
    if (orgError || !resolvedOrgId) {
      return { success: false, error: orgError || "No organization selected" };
    }

    // Validation
    if (!input.title || input.title.trim().length === 0) {
      return { success: false, error: "Title is required" };
    }

    if (input.title.length > 500) {
      return { success: false, error: "Title must be 500 characters or less" };
    }

    if (input.description && input.description.length > 5000) {
      return { success: false, error: "Description must be 5000 characters or less" };
    }

    if (input.status && !["todo", "doing", "done"].includes(input.status)) {
      return { success: false, error: "Invalid status" };
    }

    if (input.priority && !["low", "medium", "high"].includes(input.priority)) {
      return { success: false, error: "Invalid priority" };
    }

    if (input.team && !["tech", "logistics", "sponsorship", "outreach"].includes(input.team)) {
      return { success: false, error: "Invalid team" };
    }

    if (input.assigned_to) {
      const isMember = await verifyOrgMembership(input.assigned_to, resolvedOrgId, supabase);
      if (!isMember) {
        return { success: false, error: "Assigned user must be a member of the organization" };
      }
    }

    // Build insert data
    const insertData: Record<string, unknown> = {
      org_id: resolvedOrgId,
      created_by: authData.user.id,
      title: input.title.trim(),
      description: input.description?.trim() || null,
      status: input.status || "todo",
      priority: input.priority || null,
      due_date: input.due_date || null,
      assigned_to: input.assigned_to || null,
      team: input.team || null,
    };

    const { data, error } = await supabase
      .from("tasks")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      return { success: false, error: `Failed to create task: ${error.message}` };
    }

    if (!data) {
      return { success: false, error: "Task was created but no data was returned" };
    }

    revalidatePath("/tasks");
    revalidatePath("/dashboard");

    return { success: true, data: data as Task };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create task",
    };
  }
}

/**
 * Updates an existing task.
 */
export async function updateTask(
  taskId: string,
  input: UpdateTaskInput,
  orgId?: string
): Promise<ActionResult<Task>> {
  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    
    if (!authData.user) {
      return { success: false, error: "Authentication required" };
    }

    const { orgId: resolvedOrgId, error: orgError } = await getOrgId(authData.user.id, orgId, supabase);
    if (orgError || !resolvedOrgId) {
      return { success: false, error: orgError || "No organization selected" };
    }

    // Verify task exists
    const taskResult = await getTask(taskId, resolvedOrgId);
    if (!taskResult.success) {
      return taskResult;
    }

    // Validation
    if (input.title !== undefined && (!input.title || input.title.trim().length === 0)) {
      return { success: false, error: "Title cannot be empty" };
    }

    if (input.title && input.title.length > 500) {
      return { success: false, error: "Title must be 500 characters or less" };
    }

    if (input.description !== undefined && input.description !== null && input.description.length > 5000) {
      return { success: false, error: "Description must be 5000 characters or less" };
    }

    if (input.status && !["todo", "doing", "done"].includes(input.status)) {
      return { success: false, error: "Invalid status" };
    }

    if (input.priority !== undefined && input.priority !== null && !["low", "medium", "high"].includes(input.priority)) {
      return { success: false, error: "Invalid priority" };
    }

    if (input.team !== undefined && input.team !== null && !["tech", "logistics", "sponsorship", "outreach"].includes(input.team)) {
      return { success: false, error: "Invalid team" };
    }

    if (input.assigned_to !== undefined && input.assigned_to !== null) {
      const isMember = await verifyOrgMembership(input.assigned_to, resolvedOrgId, supabase);
      if (!isMember) {
        return { success: false, error: "Assigned user must be a member of the organization" };
      }
    }

    // Build update data
    const updateData: Record<string, unknown> = {};
    if (input.title !== undefined) updateData.title = input.title.trim();
    if (input.description !== undefined) updateData.description = input.description?.trim() || null;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.priority !== undefined) updateData.priority = input.priority;
    if (input.due_date !== undefined) updateData.due_date = input.due_date;
    if (input.assigned_to !== undefined) updateData.assigned_to = input.assigned_to;
    if (input.team !== undefined) updateData.team = input.team;

    const { data, error } = await supabase
      .from("tasks")
      .update(updateData)
      .eq("id", taskId)
      .eq("org_id", resolvedOrgId)
      .select()
      .single();

    if (error) {
      return { success: false, error: `Failed to update task: ${error.message}` };
    }

    if (!data) {
      return { success: false, error: "Task was updated but no data was returned" };
    }

    revalidatePath("/tasks");
    revalidatePath("/dashboard");

    return { success: true, data: data as Task };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update task",
    };
  }
}

/**
 * Deletes a task.
 */
export async function deleteTask(
  taskId: string,
  orgId?: string
): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    
    if (!authData.user) {
      return { success: false, error: "Authentication required" };
    }

    const { orgId: resolvedOrgId, error: orgError } = await getOrgId(authData.user.id, orgId, supabase);
    if (orgError || !resolvedOrgId) {
      return { success: false, error: orgError || "No organization selected" };
    }

    // Verify task exists
    const taskResult = await getTask(taskId, resolvedOrgId);
    if (!taskResult.success) {
      return taskResult;
    }

    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId)
      .eq("org_id", resolvedOrgId);

    if (error) {
      return { success: false, error: `Failed to delete task: ${error.message}` };
    }

    revalidatePath("/tasks");
    revalidatePath("/dashboard");

    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete task",
    };
  }
}
