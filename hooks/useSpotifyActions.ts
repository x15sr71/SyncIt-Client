import { useState } from "react";
import apiClient from "../utils/api";

interface UseSpotifyActionsProps {
  onPlaylistRenamed?: (playlistId: string, newName: string) => void;
  onPlaylistDeleted?: (playlistId: string) => void;
  refreshPlaylists?: () => Promise<void>;
  showToast?: (message: string, type: 'success' | 'error') => void;
}

export default function useSpotifyActions(props?: UseSpotifyActionsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const renamePlaylist = async (playlistId: string, newName: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Attempting to rename playlist ${playlistId} to "${newName}"`);

      const res = await apiClient.post<{ success: boolean; message?: string }>(
        "/spotify/rename-playlist",
        { playlistId, newName }
      );

      console.log("Rename playlist response:", res.data);

      if (!res.data.success) {
        const errorMessage = res.data.message || "Rename operation failed on server";
        if (props?.showToast) {
          props.showToast(errorMessage, 'error');
        }
        throw new Error(errorMessage);
      }

      // Only update UI optimistically after successful API response
      // Do NOT call refreshPlaylists here to avoid overwriting with stale data
      if (props?.onPlaylistRenamed) {
        props.onPlaylistRenamed(playlistId, newName);
      }

      // Show success toast
      if (props?.showToast) {
        props.showToast('Playlist renamed successfully!', 'success');
      }

      console.log("Playlist renamed successfully in UI. Spotify API may take ~30 seconds to reflect changes.");

      return res.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to rename playlist.";
      setError(errorMessage);
      
      // Show error toast for network/server errors
      if (props?.showToast) {
        props.showToast(errorMessage, 'error');
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePlaylist = async (playlistId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.post("/spotify/delete-playlist", { playlistId });

      if (props?.onPlaylistDeleted) {
        props.onPlaylistDeleted(playlistId);
      }

      if (props?.refreshPlaylists) {
        await props.refreshPlaylists();
      }

      return res.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to delete playlist.";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSongFromPlaylist = async (playlistId: string, trackUri: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.post("/spotify/delete-song", {
        playlistId,
        trackUri,
      });
      return res.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to delete song from playlist.";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    renamePlaylist,
    deletePlaylist,
    deleteSongFromPlaylist,
    loading,
    error,
    clearError,
  };
}