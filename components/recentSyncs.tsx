import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SyncStatus } from "@/components/sync-status";

export default function RecentSyncs() {
  return (
    <>
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
          <SyncStatus
            playlistName="My Favorites"
            status="success"
            timestamp="2 hours ago"
            tracksCount={127}
          />
          <SyncStatus
            playlistName="Workout Mix"
            status="in-progress"
            timestamp="Just now"
            tracksCount={45}
          />
          <SyncStatus
            playlistName="Chill Vibes"
            status="failed"
            timestamp="1 day ago"
            tracksCount={89}
          />
        </CardContent>
      </Card>
    </>
  );
}
