"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, FolderX, Loader2, CheckCircle, AlertTriangle } from "lucide-react";

interface EmptyPlaylistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  playlistId: string;
  playlistName: string;
  songCount: number;
  onEmpty: (playlistId: string) => void;
}

type EmptyState = "confirm" | "loading" | "success";

export function EmptyPlaylistDialog({
  isOpen,
  onClose,
  playlistId,
  playlistName,
  songCount,
  onEmpty,
}: EmptyPlaylistDialogProps) {
  const [state, setState] = useState<EmptyState>("confirm");

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setState("confirm");
    }
  }, [isOpen]);

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

  const handleEmpty = async () => {
    setState("loading");

    // Simulate API call with 3-second delay
    setTimeout(() => {
      onEmpty(playlistId);
      setState("success");
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/40 backdrop-blur-sm fade-in-up">
      <Card className="w-full max-w-md shadow-elev">
        <CardHeader className="pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center shadow-soft">
                {state === "loading" ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : state === "success" ? (
                  <CheckCircle className="w-5 h-5 text-white" />
                ) : (
                  <FolderX className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <CardTitle className="text-foreground text-lg font-semibold">
                  {state === "loading"
                    ? "Emptying Playlist"
                    : state === "success"
                      ? "Emptying Successful"
                      : "Empty Playlist"}
                </CardTitle>
                <p className="text-muted-foreground text-sm">
                  {state === "loading"
                    ? "Please wait while we remove all songs..."
                    : state === "success"
                      ? "All songs have been removed successfully!"
                      : "Remove all songs from this playlist"}
                </p>
              </div>
            </div>
            {state === "confirm" && (
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
          {state === "confirm" && (
            <>
              {/* Warning message */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-amber-600 dark:text-amber-400 font-medium text-sm mb-1">
                      Do you really want to empty the whole playlist?
                    </p>
                    <p className="text-amber-600 dark:text-amber-400 text-sm">
                      This will remove all <strong>{songCount} songs</strong>{" "}
                      from "<strong>{playlistName}</strong>". The playlist will
                      remain but will be empty.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex space-x-3 pt-2">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  No, Cancel
                </Button>
                <Button
                  onClick={handleEmpty}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
                >
                  Yes, Empty
                </Button>
              </div>
            </>
          )}

          {state === "loading" && (
            <div className="text-center py-8">
              <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-soft">
                <Loader2 className="w-7 h-7 text-white animate-spin" />
              </div>
              <h3 className="text-foreground font-semibold text-base mb-1">
                Removing all songs...
              </h3>
              <p className="text-sm text-muted-foreground">
                This may take a few moments
              </p>

              <div className="flex justify-center mt-5">
                <div className="flex space-x-1.5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"
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
                Emptying Successfully Completed!
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                All songs have been removed from:
              </p>
              <p className="text-foreground font-medium bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/25 inline-block">
                "{playlistName}"
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
