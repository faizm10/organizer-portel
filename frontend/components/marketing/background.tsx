import { Motion } from "./motion";
import { cn } from "@/lib/utils";

export function GradientBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_top,_oklch(0.95_0.03_250)_0,_transparent_55%),radial-gradient(circle_at_bottom,_oklch(0.97_0.04_140)_0,_transparent_55%)]",
        className
      )}
    >
      <Motion.div
        className="absolute -left-32 top-[-10rem] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,_oklch(0.93_0.08_260)_0,_transparent_70%)] opacity-70 blur-3xl"
        animate={{ x: [0, 20, -10, 0], y: [0, 10, -10, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <Motion.div
        className="absolute right-[-6rem] top-40 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,_oklch(0.96_0.06_120)_0,_transparent_70%)] opacity-60 blur-3xl"
        animate={{ x: [0, -20, 10, 0], y: [0, -15, 10, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-x-0 top-32 mx-auto h-px max-w-5xl bg-gradient-to-r from-transparent via-border/80 to-transparent" />
    </div>
  );
}


