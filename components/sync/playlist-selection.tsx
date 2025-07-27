"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Music, Loader2 } from "lucide-react"

interface Playlist {
  id: string
  name: string
  songCount: number
  imageUrl: string
}

interface PlaylistSelectionProps {
  playlists: Playlist[]
  selectedPlaylists: { [key: string]: boolean }
  togglePlaylist: (id: string) => void
  toggleAllPlaylists: () => void
  isProcessing: boolean
  syncMode: "migrate" | "sync"
  handleContinue: () => void
}

export function PlaylistSelection({
  playlists,
  selectedPlaylists,
  togglePlaylist,
  toggleAllPlaylists,
  isProcessing,
  syncMode,
  handleContinue,
}: PlaylistSelectionProps) {
  const selectedCount = Object.values(selectedPlaylists).filter(Boolean).length
  const allSelected = selectedCount === playlists.length

  if (isProcessing) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">
          {syncMode === "migrate" ? "Migrating" : "Syncing"} Your Playlists
        </h2>
        <p className="text-white/80 text-lg">Please wait while we process your music...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Select Playlists</h2>
        <p className="text-white/80 text-lg max-w-2xl mx-auto">
          Choose which playlists you want to {syncMode === "migrate" ? "migrate" : "sync"}
        </p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Checkbox
            checked={allSelected}
            onCheckedChange={toggleAllPlaylists}
            className="border-white/40 data-[state=checked]:bg-white data-[state=checked]:text-purple-600"
          />
          <span className="text-white font-medium">Select All Playlists</span>
        </div>
        <Badge variant="secondary" className="bg-white/20 text-white">
          {selectedCount} selected
        </Badge>
      </div>

      <div className="grid gap-4 mb-8 max-h-96 overflow-y-auto">
        {playlists.map((playlist) => (
          <Card
            key={playlist.id}
            className={`cursor-pointer transition-all duration-200 ${
              selectedPlaylists[playlist.id]
                ? "bg-white/20 border-white/40"
                : "bg-white/10 border-white/20 hover:bg-white/15"
            }`}
            onClick={() => togglePlaylist(playlist.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Checkbox
                  checked={selectedPlaylists[playlist.id] || false}
                  onCheckedChange={() => togglePlaylist(playlist.id)}
                  className="border-white/40 data-[state=checked]:bg-white data-[state=checked]:text-purple-600"
                />
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium">{playlist.name}</h3>
                  <p className="text-white/70 text-sm">{playlist.songCount} songs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button
          onClick={handleContinue}
          disabled={selectedCount === 0}
          className="bg-white text-purple-600 hover:bg-white/90 px-8 py-3 text-lg font-semibold rounded-full hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {syncMode === "migrate" ? "Start Migration" : "Start Sync"} ({selectedCount} playlists)
        </Button>
      </div>
    </div>
  )
}
