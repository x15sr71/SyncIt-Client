/**
 * @file useTransformedPlaylists.test.ts
 *
 * Pure-function tests for the transformation logic inside useTransformedPlaylists.
 * The hook itself wraps everything in useMemo, so we extract and test the
 * mapping functions directly — no React renderer needed.
 *
 * Covers issue #29 (no tests) and validates the fix from issue #31
 * (unguarded p.tracks.total).
 */

import {
  transformSpotifyPlaylist,
  transformYoutubePlaylist,
} from "@/hooks/useTransformedPlaylists";

// ---------------------------------------------------------------------------
// Spotify playlist transformation
// ---------------------------------------------------------------------------

describe("transformSpotifyPlaylist", () => {
  const base = {
    id: "sp-1",
    name: "Chill Vibes",
    tracks: { total: 42 },
    images: [{ url: "https://example.com/cover.jpg" }],
    description: "Relaxing tunes",
    public: true,
  };

  it("maps a well-formed Spotify playlist object", () => {
    const result = transformSpotifyPlaylist(base);
    expect(result).toEqual({
      id: "sp-1",
      name: "Chill Vibes",
      songCount: 42,
      imageUrl: "https://example.com/cover.jpg",
      description: "Relaxing tunes",
      isPublic: true,
      songs: [],
      platform: "spotify",
    });
  });

  // --- Issue #31 regression tests ---

  it("returns songCount 0 when tracks is undefined (instead of throwing)", () => {
    const raw = { ...base, tracks: undefined };
    expect(() => transformSpotifyPlaylist(raw)).not.toThrow();
    expect(transformSpotifyPlaylist(raw).songCount).toBe(0);
  });

  it("returns songCount 0 when tracks is null (instead of throwing)", () => {
    const raw = { ...base, tracks: null };
    expect(() => transformSpotifyPlaylist(raw)).not.toThrow();
    expect(transformSpotifyPlaylist(raw).songCount).toBe(0);
  });

  it("falls back to items.total when tracks is absent (API rename hypothesis)", () => {
    const raw = { ...base, tracks: undefined, items: { total: 7 } };
    expect(transformSpotifyPlaylist(raw).songCount).toBe(7);
  });

  it("prefers tracks.total over items.total when both are present", () => {
    const raw = { ...base, items: { total: 99 } };
    expect(transformSpotifyPlaylist(raw).songCount).toBe(42);
  });

  it("falls back to placeholder when images array is empty", () => {
    const raw = { ...base, images: [] };
    expect(transformSpotifyPlaylist(raw).imageUrl).toBe(
      "/placeholder.svg?height=50&width=50",
    );
  });

  it("falls back to placeholder when images is undefined", () => {
    const raw = { ...base, images: undefined };
    expect(transformSpotifyPlaylist(raw).imageUrl).toBe(
      "/placeholder.svg?height=50&width=50",
    );
  });

  it("defaults description to empty string when absent", () => {
    const raw = { ...base, description: undefined };
    expect(transformSpotifyPlaylist(raw).description).toBe("");
  });

  it("always sets platform to 'spotify'", () => {
    expect(transformSpotifyPlaylist(base).platform).toBe("spotify");
  });

  it("always initialises songs as an empty array", () => {
    expect(transformSpotifyPlaylist(base).songs).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// YouTube playlist transformation
// ---------------------------------------------------------------------------

describe("transformYoutubePlaylist", () => {
  const base = {
    id: "yt-1",
    snippet: {
      title: "Study Mix",
      description: "Focus music",
      thumbnails: {
        high: { url: "https://example.com/high.jpg" },
        medium: { url: "https://example.com/medium.jpg" },
        default: { url: "https://example.com/default.jpg" },
      },
    },
    contentDetails: { itemCount: 15 },
    status: { privacyStatus: "public" },
  };

  it("maps a well-formed YouTube playlist object", () => {
    const result = transformYoutubePlaylist(base);
    expect(result).toEqual({
      id: "yt-1",
      name: "Study Mix",
      songCount: 15,
      imageUrl: "https://example.com/high.jpg",
      description: "Focus music",
      isPublic: true,
      songs: [],
      platform: "youtube",
    });
  });

  it("returns songCount 0 when contentDetails is absent", () => {
    const raw = { ...base, contentDetails: undefined };
    expect(transformYoutubePlaylist(raw).songCount).toBe(0);
  });

  it("falls back to medium thumbnail when high is absent", () => {
    const raw = {
      ...base,
      snippet: {
        ...base.snippet,
        thumbnails: { medium: { url: "https://example.com/medium.jpg" } },
      },
    };
    expect(transformYoutubePlaylist(raw).imageUrl).toBe(
      "https://example.com/medium.jpg",
    );
  });

  it("falls back to default thumbnail when high and medium are absent", () => {
    const raw = {
      ...base,
      snippet: {
        ...base.snippet,
        thumbnails: { default: { url: "https://example.com/default.jpg" } },
      },
    };
    expect(transformYoutubePlaylist(raw).imageUrl).toBe(
      "https://example.com/default.jpg",
    );
  });

  it("falls back to placeholder when no thumbnail is available", () => {
    const raw = {
      ...base,
      snippet: { ...base.snippet, thumbnails: undefined },
    };
    expect(transformYoutubePlaylist(raw).imageUrl).toBe(
      "/placeholder.svg?height=50&width=50",
    );
  });

  it("marks playlist as private when privacyStatus is not 'public'", () => {
    const raw = {
      ...base,
      status: { privacyStatus: "private" },
    };
    expect(transformYoutubePlaylist(raw).isPublic).toBe(false);
  });

  it("marks playlist as private when status is absent", () => {
    const raw = { ...base, status: undefined };
    expect(transformYoutubePlaylist(raw).isPublic).toBe(false);
  });

  it("always sets platform to 'youtube'", () => {
    expect(transformYoutubePlaylist(base).platform).toBe("youtube");
  });
});
