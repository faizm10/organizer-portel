import * as React from "react";
import { Users, Network, ClipboardList, Megaphone, Shield, Timer, CalendarClock, RadioTower } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MotionDiv, MotionFade } from "./motion";

export function SocialProofSection() {
  const orgs = ["CampusLaunch", "DevNight", "Hack@Scale", "Midnight Hacks", "IndieJam"];
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <MotionFade className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card/80 px-4 py-3 text-xs shadow-sm backdrop-blur-sm sm:px-6">
        <p className="text-muted-foreground">
          Trusted by teams that ship hackathons with{" "}
          <span className="font-semibold text-foreground">no all-nighters.</span>
        </p>
        <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
          {orgs.map((org) => (
            <span
              key={org}
              className="rounded-full bg-muted px-2.5 py-1 font-medium"
            >
              {org}
            </span>
          ))}
        </div>
      </MotionFade>
    </section>
  );
}

export function ProblemSolutionSection() {
  return (
    <section
      id="product"
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
    >
      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <MotionDiv className="space-y-4 rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm backdrop-blur-sm">
          <Badge variant="subtle" className="mb-1">
            Before HackPortal
          </Badge>
          <h2 className="text-lg font-semibold tracking-tight">
            Before: 9 tools, 200 channels, zero shared reality.
          </h2>
          <p className="text-sm text-muted-foreground">
            Fragmented conversations, outdated runbooks, and “who owns this?”
            moments right when things go sideways.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-destructive" />
              <span>Announcements buried under memes and off-topic threads.</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-destructive" />
              <span>Run-of-show lives in a doc only two people can find.</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-destructive" />
              <span>No audit trail when decisions are made under pressure.</span>
            </li>
          </ul>
        </MotionDiv>

        <MotionDiv delay={0.06} className="space-y-4 rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm backdrop-blur-sm">
          <Badge className="mb-1">After HackPortal</Badge>
          <h2 className="text-lg font-semibold tracking-tight">
            After: one workspace the whole crew can trust.
          </h2>
          <p className="text-sm text-muted-foreground">
            Every task, shift, incident, and announcement lives in the same
            system—designed for events that only get one shot.
          </p>
          <dl className="mt-4 grid gap-3 text-sm">
            <FeatureRow
              icon={ClipboardList}
              label="Ops dashboard"
              description="Live run-of-show, incident feed, and upcoming checkpoints in one view."
            />
            <FeatureRow
              icon={Users}
              label="People graph"
              description="See mentors, judges, sponsors, and volunteers with clear ownership."
            />
            <FeatureRow
              icon={Network}
              label="Integrated messaging"
              description="Push announcements to email, SMS, and Discord from a single composer."
            />
          </dl>
        </MotionDiv>
      </div>
    </section>
  );
}

function FeatureRow({
  icon: Icon,
  label,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-muted">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </span>
      <div>
        <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </dt>
        <dd className="text-sm text-muted-foreground">{description}</dd>
      </div>
    </div>
  );
}

const featureCards = [
  {
    title: "Ops HQ",
    icon: Timer,
    description:
      "Timeline, run-of-show, and on-call rotations kept in lockstep with the real event.",
  },
  {
    title: "Tasks & dependencies",
    icon: ClipboardList,
    description:
      "Model “only if Wi‑Fi is stable” and “after opening ceremony” with lightweight dependency graphs.",
  },
  {
    title: "Announcements with approvals",
    icon: Megaphone,
    description:
      "Draft once, route to the right approver, and publish across channels without copy-paste.",
  },
  {
    title: "People CRM",
    icon: Users,
    description:
      "Mentors, judges, sponsors, and partners with tags, roles, and engagement history.",
  },
  {
    title: "Volunteer shifts & check-in",
    icon: CalendarClock,
    description:
      "Smart shift templates, QR code check-in, and “who’s on deck now?” at a glance.",
  },
  {
    title: "Live incident board",
    icon: RadioTower,
    description:
      "SEV levels, roles, and timelines tailored for hackathon failure modes, not datacenters.",
  },
];

