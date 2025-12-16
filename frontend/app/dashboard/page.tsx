import { requireUser } from "@/lib/auth";
import { requireSelectedOrg } from "@/lib/org";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();
  const membership = await requireSelectedOrg(user);

  const org = membership.organization;

  return (
    <main className="mx-auto flex min-h-svh max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            HackPortal Dashboard
          </p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {org.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Signed in as <span className="font-medium">{user.email}</span> ·
            role <span className="font-medium">{membership.role}</span>
          </p>
        </div>
      </header>

      <nav
        aria-label="Primary"
        className="flex flex-wrap gap-2 rounded-2xl border border-border/70 bg-card/80 p-2 text-sm"
      >
        <NavPill label="Tasks" />
        <NavPill label="Announcements" />
        <NavPill label="People" />
      </nav>

      <section className="grid gap-4 md:grid-cols-3" aria-label="Overview">
        <div className="rounded-2xl border border-border/70 bg-card/80 p-4 text-sm">
          <p className="text-xs font-medium text-muted-foreground">Tasks</p>
          <p className="mt-1 text-sm text-foreground">
            Coming soon: a shared board for show-week todos, dependencies, and
            on-call rotations.
          </p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-card/80 p-4 text-sm">
          <p className="text-xs font-medium text-muted-foreground">
            Announcements
          </p>
          <p className="mt-1 text-sm text-foreground">
            Plan, approve, and send broadcast messages to hackers, mentors, and
            sponsors from one place.
          </p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-card/80 p-4 text-sm">
          <p className="text-xs font-medium text-muted-foreground">People</p>
          <p className="mt-1 text-sm text-foreground">
            Keep track of organizers, volunteers, mentors, judges, and
            partners, all tied to your event.
          </p>
        </div>
      </section>
    </main>
  );
}

function NavPill({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/70 hover:text-foreground"
    >
      {label}
    </button>
  );
}


