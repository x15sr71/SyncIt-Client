"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Single-button theme toggle, shared by the marketing header and the
 * dashboard header.
 *
 * The sun and moon are stacked and cross-faded with rotation and scale, so
 * one glyph turns into the other rather than swapping. Both are always in the
 * DOM; only transform and opacity differ.
 *
 * Visibility is driven from React rather than Tailwind `dark:` variants. The
 * variants did not win against the base utilities here, so the icon stayed on
 * the light state while the page was dark. Deriving it from `resolvedTheme`
 * removes the dependency on selector precedence entirely.
 *
 * `mounted` keeps the first paint deterministic: the server cannot know the
 * stored theme, so both renders start from the light state and the correct
 * one animates in after hydration.
 *
 * The morph depends on ThemeProvider running without
 * `disableTransitionOnChange` — see the note in app/layout.tsx.
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
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
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
          "absolute h-[1.05rem] w-[1.05rem] transition-all duration-500 ease-spring motion-reduce:transition-none",
          isDark
            ? "rotate-90 scale-50 opacity-0"
            : "rotate-0 scale-100 opacity-100",
        )}
        aria-hidden="true"
      />
      <Moon
        className={cn(
          "absolute h-[1.05rem] w-[1.05rem] transition-all duration-500 ease-spring motion-reduce:transition-none",
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-50 opacity-0",
        )}
        aria-hidden="true"
      />
    </button>
  );
}
