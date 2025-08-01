"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronDown,
  ChevronRight,
  Music,
  Clock,
  User,
  Trash2,
  Loader2,
} from "lucide-react";
import { PlaylistActionMenu } from "./playlist-action-menu";
import useGetSpotifyPlaylistContent from "../hooks/getSpotifyContent";
import useGetYoutubePlaylistContent from "../hooks/getYoutubeContent";

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  image_url?: string;
}

export interface Playlist {
  id: string;
  name: string;
  songCount: number;
  imageUrl: string;
  songs: Song[];
  description?: string;
  isPublic?: boolean;
  source?: "spotify" | "youtube";
  platform: "spotify" | "youtube";  
}

interface PlaylistPreviewProps {
  playlist: Playlist;
  isSelected: boolean;
  onToggle: (id: string) => void;
  showCheckbox?: boolean;
  onRename?: (id: string) => void;
  onEmpty?: (id: string) => void;
  onDelete?: (id: string) => void;
  platform?: "spotify" | "youtube";
  onDeleteSong?: (playlistId: string, songId: string, songTitle: string, platform: "spotify" | "youtube") => void;
  // Add prop to handle song deletion with animation
  onDeleteSongWithAnimation?: (playlistId: string, songId: string, songTitle: string, platform: "spotify" | "youtube", animateRemoval: (songId: string) => Promise<void>) => void;
}

