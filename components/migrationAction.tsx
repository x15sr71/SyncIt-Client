"use client";

import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { useMigration } from "../hooks/useMigration";
import { Playlist } from "@/hooks/useTransformedPlaylists";

type Platform = "spotify" | "youtube";

interface MigrationActionProps {
  selectedPlaylists: {
    [key: string]: boolean;
  };
  sourcePlaylists: Playlist[];
  sourcePlatform?: Platform;
  targetPlatform?: Platform;
  onMigrationStart?: () => void;
  onMigrationComplete?: (results: any) => void;
  onMigrationError?: (error: string) => void;
}

export default function MigrationAction({
  selectedPlaylists,
  sourcePlaylists,
  sourcePlatform = "youtube", // Default for backward compatibility
  targetPlatform = "spotify", // Default for backward compatibility
  onMigrationStart,
  onMigrationComplete,
  onMigrationError,
}: MigrationActionProps) {
  const { startMigration, isLoading, error } = useMigration();

  const selectedPlaylistIds = Object.keys(selectedPlaylists).filter(
    (id) => selectedPlaylists[id]
  );

  console.log("DEBUG selectedPlaylistIds:", selectedPlaylistIds);
  console.log("DEBUG sourcePlaylists:", sourcePlaylists.map((p) => p.id));
  console.log("DEBUG Migration direction:", sourcePlatform, "to", targetPlatform);

  const handleStartMigration = async () => {
    if (selectedPlaylistIds.length === 0) return;

    try {
      onMigrationStart?.();

      const firstPlaylistId = selectedPlaylistIds[0];
      const playlist = sourcePlaylists.find((p) => p.id === firstPlaylistId);

      if (!playlist) {
        console.warn(
          "MigrationAction: Playlist not found in sourcePlaylists",
          firstPlaylistId
        );
        onMigrationError?.("Selected playlist not found.");
        return;
      }

      console.log("Migrating playlist", {
        playlistId: playlist.id,
        name: playlist.name,
        from: sourcePlatform,
        to: targetPlatform,
      });

      // For Spotify to YouTube, we might need a target playlist
      // For now, we'll let the backend handle playlist creation
      let targetPlaylistId: string | undefined;
      
      // You can extend this logic to allow user selection of target playlist
      // or create new playlists as needed
      if (sourcePlatform === "spotify" && targetPlatform === "youtube") {
        // Backend will handle YouTube playlist creation or use a default one
        // You could add UI here to let users select existing YouTube playlists
        targetPlaylistId = undefined; // Let backend create new playlist
      }

      const result = await startMigration({
        playlistId: playlist.id,
        playlistName: playlist.name,
        sourcePlatform,
        targetPlatform,
        targetPlaylistId,
      });

      onMigrationComplete?.(result);
    } catch (err: any) {
      const message =
        err?.message || (typeof err === "string" ? err : "Migration failed");
      onMigrationError?.(message);
    }
  };

  const getPlatformName = (platform: Platform) => {
    return platform === "spotify" ? "Spotify" : "YouTube Music";
  };

  const getMigrationText = () => {
    const source = getPlatformName(sourcePlatform);
    const target = getPlatformName(targetPlatform);
    return `Migrate ${source} → ${target}`;
  };

  return (
    <>
      <Button
        size="lg"
        onClick={handleStartMigration}
        disabled={selectedPlaylistIds.length === 0 || isLoading}
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl px-8 py-4 focus-visible:outline-2 focus-visible:outline-purple-400 focus-visible:outline-offset-2 transition-all hover:scale-105 shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <ArrowRight className="w-5 h-5 mr-2" />
        {isLoading
          ? "Migrating..."
          : `${getMigrationText()} (${selectedPlaylistIds.length} selected)`}
      </Button>
      {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}
    </>
  );
}