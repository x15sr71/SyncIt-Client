"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PlaylistPreview } from "@/components/playlist-preview";
import { Loader2, AlertCircle, Music } from "lucide-react";

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
}

interface Playlist {
  id: string;
  name: string;
  songCount: number;
  imageUrl: string;
  description: string;
  isPublic: boolean;
  songs: Song[];
  platform: "spotify" | "youtube"; // Added platform info
}

interface PlaylistsDisplayProps {
  selectedSource: "spotify" | "youtube";
  selectedTarget: "spotify" | "youtube";
  sourcePlaylists: Playlist[];
  targetPlaylists: Playlist[];
  selectedPlaylists: { [key: string]: boolean };
  togglePlaylist: (id: string) => void;
  handleRenamePlaylist: (id: string) => void;
  handleEmptyPlaylist: (id: string) => void;
  handleDeletePlaylist: (id: string) => void;
  // Updated to accept the new function signature with animation
  handleDeleteSongFromPlaylist?: (
    playlistId: string,
    songId: string,
    songTitle: string,
    platform: "spotify" | "youtube",
    animateRemoval: (songId: string) => Promise<void>,
  ) => void;
  isLoadingSource?: boolean;
  sourceError?: string | null;
}

export default function PlaylistsDisplay({
  selectedSource,
  selectedTarget,
  sourcePlaylists,
  targetPlaylists,
  selectedPlaylists,
  togglePlaylist,
  handleRenamePlaylist,
  handleEmptyPlaylist,
  handleDeletePlaylist,
  handleDeleteSongFromPlaylist,
  isLoadingSource = false,
  sourceError = null,
}: PlaylistsDisplayProps) {
  const handleConnectSpotify = () => {
    window.location.href = "/api/auth/spotify";
  };

  const handleRetryFetch = () => {
    window.location.reload();
  };

  const renderPlaylistContent = (playlists: Playlist[], isSource: boolean) => (
    <div className="relative max-h-96 overflow-hidden rounded-b-xl2">
      <CardContent className="space-y-3 max-h-96 overflow-y-auto min-w-0 break-words pr-2 rounded-b-xl2 scroll-fade-container">
        {isSource && isLoadingSource ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <Loader2 className="h-7 w-7 animate-spin text-brand-500" />
            <div className="text-muted-foreground text-center">
              <p className="font-medium text-foreground">
                Loading {selectedSource} playlists...
              </p>
              <p className="text-sm mt-1">This may take a moment</p>
            </div>
          </div>
        ) : isSource && sourceError ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <AlertCircle className="h-10 w-10 text-red-500" />
            <div className="text-center space-y-3">
              <p className="text-red-600 font-medium">
                Failed to load playlists
              </p>
              <p className="text-sm text-muted-foreground max-w-xs">
                {sourceError}
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                {sourceError.includes("connect") ||
                sourceError.includes("unauthorized") ? (
                  <button
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                    onClick={handleConnectSpotify}
                  >
                    Connect{" "}
                    {selectedSource === "spotify" ? "Spotify" : "YouTube"}{" "}
                    Account
                  </button>
                ) : (
                  <button
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                    onClick={handleRetryFetch}
                  >
                    Try Again
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : playlists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <Music className="h-10 w-10 text-muted-foreground/40" />
            <div className="text-center">
              <p className="text-foreground font-medium">No playlists found</p>
              <p className="text-sm text-muted-foreground mt-1">
                {isSource
                  ? `Create some playlists on ${selectedSource} to get started`
                  : "Your migrated playlists will appear here"}
              </p>
            </div>
          </div>
        ) : (
          playlists.map((playlist) => (
            <PlaylistPreview
              key={playlist.id}
              playlist={playlist}
              platform={selectedSource}
              isSelected={
                isSource ? selectedPlaylists[playlist.id] || false : false
              }
              onToggle={isSource ? togglePlaylist : () => {}}
              showCheckbox={isSource}
              onRename={handleRenamePlaylist}
              onEmpty={handleEmptyPlaylist}
              onDelete={handleDeletePlaylist}
              // Updated to use the new prop name that accepts the animation function
              onDeleteSongWithAnimation={handleDeleteSongFromPlaylist}
            />
          ))
        )}
      </CardContent>
    </div>
  );

  return (
    <div className="grid md:grid-cols-2 gap-6 w-full min-w-0">
      {/* Source */}
      <Card
        className="hover-lift min-w-0"
        role="region"
        aria-labelledby="source-playlists-heading"
      >
        <CardHeader className="pt-4 pb-3">
          <CardTitle
            id="source-playlists-heading"
            className="text-foreground text-base font-semibold capitalize truncate"
          >
            {selectedSource} playlists
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Select playlists to migrate
          </p>
        </CardHeader>
        {renderPlaylistContent(sourcePlaylists, true)}
      </Card>

      {/* Target */}
      <Card
        className="hover-lift min-w-0"
        role="region"
        aria-labelledby="target-playlists-heading"
      >
        <CardHeader className="pt-4 pb-3">
          <CardTitle
            id="target-playlists-heading"
            className="text-foreground text-base font-semibold capitalize truncate"
          >
            {selectedTarget} playlists
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Your existing playlists
          </p>
        </CardHeader>
        {renderPlaylistContent(targetPlaylists, false)}
      </Card>
    </div>
  );
}
