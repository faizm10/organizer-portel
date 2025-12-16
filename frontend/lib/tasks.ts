"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "./auth";
import { getSelectedOrgIdFromCookie, getUserOrganizations } from "./org";

export type TaskStatus = "todo" | "doing" | "done";
export type TaskPriority = "low" | "medium" | "high";

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
};

export type UpdateTaskInput = {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
  assigned_to?: string | null;
};

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Verifies that the user is a member of the given organization.
 */
async function verifyOrgMembership(
  userId: string,
  orgId: string
): Promise<boolean> {
  const memberships = await getUserOrganizations(userId);
  return memberships.some((m) => m.org_id === orgId);
}

/**
 * Gets the currently selected organization ID from cookie or provided parameter.
 * Throws if no org is selected or user is not a member.
 */
async function getCurrentOrgId(
  userId: string,
  providedOrgId?: string
): Promise<string> {
  // If orgId is provided, verify membership and use it
  if (providedOrgId) {
    const isMember = await verifyOrgMembership(userId, providedOrgId);
    if (!isMember) {
      throw new Error("Not a member of the selected organization");
    }
    return providedOrgId;
  }

  // Otherwise, try to get from cookie
  const orgId = await getSelectedOrgIdFromCookie();
  if (!orgId) {
    throw new Error("No organization selected");
  }

  const isMember = await verifyOrgMembership(userId, orgId);
  if (!isMember) {
    throw new Error("Not a member of the selected organization");
  }

  return orgId;
}

/**
 * Lists all tasks for the current organization.
 * @param orgId Optional organization ID. If not provided, reads from cookie.
 */
export async function listTasks(orgId?: string): Promise<ActionResult<Task[]>> {
  try {
    const user = await requireUser();
    const resolvedOrgId = await getCurrentOrgId(user.id, orgId);

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("org_id", resolvedOrgId)
      .order("created_at", { ascending: false });

    if (error) {
      return { success: false, error: `Failed to fetch tasks: ${error.message}` };
    }

    return { success: true, data: (data ?? []) as Task[] };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to list tasks",
    };
  }
}

/**
 * Gets a single task by ID.
 * @param taskId The task ID to fetch.
 * @param orgId Optional organization ID. If not provided, reads from cookie.
 */
export async function getTask(
  taskId: string,
  orgId?: string
): Promise<ActionResult<Task>> {
  try {
    const user = await requireUser();
    const resolvedOrgId = await getCurrentOrgId(user.id, orgId);

    const supabase = await createClient();

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
 * Creates a new task in the current organization.
 * @param input Task creation data.
 * @param orgId Optional organization ID. If not provided, reads from cookie.
 */
export async function createTask(
  input: CreateTaskInput,
  orgId?: string
): Promise<ActionResult<Task>> {
  try {
    const user = await requireUser();
    const resolvedOrgId = await getCurrentOrgId(user.id, orgId);

    // Validation
    if (!input.title || input.title.trim().length === 0) {
      return { success: false, error: "Title is required" };
    }

    if (input.title.length > 500) {
      return { success: false, error: "Title must be 500 characters or less" };
    }

    if (input.description && input.description.length > 5000) {
      return {
        success: false,
        error: "Description must be 5000 characters or less",
      };
    }

    // Validate status if provided
    if (input.status && !["todo", "doing", "done"].includes(input.status)) {
      return {
        success: false,
        error: "Status must be one of: todo, doing, done",
      };
    }

    // Validate priority if provided
    if (
      input.priority &&
      !["low", "medium", "high"].includes(input.priority)
    ) {
      return {
        success: false,
        error: "Priority must be one of: low, medium, high",
      };
    }

    // Validate assigned_to if provided (must be org member)
    if (input.assigned_to) {
      const isMember = await verifyOrgMembership(
        input.assigned_to,
        resolvedOrgId
      );
      if (!isMember) {
        return {
          success: false,
          error: "Assigned user must be a member of the organization",
        };
      }
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        org_id: resolvedOrgId,
        title: input.title.trim(),
        description: input.description?.trim() || null,
        status: input.status || "todo",
        priority: input.priority || null,
        due_date: input.due_date || null,
        created_by: user.id,
        assigned_to: input.assigned_to || null,
      })
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: `Failed to create task: ${error.message}`,
      };
    }

    revalidatePath("/tasks");
    revalidatePath("/dashboard");

    return { success: true, data: data as Task };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create task",
    };
  }
}

