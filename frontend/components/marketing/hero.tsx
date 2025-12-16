import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Motion, MotionDiv, MotionFade } from "./motion";

const badges = [
  "Multi-tenant subdomains",
  "Role-based access",
  "Live Ops Console",
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:flex-row lg:items-center lg:gap-16 lg:px-8"
    >
      <div className="relative z-10 flex-1 space-y-6">
        <MotionDiv className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-[11px] font-medium text-muted-foreground shadow-sm backdrop-blur">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-[10px] font-semibold text-emerald-600">
            ●
          </span>
          <span>Purpose-built for hackathon organizers</span>
        </MotionDiv>

        <MotionDiv delay={0.05} className="space-y-4">
          <h1 className="max-w-xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Run your hackathon like a production system.
          </h1>
          <p className="max-w-xl text-pretty text-sm text-muted-foreground sm:text-base">
            HackPortal replaces the maze of Discord channels, spreadsheets, and
            ad-hoc docs with one workspace for your team: run-of-show, tasks,
            announcements, volunteer shifts, incidents, and people all in sync.
          </p>
        </MotionDiv>

        <MotionDiv delay={0.1} className="flex flex-col gap-3 pt-1 sm:flex-row">
          <div className="flex gap-2">
            <Button className="h-10 rounded-full px-5 text-sm sm:h-11 sm:px-6">
              <Link href="/auth/sign-up">Start free</Link>
            </Button>
            <Button
              variant="outline"
              className="h-10 rounded-full px-4 text-sm sm:h-11 sm:px-5"
            >
              <Link href="#demo">View demo</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground sm:self-center">
            No credit card. Designed for seasonal, volunteer-led teams.
          </p>
        </MotionDiv>

        <MotionDiv delay={0.16} className="flex flex-wrap gap-2 pt-3">
          {badges.map((badge) => (
            <Badge key={badge} variant="outline">
              {badge}
            </Badge>
          ))}
        </MotionDiv>
      </div>

      <MotionFade
        delay={0.12}
        className="relative z-10 mt-4 flex flex-1 justify-center lg:mt-0"
      >
        <HeroPreview />
      </MotionFade>
    </section>
  );
}

function HeroPreview() {
  return (
    <div
      aria-label="HackPortal overview"
      className="relative w-full max-w-md rounded-3xl border border-border/70 bg-card/80 p-4 shadow-lg shadow-black/5 backdrop-blur-xl"
    >
      <div className="mb-3 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>Live event · 420 hackers</span>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-[11px] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          <span>2 open incidents</span>
        </div>
      </div>

      <div className="grid gap-3 text-[11px] sm:text-xs">
        <div className="rounded-2xl border border-border/70 bg-background/80 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground">
              Run of show · Today
            </span>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
              On track
            </span>
          </div>
          <ul className="space-y-1.5">
            <li className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-8 rounded-full bg-emerald-500/40" />
                Check-in & badge pickup
              </span>
              <span className="text-[10px] text-muted-foreground">08:00</span>
            </li>
            <li className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-8 rounded-full bg-sky-500/40" />
                Opening ceremony
              </span>
              <span className="text-[10px] text-muted-foreground">10:00</span>
            </li>
            <li className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-8 rounded-full bg-violet-500/40" />
                Mentor rounds
              </span>
              <span className="text-[10px] text-muted-foreground">14:30</span>
            </li>
          </ul>
        </div>

        <div className="grid gap-3 sm:grid-cols-[3fr,2fr]">
          <div className="rounded-2xl border border-border/70 bg-background/80 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">
                Ops queue
              </span>
              <span className="text-[10px] text-muted-foreground">
                5 tasks · 3 owners
              </span>
            </div>
            <ul className="space-y-1.5">
              <li className="flex items-center justify-between gap-2 rounded-xl bg-muted/80 px-2.5 py-1.5">
                <span className="truncate text-[11px]">
                  Add power strips to hardware lab
                </span>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-[10px] font-semibold text-emerald-600">
                    JL
                  </span>
                </span>
              </li>
              <li className="flex items-center justify-between gap-2 rounded-xl bg-muted/40 px-2.5 py-1.5">
                <span className="truncate text-[11px]">
                  Confirm judges arrival window
                </span>
                <span className="rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[10px] text-amber-700">
                  Due in 1h
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-3 py-2">
              <div className="mb-1 flex items-center justify-between text-[11px] font-medium text-amber-900">
                <span>Incident · Wi‑Fi degradation</span>
                <span className="rounded-full bg-amber-900/5 px-2 py-0.5 text-[10px]">
                  SEV-2
                </span>
              </div>
              <p className="text-[11px] text-amber-950/80">
                Auto-routed to venue + IT. Status: triaging with NOC.
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/80 px-3 py-2">
              <div className="mb-1 flex items-center justify-between text-[11px]">
                <span className="font-medium text-muted-foreground">
                  Next announcement
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Scheduled · 15:00
                </span>
              </div>
              <p className="line-clamp-2 text-[11px] text-muted-foreground">
                “Hardware checkout closes in 30 minutes. Please return all loaner
                devices to the help desk.”
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


