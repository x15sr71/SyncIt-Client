"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Sun/Moon theme toggle, shared by the marketing header and the dashboard
 * header so the hydration guard lives in exactly one place.
 *
 * `mounted` matters: the server cannot know the visitor's persisted theme, so
 * rendering the real state on the server would produce a hydration mismatch.
 * Until mount it renders the light-mode face.
 *
 * The two icons are stacked and cross-faded on a rotate+scale arc, which reads
 * as one mark morphing rather than two icons swapping.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={cn(
        "relative grid h-9 w-9 place-items-center overflow-hidden rounded-full",
        "border border-border/70 bg-card/50 text-foreground",
        "transition-[background-color,border-color,transform] duration-200 ease-out",
        "hover:bg-accent hover:border-border active:scale-95",
        "focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2",
        className,
      )}
    >
      <Sun
        className={cn(
          "absolute h-[1.05rem] w-[1.05rem] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          isDark
            ? "rotate-90 scale-50 opacity-0"
            : "rotate-0 scale-100 opacity-100",
        )}
        aria-hidden="true"
      />
      <Moon
        className={cn(
          "absolute h-[1.05rem] w-[1.05rem] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-50 opacity-0",
        )}
        aria-hidden="true"
      />
    </button>
  );
}
