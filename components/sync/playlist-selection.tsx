"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Music, Loader2 } from "lucide-react";

interface Playlist {
  id: string;
  name: string;
  songCount: number;
  imageUrl: string;
}

interface PlaylistSelectionProps {
  playlists: Playlist[];
  selectedPlaylists: { [key: string]: boolean };
  togglePlaylist: (id: string) => void;
  toggleAllPlaylists: () => void;
  isProcessing: boolean;
  syncMode: "migrate" | "sync";
  handleContinue: () => void;
}

export function PlaylistSelection({
  playlists,
  selectedPlaylists,
  togglePlaylist,
  toggleAllPlaylists,
  isProcessing,
  syncMode,
  handleContinue,
}: PlaylistSelectionProps) {
  const selectedCount = Object.values(selectedPlaylists).filter(Boolean).length;
  const allSelected = selectedCount === playlists.length;

  if (isProcessing) {
    return (
      <div className="text-center py-12 fade-in-up">
        <div className="w-16 h-16 bg-gradient-to-br from-brand-gradStart to-brand-gradEnd rounded-xl2 flex items-center justify-center mx-auto mb-5 shadow-soft">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-2">
          {syncMode === "migrate" ? "Migrating" : "Syncing"} Your Playlists
        </h2>
        <p className="text-muted-foreground">
          Please wait while we process your music...
        </p>
      </div>
    );
  }

  return (
    <div className="fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-2">
          Select Playlists
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Choose which playlists you want to{" "}
          {syncMode === "migrate" ? "migrate" : "sync"}
        </p>
      </div>

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-2.5">
          <Checkbox
            checked={allSelected}
            onCheckedChange={toggleAllPlaylists}
          />
          <span className="text-foreground font-medium text-sm">
            Select All Playlists
          </span>
        </div>
        <Badge
          variant="outline"
          className="bg-brand-50 text-brand-700 border-brand-200"
        >
          {selectedCount} selected
        </Badge>
      </div>

      <div className="grid gap-2 mb-8 max-h-96 overflow-y-auto">
        {playlists.map((playlist) => (
          <Card
            key={playlist.id}
            className={`cursor-pointer transition-all duration-200 ${
              selectedPlaylists[playlist.id]
                ? "border-brand-300 ring-2 ring-brand-200"
                : "hover:bg-accent/40"
            }`}
            onClick={() => togglePlaylist(playlist.id)}
          >
            <CardContent className="p-3.5">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedPlaylists[playlist.id] || false}
                  onCheckedChange={() => togglePlaylist(playlist.id)}
                />
                <div className="w-10 h-10 bg-gradient-to-br from-brand-gradStart to-brand-gradEnd rounded-lg flex items-center justify-center shrink-0">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-foreground font-medium text-sm truncate">
                    {playlist.name}
                  </h3>
                  <p className="text-muted-foreground text-xs">
                    {playlist.songCount} songs
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button
          onClick={handleContinue}
          disabled={selectedCount === 0}
          className="px-6"
        >
          {syncMode === "migrate" ? "Start Migration" : "Start Sync"} (
          {selectedCount} playlists)
        </Button>
      </div>
    </div>
  );
}