/**
 * Updates an existing task.
 * @param taskId The task ID to update.
 * @param input Task update data.
 * @param orgId Optional organization ID. If not provided, reads from cookie.
 */
export async function updateTask(
  taskId: string,
  input: UpdateTaskInput,
  orgId?: string
): Promise<ActionResult<Task>> {
  try {
    const user = await requireUser();
    const resolvedOrgId = await getCurrentOrgId(user.id, orgId);

    // First verify the task exists and belongs to the org
    const taskResult = await getTask(taskId, resolvedOrgId);
    if (!taskResult.success) {
      return taskResult;
    }

    // Validation
    if (input.title !== undefined) {
      if (!input.title || input.title.trim().length === 0) {
        return { success: false, error: "Title cannot be empty" };
      }
      if (input.title.length > 500) {
        return {
          success: false,
          error: "Title must be 500 characters or less",
        };
      }
    }

    if (input.description !== undefined && input.description !== null) {
      if (input.description.length > 5000) {
        return {
          success: false,
          error: "Description must be 5000 characters or less",
        };
      }
    }

    if (input.status && !["todo", "doing", "done"].includes(input.status)) {
      return {
        success: false,
        error: "Status must be one of: todo, doing, done",
      };
    }

    if (
      input.priority !== undefined &&
      input.priority !== null &&
      !["low", "medium", "high"].includes(input.priority)
    ) {
      return {
        success: false,
        error: "Priority must be one of: low, medium, high",
      };
    }

    // Validate assigned_to if provided
    if (input.assigned_to !== undefined && input.assigned_to !== null) {
      const isMember = await verifyOrgMembership(
        input.assigned_to,
        resolvedOrgId
      );
      if (!isMember) {
        return {
          success: false,
          error: "Assigned user must be a member of the organization",
        };
      }
    }

    const supabase = await createClient();

    const updateData: Record<string, unknown> = {};
    if (input.title !== undefined) updateData.title = input.title.trim();
    if (input.description !== undefined)
      updateData.description = input.description?.trim() || null;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.priority !== undefined) updateData.priority = input.priority;
    if (input.due_date !== undefined) updateData.due_date = input.due_date;
    if (input.assigned_to !== undefined)
      updateData.assigned_to = input.assigned_to;

    const { data, error } = await supabase
      .from("tasks")
      .update(updateData)
      .eq("id", taskId)
      .eq("org_id", resolvedOrgId)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: `Failed to update task: ${error.message}`,
      };
    }

    revalidatePath("/tasks");
    revalidatePath("/dashboard");

    return { success: true, data: data as Task };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update task",
    };
  }
}

/**
 * Deletes a task.
 * @param taskId The task ID to delete.
 * @param orgId Optional organization ID. If not provided, reads from cookie.
 */
export async function deleteTask(
  taskId: string,
  orgId?: string
): Promise<ActionResult<void>> {
  try {
    const user = await requireUser();
    const resolvedOrgId = await getCurrentOrgId(user.id, orgId);

    // First verify the task exists and belongs to the org
    const taskResult = await getTask(taskId, resolvedOrgId);
    if (!taskResult.success) {
      return taskResult;
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId)
      .eq("org_id", resolvedOrgId);

    if (error) {
      return {
        success: false,
        error: `Failed to delete task: ${error.message}`,
      };
    }

    revalidatePath("/tasks");
    revalidatePath("/dashboard");

    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete task",
    };
  }
}

