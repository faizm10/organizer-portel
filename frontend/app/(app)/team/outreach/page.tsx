import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { requireUser } from "@/lib/auth";
import { requireSelectedOrg, getOrgMembers } from "@/lib/org";
import { listTasks } from "@/lib/tasks";
import { CreateTaskForm } from "@/components/create-task-form";
import { TasksPageContent } from "@/components/tasks-page-content";
import { TeamResources } from "@/components/team-resources";
import { listTeamResources } from "@/lib/team-resources-db";

export default async function OutreachTeamPage() {
  const user = await requireUser();
  const membership = await requireSelectedOrg(user);
  const org = membership.organization;

  // Fetch tasks filtered by outreach team, org members, and team resources in parallel
  const [tasksResult, orgMembers, resourcesResult] = await Promise.all([
    listTasks(org.id, "outreach"),
    getOrgMembers(org.id),
    listTeamResources("outreach", org.id),
  ]);

  const tasks = tasksResult.success ? tasksResult.data : [];
  const resources = resourcesResult.success ? resourcesResult.data : [];

  return (
    <main className="mx-auto flex min-h-svh max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <DashboardHeader orgName={org.name} userEmail={user.email} role={membership.role} />
      <section className="space-y-4">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold tracking-tight">Outreach team</h2>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Marketing, community partnerships, and campus outreach for your event.
            </p>
          </div>
          <CreateTaskForm orgMembers={orgMembers} orgId={org.id} defaultTeam="outreach" />
        </header>

        {tasksResult.success ? (
          <TasksPageContent
            tasks={tasks}
            orgMembers={orgMembers}
            orgId={org.id}
          />
        ) : (
          <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
            {tasksResult.error || "Failed to load tasks"}
          </div>
        )}

        <TeamResources
          resources={resources}
          team="outreach"
          teamName="Outreach"
          orgId={org.id}
        />
      </section>
    </main>
  );
}
