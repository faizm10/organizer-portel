import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Product", href: "#product" },
  { label: "Security", href: "#security" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "/docs" },
];

export function Navbar({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border/70 bg-background/70 backdrop-blur-xl",
        className
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground shadow-sm">
            HP
          </span>
          <span className="text-sm font-semibold tracking-tight sm:text-base">
            HackPortal
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-6 text-xs font-medium text-muted-foreground md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="hidden h-9 px-3 text-xs md:inline-flex"
              asChild={false}
            >
              <Link href="/login">Log in</Link>
            </Button>
            <Button className="h-9 rounded-full px-4 text-xs sm:px-5">
              <Link href="/signup" className="flex items-center gap-1">
                <span>Start free</span>
              </Link>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}


