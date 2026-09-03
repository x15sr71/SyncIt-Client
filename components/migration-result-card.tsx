"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  X,
  Music,
  Undo2,
  FolderSyncIcon as Sync,
} from "lucide-react";

interface FailedTrack {
  id: string;
  title: string;
  artist: string;
  reason: string;
}

interface MigrationResultCardProps {
  isVisible: boolean;
  onClose: () => void;
  successCount: number;
  failedTracks: FailedTrack[];
  playlistName: string;
  onRetryFailed: () => void;
  onManualMigrate: (trackId: string) => void;
  onRevertMigration: () => void;
  onKeepInSync: () => void;
}

export function MigrationResultCard({
  isVisible,
  onClose,
  successCount,
  failedTracks,
  playlistName,
  onRetryFailed,
  onManualMigrate,
  onRevertMigration,
  onKeepInSync,
}: MigrationResultCardProps) {
  const [retryingTrackId, setRetryingTrackId] = useState<string | null>(null);

  if (!isVisible) return null;

  const totalTracks = successCount + failedTracks.length;
  const hasFailures = failedTracks.length > 0;
  // A run that added nothing is a failure, even when no individual track was
  // recorded as failed — that combination used to render "Migration
  // Successful!" over a 0/0 division that printed "NaN% success rate".
  const addedNothing = successCount === 0;
  const isFullSuccess = !hasFailures && !addedNothing;
  const successRate =
    totalTracks === 0 ? 0 : Math.round((successCount / totalTracks) * 100);

  const handleRetryTrack = (trackId: string) => {
    setRetryingTrackId(trackId);
    setTimeout(() => {
      setRetryingTrackId(null);
      onManualMigrate(trackId);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/40 backdrop-blur-sm fade-in-up">
      <Card className="w-full max-w-2xl shadow-elev max-h-[90vh] overflow-hidden">
        <CardHeader className="pb-5 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {addedNothing ? (
                <div className="w-12 h-12 bg-red-500/10 border border-red-500/25 rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              ) : hasFailures ? (
                <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/25 rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              )}
              <div>
                <CardTitle className="text-foreground text-xl font-semibold">
                  {addedNothing
                    ? "Migration Failed"
                    : hasFailures
                      ? "Migration Partially Complete"
                      : "Migration Complete"}
                </CardTitle>
                <p className="text-muted-foreground text-sm mt-0.5">
                  {addedNothing
                    ? "No tracks were added."
                    : `${successRate}% success rate • ${successCount} of ${totalTracks} tracks migrated`}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              aria-label="Close migration results"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 overflow-y-auto max-h-[65vh] pt-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* A green "0 Migrated" tile reads as a win; stay neutral at zero. */}
            <div
              className={`text-center p-4 rounded-lg border ${
                addedNothing
                  ? "border-border bg-muted/40"
                  : "border-emerald-500/25 bg-emerald-500/10"
              }`}
            >
              <div
                className={`text-2xl font-semibold mb-0.5 ${
                  addedNothing
                    ? "text-foreground"
                    : "text-emerald-600 dark:text-emerald-400"
                }`}
              >
                {successCount}
              </div>
              <div
                className={`text-xs font-medium ${
                  addedNothing
                    ? "text-muted-foreground"
                    : "text-emerald-600 dark:text-emerald-400"
                }`}
              >
                Migrated
              </div>
            </div>
            {hasFailures && (
              <div className="text-center p-4 rounded-lg border border-amber-500/25 bg-amber-500/10">
                <div className="text-2xl font-semibold text-amber-600 dark:text-amber-400 mb-0.5">
                  {failedTracks.length}
                </div>
                <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                  Failed
                </div>
              </div>
            )}
            <div className="text-center p-4 rounded-lg border border-border bg-muted/40">
              <div className="text-2xl font-semibold text-foreground mb-0.5">
                {totalTracks}
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                Total
              </div>
            </div>
          </div>

          {/* Success Message — only when tracks actually moved. */}
          {isFullSuccess && (
            <div className="text-center p-6 rounded-lg border border-emerald-500/25 bg-emerald-500/10">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-9 h-9 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-foreground font-semibold text-lg mb-2">
                Migration Successful!
              </h3>
              <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
                All {successCount} tracks from "{playlistName}" have been
                successfully migrated.
              </p>
              <div className="flex justify-center">
                <Button
                  onClick={onKeepInSync}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Sync className="w-4 h-4" />
                  Keep Playlists in Sync
                </Button>
              </div>
            </div>
          )}

          {/* Failed Tracks */}
          {hasFailures && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-foreground font-medium text-sm flex items-center gap-2">
                  <div className="w-7 h-7 bg-amber-500/10 border border-amber-500/25 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  Tracks That Couldn't Be Migrated
                </h4>
                <Badge
                  variant="outline"
                  className="border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                >
                  {failedTracks.length} failed
                </Badge>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                {failedTracks.map((track, index) => (
                  <Card
                    key={`failed-track-${track.id || index}`}
                    className="hover-lift"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center mt-0.5 shrink-0">
                            <Music className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-foreground font-medium truncate">
                              {track.title}
                            </h5>
                            <p className="text-muted-foreground text-sm truncate mb-1.5">
                              {track.artist}
                            </p>
                            <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded-md">
                              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                              <span className="text-amber-600 dark:text-amber-400 text-xs font-medium">
                                {track.reason}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleRetryTrack(track.id)}
                            disabled={retryingTrackId === track.id}
                            className="h-9 w-9"
                          >
                            {retryingTrackId === track.id ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Search className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Post-Migration Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-border">
                <Button
                  onClick={onRetryFailed}
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry All Failed
                </Button>
                <Button onClick={onRevertMigration} variant="outline">
                  <Undo2 className="w-4 h-4" />
                  Revert Migration
                </Button>
              </div>

              {/* Keep in Sync Option */}
              <div className="text-center p-5 rounded-lg border border-border bg-muted/40">
                <p className="text-muted-foreground text-sm mb-3">
                  Want to keep the successfully migrated tracks in sync?
                </p>
                <Button onClick={onKeepInSync}>
                  <Sync className="w-4 h-4" />
                  Keep Playlists in Sync
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Close
            </Button>
            {!hasFailures && (
              <Button onClick={onClose} className="flex-1">
                Done
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
