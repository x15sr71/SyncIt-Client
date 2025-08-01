import { useCallback } from "react";
import { Playlist } from "./useTransformedPlaylists";

// Type for migration results array
export type MigrationResult = {
  playlistId: string;
  playlistName: string;
  successCount: number;
  failedTracks: any[];
};

export function useDashboardHandlers(params: {
  // see destructuring below
  sourcePlaylists: Playlist[];
  targetPlaylists: Playlist[];
  showToast: (message: string, type: "success" | "error") => void;
  // ...plus all the other state & setters
  [key: string]: any;
}) {
  const {
    setSelectedPlaylists,
    setShowMigrationDialog,
    setSelectedPlaylistForMigration,
    setIsMigrating,
    setShowMigrationResult,
    setShowSyncPreferences,
    setMigrationResults,
    setRenameDialog,
    setDeleteDialog,
    setEmptyDialog,
    setDeleteSongDialog,
    setPendingSongDeletion,
    selectedPlaylists,
    renameDialog,
    deleteDialog,
    emptyDialog,
    pendingSongDeletion,
    sourcePlaylists,
    targetPlaylists,
    renameSpotifyPlaylist,
    renameYouTubePlaylist,
    deleteSpotifyPlaylist,
    deleteYouTubePlaylist,
    deleteSpotifySong,
    deleteYouTubeSong,
    fetchPlaylists,
    fetchYoutubePlaylists,
    showToast,
    // ...rest
  } = params;

  const togglePlaylist = useCallback((id: string) => {
    setSelectedPlaylists((prev: { [key: string]: boolean }) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, [setSelectedPlaylists]);

  const handleStartMigration = useCallback(() => {
    const selectedPlaylistIds = Object.keys(selectedPlaylists).filter((id) => selectedPlaylists[id]);
    if (selectedPlaylistIds.length > 0) {
      setSelectedPlaylistForMigration(selectedPlaylistIds[0]);
      setShowMigrationDialog(true);
    }
  }, [setShowMigrationDialog, setSelectedPlaylistForMigration, selectedPlaylists]);

  const handleMigrationConfirm = useCallback((
    playlistNames: { [playlistId: string]: string },
    useOriginalNames: boolean
  ) => {
    setShowMigrationDialog(false);
    setIsMigrating(true);
  }, [setShowMigrationDialog, setIsMigrating]);

  // FIXED: Explicit type for results
  const handleMigrationComplete = useCallback((results: MigrationResult[]) => {
    const result = results[0];
    if (result) {
      setIsMigrating(false);
      setMigrationResults({
        successCount: result.successCount,
        failedTracks: result.failedTracks,
        playlistName: result.playlistName,
      });
      setShowMigrationResult(true);
    }
  }, [setIsMigrating, setMigrationResults, setShowMigrationResult]);

  const handleKeepInSync = useCallback(() => {
    setShowMigrationResult(false);
    setShowSyncPreferences(true);
  }, [setShowMigrationResult, setShowSyncPreferences]);

  const handleSyncPreferencesConfirm = useCallback(() => {
    setSelectedPlaylists({});
  }, [setSelectedPlaylists]);

  const handleRenamePlaylist = useCallback((playlistId: string) => {
    const playlist = [...sourcePlaylists, ...targetPlaylists].find((p) => p.id === playlistId);
    if (playlist) {
      setRenameDialog({
        isOpen: true,
        playlistId,
        currentName: playlist.name,
        platform: playlist.platform,
      });
    }
  }, [sourcePlaylists, targetPlaylists, setRenameDialog]);

  const handleRenameConfirm = useCallback(async (playlistId: string, newName: string) => {
    try {
      if (renameDialog.platform === "spotify") {
        await renameSpotifyPlaylist(playlistId, newName);
      } else if (renameDialog.platform === "youtube") {
        await renameYouTubePlaylist(playlistId, newName);
      }
      setRenameDialog((prev: any) => ({ ...prev, isOpen: false }));
    } catch (err) { }
  }, [renameDialog, renameSpotifyPlaylist, renameYouTubePlaylist, setRenameDialog]);

  const handleEmptyPlaylist = useCallback((playlistId: string) => {
    const playlist = [...sourcePlaylists, ...targetPlaylists].find((p) => p.id === playlistId);
    if (playlist) {
      setEmptyDialog({
        isOpen: true,
        playlistId,
        playlistName: playlist.name,
        songCount: playlist.songCount,
        platform: playlist.platform,
      });
    }
  }, [sourcePlaylists, targetPlaylists, setEmptyDialog]);

  const handleEmptyConfirm = useCallback(async (_playlistId: string) => {
    setEmptyDialog((prev: any) => ({ ...prev, isOpen: false }));
    showToast("Empty playlist functionality not yet implemented", "error");
  }, [setEmptyDialog, showToast]);

  const handleDeletePlaylist = useCallback((playlistId: string) => {
    const playlist = [...sourcePlaylists, ...targetPlaylists].find((p) => p.id === playlistId);
    if (playlist) {
      setDeleteDialog({
        isOpen: true,
        playlistId,
        playlistName: playlist.name,
        platform: playlist.platform,
      });
    }
  }, [sourcePlaylists, targetPlaylists, setDeleteDialog]);

  const handleDeleteConfirm = useCallback(async (playlistId: string) => {
    try {
      if (deleteDialog.platform === "spotify") {
        await deleteSpotifyPlaylist(playlistId);
      } else if (deleteDialog.platform === "youtube") {
        await deleteYouTubePlaylist(playlistId);
      }
      setDeleteDialog((prev: any) => ({ ...prev, isOpen: false }));
    } catch (err) {}
  }, [deleteDialog, deleteSpotifyPlaylist, deleteYouTubePlaylist, setDeleteDialog]);

  const handleDeleteSongFromPlaylistWithAnimation = useCallback((
    playlistId: string,
    songId: string,
    songTitle: string,
    platform: "spotify" | "youtube",
    animateRemoval: (songId: string) => Promise<void>,
    helpers?: {
      animateOnly?: (songId: string) => Promise<void>;
      removeFromState?: (songId: string) => void;
      cancelAnimation?: (songId: string) => void;
      setAPILoading?: (loading: boolean) => void;
    }
  ) => {
    const playlist = [...sourcePlaylists, ...targetPlaylists].find((p) => p.id === playlistId);
    if (playlist) {
      setPendingSongDeletion({
        playlistId,
        songId,
        songTitle,
        platform,
        animateRemoval,
        ...helpers,
      });
      setDeleteSongDialog({
        isOpen: true,
        playlistId,
        playlistName: playlist.name,
        songId,
        songTitle,
        platform,
      });
    }
  }, [sourcePlaylists, targetPlaylists, setPendingSongDeletion, setDeleteSongDialog]);

  const handleDeleteSongConfirm = useCallback(
    async (playlistId: string, songId: string, platform: "spotify" | "youtube") => {
      if (!pendingSongDeletion || pendingSongDeletion.songId !== songId) return;
      try {
        if (pendingSongDeletion.setAPILoading) pendingSongDeletion.setAPILoading(true);
        let apiResponse: any;
        if (platform === "spotify") apiResponse = await deleteSpotifySong(playlistId, songId);
        else if (platform === "youtube") apiResponse = await deleteYouTubeSong(playlistId, songId);

        if (apiResponse && typeof apiResponse === "object") {
          if ("success" in apiResponse && !apiResponse.success) {
            throw new Error(apiResponse.message || "Failed to delete song from backend");
          }
          if ("error" in apiResponse && apiResponse.error) {
            throw new Error(apiResponse.message || apiResponse.error || "Failed to delete song from backend");
          }
        } else if (!apiResponse) {
          throw new Error("No response from server");
        }
        if (pendingSongDeletion.setAPILoading) pendingSongDeletion.setAPILoading(false);
        await pendingSongDeletion.animateRemoval(songId);
        showToast("Song removed successfully", "success");
      } catch (err: any) {
        if (pendingSongDeletion.cancelAnimation) pendingSongDeletion.cancelAnimation(songId);
        showToast(err?.message || "Failed to remove song", "error");
      } finally {
        setPendingSongDeletion(null);
        setDeleteSongDialog((prev: any) => ({ ...prev, isOpen: false }));
      }
    }, [pendingSongDeletion, deleteSpotifySong, deleteYouTubeSong, setPendingSongDeletion, setDeleteSongDialog, showToast]
  );

  return {
    togglePlaylist,
    handleStartMigration,
    handleMigrationConfirm,
    handleMigrationComplete,
    handleKeepInSync,
    handleSyncPreferencesConfirm,
    handleRenamePlaylist,
    handleRenameConfirm,
    handleEmptyPlaylist,
    handleEmptyConfirm,
    handleDeletePlaylist,
    handleDeleteConfirm,
    handleDeleteSongFromPlaylistWithAnimation,
    handleDeleteSongConfirm,
  };
}
