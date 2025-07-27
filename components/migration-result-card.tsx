"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, RefreshCw, Search, X, Music, Undo2, FolderSyncIcon as Sync } from "lucide-react"

interface FailedTrack {
  id: string
  title: string
  artist: string
  reason: string
}

interface MigrationResultCardProps {
  isVisible: boolean
  onClose: () => void
  successCount: number
  failedTracks: FailedTrack[]
  playlistName: string
  onRetryFailed: () => void
  onManualMigrate: (trackId: string) => void
  onRevertMigration: () => void
  onKeepInSync: () => void
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
  const [retryingTrackId, setRetryingTrackId] = useState<string | null>(null)

  if (!isVisible) return null

  const totalTracks = successCount + failedTracks.length
  const hasFailures = failedTracks.length > 0
  const successRate = Math.round((successCount / totalTracks) * 100)

  const handleRetryTrack = (trackId: string) => {
    setRetryingTrackId(trackId)
    setTimeout(() => {
      setRetryingTrackId(null)
      onManualMigrate(trackId)
    }, 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-2xl bg-white/15 backdrop-blur-20 border border-white/30 rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="pb-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {hasFailures ? (
                <div className="w-16 h-16 bg-yellow-500/20 border-2 border-yellow-500/40 rounded-2xl flex items-center justify-center animate-pulse-glow shadow-xl">
                  <AlertTriangle className="w-8 h-8 text-yellow-600" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-green-500/20 border-2 border-green-500/40 rounded-2xl flex items-center justify-center animate-pulse-glow shadow-xl">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              )}
              <div>
                <CardTitle className="text-primary-dark text-2xl font-bold">
                  Migration {hasFailures ? "Partially Complete" : "Complete"}
                </CardTitle>
                <p className="text-secondary-dark text-sm mt-1">
                  {successRate}% success rate • {successCount} of {totalTracks} tracks migrated
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-secondary-dark hover:text-primary-dark hover:bg-white/20 rounded-xl transition-all"
              aria-label="Close migration results"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-6 glass-effect rounded-2xl border border-green-500/30 hover-lift">
              <div className="text-3xl font-bold text-green-600 mb-2">{successCount}</div>
              <div className="text-sm text-green-700 font-medium">Migrated</div>
            </div>
            {hasFailures && (
              <div className="text-center p-6 glass-effect rounded-2xl border border-yellow-500/30 hover-lift">
                <div className="text-3xl font-bold text-yellow-600 mb-2">{failedTracks.length}</div>
                <div className="text-sm text-yellow-700 font-medium">Failed</div>
              </div>
            )}
            <div className="text-center p-6 glass-effect rounded-2xl border border-white/30 hover-lift">
              <div className="text-3xl font-bold text-primary-dark mb-2">{totalTracks}</div>
              <div className="text-sm text-secondary-dark font-medium">Total</div>
            </div>
          </div>

          {/* Success Message */}
          {!hasFailures && (
            <div className="text-center p-8 glass-effect rounded-2xl border border-green-500/30">
              <div className="w-20 h-20 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse-glow shadow-xl">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-primary-dark font-bold text-2xl mb-3">Migration Successful!</h3>
              <p className="text-secondary-dark mb-6 max-w-md mx-auto">
                All {successCount} tracks from "{playlistName}" have been successfully migrated.
              </p>
              <div className="flex justify-center">
                <Button
                  onClick={onKeepInSync}
                  className="bg-green-500/20 hover:bg-green-500/30 text-green-700 border border-green-500/30 rounded-2xl px-6 py-3 font-semibold shadow-lg transition-all hover:scale-105"
                >
                  <Sync className="w-4 h-4 mr-2" />
                  Keep Playlists in Sync
                </Button>
              </div>
            </div>
          )}

          {/* Failed Tracks */}
          {hasFailures && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-primary-dark font-bold text-lg flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  </div>
                  Tracks That Couldn't Be Migrated
                </h4>
                <Badge
                  variant="secondary"
                  className="bg-yellow-500/20 text-yellow-700 rounded-xl px-3 py-1 font-semibold"
                >
                  {failedTracks.length} failed
                </Badge>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
                {failedTracks.map((track) => (
                  <Card
                    key={track.id}
                    className="glass-effect border-white/30 hover:bg-white/20 transition-all hover-lift"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mt-1 shadow-lg">
                            <Music className="w-6 h-6 text-secondary-dark" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-primary-dark font-semibold truncate text-lg">{track.title}</h5>
                            <p className="text-secondary-dark text-sm truncate mb-2">{track.artist}</p>
                            <div className="inline-flex items-center gap-2 bg-yellow-500/20 px-3 py-1 rounded-xl">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                              <span className="text-yellow-700 text-xs font-medium">{track.reason}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRetryTrack(track.id)}
                            disabled={retryingTrackId === track.id}
                            className="border-white/30 text-secondary-dark hover:bg-white/20 hover:text-primary-dark bg-transparent rounded-xl shadow-lg transition-all hover:scale-105"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-white/20">
                <Button
                  onClick={onRetryFailed}
                  className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-700 border border-yellow-500/30 rounded-2xl py-3 font-semibold shadow-lg transition-all hover:scale-105"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry All Failed
                </Button>
                <Button
                  onClick={onRevertMigration}
                  variant="outline"
                  className="border-red-500/50 text-red-600 hover:bg-red-500/10 hover:text-red-700 bg-transparent rounded-2xl py-3 font-semibold shadow-lg transition-all hover:scale-105"
                >
                  <Undo2 className="w-4 h-4 mr-2" />
                  Revert Migration
                </Button>
              </div>

              {/* Keep in Sync Option */}
              <div className="text-center p-6 glass-effect border border-white/30 rounded-2xl">
                <p className="text-secondary-dark text-sm mb-4">
                  Want to keep the successfully migrated tracks in sync?
                </p>
                <Button
                  onClick={onKeepInSync}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl font-semibold px-6 py-3 shadow-xl transition-all hover:scale-105"
                >
                  <Sync className="w-4 h-4 mr-2" />
                  Keep Playlists in Sync
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-white/20">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-white/30 text-secondary-dark hover:bg-white/10 hover:text-primary-dark bg-transparent rounded-2xl py-3 font-semibold shadow-lg transition-all hover:scale-105"
            >
              Close
            </Button>
            {!hasFailures && (
              <Button
                onClick={onClose}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl font-semibold shadow-xl py-3 transition-all hover:scale-105"
              >
                Done
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
