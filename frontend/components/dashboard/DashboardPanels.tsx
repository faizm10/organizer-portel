'use client'

import { PlayfulTodolist } from "@/components/animate-ui/components/community/playful-todolist"
import { NotificationList } from "@/components/animate-ui/components/community/notification-list"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export type TaskItem = {
  id: number
  label: string
  done?: boolean
}

export type NotificationItem = {
  id: number
  title: string
  subtitle: string
  time: string
  count?: number
}

// Hackathon-flavoured mock data that can be reused across pages.
export const mockTasks: TaskItem[] = [
  { id: 1, label: "Finalize venue floor plan & power drops", done: true },
  { id: 2, label: "Publish run-of-show to organizers", done: false },
  { id: 3, label: "Confirm sponsor workshop times", done: false },
  { id: 4, label: "Assign mentors to tracks", done: true },
  { id: 5, label: "Print QR codes for judging portals", done: false },
  { id: 6, label: "Set up incident response Slack channel", done: true },
  { id: 7, label: "Schedule volunteer check-in shifts", done: false },
  { id: 8, label: "Send pre-event email to hackers", done: true },
]

export const mockNotifications: NotificationItem[] = [
  {
    id: 1,
    title: "New sponsor added",
    subtitle: "Acme Cloud confirmed Gold sponsorship",
    time: "3 min ago",
  },
  {
    id: 2,
    title: "Workshop capacity alert",
    subtitle: "Intro to LLMs is 90% full",
    time: "12 min ago",
  },
  {
    id: 3,
    title: "Logistics",
    subtitle: "Late-night pizza order submitted to venue",
    time: "24 min ago",
  },
  {
    id: 4,
    title: "Judging checklist",
    subtitle: "Track leads confirmed for final round",
    time: "40 min ago",
  },
  {
    id: 5,
    title: "Volunteer shift swap",
    subtitle: "2 volunteers requested shift changes",
    time: "1 hr ago",
  },
  {
    id: 6,
    title: "Mentor availability",
    subtitle: "Hardware mentors online for next 2 hours",
    time: "1 hr ago",
  },
  {
    id: 7,
    title: "Incident resolved",
    subtitle: "Wi‑Fi saturation in main hall cleared",
    time: "2 hr ago",
  },
  {
    id: 8,
    title: "Check-in summary",
    subtitle: "312 hackers checked in so far",
    time: "Today",
  },
]

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


