import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { AuthenticatedUser } from "./auth";

const ORG_COOKIE_NAME = "hp_org_id";

export type Organization = {
  id: string;
  name: string;
  slug: string | null;
};

export type OrgMembership = {
  org_id: string;
  role: string;
  organization: Organization;
};

/**
 * Returns the list of organizations the given user belongs to.
 */
export async function getUserOrganizations(
  userId: string
): Promise<OrgMembership[]> {
  console.log("[getUserOrganizations] Starting lookup for userId:", userId);
  const supabase = await createClient();

  // Use RPC function to bypass RLS recursion issues
  // This function uses SECURITY DEFINER to avoid RLS policy recursion
  const { data, error } = await supabase.rpc("get_user_organizations", {
    p_user_id: userId,
  });

  if (error) {
    console.error("[getUserOrganizations] Error calling RPC function:", {
      error,
      errorCode: error.code,
      errorMessage: error.message,
      errorDetails: error.details,
      userId,
    });
    
    // Fallback: Try the direct query approach (might still fail with recursion)
    console.log("[getUserOrganizations] Falling back to direct query...");
    const { data: membershipsData, error: membershipsError } = await supabase
      .from("org_members")
      .select("org_id, role")
      .eq("user_id", userId);

    if (membershipsError) {
      console.error("[getUserOrganizations] Fallback query also failed:", {
        error: membershipsError,
        userId,
      });
      return [];
    }

    if (!membershipsData || membershipsData.length === 0) {
      console.log("[getUserOrganizations] No memberships found");
      return [];
    }

    // Fetch organizations separately for fallback
    const orgIds = membershipsData.map((m) => m.org_id);
    const { data: orgsData } = await supabase
      .from("organizations")
      .select("id, name, slug")
      .in("id", orgIds);

    const orgMap = new Map((orgsData || []).map((org) => [org.id, org]));

    return membershipsData.map((membership) => {
      const org = orgMap.get(membership.org_id) || {
        id: membership.org_id,
        name: null,
        slug: null,
      };
      return {
        org_id: membership.org_id,
        role: membership.role,
        organization: org,
      };
    }) as OrgMembership[];
  }

  if (!data || data.length === 0) {
    console.log("[getUserOrganizations] No memberships found via RPC");
    return [];
  }

  // Transform RPC result to OrgMembership format
  const transformed = data.map((row: any) => ({
    org_id: row.org_id,
    role: row.role,
    organization: {
      id: row.org_id,
      name: row.org_name || null,
      slug: row.org_slug || null,
    },
  })) as OrgMembership[];

  console.log("[getUserOrganizations] Success via RPC:", {
    memberships: transformed,
    count: transformed.length,
    userId,
  });

  return transformed;
}

/**
 * Reads the currently selected organization id from the signed cookie.
 */
export async function getSelectedOrgIdFromCookie(): Promise<string | null> {
  const store = await cookies();
  const value = store.get(ORG_COOKIE_NAME)?.value;
  return value ?? null;
}

/**
 * Persists the selected organization id to a signed cookie.
 */
export async function setSelectedOrgIdInCookie(orgId: string) {
  const store = await cookies();
  store.set(ORG_COOKIE_NAME, orgId, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
  });
}

/**
 * Ensures that a selected organization exists for the given user and that the
 * user is a member of that organization. If no organization is selected, or
 * the user has no memberships, redirects to the appropriate route.
 */
export async function requireSelectedOrg(user: AuthenticatedUser) {
  console.log("[requireSelectedOrg] Starting check for user:", {
    userId: user.id,
    userEmail: user.email,
  });

  const memberships = await getUserOrganizations(user.id);

  console.log("[requireSelectedOrg] Memberships found:", {
    count: memberships.length,
    memberships: memberships.map((m) => ({
      org_id: m.org_id,
      role: m.role,
      orgName: m.organization?.name,
      orgSlug: m.organization?.slug,
    })),
    userId: user.id,
  });

  if (memberships.length === 0) {
    console.log("[requireSelectedOrg] No memberships found, redirecting to /join", {
      userId: user.id,
      userEmail: user.email,
    });
    redirect("/join");
  }

  // If only one org, just return it. We intentionally avoid mutating cookies
  // here because Server Components cannot write cookies directly.
  if (memberships.length === 1) {
    const only = memberships[0];
    return only;
  }

  // Multiple orgs: check if we already have a selected one in cookie.
  const selectedId = await getSelectedOrgIdFromCookie();
  const selected = memberships.find((m) => m.org_id === selectedId);

  if (!selected) {
    // No selection yet or invalid selection → go to org picker.
    redirect("/select-org");
  }

  return selected;
}

export type OrgMember = {
  user_id: string;
  role: string;
  profile: {
    id: string;
    full_name: string | null;
  };
};

/**
 * Gets all members of a specific organization.
 */
export async function getOrgMembers(
  orgId: string
): Promise<OrgMember[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("org_members")
    .select("user_id, role, profile:profiles(id, full_name)")
    .eq("org_id", orgId);

  if (error) {
    return [];
  }

  if (!data) {
    return [];
  }

  // Transform the data to match OrgMember type
  return data.map((item: any) => ({
    user_id: item.user_id,
    role: item.role,
    profile: Array.isArray(item.profile) && item.profile.length > 0
      ? item.profile[0]
      : item.profile,
  })) as OrgMember[];
}


