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

/**
 * Maps a raw Spotify playlist API object to the unified Playlist shape.
 *
 * Exported as a named function so it can be unit-tested in isolation
 * without a React renderer (see __tests__/hooks/useTransformedPlaylists.test.ts).
 *
 * Guard rationale (issue #31):
 *   p.tracks?.total  — prevents TypeError when tracks is absent
 *   p.items?.total   — covers the unverified Feb-2026 hypothesis that Spotify
 *                      renamed `tracks` → `items` in GET /v1/me/playlists
 *   ?? 0             — guarantees songCount is always a number
 */
export function transformSpotifyPlaylist(p: any): Playlist {
  return {
    id: p.id,
    name: p.name,
    songCount: p.tracks?.total ?? p.items?.total ?? 0,
    imageUrl: p.images?.[0]?.url ?? "/placeholder.svg?height=50&width=50",
    description: p.description || "",
    isPublic: p.public,
    songs: [],
    platform: "spotify",
  };
}

/**
 * Maps a raw YouTube playlist API object to the unified Playlist shape.
 *
 * Exported for unit testing (mirrors the approach above).
 */
export function transformYoutubePlaylist(p: any): Playlist {
  return {
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
  };
}

export function useTransformedPlaylists(
  localSpotifyPlaylists: any[],
  localYoutubePlaylists: any[],
) {
  const transformedSpotifyPlaylists: Playlist[] = useMemo(
    () => localSpotifyPlaylists.map(transformSpotifyPlaylist),
    [localSpotifyPlaylists],
  );

  const transformedYoutubePlaylists: Playlist[] = useMemo(
    () => localYoutubePlaylists.map(transformYoutubePlaylist),
    [localYoutubePlaylists],
  );

  return { transformedSpotifyPlaylists, transformedYoutubePlaylists };
}
