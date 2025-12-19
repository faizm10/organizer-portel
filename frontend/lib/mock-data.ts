// Shared mock data for development and placeholder pages

export type TaskItem = {
  id: number;
  label: string;
  done?: boolean;
};

export type NotificationItem = {
  id: number;
  title: string;
  subtitle: string;
  time: string;
  count?: number;
};

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
];

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
];