export function FeaturesGridSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
      <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <MotionDiv className="space-y-2">
          <Badge variant="subtle">Features</Badge>
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
            Everything your organizing team touches—under one roof.
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            HackPortal gives you operational primitives tuned for hackathons, not generic project boards.
          </p>
        </MotionDiv>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featureCards.map((feature, index) => (
          <MotionDiv
            key={feature.title}
            delay={index * 0.04}
            className="h-full"
          >
            <Card className="h-full border-border/70 bg-card/90 transition-transform hover:-translate-y-1 hover:border-border hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                  <feature.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 text-[11px] text-muted-foreground">
                <ul className="space-y-1.5">
                  <li className="flex gap-1.5">
                    <span className="mt-1 h-1 w-1 rounded-full bg-foreground/40" />
                    <span>Realtime updates for the whole crew.</span>
                  </li>
                  <li className="flex gap-1.5">
                    <span className="mt-1 h-1 w-1 rounded-full bg-foreground/40" />
                    <span>Designed to feel calm—even when the schedule isn&apos;t.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </MotionDiv>
        ))}
      </div>
    </section>
  );
}

export function ProductMockSection() {
  return (
    <section
      id="demo"
      className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 lg:px-8 lg:pb-20"
      aria-labelledby="demo-heading"
    >
      <div className="mb-4 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
        <MotionDiv className="space-y-1">
          <Badge variant="subtle">Live demo</Badge>
          <h2
            id="demo-heading"
            className="text-lg font-semibold tracking-tight sm:text-xl"
          >
            See how your event feels inside HackPortal.
          </h2>
        </MotionDiv>
        <MotionFade delay={0.06}>
          <p className="max-w-md text-xs text-muted-foreground">
            This is a static mock of the actual product UI—no fake screenshots,
            just HTML and CSS.
          </p>
        </MotionFade>
      </div>

      <MotionDiv
        delay={0.04}
        className="overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-background via-background to-muted/70 p-4 shadow-lg shadow-black/5"
      >
        <div className="mb-3 flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>HackPortal · ops.hacknight.dev</span>
          </div>
          <div className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>All systems healthy</span>
          </div>
        </div>

        <Tabs
          defaultValue="tasks"
          aria-label="HackPortal workspace demo"
          className="mt-1"
        >
          <TabsList>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="incidents">Incidents</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="mt-3">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Ops board · Today
                  </span>
                  <span>6 open · 12 done</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <TaskRow
                    title="Finalize sponsor expo layout"
                    status="In progress"
                    pill="Venue"
                    owner="AL"
                  />
                  <TaskRow
                    title="Print & place judging QR posters"
                    status="Blocked"
                    pill="Judging"
                    owner="RM"
                    tone="warning"
                  />
                  <TaskRow
                    title="Confirm midnight snack delivery window"
                    status="Queued"
                    pill="Experience"
                    owner="ST"
                  />
                </div>
              </div>
              <div className="w-full max-w-xs space-y-2 rounded-2xl border border-border/70 bg-background/80 p-3 text-[11px] text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">
                    Dependencies
                  </span>
                  <span>3 linked</span>
                </div>
                <ul className="space-y-1.5">
                  <li className="flex items-center justify-between gap-2 rounded-xl bg-muted px-2.5 py-1.5">
                    <span className="truncate">
                      Opening ceremony AV check passed
                    </span>
                    <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-700">
                      Met
                    </span>
                  </li>
                  <li className="flex items-center justify-between gap-2 rounded-xl bg-muted/60 px-2.5 py-1.5">
                    <span className="truncate">
                      Wi‑Fi capacity test baseline recorded
                    </span>
                    <span className="rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[10px] text-amber-700">
                      Pending
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="announcements" className="mt-3">
            <div className="grid gap-3 sm:grid-cols-[3fr,2fr]">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Announcement composer
                  </span>
                  <span>Goes to: Email · SMS · Discord</span>
                </div>
                <div className="space-y-2 rounded-2xl border border-border/70 bg-background/80 p-3">
                  <input
                    aria-label="Announcement title"
                    className="w-full rounded-lg border border-border/70 bg-muted/60 px-2.5 py-1.5 text-[11px] outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    placeholder="Late-night mentor office hours"
                  />
                  <textarea
                    aria-label="Announcement body"
                    className="h-20 w-full resize-none rounded-lg border border-border/70 bg-muted/60 px-2.5 py-1.5 text-[11px] outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    defaultValue="Mentors will be available in the Quiet Room from 11:30pm–1:00am. Please keep discussions focused and quiet for sleeping hackers."
                  />
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <div className="inline-flex items-center gap-1 rounded-full bg-muted px-1.5 py-0.5">
                      <Shield className="h-3 w-3" />
                      <span>Requires approvals · Ops, Sponsor</span>
                    </div>
                    <Button className="h-7 rounded-full px-3 text-[10px]">
                      Send for approval
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-2 rounded-2xl border border-border/70 bg-background/80 p-3 text-[11px] text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">
                    Approval timeline
                  </span>
                  <span>2 of 3 approved</span>
                </div>
                <ul className="space-y-1.5">
                  <li className="flex items-center justify-between gap-2 rounded-xl bg-muted px-2.5 py-1.5">
                    <span>Ops lead · 2 min ago</span>
                    <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-700">
                      Approved
                    </span>
                  </li>
                  <li className="flex items-center justify-between gap-2 rounded-xl bg-muted/60 px-2.5 py-1.5">
                    <span>Sponsor liaison · waiting</span>
                    <span className="rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[10px] text-amber-700">
                      Pending
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="incidents" className="mt-3">
            <div className="grid gap-3 sm:grid-cols-[2fr,3fr]">
              <div className="space-y-2 rounded-2xl border border-border/70 bg-background/80 p-3 text-[11px] text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">
                    Active incidents
                  </span>
                  <span>2 open · 4 resolved</span>
                </div>
                <ul className="space-y-1.5">
                  <IncidentRow
                    title="Wi‑Fi saturation in main hall"
                    sev="SEV‑2"
                    owner="Infra"
                    tone="warning"
                  />
                  <IncidentRow
                    title="Hardware lab badge printer offline"
                    sev="SEV‑3"
                    owner="Ops"
                    tone="info"
                  />
                </ul>
              </div>
              <div className="space-y-2 rounded-2xl border border-border/70 bg-background/80 p-3 text-[11px] text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">
                    Timeline · Wi‑Fi saturation
                  </span>
                  <span>Last update 2 min ago</span>
                </div>
                <ol className="space-y-1.5">
                  <li className="flex gap-2">
                    <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-amber-500" />
                    <div>
                      <p className="text-[11px]">
                        13:02 · Spike detected from judge devices on 5GHz band.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-sky-500" />
                    <div>
                      <p className="text-[11px]">
                        13:06 · Auto-routed to venue IT + Infra on-call.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <div>
                      <p className="text-[11px]">
                        13:11 · Workaround posted to hacker announcements.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </MotionDiv>
    </section>
  );
}

