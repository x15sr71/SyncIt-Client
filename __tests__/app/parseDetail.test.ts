/**
 * @file parseDetail.test.ts
 *
 * Tests for the parseDetail() function extracted from
 * app/missing-tracks/page.tsx.
 *
 * parseDetail() is a pure regex parser with three distinct input formats:
 *   1. YouTube→Spotify format  — multiline "Title: X\nChannel: Y\n..."
 *   2. Spotify→YouTube format  — "Track N: title" or "Track: title (failed…)"
 *   3. Fallback                — any other string, collapsed to single line
 */

import { parseDetail } from "@/app/missing-tracks/parseDetail";

// ---------------------------------------------------------------------------
// Format 1 — YouTube→Spotify: "Title: X\nChannel: Y\nDuration: Z\n"
// ---------------------------------------------------------------------------

describe("parseDetail — YouTube→Spotify format (Title/Channel lines)", () => {
  it("extracts title and channel from a standard YT→SP detail string", () => {
    const detail =
      "Title: Bohemian Rhapsody\nChannel: Queen - Topic\nDuration: 5:55\n";
    expect(parseDetail(detail)).toEqual({
      title: "Bohemian Rhapsody",
      artist: "Queen - Topic",
    });
  });

  it("trims leading/trailing whitespace from title and channel", () => {
    const detail = "Title:   Stairway to Heaven   \nChannel:  Led Zeppelin  \n";
    expect(parseDetail(detail)).toEqual({
      title: "Stairway to Heaven",
      artist: "Led Zeppelin",
    });
  });

  it("sets artist to empty string when Channel line is absent", () => {
    const detail = "Title: Mystery Song\nDuration: 3:00\n";
    expect(parseDetail(detail)).toEqual({
      title: "Mystery Song",
      artist: "",
    });
  });

  it("handles Title line appearing after other lines", () => {
    const detail = "Duration: 4:12\nChannel: Some Artist\nTitle: Late Line Song\n";
    expect(parseDetail(detail)).toEqual({
      title: "Late Line Song",
      artist: "Some Artist",
    });
  });
});

// ---------------------------------------------------------------------------
// Format 2 — Spotify→YouTube: "Track N: title" / "Track: title (failed…)"
// ---------------------------------------------------------------------------

describe("parseDetail — Spotify→YouTube format (Track lines)", () => {
  it("extracts title from 'Track N: ...' format", () => {
    const detail = "Track 3: Shape of You";
    expect(parseDetail(detail)).toEqual({
      title: "Shape of You",
      artist: "",
    });
  });

  it("extracts title from 'Track: ...' format (no number)", () => {
    const detail = "Track: Blinding Lights (failed to add to playlist)";
    expect(parseDetail(detail)).toEqual({
      title: "Blinding Lights (failed to add to playlist)",
      artist: "",
    });
  });

  it("trims whitespace from extracted title", () => {
    const detail = "Track 12:   Levitating   ";
    expect(parseDetail(detail)).toEqual({
      title: "Levitating",
      artist: "",
    });
  });

  it("handles double-digit track numbers", () => {
    const detail = "Track 42: bad guy";
    expect(parseDetail(detail)).toEqual({
      title: "bad guy",
      artist: "",
    });
  });
});

// ---------------------------------------------------------------------------
// Format 3 — Fallback: unrecognised string → collapsed to single line
// ---------------------------------------------------------------------------

describe("parseDetail — fallback (unrecognised format)", () => {
  it("returns full string as title and empty artist for unrecognised input", () => {
    const detail = "some random failure message";
    expect(parseDetail(detail)).toEqual({
      title: "some random failure message",
      artist: "",
    });
  });

  it("collapses multiple whitespace into a single space", () => {
    const detail = "word1   word2\t\tword3\n\nword4";
    expect(parseDetail(detail)).toEqual({
      title: "word1 word2 word3 word4",
      artist: "",
    });
  });

  it("handles empty string without throwing", () => {
    expect(() => parseDetail("")).not.toThrow();
    expect(parseDetail("")).toEqual({ title: "", artist: "" });
  });
});
