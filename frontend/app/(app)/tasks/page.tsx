import { Suspense } from "react";
import { PlayfulTodolist } from "@/components/animate-ui/components/community/playful-todolist";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TasksList } from "@/components/tasks/TasksList";
import { mockTasks } from "@/lib/mock-data";
import { requireUser } from "@/lib/auth";
import { requireSelectedOrg } from "@/lib/org";
import { listTasks } from "@/lib/tasks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

async function TasksListContent({ orgId }: { orgId: string }) {
  const result = await listTasks(orgId);

  if (!result.success) {
    return (
      <Card>
        <CardContent className="py-6 text-center">
          <p className="text-sm text-destructive">
            Failed to load tasks: {result.error}
          </p>
        </CardContent>
      </Card>
    );
  }

  return <TasksList tasks={result.data} />;
}

function TasksListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default async function TasksPage() {
  const user = await requireUser();
  const membership = await requireSelectedOrg(user);
  const org = membership.organization;

  return (
    <main className="mx-auto flex min-h-svh max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <DashboardHeader
        orgName={org.name}
        userEmail={user.email}
        role={membership.role}
      />

      <section className="space-y-4">
        <header className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">Tasks</h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Central board for everything your team needs to ship a calm, on‑time
            hackathon.
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Tasks</CardTitle>
                <CardDescription>
                  View and manage all tasks for your organization.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <Suspense fallback={<TasksListSkeleton />}>
                  <TasksListContent orgId={membership.org_id} />
                </Suspense>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Playful todo list</CardTitle>
                <CardDescription>
                  A playful view of your core show‑week checklist.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <PlayfulTodolist
                  items={mockTasks.map((t) => ({
                    id: t.id,
                    label: t.label,
                    defaultChecked: t.done ?? false,
                  }))}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What&apos;s coming</CardTitle>
                <CardDescription>
                  Planned features for the full Tasks experience.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                  <li>Timeline-aware tasks tied to your run-of-show.</li>
                  <li>Dependencies like "only if Wi‑Fi incident is closed".</li>
                  <li>Ownership and on-call rotations for each checklist.</li>
                  <li>Views by team: tech, logistics, sponsorship, outreach.</li>
                  <li>Exports for post-mortems and sponsor reports.</li>
                </ul>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="secondary">Coming soon</Badge>
                  <Badge variant="outline">Show‑week focused</Badge>
                </div>
                <Button size="sm" className="mt-2 rounded-full">
                  Add placeholder task
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