function TaskRow({
  title,
  status,
  pill,
  owner,
  tone = "default",
}: {
  title: string;
  status: string;
  pill: string;
  owner: string;
  tone?: "default" | "warning";
}) {
  const toneClasses =
    tone === "warning"
      ? "border-amber-500/40 bg-amber-500/5"
      : "border-border/60 bg-muted/60";

  return (
    <div
      className={`flex items-center justify-between gap-2 rounded-xl border px-2.5 py-1.5 ${toneClasses}`}
    >
      <div className="space-y-0.5">
        <p className="truncate text-[11px] text-foreground">{title}</p>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <span>{status}</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span>{pill}</span>
        </div>
      </div>
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-background text-[10px] font-semibold text-muted-foreground">
        {owner}
      </span>
    </div>
  );
}

function IncidentRow({
  title,
  sev,
  owner,
  tone = "info",
}: {
  title: string;
  sev: string;
  owner: string;
  tone?: "info" | "warning";
}) {
  const sevClasses =
    tone === "warning"
      ? "bg-amber-500/10 text-amber-800"
      : "bg-sky-500/10 text-sky-800";

  return (
    <li className="flex items-center justify-between gap-2 rounded-xl bg-muted px-2.5 py-1.5">
      <div className="space-y-0.5">
        <p className="truncate text-[11px] text-foreground">{title}</p>
        <p className="text-[10px] text-muted-foreground">Owner: {owner}</p>
      </div>
      <span
        className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${sevClasses}`}
      >
        {sev}
      </span>
    </li>
  );
}

export function SecuritySection() {
  return (
    <section
      id="security"
      className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 lg:px-8 lg:pb-20"
    >
      <div className="grid gap-6 lg:grid-cols-[1.6fr,1fr] lg:items-start">
        <MotionDiv className="space-y-3">
          <Badge variant="subtle">Security & trust</Badge>
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
            Built for events that handle real data, not just pizza orders.
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            From mentor availability to sponsor contracts and student info, we
            treat your hackathon like a production system with real privacy
            requirements.
          </p>
          <dl className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            <SecurityItem title="Audit logs">
              Every significant action—announcements, incident changes, role
              updates—is recorded with actor, time, and context.
            </SecurityItem>
            <SecurityItem title="SSO-ready">
              Connect to campus SSO or your existing SAML/OIDC provider for
              staff access.
            </SecurityItem>
            <SecurityItem title="Encryption & backups">
              Data encrypted in transit & at rest with rolling backups during
              and after your event.
            </SecurityItem>
            <SecurityItem title="Least-privilege roles">
              Separate views for leads, volunteers, sponsors, and mentors with
              just enough access for their job.
            </SecurityItem>
          </dl>
        </MotionDiv>

        <MotionFade delay={0.08}>
          <Card className="border-dashed border-emerald-600/50 bg-emerald-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-emerald-600" />
                Designed for live events
              </CardTitle>
              <CardDescription>
                HackPortal is opinionated about how event access should work, so
                you don&apos;t have to design permissions from scratch.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 text-xs text-emerald-900/80">
              <ul className="space-y-1.5">
                <li>Scoped access windows for contractors and temp staff.</li>
                <li>Separate sandboxes for each event or campus chapter.</li>
                <li>Easy data export after the event for audits and reports.</li>
              </ul>
            </CardContent>
          </Card>
        </MotionFade>
      </div>
    </section>
  );
}

function SecurityItem({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </dt>
      <dd className="text-sm text-muted-foreground">{children}</dd>
    </div>
  );
}

const pricingTiers = [
  {
    name: "Starter",
    price: "$0",
    cadence: "per event",
    highlight: false,
    description: "For small, first-time, or campus-side hackathons.",
    features: [
      "Up to 150 participants",
      "Single organizing workspace",
      "Basic tasks, announcements, and incidents",
      "Email-only support during event week",
    ],
    cta: "Launch your first event",
  },
  {
    name: "Team",
    price: "$249",
    cadence: "per event",
    highlight: true,
    description: "For recurring mid-size events with sponsors and judges.",
    features: [
      "Up to 600 participants",
      "Multiple workspaces (pre-event, live, post-mortem)",
      "Advanced roles, approvals, and incident workflows",
      "Priority support during show weekend",
    ],
    cta: "Start with Team",
  },
  {
    name: "Enterprise",
    price: "Let’s talk",
    cadence: "for your portfolio",
    highlight: false,
    description: "For universities, devrel teams, and corporate series.",
    features: [
      "Unlimited events and organizers",
      "Custom SSO & security reviews",
      "Dedicated onboarding for your crew",
      "White-labeling and sponsor integrations",
    ],
    cta: "Talk to sales",
  },
];

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 lg:px-8 lg:pb-20"
    >
      <div className="mb-6 flex flex-col gap-2 text-center sm:mb-8">
        <MotionDiv className="space-y-2">
          <Badge variant="subtle">Pricing</Badge>
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
            Simple per-event pricing for seasonal teams.
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground">
            No per-seat math, no long-term contracts. Spin up HackPortal for
            each event, archive it when you&apos;re done, and keep a clean
            operational history.
          </p>
        </MotionDiv>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {pricingTiers.map((tier) => (
          <MotionDiv
            key={tier.name}
            delay={tier.highlight ? 0.06 : 0}
            className="h-full"
          >
            <Card
              className={`flex h-full flex-col border-border/70 bg-card/90 ${
                tier.highlight
                  ? "ring-1 ring-primary/40"
                  : "hover:border-border"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>{tier.name}</CardTitle>
                  {tier.highlight && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                      Most popular
                    </span>
                  )}
                </div>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between gap-4 pt-0">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-semibold tracking-tight">
                      {tier.price}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {tier.cadence}
                    </span>
                  </div>
                  <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex gap-1.5">
                        <span className="mt-1 h-1 w-1 rounded-full bg-foreground/40" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  variant={tier.highlight ? "default" : "outline"}
                  className="mt-1 h-9 rounded-full px-3 text-xs"
                >
                  {tier.cta}
                </Button>
              </CardContent>
            </Card>
          </MotionDiv>
        ))}
      </div>
    </section>
  );
}

