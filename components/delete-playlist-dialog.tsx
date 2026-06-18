"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Trash2, Loader2, CheckCircle, AlertTriangle } from "lucide-react";

interface DeletePlaylistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  playlistId: string;
  playlistName: string;
  onDelete: (playlistId: string) => void;
  loading?: boolean;
  error?: string | null;
}

type DeleteState = "confirm" | "loading" | "success";

export function DeletePlaylistDialog({
  isOpen,
  onClose,
  playlistId,
  playlistName,
  onDelete,
}: DeletePlaylistDialogProps) {
  const [state, setState] = useState<DeleteState>("confirm");

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

  const handleDelete = async () => {
    setState("loading");

    // Simulate API call with 3-second delay
    setTimeout(() => {
      onDelete(playlistId);
      setState("success");
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/40 backdrop-blur-sm fade-in-up">
      <Card className="w-full max-w-md shadow-elev">
        <CardHeader className="pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center shadow-soft">
                {state === "loading" ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : state === "success" ? (
                  <CheckCircle className="w-5 h-5 text-white" />
                ) : (
                  <Trash2 className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <CardTitle className="text-foreground text-lg font-semibold">
                  {state === "loading"
                    ? "Deleting Playlist"
                    : state === "success"
                      ? "Deletion Successful"
                      : "Delete Playlist"}
                </CardTitle>
                <p className="text-muted-foreground text-sm">
                  {state === "loading"
                    ? "Please wait while we delete your playlist..."
                    : state === "success"
                      ? "Your playlist has been deleted successfully!"
                      : "This action cannot be undone"}
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
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-red-700 font-medium text-sm mb-1">
                      Do you really want to delete this playlist?
                    </p>
                    <p className="text-red-600 text-sm">
                      This will permanently delete "
                      <strong>{playlistName}</strong>" and all its songs. This
                      action cannot be undone.
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
                  onClick={handleDelete}
                  variant="destructive"
                  className="flex-1"
                >
                  Yes, Delete
                </Button>
              </div>
            </>
          )}

          {state === "loading" && (
            <div className="text-center py-8">
              <div className="w-14 h-14 bg-red-500 rounded-xl2 flex items-center justify-center mx-auto mb-5 shadow-soft">
                <Loader2 className="w-7 h-7 text-white animate-spin" />
              </div>
              <h3 className="text-foreground font-semibold text-base mb-1">
                Deleting playlist...
              </h3>
              <p className="text-sm text-muted-foreground">
                This may take a few moments
              </p>

              <div className="flex justify-center mt-5">
                <div className="flex space-x-1.5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-red-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {state === "success" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-xl2 flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-9 h-9 text-green-600" />
              </div>
              <h3 className="text-foreground font-semibold text-lg mb-2">
                Deletion Completed Successfully!
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                The playlist has been permanently removed:
              </p>
              <p className="text-foreground font-medium bg-green-50 px-4 py-2 rounded-lg border border-green-200 inline-block">
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
