import { useState } from "react";
import apiClient from "../utils/api";

interface SpotifyTrack {
  id: string;
  name: string;
  artists: string[];
  album: string;
  duration_ms: number;
  image_url?: string; // If image URL is available
}

interface GetPlaylistContentResponse {
  success: boolean;
  data?: Record<string, SpotifyTrack[]>;
  message?: string;
  error?: string;
}

export default function useGetSpotifyPlaylistContent() {
  const [playlistContent, setPlaylistContent] = useState<Record<string, SpotifyTrack[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaylistContent = async (playlistIds: string[]) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<GetPlaylistContentResponse>(
        "/spotifyplaylistcontent",
        { playlistIds }
      );

      const { success, data, message, error: apiError } = response.data;

      if (!success || !data) {
        const msg = message || apiError || "Unknown error from server.";
        setError(msg);
        throw new Error(msg);
      }

      setPlaylistContent(data);
      return { success: true, data }; // ✅ return structured result
    } catch (err: any) {
      console.error("Error fetching Spotify playlist content:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch playlist content";

      setError(errorMessage);
      setPlaylistContent({});
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const clearPlaylistContent = () => {
    setPlaylistContent({});
    setError(null);
  };

  return {
    fetchPlaylistContent,
    playlistContent,
    loading,
    error,
    clearPlaylistContent,
  };
}