const testimonials = [
  {
    quote:
      "HackPortal turned our organizing chat from chaos into a calm control room. For the first time, I slept during a hackathon.",
    name: "Leah Chen",
    role: "Lead organizer, Midnight Hacks",
  },
  {
    quote:
      "We ran three events across two campuses in one semester. Having a single place for staff tasks and incidents made it actually possible.",
    name: "Arun Patel",
    role: "Faculty advisor, DevNight@State",
  },
  {
    quote:
      "Sponsors noticed the difference: fewer fire drills, faster judging, clearer communication. HackPortal paid for itself on day one.",
    name: "Morgan Reyes",
    role: "Partnerships, CampusLaunch",
  },
];

export function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 lg:px-8 lg:pb-20">
      <MotionDiv className="mb-6 space-y-2 text-center sm:mb-8">
        <Badge variant="subtle">Testimonials</Badge>
        <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
          Loved by teams that know show weekend is game day.
        </h2>
      </MotionDiv>
      <div className="grid gap-4 md:grid-cols-3">
        {testimonials.map((t, index) => (
          <MotionDiv key={t.name} delay={index * 0.06}>
            <Card className="h-full border-border/70 bg-card/90">
              <CardContent className="flex h-full flex-col gap-4 pt-5">
                <p className="flex-1 text-sm text-muted-foreground">{t.quote}</p>
                <div className="space-y-0.5 text-sm">
                  <p className="font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </CardContent>
            </Card>
          </MotionDiv>
        ))}
      </div>
    </section>
  );
}

