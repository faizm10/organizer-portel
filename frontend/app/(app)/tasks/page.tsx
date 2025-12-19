import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { requireUser } from "@/lib/auth";
import { requireSelectedOrg, getOrgMembers } from "@/lib/org";
import { listTasks } from "@/lib/tasks";
import { CreateTaskForm } from "@/components/create-task-form";
import { TasksPageContent } from "@/components/tasks-page-content";

export default async function TasksPage() {
  const user = await requireUser();
  const membership = await requireSelectedOrg(user);
  const org = membership.organization;

  // Fetch tasks and org members in parallel
  const [tasksResult, orgMembers] = await Promise.all([
    listTasks(org.id),
    getOrgMembers(org.id),
  ]);

  const tasks = tasksResult.success ? tasksResult.data : [];

  return (
    <main className="mx-auto flex min-h-svh max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <DashboardHeader
        orgName={org.name}
        userEmail={user.email}
        role={membership.role}
      />

      <section className="space-y-4">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
            <p className="text-sm text-muted-foreground">
              Task management for your hackathon organization.
            </p>
          </div>
          <CreateTaskForm orgMembers={orgMembers} orgId={org.id} />
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
      </section>
    </main>
  );
}
