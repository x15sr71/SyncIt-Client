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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md bg-white/15 backdrop-blur-20 border border-white/30 rounded-3xl shadow-2xl">
        <CardHeader className="pb-4 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl">
                {state === "loading" ? (
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                ) : state === "success" ? (
                  <CheckCircle className="w-6 h-6 text-white" />
                ) : state === "error" ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <Edit3 className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <CardTitle className="text-primary-dark text-xl font-bold">
                  {state === "loading"
                    ? "Renaming Playlist"
                    : state === "success"
                    ? "Rename Successful"
                    : state === "error"
                    ? "Rename Failed"
                    : "Rename Playlist"}
                </CardTitle>
                <p className="text-secondary-dark text-sm">
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
                size="sm"
                onClick={onClose}
                className="text-secondary-dark hover:text-primary-dark hover:bg-white/20 rounded-xl transition-all"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {(state === "input" || state === "error") && (
            <>
              {/* Current playlist info */}
              <div className="p-4 glass-effect rounded-2xl border border-white/20">
                <p className="text-secondary-dark text-sm mb-1">
                  Current name:
                </p>
                <p className="text-primary-dark font-semibold">{currentName}</p>
              </div>

              {/* Error message */}
              {state === "error" && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                  <p className="text-red-600 text-sm">{error || "Failed to rename playlist. Please try again."}</p>
                </div>
              )}

              {/* New name input */}
              <div className="space-y-3">
                <Label
                  htmlFor="new-playlist-name"
                  className="text-primary-dark font-medium"
                >
                  New playlist name
                </Label>
                <Input
                  id="new-playlist-name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-white/10 border-white/30 text-primary-dark placeholder-secondary-dark rounded-xl focus:ring-purple-500 focus:border-purple-500 shadow-lg"
                  placeholder="Enter new playlist name"
                  autoFocus
                />
              </div>

              {/* Action buttons */}
              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 rounded-2xl border-white/30 text-secondary-dark hover:bg-white/10 hover:text-primary-dark bg-transparent shadow-lg transition-all hover:scale-105"
                >
                  Cancel
                </Button>
                <Button
                  onClick={state === "error" ? handleRetry : handleRename}
                  disabled={!newName.trim() || newName.trim() === currentName}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl font-semibold shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {state === "error" ? "Try Again" : "Rename Playlist"}
                </Button>
              </div>
            </>
          )}

          {state === "loading" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse-glow shadow-xl">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
              <h3 className="text-primary-dark font-bold text-lg mb-2">
                Updating playlist name...
              </h3>
              <p className="text-secondary-dark">This may take a few moments</p>

              {/* Loading animation */}
              <div className="flex justify-center mt-6">
                <div className="flex space-x-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {state === "success" && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-500/20 border-2 border-green-500/40 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse-glow shadow-xl">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-primary-dark font-bold text-xl mb-3">
                Playlist Renamed!
              </h3>
              <p className="text-secondary-dark mb-2">
                Your playlist is now called:
              </p>
              <p className="text-primary-dark font-semibold text-lg bg-green-500/10 px-4 py-2 rounded-xl border border-green-500/20">
                "{newName}"
              </p>
              <p className="text-secondary-dark text-sm mt-4 opacity-70">
                This dialog will close automatically...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}