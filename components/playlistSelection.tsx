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
        className="glass-card border-white/40 hover-lift min-w-0"
        role="region"
        aria-labelledby="platform-selection-heading"
      >
        <CardHeader>
          <CardTitle
            id="platform-selection-heading"
            className="text-primary-dark"
          >
            Select Migration Platforms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div className="flex flex-col sm:grid sm:grid-cols-[1fr_auto_1fr] sm:place-items-center items-center justify-center gap-y-2 sm:gap-x-6 sm:gap-y-10">
              {/* From Platform */}
              <div className="w-[160px] flex flex-col items-center text-center">
                <p className="text-muted-foreground text-sm mb-1">From</p>
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-medium text-sm capitalize
            ${
              selectedSource === "spotify"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
                >
                  {selectedSource === "spotify" ? (
                    <>
                      <SiSpotify className="w-4 h-4" /> Spotify
                    </>
                  ) : (
                    <>
                      <SiYoutubemusic className="w-4 h-4" /> YouTube Music
                    </>
                  )}
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex-shrink-0 self-center sm:-mt-2 lg:mt-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="group h-9 w-9 rounded-lg backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 shadow-md hover:shadow-xl transition-all"
                  aria-label="Swap platforms"
                  onClick={() => {
                    const temp = selectedSource;
                    setSelectedSource(selectedTarget);
                    setSelectedTarget(temp);
                  }}
                >
                  <ArrowLeftRight className="h-4 w-4 sm:rotate-0 rotate-90 text-white/90 drop-shadow-sm group-hover:text-white transition-colors" />
                </Button>
              </div>

              {/* To Platform */}
              <div className="w-[160px] flex flex-col items-center text-center">
                <p className="text-muted-foreground text-sm mb-1">To</p>
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-medium text-sm capitalize
            ${
              selectedTarget === "spotify"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
                >
                  {selectedTarget === "spotify" ? (
                    <>
                      <SiSpotify className="w-4 h-4" /> Spotify
                    </>
                  ) : (
                    <>
                      <SiYoutubemusic className="w-4 h-4" /> YouTube Music
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* YouTube Music API Limitation Notice */}
          {(selectedSource === "youtube" || selectedTarget === "youtube") && (
            <div className="mt-6 p-5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/40 rounded-2xl shadow-lg min-w-0">
              <div className="flex items-start gap-4 min-w-0">
                <div className="w-12 h-12 bg-yellow-500/30 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <AlertTriangle className="w-6 h-6 text-yellow-700" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-yellow-800 font-bold text-lg mb-2 break-words">
                    YouTube Music API Limitation
                  </h4>
                  <p className="text-yellow-900 text-sm leading-relaxed break-words">
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
