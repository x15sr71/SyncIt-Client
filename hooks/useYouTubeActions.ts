import { useState } from "react";
import apiClient from "../utils/api";

interface UseYouTubeActionsProps {
  onPlaylistRenamed?: (playlistId: string, newName: string) => void;
  onPlaylistDeleted?: (playlistId: string) => void;
  refreshPlaylists?: () => Promise<void>;
  showToast?: (message: string, type: "success" | "error") => void;
}

export default function useYouTubeActions(props?: UseYouTubeActionsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const renamePlaylist = async (playlistId: string, newName: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.post<{ success: boolean; message?: string }>(
        "/youtube/rename-playlist",
        { playlistId, newName },
      );

      console.log("Rename playlist response:", res.data);

      if (!res.data.success) {
        const errorMessage = res.data.message || "Rename failed.";
        props?.showToast?.(errorMessage, "error");
        throw new Error(errorMessage);
      }

      props?.onPlaylistRenamed?.(playlistId, newName);
      props?.showToast?.("Playlist renamed successfully!", "success");

      return res.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to rename playlist.";
      setError(errorMessage);
      props?.showToast?.(errorMessage, "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePlaylist = async (playlistId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.post<{ success: boolean; message?: string }>(
        "/youtube/delete-playlist",
        { playlistId },
      );

      props?.onPlaylistDeleted?.(playlistId);
      await props?.refreshPlaylists?.();

      return res.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to delete playlist.";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /** DELETE /emptyYouTubePlaylist — removes every item, keeps the playlist. */
  const emptyPlaylist = async (playlistId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.delete<{
        success: boolean;
        message?: string;
      }>("/emptyYouTubePlaylist", { data: { playlistId } });

      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to empty playlist.");
      }

      await props?.refreshPlaylists?.();
      props?.showToast?.("Playlist emptied successfully!", "success");
      return res.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to empty playlist.";
      setError(errorMessage);
      props?.showToast?.(errorMessage, "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSongFromPlaylist = async (
    playlistId: string,
    videoId: string,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.post<{ success: boolean; message?: string }>(
        "/youtube/delete-song",
        { playlistId, videoId },
      );
      console.log("Delete song response:", res.data);

      return res.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to delete song.";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    renamePlaylist,
    deletePlaylist,
    emptyPlaylist,
    deleteSongFromPlaylist,
    loading,
    error,
    clearError,
  };
}
