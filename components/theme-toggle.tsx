"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";

/**
 * Sun/Moon theme switch, shared by the marketing header and the dashboard
 * header so the hydration guard lives in exactly one place.
 *
 * `mounted` matters: the server cannot know the visitor's persisted theme, so
 * rendering the switch's real state on the server would produce a hydration
 * mismatch. Until mount it renders unchecked.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div
      className={
        className ??
        "flex items-center gap-2 px-2 py-1 rounded-md border border-border bg-card"
      }
    >
      <Sun className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
      <Switch
        checked={isDark}
        onCheckedChange={(value) => setTheme(value ? "dark" : "light")}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      />
      <Moon className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
    </div>
  );
}
