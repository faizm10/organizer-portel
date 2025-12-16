import { PlayfulTodolist } from "@/components/animate-ui/components/community/playful-todolist"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { mockTasks } from "@/lib/mock-data"
import { requireUser } from "@/lib/auth"
import { requireSelectedOrg } from "@/lib/org"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default async function TasksPage() {
  const user = await requireUser()
  const membership = await requireSelectedOrg(user)
  const org = membership.organization

  return (
    <main className="mx-auto flex min-h-svh max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <DashboardHeader orgName={org.name} userEmail={user.email} role={membership.role} />

      <section className="space-y-4">
        <header className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">Tasks</h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Central board for everything your team needs to ship a calm, on‑time
            hackathon.
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
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
                <li>Dependencies like “only if Wi‑Fi incident is closed”.</li>
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
      </section>
    </main>
  )
}



