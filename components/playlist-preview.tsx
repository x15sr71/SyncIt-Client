"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronRight, Music, Clock, User, Trash2 } from "lucide-react"
import { PlaylistActionMenu } from "./playlist-action-menu"

interface Song {
  id: string
  title: string
  artist: string
  duration: string
}

interface Playlist {
  id: string
  name: string
  songCount: number
  imageUrl: string
  songs: Song[]
  description?: string
  isPublic?: boolean
}

interface PlaylistPreviewProps {
  playlist: Playlist
  isSelected: boolean
  onToggle: (id: string) => void
  showCheckbox?: boolean
  onRename?: (id: string) => void
  onEmpty?: (id: string) => void
  onDelete?: (id: string) => void
}

export function PlaylistPreview({
  playlist,
  isSelected,
  onToggle,
  showCheckbox = true,
  onRename,
  onEmpty,
  onDelete,
}: PlaylistPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card
      className={`glass-card border-white/40 hover-lift transition-all duration-300 ${isSelected ? "ring-2 ring-purple-500/50" : ""}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {showCheckbox && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggle(playlist.id)}
                className="w-4 h-4 text-purple-600 bg-white/20 border-white/30 rounded focus:ring-purple-500 focus:ring-2"
                aria-label={`Select ${playlist.name} playlist`}
              />
            )}
            <img
              src={playlist.imageUrl || "/placeholder.svg"}
              alt={`${playlist.name} playlist cover`}
              className="w-12 h-12 rounded-xl object-cover shadow-md"
            />
            <div className="flex-1 min-w-0">
              <CardTitle className="text-primary-dark text-base font-semibold">{playlist.name}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-secondary-dark">
                <Music className="w-3 h-3" />
                <span>{playlist.songCount} songs</span>
                {playlist.isPublic !== undefined && (
                  <>
                    <span>•</span>
                    <User className="w-3 h-3" />
                    <span>{playlist.isPublic ? "Public" : "Private"}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onRename && onEmpty && onDelete && (
              <PlaylistActionMenu
                playlistId={playlist.id}
                playlistName={playlist.name}
                onRename={onRename}
                onEmpty={onEmpty}
                onDelete={onDelete}
              />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-secondary-dark hover:text-primary-dark hover:bg-white/20 rounded-xl"
              aria-expanded={isExpanded}
              aria-label={`${isExpanded ? "Collapse" : "Expand"} ${playlist.name} playlist details`}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        {playlist.description && <p className="text-sm text-muted-dark mt-2">{playlist.description}</p>}
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="border-t border-white/20 pt-3">
            <h4 className="text-sm font-medium text-primary-dark mb-3 flex items-center gap-2">
              <Music className="w-4 h-4" />
              Songs in this playlist
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {playlist.songs.map((song, index) => (
                <div
                  key={song.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-white/10 transition-colors group"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <span className="text-xs text-muted-dark w-6 text-center">{index + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-primary-dark truncate">{song.title}</p>
                      <p className="text-xs text-secondary-dark truncate">{song.artist}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs text-muted-dark">
                      <Clock className="w-3 h-3" />
                      <span>{song.duration}</span>
                    </div>
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          // This would trigger a confirmation dialog for song removal
                          console.log(`Remove song ${song.id} from playlist ${playlist.id}`)
                        }}
                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-lg p-1 transition-all"
                        aria-label={`Remove ${song.title} from playlist`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
