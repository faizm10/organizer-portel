import { NotificationList } from "@/components/animate-ui/components/community/notification-list"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { mockNotifications } from "@/components/dashboard/DashboardPanels"
import { requireUser } from "@/lib/auth"
import { requireSelectedOrg } from "@/lib/org"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default async function AnnouncementsPage() {
  const user = await requireUser()
  const membership = await requireSelectedOrg(user)
  const org = membership.organization

  return (
    <main className="mx-auto flex min-h-svh max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <DashboardHeader orgName={org.name} userEmail={user.email} role={membership.role} />

      <section className="space-y-4">
        <header className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">Announcements</h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Draft, approve, and send messages to hackers, mentors, judges, and
            sponsors without chasing threads.
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
          <Card>
            <CardHeader>
              <CardTitle>Notification list</CardTitle>
              <CardDescription>
                A stack of recent announcements and operational updates.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <NotificationList
                items={mockNotifications.map((n) => ({
                  id: n.id,
                  title: n.title,
                  subtitle: n.subtitle,
                  time: n.time,
                  count: n.count,
                }))}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Planned features</CardTitle>
              <CardDescription>
                What the full Announcements module will grow into.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                <li>Announcement composer with approvals and change history.</li>
                <li>Multi-channel delivery to email, SMS, and Discord.</li>
                <li>Quiet hours and rate limiting for late‑night updates.</li>
                <li>Segmented audiences for sponsors, mentors, and hackers.</li>
                <li>Incident‑linked announcements and status updates.</li>
              </ul>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="secondary">Coming soon</Badge>
                <Badge variant="outline">Multi‑channel</Badge>
              </div>
              <Button size="sm" className="mt-2 rounded-full">
                Draft example announcement
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}


