"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Edit3, Loader2, CheckCircle } from "lucide-react";

interface RenamePlaylistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  playlistId: string;
  currentName: string;
  onRename: (playlistId: string, newName: string) => Promise<void>; // Make this return a Promise
  loading?: boolean;
  error?: string | null;
}

type RenameState = "input" | "loading" | "success" | "error";

export function RenamePlaylistDialog({
  isOpen,
  onClose,
  playlistId,
  currentName,
  onRename,
  loading = false,
  error = null,
}: RenamePlaylistDialogProps) {
  const [newName, setNewName] = useState(currentName);
  const [state, setState] = useState<RenameState>("input");

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setNewName(currentName);
      setState("input");
    }
  }, [isOpen, currentName]);

  // Handle loading state from parent
  useEffect(() => {
    if (loading && state === "loading") {
      // Keep loading state
    } else if (!loading && state === "loading") {
      if (error) {
        setState("error");
      } else {
        setState("success");
      }
    }
  }, [loading, error, state]);

  // Auto-close after success
  useEffect(() => {
    if (state === "success") {
      const timer = setTimeout(() => {
        onClose();
      }, 2000); // Close after 2 seconds to show success message

      return () => clearTimeout(timer);
    }
  }, [state, onClose]);

  if (!isOpen) return null;

  const handleRename = async () => {
    if (!newName.trim() || newName.trim() === currentName) return;

    setState("loading");

    try {
      await onRename(playlistId, newName.trim());
      // Success state will be handled by useEffect above
    } catch (err) {
      setState("error");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && state === "input") {
      handleRename();
    }
  };

  const handleRetry = () => {
    setState("input");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/40 backdrop-blur-sm fade-in-up">
      <Card className="w-full max-w-md shadow-elev">
        <CardHeader className="pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-gradStart to-brand-gradEnd rounded-lg flex items-center justify-center shadow-soft">
                {state === "loading" ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : state === "success" ? (
                  <CheckCircle className="w-5 h-5 text-white" />
                ) : state === "error" ? (
                  <X className="w-5 h-5 text-white" />
                ) : (
                  <Edit3 className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <CardTitle className="text-foreground text-lg font-semibold">
                  {state === "loading"
                    ? "Renaming Playlist"
                    : state === "success"
                      ? "Rename Successful"
                      : state === "error"
                        ? "Rename Failed"
                        : "Rename Playlist"}
                </CardTitle>
                <p className="text-muted-foreground text-sm">
                  {state === "loading"
                    ? "Please wait while we update your playlist..."
                    : state === "success"
                      ? "Your playlist has been renamed successfully!"
                      : state === "error"
                        ? error || "Something went wrong. Please try again."
                        : "Enter a new name for your playlist"}
                </p>
              </div>
            </div>
            {(state === "input" || state === "error") && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-5 pt-6">
          {(state === "input" || state === "error") && (
            <>
              {/* Current playlist info */}
              <div className="p-3 rounded-lg border border-border bg-muted/50">
                <p className="text-muted-foreground text-xs mb-1">
                  Current name
                </p>
                <p className="text-foreground font-medium">{currentName}</p>
              </div>

              {/* Error message */}
              {state === "error" && (
                <div className="p-3 bg-red-500/10 border border-red-500/25 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    {error || "Failed to rename playlist. Please try again."}
                  </p>
                </div>
              )}

              {/* New name input */}
              <div className="space-y-2">
                <Label
                  htmlFor="new-playlist-name"
                  className="text-foreground font-medium text-sm"
                >
                  New playlist name
                </Label>
                <Input
                  id="new-playlist-name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter new playlist name"
                  autoFocus
                />
              </div>

              {/* Action buttons */}
              <div className="flex space-x-3 pt-2">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={state === "error" ? handleRetry : handleRename}
                  disabled={!newName.trim() || newName.trim() === currentName}
                  className="flex-1"
                >
                  {state === "error" ? "Try Again" : "Rename Playlist"}
                </Button>
              </div>
            </>
          )}

          {state === "loading" && (
            <div className="text-center py-8">
              <div className="w-14 h-14 bg-gradient-to-br from-brand-gradStart to-brand-gradEnd rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-soft">
                <Loader2 className="w-7 h-7 text-white animate-spin" />
              </div>
              <h3 className="text-foreground font-semibold text-base mb-1">
                Updating playlist name...
              </h3>
              <p className="text-sm text-muted-foreground">
                This may take a few moments
              </p>

              <div className="flex justify-center mt-5">
                <div className="flex space-x-1.5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-brand-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {state === "success" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-9 h-9 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-foreground font-semibold text-lg mb-2">
                Playlist Renamed!
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                Your playlist is now called:
              </p>
              <p className="text-foreground font-medium bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/25 inline-block">
                "{newName}"
              </p>
              <p className="text-muted-foreground text-xs mt-4">
                This dialog will close automatically...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