const formatDuration = (msOrIso: number | string): string => {
  if (typeof msOrIso === "string") {
    return "–:––";
  }
  const minutes = Math.floor(msOrIso / 60000);
  const seconds = Math.floor((msOrIso % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export function PlaylistPreview({
  playlist,
  isSelected,
  onToggle,
  showCheckbox = true,
  onRename,
  onEmpty,
  onDelete,
  onDeleteSong,
  onDeleteSongWithAnimation
}: PlaylistPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loadedSongs, setLoadedSongs] = useState<Song[]>([]);
  const [hasLoadedContent, setHasLoadedContent] = useState(false);
  const [removingSongs, setRemovingSongs] = useState<Set<string>>(new Set());

  const {
    fetchPlaylistContent: fetchSpotifyContent,
    loading: loadingSpotify,
    error: errorSpotify,
  } = useGetSpotifyPlaylistContent();

  const {
    fetchPlaylistContent: fetchYoutubeContent,
    loading: loadingYoutube,
    error: errorYoutube,
  } = useGetYoutubePlaylistContent();

  const loading = playlist.platform === "youtube" ? loadingYoutube : loadingSpotify;
  const error = playlist.platform === "youtube" ? errorYoutube : errorSpotify;

  const handleExpand = async () => {
    if (!isExpanded && !hasLoadedContent) {
      try {
        if (playlist.platform === "youtube") {
          const response = await fetchYoutubeContent([playlist.id]);
          if (!response.success) throw new Error(response.error);
          const youtubeTracks = response.data?.[playlist.id] || [];
          const transformed: Song[] = youtubeTracks.map((track) => ({
            id: track.videoId,
            duration: track.duration,
            title: track.title,
            artist: track.channelTitle,
            image_url: track.thumbnail,
          }));
          setLoadedSongs(transformed);
        } else {
          const response = await fetchSpotifyContent([playlist.id]);
          if (!response.success) throw new Error(response.error);
          const spotifyTracks = response.data?.[playlist.id] || [];
          const transformed: Song[] = spotifyTracks.map((track) => ({
            id: track.id,
            title: track.name,
            artist: track.artists.join(", "),
            duration: formatDuration(track.duration_ms),
            image_url: track.image_url,
          }));
          setLoadedSongs(transformed);
        }
        setHasLoadedContent(true);
      } catch (err: any) {
        console.error("Failed to load playlist content:", err);
        setLoadedSongs(playlist.songs);
      }
    }
    setIsExpanded(!isExpanded);
  };

  // Animation function that can be passed to parent
  const animateRemoval = async (songId: string) => {
    setRemovingSongs(prev => new Set([...prev, songId]));
    await new Promise(resolve => setTimeout(resolve, 900)); // Wait for full animation
    setLoadedSongs(prev => prev.filter(song => song.id !== songId));
    setRemovingSongs(prev => {
      const newSet = new Set(prev);
      newSet.delete(songId);
      return newSet;
    });
  };

  // This function opens the confirmation dialog and passes the animation function
  const handleRemoveSong = (songId: string, songTitle: string) => {
    if (onDeleteSongWithAnimation) {
      // Use the new prop that handles both dialog and animation
      onDeleteSongWithAnimation(playlist.id, songId, songTitle, playlist.platform, animateRemoval);
    } else if (onDeleteSong) {
      // Fallback to old behavior (just opens dialog, no animation)
      onDeleteSong(playlist.id, songId, songTitle, playlist.platform);
    }
  };

  const songsToDisplay = hasLoadedContent ? loadedSongs : playlist.songs;

  return (
    <Card
      className={`glass-card border-white/40 hover-lift transition-all duration-300 ${
        isSelected ? "ring-2 ring-purple-500/50" : ""
      }`}
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
              <CardTitle className="text-primary-dark text-base font-semibold">
                {playlist.name}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-secondary-dark">
                <Music className="w-3 h-3" />
                <span>
                  {hasLoadedContent ? loadedSongs.length : playlist.songCount} songs
                </span>
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
              aria-label={`${isExpanded ? "Collapse" : "Expand"} ${playlist.name}`}
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
                songsToDisplay.map((song) => {
                  const isRemoving = removingSongs.has(song.id);
                  return (
                    <div
                      key={song.id}
                      className={`flex items-center justify-between p-2 rounded-lg hover:bg-white/10 transition-all duration-300 group ${
                        isRemoving 
                          ? 'animate-pulse bg-red-500/20 border border-red-500/50 transform' 
                          : ''
                      }`}
                      style={{
                        animation: isRemoving 
                          ? 'shake 0.6s ease-in-out, fadeOutScale 0.3s ease-in-out 0.3s forwards' 
                          : undefined
                      }}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {song.image_url ? (
                          <img
                            src={song.image_url}
                            alt={song.title}
                            className={`w-10 h-10 rounded-md object-cover transition-all duration-300 ${
                              isRemoving ? 'grayscale opacity-50' : ''
                            }`}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "/placeholder-song.svg";
                            }}
                          />
                        ) : (
                          <img
                            src="/placeholder-song.svg"
                            alt="no album art"
                            className={`w-10 h-10 rounded-md object-cover opacity-50 transition-all duration-300 ${
                              isRemoving ? 'grayscale opacity-25' : ''
                            }`}
                          />
                        )}
                        <div className="min-w-0">
                          <p className={`text-sm font-medium text-primary-dark truncate transition-all duration-300 ${
                            isRemoving ? 'text-red-400 line-through' : ''
                          }`}>
                            {song.title}
                          </p>
                          <p className={`text-xs text-secondary-dark truncate transition-all duration-300 ${
                            isRemoving ? 'text-red-300/70 line-through' : ''
                          }`}>
                            {song.artist}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-xs text-muted-dark transition-all duration-300 ${
                          isRemoving ? 'text-red-300/70 line-through' : ''
                        }`}>
                          {song.duration}
                        </span>
                        {(onDeleteSong || onDeleteSongWithAnimation) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveSong(song.id, song.title);
                            }}
                            disabled={isRemoving}
                            className={`opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-lg p-1 transition-all ${
                              isRemoving 
                                ? 'opacity-100 bg-red-500/20 text-red-400 cursor-not-allowed animate-spin' 
                                : ''
                            }`}
                            aria-label={`Remove ${song.title} from playlist`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
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

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
          20%, 40%, 60%, 80% { transform: translateX(3px); }
        }

        @keyframes fadeOutScale {
          0% { opacity: 1; transform: scale(1) translateY(0); max-height: 64px; margin-bottom: 8px; }
          50% { opacity: 0.5; transform: scale(0.95) translateY(-2px); }
          100% { opacity: 0; transform: scale(0.8) translateY(-10px); max-height: 0; margin-bottom: 0; padding-top: 0; padding-bottom: 0; }
        }

        @keyframes pulseRed {
          0%, 100% { background-color: rgba(239, 68, 68, 0.1); }
          50% { background-color: rgba(239, 68, 68, 0.3); }
        }
      `}</style>
    </Card>
  );
}