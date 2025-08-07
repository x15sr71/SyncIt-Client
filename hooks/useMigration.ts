import { useState } from "react";

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
    const { playlistId, playlistName, sourcePlatform, targetPlatform, targetPlaylistId } = params;
    
    console.log("useMigration: Starting migration", { 
      playlistId, 
      playlistName, 
      sourcePlatform, 
      targetPlatform,
      targetPlaylistId 
    });

    setIsLoading(true);
    setError(null);

    try {
      // Determine the correct endpoint based on migration direction
      let endpoint = "";
      let requestBody: any = { playlistId, playlistName };

      if (sourcePlatform === "youtube" && targetPlatform === "spotify") {
        endpoint = "http://localhost:3002/youtube-to-spotify";
        // YouTube to Spotify uses existing structure
      } else if (sourcePlatform === "spotify" && targetPlatform === "youtube") {
        endpoint = "http://localhost:3002/spotify-to-youtube";
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

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        credentials: "include",
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

        try {
          const errorData = await response.json();
          errorMessage = errorData?.message || errorMessage;
          console.error("useMigration: Backend error response", { errorData });
        } catch (jsonErr) {
          try {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
            console.error("useMigration: Fallback text error response", { errorText });
          } catch (textErr) {
            console.error("useMigration: Failed to parse error", { textErr });
          }
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;

    } catch (err: any) {
      let userFriendlyMessage = err?.message || "Migration failed";

      if (err.name === "TypeError" && err.message.includes("fetch")) {
        userFriendlyMessage = "Cannot connect to the migration server. Please check if the server is running on port 3002.";
      } else if (err.message.includes("ECONNREFUSED")) {
        userFriendlyMessage = "Connection refused. Please check if the migration server is running.";
      } else if (err.message.includes("CORS")) {
        userFriendlyMessage = "CORS error. Please check server CORS configuration.";
      }

      setError(userFriendlyMessage);
      throw new Error(userFriendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { startMigration, isLoading, error };
};