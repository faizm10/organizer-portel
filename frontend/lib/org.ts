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
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("org_members")
    .select("org_id, role, organization:organizations(id, name, slug)")
    .eq("user_id", userId);

  if (error) {
    // In a real app you might want to log this.
    return [];
  }

  return (data ?? []) as OrgMembership[];
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
  const memberships = await getUserOrganizations(user.id);

  if (memberships.length === 0) {
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


