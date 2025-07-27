"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, FolderX, Loader2, CheckCircle, AlertTriangle } from "lucide-react"

interface EmptyPlaylistDialogProps {
  isOpen: boolean
  onClose: () => void
  playlistId: string
  playlistName: string
  songCount: number
  onEmpty: (playlistId: string) => void
}

type EmptyState = "confirm" | "loading" | "success"

export function EmptyPlaylistDialog({
  isOpen,
  onClose,
  playlistId,
  playlistName,
  songCount,
  onEmpty,
}: EmptyPlaylistDialogProps) {
  const [state, setState] = useState<EmptyState>("confirm")

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setState("confirm")
    }
  }, [isOpen])

  // Auto-close after success
  useEffect(() => {
    if (state === "success") {
      const timer = setTimeout(() => {
        onClose()
      }, 2000) // Close after 2 seconds to show success message

      return () => clearTimeout(timer)
    }
  }, [state, onClose])

  if (!isOpen) return null

  const handleEmpty = async () => {
    setState("loading")

    // Simulate API call with 3-second delay
    setTimeout(() => {
      onEmpty(playlistId)
      setState("success")
    }, 3000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md bg-white/15 backdrop-blur-20 border border-white/30 rounded-3xl shadow-2xl">
        <CardHeader className="pb-4 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-xl">
                {state === "loading" ? (
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                ) : state === "success" ? (
                  <CheckCircle className="w-6 h-6 text-white" />
                ) : (
                  <FolderX className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <CardTitle className="text-primary-dark text-xl font-bold">
                  {state === "loading"
                    ? "Emptying Playlist"
                    : state === "success"
                      ? "Emptying Successful"
                      : "Empty Playlist"}
                </CardTitle>
                <p className="text-secondary-dark text-sm">
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
          {state === "confirm" && (
            <>
              {/* Warning message */}
              <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-orange-700 font-medium text-sm mb-1">
                      Do you really want to empty the whole playlist?
                    </p>
                    <p className="text-orange-600 text-sm">
                      This will remove all <strong>{songCount} songs</strong> from "<strong>{playlistName}</strong>".
                      The playlist will remain but will be empty.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 rounded-2xl border-white/30 text-secondary-dark hover:bg-white/10 hover:text-primary-dark bg-transparent shadow-lg transition-all hover:scale-105"
                >
                  No, Cancel
                </Button>
                <Button
                  onClick={handleEmpty}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white rounded-2xl font-semibold shadow-xl transition-all hover:scale-105"
                >
                  Yes, Empty
                </Button>
              </div>
            </>
          )}

          {state === "loading" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse-glow shadow-xl">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
              <h3 className="text-primary-dark font-bold text-lg mb-2">Removing all songs...</h3>
              <p className="text-secondary-dark">This may take a few moments</p>

              {/* Loading animation */}
              <div className="flex justify-center mt-6">
                <div className="flex space-x-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-3 h-3 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full animate-bounce"
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
              <h3 className="text-primary-dark font-bold text-xl mb-3">Emptying Successfully Completed!</h3>
              <p className="text-secondary-dark mb-2">All songs have been removed from:</p>
              <p className="text-primary-dark font-semibold text-lg bg-green-500/10 px-4 py-2 rounded-xl border border-green-500/20">
                "{playlistName}"
              </p>
              <p className="text-secondary-dark text-sm mt-4 opacity-70">This dialog will close automatically...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
