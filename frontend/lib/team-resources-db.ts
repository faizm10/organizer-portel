"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSelectedOrgIdFromCookie } from "./org";
import { requireUser } from "./auth";

export type ResourceType = "document" | "link" | "guide" | "other";
export type TaskTeam = "tech" | "logistics" | "sponsorship" | "outreach";

export interface TeamResource {
  id: string;
  org_id: string;
  team: TaskTeam;
  title: string;
  description: string | null;
  resource_type: ResourceType;
  url: string;
  storage_path: string | null;
  file_name: string | null;
  file_size: number | null;
  file_type: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateResourceInput {
  team: TaskTeam;
  title: string;
  description?: string;
  resource_type: ResourceType;
  url: string;
  storage_path?: string;
  file_name?: string;
  file_size?: number;
  file_type?: string;
}

export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * List all resources for a specific team in the current org
 */
export async function listTeamResources(
  team: TaskTeam,
  orgId?: string
): Promise<ActionResult<TeamResource[]>> {
  try {
    const user = await requireUser();
    const resolvedOrgId = orgId || (await getSelectedOrgIdFromCookie());

    if (!resolvedOrgId) {
      return { success: false, error: "No organization selected" };
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("team_resources")
      .select("*")
      .eq("org_id", resolvedOrgId)
      .eq("team", team)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error listing team resources:", {
        error,
        errorCode: error.code,
        errorMessage: error.message,
        errorDetails: error.details,
        errorHint: error.hint,
        orgId: resolvedOrgId,
        team,
      });
      return { 
        success: false, 
        error: error.message || error.details || error.hint || "Failed to list team resources" 
      };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error listing team resources (catch):", {
      error,
      errorType: typeof error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error) || "Failed to list resources",
    };
  }
}

/**
 * Create a new team resource
 */
export async function createTeamResource(
  input: CreateResourceInput,
  orgId?: string
): Promise<ActionResult<TeamResource>> {
  try {
    const user = await requireUser();
    const resolvedOrgId = orgId || (await getSelectedOrgIdFromCookie());

    if (!resolvedOrgId) {
      return { success: false, error: "No organization selected" };
    }

    const supabase = await createClient();

    const insertData = {
      org_id: resolvedOrgId,
      team: input.team,
      title: input.title,
      description: input.description || null,
      resource_type: input.resource_type,
      url: input.url,
      storage_path: input.storage_path || null,
      file_name: input.file_name || null,
      file_size: input.file_size || null,
      file_type: input.file_type || null,
      created_by: user.id,
    };

    const { data, error } = await supabase
      .from("team_resources")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Error creating team resource:", error);
      return { success: false, error: error.message };
    }

    revalidatePath(`/team/${input.team}`);
    return { success: true, data };
  } catch (error) {
    console.error("Error creating team resource:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create resource",
    };
  }
}

/**
 * Delete a team resource (and optionally the file from storage)
 */
export async function deleteTeamResource(
  resourceId: string,
  orgId?: string
): Promise<ActionResult<void>> {
  try {
    const user = await requireUser();
    const resolvedOrgId = orgId || (await getSelectedOrgIdFromCookie());

    if (!resolvedOrgId) {
      return { success: false, error: "No organization selected" };
    }

    const supabase = await createClient();

    // First get the resource to check if it has a storage_path
    const { data: resource, error: fetchError } = await supabase
      .from("team_resources")
      .select("storage_path, org_id")
      .eq("id", resourceId)
      .single();

    if (fetchError) {
      console.error("Error fetching resource:", fetchError);
      return { success: false, error: fetchError.message };
    }

    // Verify org_id matches
    if (resource.org_id !== resolvedOrgId) {
      return { success: false, error: "Resource not found or access denied" };
    }

    // Delete file from storage if it exists
    if (resource.storage_path) {
      const { error: storageError } = await supabase.storage
        .from("team-documents")
        .remove([resource.storage_path]);

      if (storageError) {
        console.error("Error deleting file from storage:", storageError);
        // Continue with database deletion even if storage deletion fails
      }
    }

    // Delete from database
    const { error } = await supabase
      .from("team_resources")
      .delete()
      .eq("id", resourceId);

    if (error) {
      console.error("Error deleting team resource:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/team");
    return { success: true };
  } catch (error) {
    console.error("Error deleting team resource:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete resource",
    };
  }
}

/**
 * Get a signed URL for a document in storage
 */
export async function getDocumentUrl(
  storagePath: string,
  expiresIn: number = 3600
): Promise<ActionResult<string>> {
  try {
    const user = await requireUser();
    const supabase = await createClient();

    const { data, error } = await supabase.storage
      .from("team-documents")
      .createSignedUrl(storagePath, expiresIn);

    if (error) {
      console.error("Error creating signed URL:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data.signedUrl };
  } catch (error) {
    console.error("Error getting document URL:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get document URL",
    };
  }
}

/**
 * Upload a file to storage and create a resource record
 */
export async function uploadTeamDocument(
  file: File,
  team: TaskTeam,
  title: string,
  description?: string,
  orgId?: string
): Promise<ActionResult<TeamResource>> {
  try {
    const user = await requireUser();
    const resolvedOrgId = orgId || (await getSelectedOrgIdFromCookie());

    if (!resolvedOrgId) {
      return { success: false, error: "No organization selected" };
    }

    const supabase = await createClient();

    // Generate a unique file path: team-documents/{org_id}/{team}/{timestamp}-{filename}
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const storagePath = `${resolvedOrgId}/${team}/${timestamp}-${sanitizedFilename}`;

    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from("team-documents")
      .upload(storagePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return { success: false, error: uploadError.message };
    }

    // For private buckets, we'll generate signed URLs on-demand when accessing
    // Store a placeholder URL that will be replaced by signed URL when accessed
    // The actual URL will be generated via the API route /api/team-resources/[id]/url
    const publicUrl = `/api/team-resources/temp/url?storage_path=${encodeURIComponent(storagePath)}`;

    // Create resource record
    const createResult = await createTeamResource(
      {
        team,
        title,
        description,
        resource_type: "document",
        url: publicUrl,
        storage_path: storagePath,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
      },
      resolvedOrgId
    );

    if (!createResult.success) {
      // Try to clean up the uploaded file
      await supabase.storage.from("team-documents").remove([storagePath]);
      return createResult;
    }

    return createResult;
  } catch (error) {
    console.error("Error uploading team document:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload document",
    };
  }
}
