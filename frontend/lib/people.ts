"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSelectedOrgIdFromCookie } from "./org";
import { requireUser } from "./auth";

export type PersonType = "volunteer" | "mentor" | "judge" | "sponsor" | "partner";

export interface EventPerson {
  id: string;
  org_id: string;
  person_type: PersonType;
  full_name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  role_title: string | null;
  bio: string | null;
  skills: string[] | null;
  notes: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEventPersonInput {
  person_type: PersonType;
  full_name: string;
  email?: string;
  phone?: string;
  company?: string;
  role_title?: string;
  bio?: string;
  skills?: string[];
  notes?: string;
}

export interface UpdateEventPersonInput {
  full_name?: string;
  email?: string;
  phone?: string;
  company?: string;
  role_title?: string;
  bio?: string;
  skills?: string[];
  notes?: string;
}

export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * List all event people for an organization, optionally filtered by type
 */
export async function listEventPeople(
  personType?: PersonType,
  orgId?: string
): Promise<ActionResult<EventPerson[]>> {
  try {
    const user = await requireUser();
    const resolvedOrgId = orgId || (await getSelectedOrgIdFromCookie());

    if (!resolvedOrgId) {
      return { success: false, error: "No organization selected" };
    }

    const supabase = await createClient();

    let query = supabase
      .from("event_people")
      .select("*")
      .eq("org_id", resolvedOrgId)
      .order("created_at", { ascending: false });

    if (personType) {
      query = query.eq("person_type", personType);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error listing event people:", error);
      return { success: false, error: error.message || "Failed to list people" };
    }

    return { success: true, data: (data || []) as EventPerson[] };
  } catch (error) {
    console.error("Error listing event people:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to list people",
    };
  }
}

/**
 * Create a new event person
 */
export async function createEventPerson(
  input: CreateEventPersonInput,
  orgId?: string
): Promise<ActionResult<EventPerson>> {
  try {
    const user = await requireUser();
    const resolvedOrgId = orgId || (await getSelectedOrgIdFromCookie());

    if (!resolvedOrgId) {
      return { success: false, error: "No organization selected" };
    }

    if (!input.full_name || input.full_name.trim().length === 0) {
      return { success: false, error: "Full name is required" };
    }

    const supabase = await createClient();

    const insertData = {
      org_id: resolvedOrgId,
      person_type: input.person_type,
      full_name: input.full_name.trim(),
      email: input.email?.trim() || null,
      phone: input.phone?.trim() || null,
      company: input.company?.trim() || null,
      role_title: input.role_title?.trim() || null,
      bio: input.bio?.trim() || null,
      skills: input.skills || null,
      notes: input.notes?.trim() || null,
      created_by: user.id,
    };

    const { data, error } = await supabase
      .from("event_people")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Error creating event person:", error);
      return { success: false, error: error.message || "Failed to create person" };
    }

    revalidatePath("/people");
    return { success: true, data: data as EventPerson };
  } catch (error) {
    console.error("Error creating event person:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create person",
    };
  }
}

/**
 * Update an event person
 */
export async function updateEventPerson(
  personId: string,
  input: UpdateEventPersonInput,
  orgId?: string
): Promise<ActionResult<EventPerson>> {
  try {
    const user = await requireUser();
    const resolvedOrgId = orgId || (await getSelectedOrgIdFromCookie());

    if (!resolvedOrgId) {
      return { success: false, error: "No organization selected" };
    }

    const supabase = await createClient();

    const updateData: Record<string, unknown> = {};
    if (input.full_name !== undefined) updateData.full_name = input.full_name.trim();
    if (input.email !== undefined) updateData.email = input.email?.trim() || null;
    if (input.phone !== undefined) updateData.phone = input.phone?.trim() || null;
    if (input.company !== undefined) updateData.company = input.company?.trim() || null;
    if (input.role_title !== undefined) updateData.role_title = input.role_title?.trim() || null;
    if (input.bio !== undefined) updateData.bio = input.bio?.trim() || null;
    if (input.skills !== undefined) updateData.skills = input.skills;
    if (input.notes !== undefined) updateData.notes = input.notes?.trim() || null;

    const { data, error } = await supabase
      .from("event_people")
      .update(updateData)
      .eq("id", personId)
      .eq("org_id", resolvedOrgId)
      .select()
      .single();

    if (error) {
      console.error("Error updating event person:", error);
      return { success: false, error: error.message || "Failed to update person" };
    }

    revalidatePath("/people");
    return { success: true, data: data as EventPerson };
  } catch (error) {
    console.error("Error updating event person:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update person",
    };
  }
}

/**
 * Delete an event person
 */
export async function deleteEventPerson(
  personId: string,
  orgId?: string
): Promise<ActionResult<void>> {
  try {
    const user = await requireUser();
    const resolvedOrgId = orgId || (await getSelectedOrgIdFromCookie());

    if (!resolvedOrgId) {
      return { success: false, error: "No organization selected" };
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("event_people")
      .delete()
      .eq("id", personId)
      .eq("org_id", resolvedOrgId);

    if (error) {
      console.error("Error deleting event person:", error);
      return { success: false, error: error.message || "Failed to delete person" };
    }

    revalidatePath("/people");
    return { success: true };
  } catch (error) {
    console.error("Error deleting event person:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete person",
    };
  }
}
