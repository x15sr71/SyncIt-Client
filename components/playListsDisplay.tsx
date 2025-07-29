import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { PlaylistPreview } from "@/components/playlist-preview";

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
}: PlaylistsDisplayProps) {
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
          {sourcePlaylists.map((playlist) => (
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
          ))}
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
          {targetPlaylists.map((playlist) => (
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
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
