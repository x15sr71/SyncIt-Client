"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

interface Playlist {
  id: string
  name: string
  tracks: number
  cover: string
}

interface PlaylistSelectorProps {
  platform: "spotify" | "youtube"
}

export function PlaylistSelector({ platform }: PlaylistSelectorProps) {
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([])

  const playlists: Playlist[] =
    platform === "spotify"
      ? [
          { id: "1", name: "My Favorites", tracks: 127, cover: "🎵" },
          { id: "2", name: "Workout Mix", tracks: 45, cover: "💪" },
          { id: "3", name: "Chill Vibes", tracks: 89, cover: "🌙" },
          { id: "4", name: "Road Trip", tracks: 156, cover: "🚗" },
          { id: "5", name: "Party Hits", tracks: 78, cover: "🎉" },
        ]
      : [
          { id: "1", name: "Liked Music", tracks: 234, cover: "❤️" },
          { id: "2", name: "Discover Weekly", tracks: 30, cover: "🔍" },
          { id: "3", name: "Focus Music", tracks: 92, cover: "🎯" },
          { id: "4", name: "Throwback Hits", tracks: 145, cover: "⏰" },
          { id: "5", name: "New Releases", tracks: 67, cover: "🆕" },
        ]

  const handlePlaylistToggle = (playlistId: string) => {
    setSelectedPlaylists((prev) =>
      prev.includes(playlistId) ? prev.filter((id) => id !== playlistId) : [...prev, playlistId],
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h3 className="text-primary-dark font-semibold">Select Playlists to Sync</h3>
        <Badge variant="secondary" className="bg-purple-500/20 text-purple-700 rounded-xl">
          {selectedPlaylists.length} selected
        </Badge>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto" role="group" aria-labelledby="playlist-selection-heading">
        <h4 id="playlist-selection-heading" className="sr-only">
          Available playlists for syncing
        </h4>
        {playlists.map((playlist) => (
          <Card
            key={playlist.id}
            className="glass-effect border-white/30 hover:border-white/50 hover:bg-white/20 transition-all cursor-pointer rounded-2xl"
            onClick={() => handlePlaylistToggle(playlist.id)}
            role="button"
            tabIndex={0}
            aria-pressed={selectedPlaylists.includes(playlist.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                handlePlaylistToggle(playlist.id)
              }
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedPlaylists.includes(playlist.id)}
                  onCheckedChange={() => handlePlaylistToggle(playlist.id)}
                  aria-label={`Select ${playlist.name} playlist with ${playlist.tracks} tracks`}
                />
                <div
                  className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-lg shadow-lg"
                  aria-hidden="true"
                >
                  {playlist.cover}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-primary-dark font-semibold truncate">{playlist.name}</h4>
                  <p className="text-secondary-dark text-sm">{playlist.tracks} tracks</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
