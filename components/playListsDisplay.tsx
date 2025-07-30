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
  isLoadingSource = false,
  sourceError = null,
}: PlaylistsDisplayProps) {
  const handleConnectSpotify = () => {
    // Add your Spotify authentication logic here
    // Example: redirect to your Spotify auth endpoint
    window.location.href = "/api/auth/spotify";
  };

  const handleRetryFetch = () => {
    // Trigger a retry by reloading the page or calling a retry function
    window.location.reload();
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 w-full min-w-0">
      {/* Source Playlists */}
      <Card
        className="glass-card border-white/40 hover-lift min-w-0"
        role="region"
        aria-labelledby="source-playlists-heading"
      >
        <CardHeader>
          <CardTitle
            id="source-playlists-heading"
            className="text-primary-dark capitalize truncate"
          >
            {selectedSource} Playlists
          </CardTitle>
          <p className="text-sm text-secondary-dark">
            Select playlists to migrate
          </p>
        </CardHeader>
        <CardContent className="space-y-4 max-h-96 overflow-y-auto min-w-0 break-words">
          {isLoadingSource ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary-dark" />
              <div className="text-secondary-dark text-center">
                <p className="font-medium">Loading {selectedSource} playlists...</p>
                <p className="text-sm mt-1">This may take a moment</p>
              </div>
            </div>
          ) : sourceError ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <div className="text-center space-y-3">
                <p className="text-red-600 font-medium">Failed to load playlists</p>
                <p className="text-sm text-secondary-dark max-w-xs">
                  {sourceError}
                </p>
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
          ) : sourcePlaylists.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <Music className="h-12 w-12 text-secondary-dark/50" />
              <div className="text-center">
                <p className="text-secondary-dark font-medium">No playlists found</p>
                <p className="text-sm text-secondary-dark/70 mt-1">
                  Create some playlists on {selectedSource} to get started
                </p>
              </div>
            </div>
          ) : (
            sourcePlaylists.map((playlist) => (
              <PlaylistPreview
                key={playlist.id}
                playlist={playlist}
                isSelected={selectedPlaylists[playlist.id] || false}
                onToggle={togglePlaylist}
                showCheckbox={true}
                onRename={handleRenamePlaylist}
                onEmpty={handleEmptyPlaylist}
                onDelete={handleDeletePlaylist}
              />
            ))
          )}
        </CardContent>
      </Card>

      {/* Target Playlists */}
      <Card
        className="glass-card border-white/40 hover-lift min-w-0"
        role="region"
        aria-labelledby="target-playlists-heading"
      >
        <CardHeader>
          <CardTitle
            id="target-playlists-heading"
            className="text-primary-dark capitalize truncate"
          >
            {selectedTarget} Playlists
          </CardTitle>
          <p className="text-sm text-secondary-dark">
            Your existing playlists
          </p>
        </CardHeader>
        <CardContent className="space-y-4 max-h-96 overflow-y-auto min-w-0 break-words">
          {targetPlaylists.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <Music className="h-12 w-12 text-secondary-dark/50" />
              <div className="text-center">
                <p className="text-secondary-dark font-medium">No playlists found</p>
                <p className="text-sm text-secondary-dark/70 mt-1">
                  Your migrated playlists will appear here
                </p>
              </div>
            </div>
          ) : (
            targetPlaylists.map((playlist) => (
              <PlaylistPreview
                key={playlist.id}
                playlist={playlist}
                isSelected={false}
                onToggle={() => {}}
                showCheckbox={false}
                onRename={handleRenamePlaylist}
                onEmpty={handleEmptyPlaylist}
                onDelete={handleDeletePlaylist}
              />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}