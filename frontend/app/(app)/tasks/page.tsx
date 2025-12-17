import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { requireUser } from "@/lib/auth";
import { requireSelectedOrg } from "@/lib/org";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground">
            Task management for your hackathon organization.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>
              Task management features will be available soon.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Planned features:
              </p>
              <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                <li>Create and manage tasks</li>
                <li>Assign tasks to team members</li>
                <li>Track task status and priorities</li>
                <li>Set due dates and reminders</li>
                <li>Filter and sort tasks</li>
              </ul>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="secondary">Coming soon</Badge>
                <Badge variant="outline">In development</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
