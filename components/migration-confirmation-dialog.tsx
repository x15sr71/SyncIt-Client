"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, ArrowRight, Music, AlertTriangle } from "lucide-react"

interface MigrationConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (playlistNames: { [playlistId: string]: string }, useOriginalNames: boolean) => void
  originalPlaylistName: string
  sourcePlatform: string
  destinationPlatform: string
  trackCount: number
  selectedPlaylists: Array<{ id: string; name: string; songCount: number }>
  selectedPlaylistCount: number
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
  const [useOriginalNames, setUseOriginalNames] = useState(true)
  const [singleCustomName, setSingleCustomName] = useState(originalPlaylistName)
  const [customNames, setCustomNames] = useState<{ [key: string]: string }>({})

  // Initialize custom names when dialog opens or playlists change
  useEffect(() => {
    if (isOpen && selectedPlaylists.length > 0) {
      const initialNames: { [key: string]: string } = {}
      selectedPlaylists.forEach((playlist) => {
        initialNames[playlist.id] = playlist.name
      })
      setCustomNames(initialNames)
      setSingleCustomName(selectedPlaylists[0]?.name || originalPlaylistName)
    }
  }, [isOpen, selectedPlaylists, originalPlaylistName])

  if (!isOpen) return null

  const handleConfirm = () => {
    if (selectedPlaylistCount === 1) {
      // Single playlist
      const playlistId = selectedPlaylists[0].id
      const finalName = useOriginalNames ? selectedPlaylists[0].name : singleCustomName.trim()
      onConfirm({ [playlistId]: finalName }, useOriginalNames)
    } else {
      // Multiple playlists
      const finalNames: { [playlistId: string]: string } = {}
      selectedPlaylists.forEach((playlist) => {
        finalNames[playlist.id] = useOriginalNames ? playlist.name : customNames[playlist.id]?.trim() || playlist.name
      })
      onConfirm(finalNames, useOriginalNames)
    }
  }

  const updateCustomName = (playlistId: string, newName: string) => {
    setCustomNames((prev) => ({
      ...prev,
      [playlistId]: newName,
    }))
  }

  // Check if all custom names are valid
  const isValidCustomNames = () => {
    if (useOriginalNames) return true

    if (selectedPlaylistCount === 1) {
      return singleCustomName.trim().length > 0
    }

    return selectedPlaylists.every((playlist) => customNames[playlist.id]?.trim().length > 0)
  }

  const isYouTubeTarget = destinationPlatform === "youtube"
  const totalTracks = selectedPlaylists.reduce((sum, playlist) => sum + playlist.songCount, 0)
  const exceedsYouTubeLimit = isYouTubeTarget && totalTracks > 100

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-lg bg-white/15 backdrop-blur-20 border border-white/30 rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="pb-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center animate-pulse-glow shadow-xl">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-primary-dark text-xl font-bold">Confirm Migration</CardTitle>
                <p className="text-secondary-dark text-sm">
                  {selectedPlaylistCount === 1
                    ? "Configure your playlist migration"
                    : `Configure migration for ${selectedPlaylistCount} playlists`}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-secondary-dark hover:text-primary-dark hover:bg-white/20 rounded-xl transition-all"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Migration Flow Visualization */}
          <div className="flex items-center justify-center space-x-6 p-6 glass-effect rounded-2xl">
            <div className="text-center">
              <div className="w-14 h-14 bg-green-500/20 border-2 border-green-500/40 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                <Music className="w-7 h-7 text-green-600" />
              </div>
              <div className="text-sm font-medium text-secondary-dark mb-1">From</div>
              <div className="text-primary-dark font-bold capitalize">{sourcePlatform}</div>
            </div>
            <div className="flex flex-col items-center">
              <ArrowRight className="w-8 h-8 text-purple-500 animate-pulse mb-2" />
              <div className="text-xs text-secondary-dark">Migrate</div>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-red-500/20 border-2 border-red-500/40 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                <Music className="w-7 h-7 text-red-600" />
              </div>
              <div className="text-sm font-medium text-secondary-dark mb-1">To</div>
              <div className="text-primary-dark font-bold capitalize">{destinationPlatform}</div>
            </div>
          </div>

          {/* YouTube Music API Limitation Warning */}
          {exceedsYouTubeLimit && (
            <div className="p-5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/40 rounded-2xl shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-500/30 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <AlertTriangle className="w-6 h-6 text-yellow-700" />
                </div>
                <div>
                  <h4 className="text-yellow-800 font-bold text-lg mb-2">YouTube Music API Limitation</h4>
                  <p className="text-yellow-900 text-sm leading-relaxed">
                    {selectedPlaylistCount === 1
                      ? `This playlist has ${trackCount} tracks`
                      : `These playlists have a total of ${totalTracks} tracks`}
                    , but YouTube Music allows only <span className="font-semibold">100 tracks per day</span> via API.
                    The migration will be split across multiple days.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Playlist Name Options */}
          <div className="space-y-4">
            <h3 className="text-primary-dark font-semibold">
              Choose playlist name{selectedPlaylistCount > 1 ? "s" : ""}:
            </h3>

            {/* Use Original Names Option */}
            <div
              className="flex items-start space-x-3 p-4 glass-effect rounded-2xl hover:bg-white/20 transition-all cursor-pointer"
              onClick={() => setUseOriginalNames(true)}
            >
              <input
                type="radio"
                id="original-names"
                name="playlist-naming"
                checked={useOriginalNames}
                onChange={() => setUseOriginalNames(true)}
                className="mt-1 w-4 h-4 text-purple-600 bg-white/20 border-white/30 focus:ring-purple-500 focus:ring-2"
              />
              <div className="flex-1">
                <Label htmlFor="original-names" className="text-primary-dark font-semibold cursor-pointer">
                  Use original name{selectedPlaylistCount > 1 ? "s" : ""}
                </Label>
                <p className="text-sm text-secondary-dark mt-1">
                  {selectedPlaylistCount > 1
                    ? `Keep the original names for all ${selectedPlaylistCount} playlists`
                    : `Create playlist with the same name: "${originalPlaylistName}"`}
                </p>
              </div>
            </div>

            {/* Custom Names Option */}
            <div
              className="flex items-start space-x-3 p-4 glass-effect rounded-2xl hover:bg-white/20 transition-all cursor-pointer"
              onClick={() => setUseOriginalNames(false)}
            >
              <input
                type="radio"
                id="custom-names"
                name="playlist-naming"
                checked={!useOriginalNames}
                onChange={() => setUseOriginalNames(false)}
                className="mt-1 w-4 h-4 text-purple-600 bg-white/20 border-white/30 focus:ring-purple-500 focus:ring-2"
              />
              <div className="flex-1 space-y-3">
                <Label htmlFor="custom-names" className="text-primary-dark font-semibold cursor-pointer">
                  Customize name{selectedPlaylistCount > 1 ? "s" : ""}
                </Label>

                {selectedPlaylistCount === 1 ? (
                  <Input
                    value={singleCustomName}
                    onChange={(e) => setSingleCustomName(e.target.value)}
                    disabled={useOriginalNames}
                    className="bg-white/10 border-white/30 text-primary-dark placeholder-secondary-dark rounded-xl focus:ring-purple-500 focus:border-purple-500 shadow-lg disabled:opacity-50"
                    placeholder="Enter custom playlist name"
                  />
                ) : (
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {selectedPlaylists.map((playlist) => (
                      <div key={playlist.id} className="space-y-2">
                        <Label className="text-sm text-secondary-dark font-medium">
                          {playlist.name} ({playlist.songCount} tracks)
                        </Label>
                        <Input
                          value={customNames[playlist.id] || playlist.name}
                          onChange={(e) => updateCustomName(playlist.id, e.target.value)}
                          disabled={useOriginalNames}
                          className="bg-white/10 border-white/30 text-primary-dark placeholder-secondary-dark rounded-xl focus:ring-purple-500 focus:border-purple-500 shadow-lg disabled:opacity-50"
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
          <div className="flex space-x-3 pt-6 border-t border-white/20">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-2xl border-white/30 text-secondary-dark hover:bg-white/10 hover:text-primary-dark bg-transparent shadow-lg transition-all hover:scale-105"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!isValidCustomNames()}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl font-semibold shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Start Migration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
