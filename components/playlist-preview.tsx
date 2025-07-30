"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronRight, Music, Clock, User, Trash2, Loader2 } from "lucide-react"
import { PlaylistActionMenu } from "./playlist-action-menu"
import useGetSpotifyPlaylistContent from "../hooks/getSpotifyContent"

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

// Helper function to format duration from milliseconds to "3:45" format
const formatDuration = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

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
  const [loadedSongs, setLoadedSongs] = useState<Song[]>([])
  const [hasLoadedContent, setHasLoadedContent] = useState(false)
  
  const { fetchPlaylistContent, loading, error } = useGetSpotifyPlaylistContent()

  const handleExpand = async () => {
    if (!isExpanded && !hasLoadedContent) {
      try {
        const spotifyTracks = await fetchPlaylistContent()
        
        // Transform Spotify tracks to Song format
        const transformedSongs: Song[] = spotifyTracks.map(track => ({
          id: track.id,
          title: track.name,
          artist: track.artists.join(', '),
          duration: formatDuration(track.duration_ms)
        }))
        
        setLoadedSongs(transformedSongs)
        setHasLoadedContent(true)
      } catch (error) {
        console.error('Failed to load playlist content:', error)
        // Keep the existing songs from playlist.songs as fallback
        setLoadedSongs(playlist.songs)
      }
    }
    setIsExpanded(!isExpanded)
  }

  // Use loaded songs if available, otherwise fall back to playlist.songs
  const songsToDisplay = hasLoadedContent ? loadedSongs : playlist.songs

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
                <span>{hasLoadedContent ? loadedSongs.length : playlist.songCount} songs</span>
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
              onClick={handleExpand}
              disabled={loading}
              className="text-secondary-dark hover:text-primary-dark hover:bg-white/20 rounded-xl"
              aria-expanded={isExpanded}
              aria-label={`${isExpanded ? "Collapse" : "Expand"} ${playlist.name} playlist details`}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
        {/* {playlist.description && <p className="text-sm text-muted-dark mt-2">{playlist.description}</p>} */}
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="border-t border-white/20 pt-3">
            <h4 className="text-sm font-medium text-primary-dark mb-3 flex items-center gap-2">
              <Music className="w-4 h-4" />
              Songs in this playlist
            </h4>
            
            {error && (
              <div className="text-red-500 text-sm mb-3 p-2 bg-red-500/10 rounded-lg">
                Failed to load playlist content. Showing cached songs.
              </div>
            )}
            
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {songsToDisplay.length > 0 ? (
                songsToDisplay.map((song, index) => (
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
                ))
              ) : (
                <div className="text-center text-muted-dark py-4">
                  <Music className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No songs in this playlist</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}