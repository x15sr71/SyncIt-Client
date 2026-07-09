import { useState } from "react";
import apiClient from "../utils/api";

type Platform = "spotify" | "youtube";

interface MigrationParams {
  playlistId: string;
  playlistName: string;
  sourcePlatform: Platform;
  targetPlatform: Platform;
  targetPlaylistId?: string; // Optional for creating new playlists
}

export const useMigration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startMigration = async (params: MigrationParams) => {
    const {
      playlistId,
      playlistName,
      sourcePlatform,
      targetPlatform,
      targetPlaylistId,
    } = params;

    console.log("useMigration: Starting migration", {
      playlistId,
      playlistName,
      sourcePlatform,
      targetPlatform,
      targetPlaylistId,
    });

    setIsLoading(true);
    setError(null);

    try {
      // Determine the correct endpoint based on migration direction.
      // Paths are relative: the shared axios client owns the base URL
      // (dev: direct backend, prod: same-origin /api/backend proxy).
      let endpoint = "";
      let requestBody: any = { playlistId, playlistName };

      if (sourcePlatform === "youtube" && targetPlatform === "spotify") {
        endpoint = "/youtube-to-spotify";
        // YouTube to Spotify uses existing structure
      } else if (sourcePlatform === "spotify" && targetPlatform === "youtube") {
        endpoint = "/spotify-to-youtube";
        // Add target YouTube playlist ID if provided
        if (targetPlaylistId) {
          requestBody.youtubePlaylistId = targetPlaylistId;
        }
        // Rename for backend compatibility and add YouTube playlist name
        requestBody.spotifyPlaylistId = requestBody.playlistId;
        requestBody.youtubePlaylistName = requestBody.playlistName; // Keep the name for YouTube playlist
        delete requestBody.playlistId;
      } else {
        throw new Error("Unsupported migration direction");
      }

      const response = await apiClient.post<Record<string, any>>(
        endpoint,
        requestBody,
      );

      const data = response.data;
      return {
        ...data,
        successCount: data.successCount ?? data.numberOfTracksAdded ?? 0,
        failedTracks: data.failedTracks ?? data.failedTrackDetails ?? [],
        playlistName: data.playlistName ?? params.playlistName,
      };
    } catch (err: any) {
      let userFriendlyMessage =
        err?.response?.data?.message || err?.message || "Migration failed";

      if (err?.response?.status === 409) {
        userFriendlyMessage =
          "Another sync is already running for your account. Please wait for it to finish.";
      } else if (
        err?.code === "ERR_NETWORK" ||
        err?.message?.includes("Network Error")
      ) {
        userFriendlyMessage =
          "Cannot connect to the migration server. Please check if the server is running.";
      }

      setError(userFriendlyMessage);
      throw new Error(userFriendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { startMigration, isLoading, error };
};
