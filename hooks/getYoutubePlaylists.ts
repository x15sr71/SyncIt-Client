import { useState } from "react";
import apiClient from "../utils/api";
import { useCallback } from "react";

interface YoutubeThumbnail {
  url: string;
  width: number;
  height: number;
}

interface YoutubeThumbnails {
  default?: YoutubeThumbnail;
  medium?: YoutubeThumbnail;
  high?: YoutubeThumbnail;
  standard?: YoutubeThumbnail;
  maxres?: YoutubeThumbnail;
}

interface YoutubeLocalized {
  title: string;
  description: string;
}

interface YoutubeSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: YoutubeThumbnails;
  channelTitle: string;
  localized: YoutubeLocalized;
}

interface YoutubePlaylist {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails?: {
      default?: { url: string };
      medium?: { url: string };
      high?: { url: string };
    };
  };
  contentDetails?: {
    itemCount?: number;
  };
  status?: {
    privacyStatus?: "public" | "private" | "unlisted";
  };
}

interface GetYoutubePlaylistsResponse {
  success: boolean;
  data: YoutubePlaylist[];
  totalResults: number;
}


export default function useGetYoutubePlaylists() {
  const [youtubePlaylists, setYoutubePlaylists] = useState<YoutubePlaylist[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const fetchYoutubePlaylists = useCallback(async () => {
    setLoading(true);
    setAuthError(null); // Reset auth error on a new attempt

    try {
      const response = await apiClient.get<GetYoutubePlaylistsResponse>("/getyoutubeplaylists");
      if (response.data.success) {
        setYoutubePlaylists(response.data.data);
      } else {
        throw new Error("API indicated failure but did not throw an HTTP error.");
      }
    } catch (error) {
      // 1. Check if the error object looks like an Axios error by checking for the 'response' property.
      // We are now directly accessing properties without explicit AxiosError type assertion.
      if (error && typeof error === 'object' && 'response' in error) {
        // Access 'response' and 'data' directly, assuming their structure based on typical Axios errors.
        const errorResponse = (error as any).response; // Use 'any' to bypass strict type checking for this access

        // 2. If it is, check the status code.
        if (errorResponse?.status === 401) {
          console.log("Authentication error detected:", errorResponse.data);
          
          // 3. Set the specific auth error state for the UI to handle.
          setAuthError(
            errorResponse.data?.message || "Your session has expired. Please reconnect."
          );
          setYoutubePlaylists([]); // Clear any stale data
        } else {
          // Handle other HTTP errors (404, 500, etc.)
          console.error("An HTTP error occurred:", error);
          throw error; // Re-throw to be handled by a higher-level boundary
        }
      } else {
        // 4. This is not an API response error (e.g., network failure, code error).
        console.error("A non-HTTP error occurred:", error);
        throw error;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchYoutubePlaylists, youtubePlaylists, loading, authError };
}
