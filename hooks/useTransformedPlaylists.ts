import { useMemo } from "react";

// Generic unified playlist type
export interface Playlist {
  id: string;
  name: string;
  songCount: number;
  imageUrl: string;
  description: string;
  isPublic: boolean;
  songs: any[];
  platform: "spotify" | "youtube";
}

export function useTransformedPlaylists(localSpotifyPlaylists: any[], localYoutubePlaylists: any[]) {
  const transformedSpotifyPlaylists: Playlist[] = useMemo(() => {
    return localSpotifyPlaylists.map((p: any) => ({
      id: p.id,
      name: p.name,
      songCount: p.tracks.total,
      imageUrl: p.images[0]?.url || "/placeholder.svg?height=50&width=50",
      description: p.description || "",
      isPublic: p.public,
      songs: [],
      platform: "spotify",
    }));
  }, [localSpotifyPlaylists]);

  const transformedYoutubePlaylists: Playlist[] = useMemo(() => {
    return localYoutubePlaylists.map((p: any) => ({
      id: p.id,
      name: p.snippet.title,
      description: p.snippet.description || "",
      songCount: p.contentDetails?.itemCount || 0,
      imageUrl:
        p.snippet.thumbnails?.high?.url ||
        p.snippet.thumbnails?.medium?.url ||
        p.snippet.thumbnails?.default?.url ||
        "/placeholder.svg?height=50&width=50",
      isPublic: p.status?.privacyStatus === "public",
      songs: [],
      platform: "youtube",
    }));
  }, [localYoutubePlaylists]);

  return { transformedSpotifyPlaylists, transformedYoutubePlaylists };
}
