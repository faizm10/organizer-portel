import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { requireUser } from "@/lib/auth"
import { requireSelectedOrg } from "@/lib/org"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default async function OpsPage() {
  const user = await requireUser()
  const membership = await requireSelectedOrg(user)
  const org = membership.organization

  return (
    <main className="mx-auto flex min-h-svh max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <DashboardHeader orgName={org.name} userEmail={user.email} role={membership.role} />

      <section className="space-y-4">
        <header className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">Ops HQ</h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            The live control room for run‑of‑show, incidents, and on‑call
            rotations during your event.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Coming soon</CardTitle>
            <CardDescription>
              A purpose‑built view for leads to keep the hackathon calm in real time.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
              <li>Timeline view for load‑in, opening ceremony, hacking, and judging.</li>
              <li>Incident board with SEV levels and explicit on‑call roles.</li>
              <li>Integration points for Wi‑Fi, venue, and ticketing systems.</li>
              <li>Escalation paths for tech, logistics, and safety issues.</li>
              <li>Post‑event incident review and learning capture.</li>
            </ul>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="secondary">Coming soon</Badge>
              <Badge variant="outline">Live ops</Badge>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" className="rounded-full">
                Add mock incident
              </Button>
              <Button size="sm" className="rounded-full">
                View sample run‑of‑show
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}





