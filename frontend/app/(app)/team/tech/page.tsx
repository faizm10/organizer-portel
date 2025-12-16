import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { requireUser } from "@/lib/auth"
import { requireSelectedOrg } from "@/lib/org"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function TechTeamPage() {
  const user = await requireUser()
  const membership = await requireSelectedOrg(user)
  const org = membership.organization

  return (
    <main className="mx-auto flex min-h-svh max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <DashboardHeader orgName={org.name} userEmail={user.email} role={membership.role} />
      <section className="space-y-4">
        <header className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">Tech team</h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Infrastructure, Wi‑Fi, check‑in systems, and judging tech for your event.
          </p>
        </header>
        <Card>
          <CardHeader>
            <CardTitle>Coming soon</CardTitle>
            <CardDescription>Views tailored for your tech & infra leads.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
              <li>Incident queue filtered to technical issues.</li>
              <li>Integrations with Wi‑Fi, DNS, and deployment tooling.</li>
              <li>Runbooks for registration, badge printing, and portals.</li>
              <li>On‑call rotation overview for show‑week coverage.</li>
            </ul>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="secondary">Coming soon</Badge>
              <Badge variant="outline">Tech & infra</Badge>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}


