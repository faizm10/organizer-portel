'use client'

import { PlayfulTodolist } from "@/components/animate-ui/components/community/playful-todolist"
import { NotificationList } from "@/components/animate-ui/components/community/notification-list"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { mockTasks, mockNotifications } from "@/lib/mock-data"

export function DashboardPanels() {
  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>
              Show-week checklist for your organizing crew.
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
            <CardTitle>Updates</CardTitle>
            <CardDescription>
              Recent sponsor, logistics, and judging activity.
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
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <QuickLink
          title="Tasks"
          description="Plan and track everything from load-in to closing ceremony."
          href="/tasks"
        />
        <QuickLink
          title="Announcements"
          description="Draft and schedule updates for hackers, mentors, and sponsors."
          href="/announcements"
        />
        <QuickLink
          title="People"
          description="Keep organizers, volunteers, and mentors in one shared list."
          href="/people"
        />
        <QuickLink
          title="Ops HQ"
          description="Run-of-show, incidents, and on-call rotations in one view."
          href="/ops"
        />
      </div>
    </section>
  )
}

function QuickLink({
  title,
  description,
  href,
}: {
  title: string
  description: string
  href: string
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button asChild variant="outline" size="sm" className="mt-1 rounded-full">
          <Link href={href}>Open {title}</Link>
        </Button>
      </CardContent>
    </Card>
  )
}



