"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Music, ArrowLeft, Search, X, Check } from "lucide-react";
import Link from "next/link";

interface MissingTrack {
  id: string;
  originalTitle: string;
  artist: string;
  status: "pending" | "found" | "skipped";
  suggestions?: string[];
}

export default function MissingTracksPage() {
  const [missingTracks, setMissingTracks] = useState<MissingTrack[]>([
    {
      id: "1",
      originalTitle: "Rare Song Title",
      artist: "Obscure Artist",
      status: "pending",
      suggestions: [
        "Similar Song - Different Artist",
        "Rare Song - Cover Version",
      ],
    },
    {
      id: "2",
      originalTitle: "Live Version Track",
      artist: "Famous Band",
      status: "pending",
      suggestions: [
        "Studio Version - Famous Band",
        "Live Album Version - Famous Band",
      ],
    },
    {
      id: "3",
      originalTitle: "Remix Track",
      artist: "DJ Producer",
      status: "pending",
      suggestions: [
        "Original Version - Original Artist",
        "Different Remix - Another DJ",
      ],
    },
  ]);

  const handleTrackAction = (trackId: string, action: "found" | "skipped") => {
    setMissingTracks((prev) =>
      prev.map((track) =>
        track.id === trackId ? { ...track, status: action } : track,
      ),
    );
  };

  const pendingTracks = missingTracks.filter(
    (track) => track.status === "pending",
  );
  const resolvedTracks = missingTracks.filter(
    (track) => track.status !== "pending",
  );

  return (
    <div className="min-h-screen gradient-background-subdued">
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
            <div className="hidden sm:flex items-center gap-2.5">
              <div className="logo-icon" aria-hidden="true">
                <Music className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-base font-semibold text-foreground">
                Missing tracks
              </h1>
            </div>
            <Badge
              variant="outline"
              className="border-amber-200 bg-amber-50 text-amber-700 ml-auto"
            >
              {pendingTracks.length} remaining
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-5 fade-in-up">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-1.5">
            Tracks needing review
          </h2>
          <p className="text-muted-foreground">
            These couldn't be matched automatically. Confirm a suggestion,
            search for an alternative, or skip.
          </p>
        </div>

        <div className="space-y-3 stagger">
          {pendingTracks.map((track) => (
            <Card key={track.id}>
              <CardContent className="p-5">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-foreground font-medium">
                        {track.originalTitle}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {track.artist}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-amber-200 bg-amber-50 text-amber-700"
                    >
                      Unmatched
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Suggested matches
                    </p>
                    {track.suggestions?.map((suggestion, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 row-hover"
                      >
                        <span className="text-foreground text-sm">
                          {suggestion}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTrackAction(track.id, "found")}
                        >
                          <Check className="w-4 h-4" />
                          Use This
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search for alternative..."
                        className="pl-9"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTrackAction(track.id, "skipped")}
                    >
                      <X className="w-4 h-4" />
                      Skip
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {pendingTracks.length === 0 && (
            <Card>
              <CardContent className="text-center py-10">
                <div className="w-14 h-14 bg-green-50 border border-green-200 rounded-xl2 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  All Done!
                </h3>
                <p className="text-muted-foreground">
                  All tracks have been resolved.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {resolvedTracks.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-foreground text-base font-semibold">
                Resolved tracks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {resolvedTracks.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center justify-between p-2 rounded-md row-hover"
                >
                  <div className="text-sm">
                    <span className="text-foreground">
                      {track.originalTitle}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      by {track.artist}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      track.status === "found"
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {track.status === "found" ? "Found" : "Skipped"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="flex justify-center pt-2">
          <Link href="/dashboard">
            <Button className="px-6">Complete Sync</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
