"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, ArrowRight, Music, AlertTriangle } from "lucide-react";

interface MigrationConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    playlistNames: { [playlistId: string]: string },
    useOriginalNames: boolean,
  ) => void;
  originalPlaylistName: string;
  sourcePlatform: string;
  destinationPlatform: string;
  trackCount: number;
  selectedPlaylists: Array<{ id: string; name: string; songCount: number }>;
  selectedPlaylistCount: number;
}

export function MigrationConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  originalPlaylistName,
  sourcePlatform,
  destinationPlatform,
  trackCount,
  selectedPlaylists,
  selectedPlaylistCount,
}: MigrationConfirmationDialogProps) {
  const [useOriginalNames, setUseOriginalNames] = useState(true);
  const [singleCustomName, setSingleCustomName] =
    useState(originalPlaylistName);
  const [customNames, setCustomNames] = useState<{ [key: string]: string }>({});

  // Initialize custom names when dialog opens or playlists change
  useEffect(() => {
    if (isOpen && selectedPlaylists.length > 0) {
      const initialNames: { [key: string]: string } = {};
      selectedPlaylists.forEach((playlist) => {
        initialNames[playlist.id] = playlist.name;
      });
      setCustomNames(initialNames);
      setSingleCustomName(selectedPlaylists[0]?.name || originalPlaylistName);
    }
  }, [isOpen, selectedPlaylists, originalPlaylistName]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedPlaylistCount === 1) {
      // Single playlist
      const playlistId = selectedPlaylists[0].id;
      const finalName = useOriginalNames
        ? selectedPlaylists[0].name
        : singleCustomName.trim();
      onConfirm({ [playlistId]: finalName }, useOriginalNames);
    } else {
      // Multiple playlists
      const finalNames: { [playlistId: string]: string } = {};
      selectedPlaylists.forEach((playlist) => {
        finalNames[playlist.id] = useOriginalNames
          ? playlist.name
          : customNames[playlist.id]?.trim() || playlist.name;
      });
      onConfirm(finalNames, useOriginalNames);
    }
  };

  const updateCustomName = (playlistId: string, newName: string) => {
    setCustomNames((prev) => ({
      ...prev,
      [playlistId]: newName,
    }));
  };

  // Check if all custom names are valid
  const isValidCustomNames = () => {
    if (useOriginalNames) return true;

    if (selectedPlaylistCount === 1) {
      return singleCustomName.trim().length > 0;
    }

    return selectedPlaylists.every(
      (playlist) => customNames[playlist.id]?.trim().length > 0,
    );
  };

  const isYouTubeTarget = destinationPlatform === "youtube";
  const totalTracks = selectedPlaylists.reduce(
    (sum, playlist) => sum + playlist.songCount,
    0,
  );
  const exceedsYouTubeLimit = isYouTubeTarget && totalTracks > 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/40 backdrop-blur-sm fade-in-up">
      <Card className="w-full max-w-lg shadow-elev max-h-[90vh] overflow-hidden">
        <CardHeader className="pb-5 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-gradStart to-brand-gradEnd rounded-lg flex items-center justify-center shadow-soft">
                <Music className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-foreground text-lg font-semibold">
                  Confirm Migration
                </CardTitle>
                <p className="text-muted-foreground text-sm">
                  {selectedPlaylistCount === 1
                    ? "Configure your playlist migration"
                    : `Configure migration for ${selectedPlaylistCount} playlists`}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 overflow-y-auto max-h-[60vh] pt-6">
          {/* Migration Flow Visualization */}
          <div className="flex items-center justify-center space-x-6 p-5 rounded-lg border border-border bg-muted/40">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/25 rounded-lg flex items-center justify-center mb-2">
                <Music className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-xs font-medium text-muted-foreground mb-0.5">
                From
              </div>
              <div className="text-foreground font-semibold capitalize text-sm">
                {sourcePlatform}
              </div>
            </div>
            <div className="sync-link">
              <div className="sync-pulse"></div>
              <span className="sync-dot"></span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-500/10 border border-red-500/25 rounded-lg flex items-center justify-center mb-2">
                <Music className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-xs font-medium text-muted-foreground mb-0.5">
                To
              </div>
              <div className="text-foreground font-semibold capitalize text-sm">
                {destinationPlatform}
              </div>
            </div>
          </div>

          {/* YouTube Music API Limitation Warning */}
          {exceedsYouTubeLimit && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/25 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h4 className="text-amber-800 font-semibold text-sm mb-1">
                    YouTube Music API Limitation
                  </h4>
                  <p className="text-amber-600 dark:text-amber-400 text-sm leading-relaxed">
                    {selectedPlaylistCount === 1
                      ? `This playlist has ${trackCount} tracks`
                      : `These playlists have a total of ${totalTracks} tracks`}
                    , but YouTube Music allows only{" "}
                    <span className="font-semibold">100 tracks per day</span>{" "}
                    via API. The migration will be split across multiple days.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Playlist Name Options */}
          <div className="space-y-3">
            <h3 className="text-foreground font-medium text-sm">
              Choose playlist name{selectedPlaylistCount > 1 ? "s" : ""}:
            </h3>

            {/* Use Original Names Option */}
            <div
              className="flex items-start space-x-3 p-3.5 rounded-lg border border-border hover:bg-accent/40 transition-colors cursor-pointer"
              onClick={() => setUseOriginalNames(true)}
            >
              <input
                type="radio"
                id="original-names"
                name="playlist-naming"
                checked={useOriginalNames}
                onChange={() => setUseOriginalNames(true)}
                className="mt-1 w-4 h-4 accent-brand-500"
              />
              <div className="flex-1">
                <Label
                  htmlFor="original-names"
                  className="text-foreground font-medium cursor-pointer"
                >
                  Use original name{selectedPlaylistCount > 1 ? "s" : ""}
                </Label>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {selectedPlaylistCount > 1
                    ? `Keep the original names for all ${selectedPlaylistCount} playlists`
                    : `Create playlist with the same name: "${originalPlaylistName}"`}
                </p>
              </div>
            </div>

            {/* Custom Names Option */}
            <div
              className="flex items-start space-x-3 p-3.5 rounded-lg border border-border hover:bg-accent/40 transition-colors cursor-pointer"
              onClick={() => setUseOriginalNames(false)}
            >
              <input
                type="radio"
                id="custom-names"
                name="playlist-naming"
                checked={!useOriginalNames}
                onChange={() => setUseOriginalNames(false)}
                className="mt-1 w-4 h-4 accent-brand-500"
              />
              <div className="flex-1 space-y-3">
                <Label
                  htmlFor="custom-names"
                  className="text-foreground font-medium cursor-pointer"
                >
                  Customize name{selectedPlaylistCount > 1 ? "s" : ""}
                </Label>

                {selectedPlaylistCount === 1 ? (
                  <Input
                    value={singleCustomName}
                    onChange={(e) => setSingleCustomName(e.target.value)}
                    disabled={useOriginalNames}
                    className="disabled:opacity-50"
                    placeholder="Enter custom playlist name"
                  />
                ) : (
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {selectedPlaylists.map((playlist) => (
                      <div key={playlist.id} className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground font-medium">
                          {playlist.name} ({playlist.songCount} tracks)
                        </Label>
                        <Input
                          value={customNames[playlist.id] || playlist.name}
                          onChange={(e) =>
                            updateCustomName(playlist.id, e.target.value)
                          }
                          disabled={useOriginalNames}
                          className="disabled:opacity-50"
                          placeholder={`Custom name for ${playlist.name}`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-5 border-t border-border">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!isValidCustomNames()}
              className="flex-1"
            >
              Start Migration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
