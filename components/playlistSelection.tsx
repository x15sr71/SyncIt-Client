import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiSpotify, SiYoutubemusic } from "react-icons/si";
import { ArrowLeftRight } from "lucide-react";
import { AlertTriangle } from "lucide-react";

type Platform = "spotify" | "youtube";

interface PlaylistSelectionProps {
  selectedSource: Platform;
  setSelectedSource: (platform: Platform) => void;
  selectedTarget: Platform;
  setSelectedTarget: (platform: Platform) => void;
}

export default function PlaylistSelection({
  selectedSource,
  setSelectedSource,
  selectedTarget,
  setSelectedTarget,
}: PlaylistSelectionProps) {
  return (
    <>
      <Card
        className="hover-lift min-w-0"
        role="region"
        aria-labelledby="platform-selection-heading"
      >
        <CardHeader className="pb-3">
          <CardTitle
            id="platform-selection-heading"
            className="text-foreground text-base font-semibold"
          >
            Select migration platforms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div className="flex flex-col sm:grid sm:grid-cols-[1fr_auto_1fr] sm:place-items-center items-center justify-center gap-y-2 sm:gap-x-6 sm:gap-y-10">
              {/* From Platform */}
              <div className="w-[160px] flex flex-col items-center text-center">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1.5">
                  From
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card font-medium text-sm capitalize">
                  {selectedSource === "spotify" ? (
                    <>
                      <SiSpotify className="w-4 h-4 text-[#1db954]" /> Spotify
                    </>
                  ) : (
                    <>
                      <SiYoutubemusic className="w-4 h-4 text-[#ff3b3b]" />{" "}
                      YouTube Music
                    </>
                  )}
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex-shrink-0 self-center sm:-mt-2 lg:mt-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="group h-9 w-9"
                  aria-label="Swap platforms"
                  onClick={() => {
                    const temp = selectedSource;
                    setSelectedSource(selectedTarget);
                    setSelectedTarget(temp);
                  }}
                >
                  <ArrowLeftRight className="h-4 w-4 sm:rotate-0 rotate-90 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Button>
              </div>

              {/* To Platform */}
              <div className="w-[160px] flex flex-col items-center text-center">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1.5">
                  To
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card font-medium text-sm capitalize">
                  {selectedTarget === "spotify" ? (
                    <>
                      <SiSpotify className="w-4 h-4 text-[#1db954]" /> Spotify
                    </>
                  ) : (
                    <>
                      <SiYoutubemusic className="w-4 h-4 text-[#ff3b3b]" />{" "}
                      YouTube Music
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* YouTube Music API Limitation Notice */}
          {selectedTarget === "youtube" && (
            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/25 rounded-lg min-w-0">
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="w-6 h-6 bg-amber-100 rounded-md flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-amber-800 font-medium text-sm mb-0.5 break-words">
                    YouTube Music API limitation
                  </h4>
                  <p className="text-amber-600 dark:text-amber-400 text-xs leading-snug break-words">
                    YouTube Music allows only{" "}
                    <span className="font-semibold">100 tracks per day</span>{" "}
                    via API. Large playlists will be migrated over multiple days
                    to comply with these restrictions.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
