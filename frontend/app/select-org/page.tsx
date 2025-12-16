import Link from "next/link";

import { requireUser } from "@/lib/auth";
import {
  getUserOrganizations,
  setSelectedOrgIdInCookie,
  type OrgMembership,
} from "@/lib/org";

export const dynamic = "force-dynamic";

export default async function SelectOrgPage() {
  const user = await requireUser();
  const memberships = await getUserOrganizations(user.id);

  if (memberships.length === 0) {
    // No orgs at all – send them to join flow.
    return (
      <main className="mx-auto flex min-h-svh max-w-2xl flex-col items-center justify-center gap-6 px-4 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          You&apos;re not part of any organization yet.
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Ask an existing HackPortal admin to invite you to their organization,
          or create a new one once org creation is enabled.
        </p>
        <Link
          href="/join"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Continue to join flow
        </Link>
      </main>
    );
  }

  async function handleSelectOrg(formData: FormData) {
    "use server";
    const orgId = String(formData.get("org_id") ?? "");
    if (!orgId) return;
    await setSelectedOrgIdInCookie(orgId);
  }

  return (
    <main className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 px-4 py-12">
      <header className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          HackPortal
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">
          Choose an organization
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          It looks like you belong to multiple hackathon teams. Pick the one you
          want to work in right now. You can switch orgs later.
        </p>
      </header>

      <form action={handleSelectOrg} className="space-y-4">
        <fieldset className="space-y-2">
          <legend className="text-xs font-medium text-muted-foreground">
            Your organizations
          </legend>
          <div className="space-y-2 rounded-2xl border border-border/70 bg-card/80 p-4">
            {memberships.map((m: OrgMembership) => (
              <label
                key={m.org_id}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm hover:bg-muted/60"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{m.organization.name}</span>
                  <span className="text-xs text-muted-foreground">
                    Role: {m.role}
                  </span>
                </div>
                <input
                  type="radio"
                  name="org_id"
                  value={m.org_id}
                  className="h-4 w-4 accent-foreground"
                  required
                />
              </label>
            ))}
          </div>
        </fieldset>
        <button
          type="submit"
          className="inline-flex h-9 items-center justify-center rounded-full bg-foreground px-5 text-xs font-medium text-background shadow-sm hover:bg-foreground/90"
          formAction={async (formData) => {
            "use server";
            await handleSelectOrg(formData);
            // After setting cookie, redirect to dashboard.
            return new Response(null, {
              status: 303,
              headers: { Location: "/dashboard" },
            });
          }}
        >
          Continue to dashboard
        </button>
      </form>
    </main>
  );
}


