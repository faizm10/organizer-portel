import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { requireUser } from "@/lib/auth"
import { requireSelectedOrg } from "@/lib/org"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default async function PeoplePage() {
  const user = await requireUser()
  const membership = await requireSelectedOrg(user)
  const org = membership.organization

  return (
    <main className="mx-auto flex min-h-svh max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <DashboardHeader orgName={org.name} userEmail={user.email} role={membership.role} />

      <section className="space-y-4">
        <header className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">People</h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            One place for organizers, volunteers, mentors, judges, sponsors, and
            partners tied to your event.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Coming soon</CardTitle>
            <CardDescription>
              A people-first view of everyone who helps ship your hackathon.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
              <li>Unified directory across organizers, volunteers, and mentors.</li>
              <li>Tags for skills, tracks, and sponsorship tiers.</li>
              <li>Contact details and communication history per person.</li>
              <li>Role‑based views for tech, logistics, sponsorship, outreach.</li>
              <li>Post‑event export for future recruiting and alumni.</li>
            </ul>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="secondary">Coming soon</Badge>
              <Badge variant="outline">People‑centric</Badge>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" className="rounded-full">
                Import CSV (mock)
              </Button>
              <Button size="sm" className="rounded-full">
                Add placeholder person
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}


