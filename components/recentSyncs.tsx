import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SyncStatus } from "@/components/sync-status";
import type { RecentSync } from "@/hooks/useMe";

interface RecentSyncsProps {
  syncs?: RecentSync[];
  /** Maps a source playlist ID to a display name (from fetched playlists). */
  resolvePlaylistName?: (playlistId: string) => string | undefined;
}

function toDisplayStatus(status: string | null): "success" | "in-progress" | "failed" {
  if (status === "SUCCESS" || status === "PARTIAL") return "success";
  if (status === "RUNNING") return "in-progress";
  return "failed";
}

function relativeTime(iso: string | null): string {
  if (!iso) return "—";
  const deltaMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(deltaMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export default function RecentSyncs({ syncs, resolvePlaylistName }: RecentSyncsProps) {
  return (
    <Card
      className="hover-lift min-w-0"
      role="region"
      aria-labelledby="recent-syncs-heading"
    >
      <CardHeader className="pb-3">
        <CardTitle
          id="recent-syncs-heading"
          className="text-foreground text-base font-semibold truncate"
        >
          Recent syncs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 min-w-0 break-words">
        {!syncs || syncs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No syncs yet — migrate a playlist to see it here.
          </p>
        ) : (
          syncs.map((sync) => (
            <SyncStatus
              key={sync.id}
              playlistName={
                resolvePlaylistName?.(sync.sourcePlaylistId) ?? sync.sourcePlaylistId
              }
              status={toDisplayStatus(sync.status)}
              timestamp={
                sync.autoSyncEnabled && sync.nextSyncAt
                  ? `${relativeTime(sync.lastSyncAt)} · auto-sync on`
                  : relativeTime(sync.lastSyncAt)
              }
              tracksCount={sync.trackCount}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}
