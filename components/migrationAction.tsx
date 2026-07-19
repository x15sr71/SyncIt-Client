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
    (id) => selectedPlaylists[id],
  );

  console.log("DEBUG selectedPlaylistIds:", selectedPlaylistIds);
  console.log(
    "DEBUG sourcePlaylists:",
    sourcePlaylists.map((p) => p.id),
  );
  console.log(
    "DEBUG Migration direction:",
    sourcePlatform,
    "to",
    targetPlatform,
  );

  const handleStartMigration = async () => {
    if (selectedPlaylistIds.length === 0) return;

    try {
      onMigrationStart?.();

      const playlists = selectedPlaylistIds
        .map((id) => sourcePlaylists.find((p) => p.id === id))
        .filter((p): p is NonNullable<typeof p> => !!p);

      if (playlists.length === 0) {
        onMigrationError?.("Selected playlists not found.");
        return;
      }

      // Migrate every selected playlist sequentially — the button said
      // "(N selected)" but only the first was migrated (audit P2-11).
      // Sequential also cooperates with the backend's per-user sync mutex.
      let successCount = 0;
      const failedTracks: any[] = [];
      for (const playlist of playlists) {
        const result = await startMigration({
          playlistId: playlist.id,
          playlistName: playlist.name,
          sourcePlatform,
          targetPlatform,
          targetPlaylistId: undefined, // let the backend find/create the target
        });
        successCount += result.successCount ?? 0;
        failedTracks.push(...(result.failedTracks ?? []));
      }

      onMigrationComplete?.({
        successCount,
        failedTracks,
        playlistName:
          playlists.length === 1
            ? playlists[0].name
            : `${playlists[0].name} +${playlists.length - 1} more`,
      });
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
        className="px-6"
      >
        <ArrowRight className="w-4 h-4" />
        {isLoading
          ? "Migrating..."
          : `${getMigrationText()} (${selectedPlaylistIds.length} selected)`}
      </Button>
      {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}
    </>
  );
}
