import { useState } from "react";
import apiClient from "../utils/api";

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

interface YoutubeContentDetails {
  itemCount: number;
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


  const fetchYoutubePlaylists = async () => {
    try {
      const response = await apiClient.get<GetYoutubePlaylistsResponse>("/getyoutubeplaylists");
      if (response.data.success) {
        setYoutubePlaylists(response.data.data);
        return response.data.data;
      } else {
        throw new Error("Failed to fetch YouTube playlists.");
      }
    } catch (error) {
      console.error("Error fetching YouTube playlists:", error);
      setYoutubePlaylists([]);
      throw error;
    }
  };

  return { fetchYoutubePlaylists, youtubePlaylists };
}
