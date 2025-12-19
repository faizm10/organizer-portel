import { requireUser } from "@/lib/auth";
import { getUserOrganizations } from "@/lib/org";

export default async function JoinPage() {
  console.log("[JoinPage] Render started");

  const user = await requireUser();
  console.log("[JoinPage] User authenticated:", {
    userId: user.id,
    userEmail: user.email,
  });

  // Check memberships for debug info only
  // Don't redirect from here - let requireSelectedOrg handle redirects in protected routes
  const memberships = await getUserOrganizations(user.id);
  console.log("[JoinPage] Memberships query result:", {
    count: memberships.length,
    memberships,
    userId: user.id,
  });

  return (
    <main className="mx-auto flex min-h-svh max-w-2xl flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        You&apos;re not part of any organization yet.
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        HackPortal is invite-based. Ask an existing organizer to add you to
        their event, or check back once your team has set up an organization.
      </p>
      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-8 rounded-md bg-muted p-4 text-left text-xs font-mono">
          <p className="font-semibold">Debug Info:</p>
          <p>User ID: {user.id}</p>
          <p>User Email: {user.email}</p>
          <p>Memberships Found: {memberships.length}</p>
          {memberships.length > 0 && (
            <ul className="mt-2 list-disc pl-5">
              {memberships.map((m, i) => (
                <li key={i}>
                  Org ID: {m.org_id}, Role: {m.role}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </main>
  );
}


