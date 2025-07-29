import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SyncStatus } from "@/components/sync-status";

export default function RecentSyncs() {
    return (
        <>
         <Card
                      className="glass-card border-white/40 hover-lift min-w-0"
                      role="region"
                      aria-labelledby="recent-syncs-heading"
                    >
                      <CardHeader>
                        <CardTitle
                          id="recent-syncs-heading"
                          className="text-primary-dark truncate"
                        >
                          Recent Syncs
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 min-w-0 break-words">
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
    )
}