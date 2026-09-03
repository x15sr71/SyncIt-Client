"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Loader2 } from "lucide-react";

/**
 * Purely presentational "migration in progress" overlay.
 *
 * This card used to run a setInterval that walked the playlist list on a 4s
 * timer and then invented a result — successCount = totalTracks * 0.9 plus a
 * hardcoded failed track — and handed it to the dashboard as if it were the
 * backend's answer. Because it usually finished before the real request, the
 * fabricated numbers were what users actually saw; it once reported success
 * for a migration that added zero tracks.
 *
 * The real result now comes solely from the migration response
 * (see `handleMigrationComplete` in app/dashboard/page.tsx).
 *
 * The backend exposes no per-track progress, so this deliberately shows an
 * indeterminate state rather than a number it cannot know.
 */
interface MigrationLoadingCardProps {
  isVisible: boolean;
  sourcePlatform: string;
  targetPlatform: string;
  playlists: Array<{
    id: string;
    name: string;
    totalTracks: number;
  }>;
}

export function MigrationLoadingCard({
  isVisible,
  sourcePlatform,
  targetPlatform,
  playlists = [],
}: MigrationLoadingCardProps) {
  if (!isVisible || playlists.length === 0) return null;

  const totalTracks = playlists.reduce(
    (sum, playlist) => sum + (playlist.totalTracks || 0),
    0,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/40 backdrop-blur-sm fade-in-up"
      role="status"
      aria-live="polite"
    >
      <Card className="w-full max-w-2xl shadow-elev">
        <CardHeader className="text-center pb-5 border-b border-border">
          <div className="mx-auto w-14 h-14 bg-gradient-to-br from-brand-gradStart to-brand-gradEnd rounded-2xl flex items-center justify-center mb-3 shadow-soft">
            <Loader2 className="w-7 h-7 text-white animate-spin" />
          </div>
          <CardTitle className="text-foreground text-xl font-semibold">
            Migrating {playlists.length === 1 ? "playlist" : "playlists"}
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            {playlists.length}{" "}
            {playlists.length === 1 ? "playlist" : "playlists"} • {totalTracks}{" "}
            tracks — matching songs across platforms. This can take a few
            minutes; please keep this tab open.
          </p>
        </CardHeader>

        <CardContent className="space-y-5 pt-6">
          {/* Migration Flow Visualization */}
          <div className="flex items-center justify-center space-x-6 p-5 rounded-lg border border-border bg-muted/40">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/25 rounded-lg flex items-center justify-center mb-2">
                <Music className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-xs font-medium text-muted-foreground mb-0.5">
                From
              </div>
              <div className="text-foreground font-semibold capitalize text-sm">
                {sourcePlatform}
              </div>
            </div>

            <div className="sync-link">
              <div className="sync-pulse"></div>
              <span className="sync-dot"></span>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-red-500/10 border border-red-500/25 rounded-lg flex items-center justify-center mb-2">
                <Music className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-xs font-medium text-muted-foreground mb-0.5">
                To
              </div>
              <div className="text-foreground font-semibold capitalize text-sm">
                {targetPlatform}
              </div>
            </div>
          </div>

          {/* Queued playlists — no per-playlist status: the backend reports
              results only once the whole migration finishes. */}
          <div className="space-y-2">
            <h4 className="text-foreground font-medium text-sm">
              In this migration
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border"
                >
                  <span className="text-foreground font-medium text-sm truncate">
                    {playlist.name}
                  </span>
                  <span className="text-muted-foreground text-sm shrink-0">
                    {playlist.totalTracks} tracks
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Indeterminate activity indicator */}
          <div className="flex justify-center">
            <div className="flex space-x-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-brand-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
