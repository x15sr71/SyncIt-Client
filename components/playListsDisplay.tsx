"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
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
  handleDeleteSongFromPlaylist?: (playlistId: string, songId: string, songTitle: string, platform: "spotify" | "youtube") => void;
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

  const renderPlaylistContent = (
    playlists: Playlist[],
    isSource: boolean
  ) => (
    <div className="relative max-h-96 overflow-hidden rounded-b-xl">
      {/* Top fade overlay */}
      <div className="pointer-events-none absolute top-0 left-0 w-full h-6 z-10 bg-gradient-to-b from-[#ffffff0a] to-transparent" />
      
      <CardContent className="space-y-4 max-h-96 overflow-y-auto min-w-0 break-words pr-2 bg-white/5 backdrop-blur-md rounded-b-xl scroll-fade-container">
        {isSource && isLoadingSource ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary-dark" />
            <div className="text-secondary-dark text-center">
              <p className="font-medium">Loading {selectedSource} playlists...</p>
              <p className="text-sm mt-1">This may take a moment</p>
            </div>
          </div>
        ) : isSource && sourceError ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <div className="text-center space-y-3">
              <p className="text-red-600 font-medium">Failed to load playlists</p>
              <p className="text-sm text-secondary-dark max-w-xs">{sourceError}</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                {sourceError.includes("connect") || sourceError.includes("unauthorized") ? (
                  <button
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                    onClick={handleConnectSpotify}
                  >
                    Connect {selectedSource === "spotify" ? "Spotify" : "YouTube"} Account
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
            <Music className="h-12 w-12 text-secondary-dark/50" />
            <div className="text-center">
              <p className="text-secondary-dark font-medium">No playlists found</p>
              <p className="text-sm text-secondary-dark/70 mt-1">
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
              isSelected={isSource ? selectedPlaylists[playlist.id] || false : false}
              onToggle={isSource ? togglePlaylist : () => {}}
              showCheckbox={isSource}
              onRename={handleRenamePlaylist}
              onEmpty={handleEmptyPlaylist}
              onDelete={handleDeletePlaylist}
              onDeleteSong={handleDeleteSongFromPlaylist}
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
        className="glass-card border-white/40 hover-lift min-w-0 bg-white/5 backdrop-blur-md"
        role="region"
        aria-labelledby="source-playlists-heading"
      >
        <CardHeader className="relative rounded-t-xl pt-4 pb-2 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none rounded-t-xl bg-gradient-to-b from-white/0 via-white/10 to-transparent backdrop-blur-sm" />
          <div className="relative z-10 pb-2">
            <CardTitle
              id="source-playlists-heading"
              className="text-primary-dark capitalize truncate"
            >
              {selectedSource} Playlists
            </CardTitle>
            <p className="text-sm text-secondary-dark">
              Select playlists to migrate
            </p>
          </div>
        </CardHeader>
        {renderPlaylistContent(sourcePlaylists, true)}
      </Card>

      {/* Target */}
      <Card
        className="glass-card border-white/40 hover-lift min-w-0 bg-white/5 backdrop-blur-md"
        role="region"
        aria-labelledby="target-playlists-heading"
      >
        <CardHeader className="relative rounded-t-xl pt-4 pb-2 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none rounded-t-xl bg-gradient-to-b from-white/0 via-white/10 to-transparent backdrop-blur-sm" />
          <div className="relative z-10 pb-2">
            <CardTitle
              id="target-playlists-heading"
              className="text-primary-dark capitalize truncate"
            >
              {selectedTarget} Playlists
            </CardTitle>
            <p className="text-sm text-secondary-dark">
              Your existing playlists
            </p>
          </div>
        </CardHeader>
        {renderPlaylistContent(targetPlaylists, false)}
      </Card>
    </div>
  );
}