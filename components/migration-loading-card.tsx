"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Music, ArrowRight, Loader2, CheckCircle } from "lucide-react";

interface MigrationLoadingCardProps {
  isVisible: boolean;
  sourcePlatform: string;
  targetPlatform: string;
  playlists: Array<{
    id: string;
    name: string;
    totalTracks: number;
    status: "pending" | "in-progress" | "completed" | "failed";
    progress: number;
    currentStep: string;
    processedTracks: number;
  }>;
  onComplete: (
    results: Array<{
      playlistId: string;
      playlistName: string;
      successCount: number;
      failedTracks: FailedTrack[];
    }>,
  ) => void;
}

interface FailedTrack {
  id: string;
  title: string;
  artist: string;
  reason: string;
}

export function MigrationLoadingCard({
  isVisible,
  sourcePlatform,
  targetPlatform,
  playlists = [], // Default to empty array
  onComplete,
}: MigrationLoadingCardProps) {
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);

  useEffect(() => {
    if (!isVisible || playlists.length === 0) return;

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
    }, 4000); // 4 seconds per playlist

    return () => clearInterval(interval);
  }, [isVisible, playlists, onComplete]);

  if (!isVisible || playlists.length === 0) return null;

  const currentPlaylist = playlists[currentPlaylistIndex];
  const completedPlaylists = playlists.slice(
    0,
    Math.min(currentPlaylistIndex + 1, playlists.length),
  );
  const totalPlaylists = playlists.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/40 backdrop-blur-sm fade-in-up">
      <Card className="w-full max-w-2xl shadow-elev">
        <CardHeader className="text-center pb-5 border-b border-border">
          <div className="mx-auto w-14 h-14 bg-gradient-to-br from-brand-gradStart to-brand-gradEnd rounded-xl2 flex items-center justify-center mb-3 shadow-soft">
            <Loader2 className="w-7 h-7 text-white animate-spin" />
          </div>
          <CardTitle className="text-foreground text-xl font-semibold">
            Migrating Playlists
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            {currentPlaylistIndex + 1} of {totalPlaylists} playlists • Please
            wait while we sync your music
          </p>
        </CardHeader>

        <CardContent className="space-y-5 pt-6">
          {/* Migration Flow Visualization */}
          <div className="flex items-center justify-center space-x-6 p-5 rounded-lg border border-border bg-muted/40">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-50 border border-green-200 rounded-lg flex items-center justify-center mb-2">
                <Music className="w-6 h-6 text-green-600" />
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
              <div className="w-12 h-12 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center mb-2">
                <Music className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-xs font-medium text-muted-foreground mb-0.5">
                To
              </div>
              <div className="text-foreground font-semibold capitalize text-sm">
                {targetPlatform}
              </div>
            </div>
          </div>

          {/* Current Playlist */}
          {currentPlaylist && currentPlaylistIndex < playlists.length && (
            <div className="text-center p-5 rounded-lg border border-brand-200 bg-brand-50/50">
              <h3 className="text-foreground font-semibold text-base mb-1">
                Currently Migrating
              </h3>
              <h4 className="text-foreground font-medium mb-0.5">
                {currentPlaylist.name}
              </h4>
              <p className="text-muted-foreground text-sm mb-4">
                {currentPlaylist.totalTracks} tracks total
              </p>

              {/* Progress Bar */}
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="text-foreground font-medium">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>

              <p className="text-muted-foreground text-sm">
                Matching songs across platforms...
              </p>
            </div>
          )}

          {/* Completed Playlists */}
          {completedPlaylists.length > 0 && currentPlaylistIndex >= 0 && (
            <div className="space-y-2">
              <h4 className="text-foreground font-medium text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Completed Playlists
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {completedPlaylists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-foreground font-medium text-sm">
                        {playlist.name}
                      </span>
                    </div>
                    <span className="text-muted-foreground text-sm">
                      {playlist.totalTracks} tracks
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loading Animation */}
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