const faqs = [
  {
    q: "Can we run multiple hackathons on separate subdomains?",
    a: "Yes. Each event can live on its own subdomain with isolated workspaces, permissions, and data boundaries.",
  },
  {
    q: "How granular are roles and permissions?",
    a: "We ship with opinionated roles for leads, core staff, volunteers, mentors, judges, and sponsors. You can fine-tune access per workspace.",
  },
  {
    q: "How long does onboarding take?",
    a: "Most teams are ready in under an hour. Import your schedule, define roles, and invite your crew. We provide templates to start from.",
  },
  {
    q: "Can we export our data after the event?",
    a: "Yes. You can export tasks, incidents, announcements, and people records for reporting, archives, or audits.",
  },
  {
    q: "Is pricing flexible for student or volunteer-run events?",
    a: "Absolutely. Pricing is per-event with friendly discounts for student groups and repeat organizers.",
  },
  {
    q: "What support do we get during show weekend?",
    a: "Team and Enterprise tiers include priority support with humans who have actually run production hackathons.",
  },
];

export function FAQSection() {
  return (
    <section
      id="faq"
      className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 lg:px-8 lg:pb-20"
    >
      <div className="mb-5 flex flex-col gap-2 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
        <MotionDiv className="space-y-2">
          <Badge variant="subtle">FAQ</Badge>
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
            Answers for organizers who ask the sharp questions.
          </h2>
        </MotionDiv>
      </div>
      <MotionFade>
        <Accordion type="multiple" defaultValue={["0"]}>
          {faqs.map((faq, index) => (
            <AccordionItem key={faq.q} value={String(index)} trigger={faq.q}>
              {faq.a}
            </AccordionItem>
          ))}
        </Accordion>
      </MotionFade>
    </section>
  );
}

