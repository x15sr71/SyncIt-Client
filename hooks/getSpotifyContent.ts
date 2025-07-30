import { useState } from "react";
import apiClient from "../utils/api";

interface SpotifyTrack {
  id: string;
  name: string;
  artists: string[];
  album: string;
  duration_ms: number;
}

interface GetPlaylistContentResponse {
  success: boolean;
  data: SpotifyTrack[];
}

export default function useGetSpotifyPlaylistContent() {
  const [playlistContent, setPlaylistContent] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaylistContent = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get<GetPlaylistContentResponse>("/spotifyplaylistcontent");
      console.log(response.data);
      setPlaylistContent(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching Spotify playlist content:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch playlist content";
      setError(errorMessage);
      setPlaylistContent([]);
      throw error; // Re-throw the error so the component can handle it
    } finally {
      setLoading(false);
    }
  };

  const clearPlaylistContent = () => {
    setPlaylistContent([]);
    setError(null);
  };

  return { 
    fetchPlaylistContent, 
    playlistContent, 
    loading, 
    error,
    clearPlaylistContent 
  };
}