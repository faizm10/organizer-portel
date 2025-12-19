"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

type DashboardHeaderProps = {
  orgName: string;
  userEmail: string;
  role?: string;
};

export function DashboardHeader({ orgName, userEmail, role }: DashboardHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="flex flex-col gap-4 border-b border-border/60 pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Dashboard
        </p>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            HackPortal organizer workspace
          </h1>
          <p className="text-sm text-muted-foreground">
            Central command for run-of-show, tasks, announcements, and people for{" "}
            <span className="font-medium">{orgName}</span>.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Badge variant="outline">{userEmail}</Badge>
          <Badge variant="secondary">Org: {orgName}</Badge>
          {role && <Badge>Role: {role}</Badge>}
        </div>
      </div>

      <nav
        aria-label="App navigation"
        className="flex flex-wrap items-center gap-2 text-xs sm:justify-end"
      >
        <NavLink href="/dashboard" label="Dashboard" pathname={pathname} />
        <NavLink href="/tasks" label="Tasks" pathname={pathname} />
        <NavLink href="/announcements" label="Announcements" pathname={pathname} />
        <NavLink href="/people" label="People" pathname={pathname} />
        <NavLink href="/ops" label="Ops HQ" pathname={pathname} />
        <div className="flex items-center gap-1 rounded-full border border-border/70 px-2 py-1">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.16em]">
            Team
          </span>
          <div className="flex gap-1">
            <SmallLink href="/team/tech" label="Tech" pathname={pathname} />
            <SmallLink href="/team/logistics" label="Logistics" pathname={pathname} />
            <SmallLink href="/team/sponsorship" label="Sponsorship" pathname={pathname} />
            <SmallLink href="/team/outreach" label="Outreach" pathname={pathname} />
          </div>
        </div>
        <Button asChild size="sm" className="h-7 rounded-full px-3 text-[11px]">
          <Link href="/auth/logout">Sign out</Link>
        </Button>
      </nav>
    </header>
  );
}

function NavLink({ href, label, pathname }: { href: string; label: string; pathname: string }) {
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`rounded-full border px-3 py-1 transition-colors ${
        isActive
          ? "border-border bg-muted text-foreground"
          : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
      }`}
    >
      {label}
    </Link>
  );
}

function SmallLink({ href, label, pathname }: { href: string; label: string; pathname: string }) {
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`rounded-full px-2 py-0.5 text-[11px] transition-colors ${
        isActive
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {label}
    </Link>
  );
}