export function FinalCTASection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
      <MotionDiv className="overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-r from-foreground via-foreground to-foreground/90 px-5 py-7 text-background shadow-lg sm:px-8 sm:py-9">
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2 text-background">
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              Your next event deserves better tooling.
            </h2>
            <p className="max-w-xl text-sm text-background/80">
              Give your organizing team a calm control room instead of a dozen
              tabs. HackPortal is the workspace built for the one weekend that
              has to run right.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button className="h-9 rounded-full bg-background px-4 text-xs font-medium text-foreground hover:bg-background/90">
              <a href="/auth/sign-up">Start free</a>
            </Button>
            <Button
              variant="outline"
              className="h-9 rounded-full border-background/40 bg-transparent px-4 text-xs font-medium text-foreground hover:bg-background/10"
            >
              <a href="/contact">Talk to us</a>
            </Button>
          </div>
        </div>
      </MotionDiv>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-background/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 text-xs text-muted-foreground sm:px-6 lg:px-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-[11px] text-primary-foreground">
              HP
            </span>
            <span>HackPortal</span>
          </div>
          <p className="max-w-xs text-xs text-muted-foreground">
            Calm, production-grade ops for the one weekend your community
            remembers.
          </p>
        </div>
        <div className="grid flex-1 gap-6 min-[480px]:grid-cols-3">
          <FooterColumn
            title="Product"
            links={[
              { label: "Overview", href: "#product" },
              { label: "Security", href: "#security" },
              { label: "Pricing", href: "#pricing" },
              { label: "Docs", href: "/docs" },
            ]}
          />
          <FooterColumn
            title="Company"
            links={[
              { label: "About", href: "/about" },
              { label: "Contact", href: "/contact" },
              { label: "Status", href: "/status" },
            ]}
          />
          <FooterColumn
            title="Legal"
            links={[
              { label: "Terms", href: "/legal/terms" },
              { label: "Privacy", href: "/legal/privacy" },
              { label: "DPA", href: "/legal/dpa" },
            ]}
          />
        </div>
        <div className="space-y-2 text-xs">
          <p className="font-medium text-foreground">Follow</p>
          <div className="flex gap-2">
            <SocialPill label="GitHub" />
            <SocialPill label="X" />
            <SocialPill label="LinkedIn" />
          </div>
        </div>
      </div>
      <div className="border-t border-border/60 bg-background/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 text-[11px] text-muted-foreground sm:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} HackPortal.</span>
          <span>Built for hackathons that ship.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-foreground">{title}</p>
      <ul className="space-y-1.5 text-xs">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialPill({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background/80 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-border hover:text-foreground"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-foreground/40" />
      <span>{label}</span>
    </button>
  );
}


