import { useState } from "react";
import apiClient from "../utils/api";

interface YouTubeTrack {
  videoId: string;
  title: string;
  channelTitle: string;
  publishedAt: string;
  thumbnail: string;
}

interface GetYoutubePlaylistContentResponse {
  success: boolean;
  data?: Record<string, YouTubeTrack[]>;
  message?: string;
  error?: string;
}

export default function useGetYoutubePlaylistContent() {
  const [playlistContent, setPlaylistContent] = useState<Record<string, YouTubeTrack[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaylistContent = async (playlistIds: string[]) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<GetYoutubePlaylistContentResponse>(
        "/youtubeplaylistcontent",
        { playlistIds }
      );

      const { success, data, message, error: apiError } = response.data;

      if (!success || !data) {
        const msg = message || apiError || "Unknown error from server.";
        setError(msg);
        throw new Error(msg);
      }

      setPlaylistContent(data);
      return { success: true, data };
    } catch (err: any) {
      console.error("Error fetching YouTube playlist content:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch YouTube playlist content";

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
