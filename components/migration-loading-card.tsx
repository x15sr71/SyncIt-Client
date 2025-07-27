"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Music, ArrowRight, Loader2, CheckCircle } from "lucide-react"

interface MigrationLoadingCardProps {
  isVisible: boolean
  sourcePlatform: string
  targetPlatform: string
  playlists: Array<{
    id: string
    name: string
    totalTracks: number
    status: "pending" | "in-progress" | "completed" | "failed"
    progress: number
    currentStep: string
    processedTracks: number
  }>
  onComplete: (
    results: Array<{
      playlistId: string
      playlistName: string
      successCount: number
      failedTracks: FailedTrack[]
    }>,
  ) => void
}

interface FailedTrack {
  id: string
  title: string
  artist: string
  reason: string
}

export function MigrationLoadingCard({
  isVisible,
  sourcePlatform,
  targetPlatform,
  playlists = [], // Default to empty array
  onComplete,
}: MigrationLoadingCardProps) {
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0)

  useEffect(() => {
    if (!isVisible || playlists.length === 0) return

    // Simulate sequential migration
    const interval = setInterval(() => {
setCurrentPlaylistIndex((prevIndex) => {
  if (prevIndex + 1 >= playlists.length) {
    clearInterval(interval);
    setTimeout(() => {
      const results = playlists.map((playlist) => ({
        playlistId: playlist.id,
        playlistName: playlist.name,
        successCount: Math.floor(playlist.totalTracks * 0.9),
        failedTracks: [
          {
            id: "1",
            title: "Rare Live Version",
            artist: "Indie Artist",
            reason: "Song not available on target platform",
          },
        ],
      }));
      console.log("Calling onComplete with results", results);
      onComplete(results);
    }, 500);
    return prevIndex; // Don't increment past the last item
  }

  return prevIndex + 1;
});

    }, 4000) // 4 seconds per playlist

    return () => clearInterval(interval)
  }, [isVisible, playlists, onComplete])

  if (!isVisible || playlists.length === 0) return null

  const currentPlaylist = playlists[currentPlaylistIndex]
  const completedPlaylists = playlists.slice(0, Math.min(currentPlaylistIndex + 1, playlists.length))
  const totalPlaylists = playlists.length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-2xl bg-white/15 backdrop-blur-20 border border-white/30 rounded-3xl shadow-2xl">
        <CardHeader className="text-center pb-6 border-b border-white/20">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 animate-pulse-glow shadow-xl">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <CardTitle className="text-primary-dark text-2xl font-bold">Migrating Playlists</CardTitle>
          <p className="text-secondary-dark text-sm">
            {currentPlaylistIndex + 1} of {totalPlaylists} playlists • Please wait while we sync your music
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Migration Flow Visualization */}
          <div className="flex items-center justify-center space-x-6 p-6 glass-effect rounded-2xl">
            <div className="text-center">
              <div className="w-14 h-14 bg-green-500/20 border-2 border-green-500/40 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                <Music className="w-7 h-7 text-green-600" />
              </div>
              <div className="text-sm font-medium text-secondary-dark mb-1">From</div>
              <div className="text-primary-dark font-bold capitalize">{sourcePlatform}</div>
            </div>

            <div className="flex flex-col items-center">
              <ArrowRight className="w-8 h-8 text-purple-500 animate-pulse mb-2" />
              <div className="text-xs text-secondary-dark">Migrating</div>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-red-500/20 border-2 border-red-500/40 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                <Music className="w-7 h-7 text-red-600" />
              </div>
              <div className="text-sm font-medium text-secondary-dark mb-1">To</div>
              <div className="text-primary-dark font-bold capitalize">{targetPlatform}</div>
            </div>
          </div>

          {/* Current Playlist */}
          {currentPlaylist && currentPlaylistIndex < playlists.length && (
            <div className="text-center p-6 glass-effect rounded-2xl border border-purple-500/30">
              <h3 className="text-primary-dark font-bold text-xl mb-2">Currently Migrating</h3>
              <h4 className="text-primary-dark font-semibold text-lg mb-1">{currentPlaylist.name}</h4>
              <p className="text-secondary-dark text-sm mb-4">{currentPlaylist.totalTracks} tracks total</p>

              {/* Progress Bar */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-dark">Progress</span>
                  <span className="text-primary-dark font-medium">75%</span>
                </div>
                <div className="relative">
                  <Progress value={75} className="h-3 bg-white/20 rounded-full overflow-hidden" />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full animate-shimmer" />
                </div>
              </div>

              <p className="text-secondary-dark text-sm">Matching songs across platforms...</p>
            </div>
          )}

          {/* Completed Playlists */}
          {completedPlaylists.length > 0 && currentPlaylistIndex >= 0 && (
            <div className="space-y-3">
              <h4 className="text-primary-dark font-semibold flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Completed Playlists
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {completedPlaylists.map((playlist) => (
                  <div key={playlist.id} className="flex items-center justify-between p-3 glass-effect rounded-xl">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-primary-dark font-medium">{playlist.name}</span>
                    </div>
                    <span className="text-secondary-dark text-sm">{playlist.totalTracks} tracks</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loading Animation */}
          <div className="flex justify-center">
            <div className="flex space-x-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
