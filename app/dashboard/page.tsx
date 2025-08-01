"use client";

import { useState, useEffect, useMemo } from "react";
import { MigrationConfirmationDialog } from "@/components/migration-confirmation-dialog";
import { MigrationLoadingCard } from "@/components/migration-loading-card";
import { MigrationResultCard } from "@/components/migration-result-card";
import { SyncPreferencesDialog } from "@/components/sync-preferences-dialog";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { RenamePlaylistDialog } from "@/components/rename-playlist-dialog";
import { DeletePlaylistDialog } from "@/components/delete-playlist-dialog";
import { EmptyPlaylistDialog } from "@/components/empty-playlist-dialog";
import ConnectedAccounts from "@/components/connectedAccounts";
import PlaylistSelection from "@/components/playlistSelection";
import PlaylistsDisplay from "@/components/playListsDisplay";
import QuickStats from "@/components/quickStats";
import RecentSyncs from "@/components/recentSyncs";
import MigrationAction from "@/components/migrationAction";
import DashboardHeader from "@/components/dasboardHeader";
import useGetSpotifyPlaylists from "@/hooks/getSpotifyPlaylists";
import useGetYoutubePlaylists from "@/hooks/getYoutubePlaylists";
import useSpotifyActions from "@/hooks/useSpotifyActions";
import useYouTubeActions from "@/hooks/useYouTubeActions";
import { SpotifyPlaylist } from "@/hooks/getSpotifyPlaylists";

interface Playlist {
  id: string;
  name: string;
  songCount: number;
  imageUrl: string;
  description: string;
  isPublic: boolean;
  songs: any[];
  platform: "spotify" | "youtube";
}

export default function DashboardPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [selectedSource, setSelectedSource] = useState<"spotify" | "youtube">("spotify");
  const [selectedTarget, setSelectedTarget] = useState<"spotify" | "youtube">("youtube");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedPlaylists, setSelectedPlaylists] = useState<{ [key: string]: boolean }>({});
  const [showMigrationDialog, setShowMigrationDialog] = useState(false);
  const [selectedPlaylistForMigration, setSelectedPlaylistForMigration] = useState<string>("");
  const [isMigrating, setIsMigrating] = useState(false);
  const [showMigrationResult, setShowMigrationResult] = useState(false);
  const [showSyncPreferences, setShowSyncPreferences] = useState(false);
  const [migrationResults, setMigrationResults] = useState<{
    successCount: number;
    failedTracks: any[];
    playlistName: string;
  }>({ successCount: 0, failedTracks: [], playlistName: "" });

  const [showToast, setShowToast] = useState<{
    message: string;
    type: 'success' | 'error';
    isVisible: boolean;
  } | null>(null);

const [confirmationDialog, setConfirmationDialog] = useState<{
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  confirmVariant?: "default" | "destructive";
}>({
  isOpen: false,
  title: "",
  message: "",
  onConfirm: () => {},
});

  const [renameDialog, setRenameDialog] = useState({
    isOpen: false,
    playlistId: "",
    currentName: "",
    platform: "" as "spotify" | "youtube" | "",
  });

  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    playlistId: "",
    playlistName: "",
    platform: "" as "spotify" | "youtube" | "",
  });

  const [emptyDialog, setEmptyDialog] = useState({
    isOpen: false,
    playlistId: "",
    playlistName: "",
    songCount: 0,
    platform: "" as "spotify" | "youtube" | "",
  });

  const [deleteSongDialog, setDeleteSongDialog] = useState({
    isOpen: false,
    playlistId: "",
    playlistName: "",
    songId: "",
    songTitle: "",
    platform: "" as "spotify" | "youtube" | "",
  });

  const { fetchPlaylists, spotifyPlaylists } = useGetSpotifyPlaylists();
  const [localSpotifyPlaylists, setLocalSpotifyPlaylists] = useState<SpotifyPlaylist[]>([]);

  useEffect(() => {
    setLocalSpotifyPlaylists(spotifyPlaylists);
  }, [spotifyPlaylists]);

  const { fetchYoutubePlaylists, youtubePlaylists } = useGetYoutubePlaylists();
  const [localYoutubePlaylists, setLocalYoutubePlaylists] = useState(youtubePlaylists);

  useEffect(() => {
    setLocalYoutubePlaylists(youtubePlaylists);
  }, [youtubePlaylists]);

  const showToastMessage = (message: string, type: 'success' | 'error') => {
    setShowToast({ message, type, isVisible: true });
    // Auto-hide toast after 5 seconds
    setTimeout(() => {
      setShowToast(null);
    }, 5000);
  };

  const { renamePlaylist: renameSpotifyPlaylist, deletePlaylist: deleteSpotifyPlaylist, deleteSongFromPlaylist: deleteSpotifySong } = useSpotifyActions({
    onPlaylistRenamed: (playlistId, newName) => {
      // Optimistically update the local state immediately
      setLocalSpotifyPlaylists((prev) =>
        prev.map((p) => (p.id === playlistId ? { ...p, name: newName } : p))
      );
      console.log(`UI updated: Spotify Playlist ${playlistId} renamed to "${newName}"`);
    },
    onPlaylistDeleted: (playlistId) => {
      // Remove playlist from local state immediately
      setLocalSpotifyPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
      console.log(`UI updated: Spotify Playlist ${playlistId} removed`);
      // Clear any selections for the deleted playlist
      setSelectedPlaylists((prev) => {
        const updated = { ...prev };
        delete updated[playlistId];
        return updated;
      });
    },
    showToast: showToastMessage,
  });

  const { renamePlaylist: renameYouTubePlaylist, deletePlaylist: deleteYouTubePlaylist, deleteSongFromPlaylist: deleteYouTubeSong } = useYouTubeActions({
    onPlaylistRenamed: (playlistId, newName) => {
      // Optimistically update the local state immediately
      setLocalYoutubePlaylists((prev) =>
        prev.map((p) => (p.id === playlistId ? { ...p, snippet: { ...p.snippet, title: newName } } : p))
      );
      console.log(`UI updated: YouTube Playlist ${playlistId} renamed to "${newName}"`);
    },
    onPlaylistDeleted: (playlistId) => {
      // Remove playlist from local state immediately
      setLocalYoutubePlaylists((prev) => prev.filter((p) => p.id !== playlistId));
      console.log(`UI updated: YouTube Playlist ${playlistId} removed`);
      // Clear any selections for the deleted playlist
      setSelectedPlaylists((prev) => {
        const updated = { ...prev };
        delete updated[playlistId];
        return updated;
      });
    },
    refreshPlaylists: async () => {
      await fetchYoutubePlaylists();
    },
    showToast: showToastMessage,
  });

  useEffect(() => {
    fetchPlaylists();
    fetchYoutubePlaylists();
  }, []);

  const transformedSpotifyPlaylists = useMemo(() => {
    return localSpotifyPlaylists.map((playlist) => ({
      id: playlist.id,
      name: playlist.name,
      songCount: playlist.tracks.total,
      imageUrl: playlist.images[0]?.url || "/placeholder.svg?height=50&width=50",
      description: playlist.description || "",
      isPublic: playlist.public,
      songs: [],
      platform: "spotify" as const,
    }));
  }, [localSpotifyPlaylists]);

  const transformedYoutubePlaylists: Playlist[] = useMemo(() => {
    return localYoutubePlaylists.map((playlist) => ({
      id: playlist.id,
      name: playlist.snippet.title,
      description: playlist.snippet.description || "",
      songCount: playlist.contentDetails?.itemCount || 0,
      imageUrl:
        playlist.snippet.thumbnails?.high?.url ||
        playlist.snippet.thumbnails?.medium?.url ||
        playlist.snippet.thumbnails?.default?.url ||
        "/placeholder.svg?height=50&width=50",
      isPublic: playlist.status?.privacyStatus === "public",
      songs: [],
      platform: "youtube",
    }));
  }, [localYoutubePlaylists]);

  const togglePlaylist = (id: string) => {
    setSelectedPlaylists((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleStartMigration = () => {
    const selectedPlaylistIds = Object.keys(selectedPlaylists).filter((id) => selectedPlaylists[id]);
    if (selectedPlaylistIds.length > 0) {
      setSelectedPlaylistForMigration(selectedPlaylistIds[0]);
      setShowMigrationDialog(true);
    }
  };

  const handleMigrationConfirm = (
    playlistNames: { [playlistId: string]: string },
    useOriginalNames: boolean
  ) => {
    console.log("Starting migration:", {
      playlistNames,
      useOriginalNames,
      from: selectedSource,
      to: selectedTarget,
    });
    setShowMigrationDialog(false);
    setIsMigrating(true);
  };

  const handleMigrationComplete = (results: Array<{ playlistId: string; playlistName: string; successCount: number; failedTracks: any[] }>) => {
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
  };

  const handleKeepInSync = () => {
    setShowMigrationResult(false);
    setShowSyncPreferences(true);
  };

  const handleSyncPreferencesConfirm = (frequency: string) => {
    console.log("Sync preferences set:", frequency);
    setSelectedPlaylists({});
  };

  const handleRenamePlaylist = (playlistId: string) => {
    const playlist = [...sourcePlaylists, ...targetPlaylists].find((p) => p.id === playlistId);
    if (playlist) {
      setRenameDialog({
        isOpen: true,
        playlistId,
        currentName: playlist.name,
        platform: playlist.platform,
      });
    }
  };

  const handleRenameConfirm = async (playlistId: string, newName: string) => {
    try {
      if (renameDialog.platform === "spotify") {
        await renameSpotifyPlaylist(playlistId, newName);
      } else if (renameDialog.platform === "youtube") {
        await renameYouTubePlaylist(playlistId, newName);
      }
      setRenameDialog((prev) => ({ ...prev, isOpen: false }));
      console.log(`${renameDialog.platform} playlist rename completed successfully`);
    } catch (err) {
      console.error(`Failed to rename ${renameDialog.platform} playlist:`, err);
      // The error will be handled by the respective hook, and optimistic update won't happen if API fails
    }
  };

  const handleEmptyPlaylist = (playlistId: string) => {
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
  };

  const handleEmptyConfirm = async (playlistId: string) => {
    try {
      // Note: This would require getting all songs from the playlist first, then deleting each one
      // This is a more complex operation that might need a separate API endpoint
      // For now, just logging the intent
      console.log(`Emptying ${emptyDialog.platform} playlist ${playlistId}`);
      
      // You might want to implement a bulk delete or empty playlist API endpoint
      // Or iterate through all songs and delete them one by one
      showToastMessage("Empty playlist functionality not yet implemented", "error");
      
      setEmptyDialog((prev) => ({ ...prev, isOpen: false }));
    } catch (err) {
      console.error(`Failed to empty ${emptyDialog.platform} playlist:`, err);
    }
  };

  const handleDeletePlaylist = (playlistId: string) => {
    const playlist = [...sourcePlaylists, ...targetPlaylists].find((p) => p.id === playlistId);
    if (playlist) {
      setDeleteDialog({
        isOpen: true,
        playlistId,
        playlistName: playlist.name,
        platform: playlist.platform,
      });
    }
  };

  const handleDeleteConfirm = async (playlistId: string) => {
    try {
      if (deleteDialog.platform === "spotify") {
        await deleteSpotifyPlaylist(playlistId);
      } else if (deleteDialog.platform === "youtube") {
        await deleteYouTubePlaylist(playlistId);
      }
      setDeleteDialog((prev) => ({ ...prev, isOpen: false }));
      console.log(`${deleteDialog.platform} playlist deleted successfully`);
    } catch (err) {
      console.error(`Failed to delete ${deleteDialog.platform} playlist:`, err);
      // Error handling is done by the respective hooks with toast messages
    }
  };

  const handleDeleteSongFromPlaylist = (playlistId: string, songId: string, songTitle: string, platform: "spotify" | "youtube") => {
    const playlist = [...sourcePlaylists, ...targetPlaylists].find((p) => p.id === playlistId);
    if (playlist) {
      setDeleteSongDialog({
        isOpen: true,
        playlistId,
        playlistName: playlist.name,
        songId,
        songTitle,
        platform,
      });
    }
  };

  const handleDeleteSongConfirm = async (playlistId: string, songId: string, platform: "spotify" | "youtube") => {
    try {
      if (platform === "spotify") {
        await deleteSpotifySong(playlistId, songId);
      } else if (platform === "youtube") {
        await deleteYouTubeSong(playlistId, songId);
      }
      setDeleteSongDialog((prev) => ({ ...prev, isOpen: false }));
      console.log(`Song deleted from ${platform} playlist successfully`);
    } catch (err) {
      console.error(`Failed to delete song from ${platform} playlist:`, err);
      // Error handling is done by the respective hooks with toast messages
    }
  };

  const sourcePlaylists = selectedSource === "spotify" ? transformedSpotifyPlaylists : transformedYoutubePlaylists;
  const targetPlaylists = selectedTarget === "spotify" ? transformedSpotifyPlaylists : transformedYoutubePlaylists;

  const selectedPlaylistData = sourcePlaylists.find((p) => p.id === selectedPlaylistForMigration);

  const migrationPlaylists = Object.keys(selectedPlaylists)
    .filter((id) => selectedPlaylists[id])
    .map((id) => {
      const playlist = sourcePlaylists.find((p) => p.id === id);
      return playlist
        ? {
            id: playlist.id,
            name: playlist.name,
            totalTracks: playlist.songCount,
            status: "pending" as const,
            progress: 0,
            currentStep: "Initializing",
            processedTracks: 0,
          }
        : null;
    })
    .filter(Boolean) as Array<{
    id: string;
    name: string;
    totalTracks: number;
    status: "pending" | "in-progress" | "completed" | "failed";
    progress: number;
    currentStep: string;
    processedTracks: number;
  }>;

  return (
    <div className="min-h-screen w-full gradient-background-subdued overflow-x-hidden">
      <DashboardHeader
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-w-0">
        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8 w-full min-w-0">
          <div className="lg:col-span-3 space-y-6 w-full min-w-0">
            <ConnectedAccounts />
            <PlaylistSelection
              selectedSource={selectedSource}
              setSelectedSource={setSelectedSource}
              selectedTarget={selectedTarget}
              setSelectedTarget={setSelectedTarget}
            />
            <PlaylistsDisplay
              selectedSource={selectedSource}
              selectedTarget={selectedTarget}
              sourcePlaylists={sourcePlaylists}
              targetPlaylists={targetPlaylists}
              selectedPlaylists={selectedPlaylists}
              togglePlaylist={togglePlaylist}
              handleRenamePlaylist={handleRenamePlaylist}
              handleEmptyPlaylist={handleEmptyPlaylist}
              handleDeletePlaylist={handleDeletePlaylist}
              handleDeleteSongFromPlaylist={handleDeleteSongFromPlaylist}
            />
            <div className="flex justify-center min-w-0">
              <MigrationAction handleStartMigration={handleStartMigration} selectedPlaylists={selectedPlaylists} />
            </div>
          </div>
          <div className="space-y-6 w-full min-w-0">
            <RecentSyncs />
            <QuickStats />
          </div>
        </div>
      </main>
      <MigrationConfirmationDialog
        isOpen={showMigrationDialog}
        onClose={() => setShowMigrationDialog(false)}
        onConfirm={handleMigrationConfirm}
        originalPlaylistName={selectedPlaylistData?.name || ""}
        sourcePlatform={selectedSource}
        destinationPlatform={selectedTarget}
        trackCount={selectedPlaylistData?.songCount || 0}
        selectedPlaylists={Object.keys(selectedPlaylists)
          .filter((id) => selectedPlaylists[id])
          .map((id) => sourcePlaylists.find((p) => p.id === id))
          .filter(Boolean)
          .map((p) => ({ id: p!.id, name: p!.name, songCount: p!.songCount }))}
        selectedPlaylistCount={Object.keys(selectedPlaylists).filter((id) => selectedPlaylists[id]).length}
      />
      <MigrationLoadingCard
        isVisible={isMigrating}
        sourcePlatform={selectedSource}
        targetPlatform={selectedTarget}
        playlists={migrationPlaylists}
        onComplete={handleMigrationComplete}
      />
      <MigrationResultCard
        isVisible={showMigrationResult}
        onClose={() => {
          setShowMigrationResult(false);
          setSelectedPlaylists({});
        }}
        successCount={migrationResults.successCount}
        failedTracks={migrationResults.failedTracks}
        playlistName={migrationResults.playlistName}
        onRetryFailed={() => {
          console.log("Retrying failed tracks");
          setShowMigrationResult(false);
          setIsMigrating(true);
        }}
        onManualMigrate={(trackId) => {
          console.log("Manual migrate track:", trackId);
        }}
        onRevertMigration={() => {
          console.log("Reverting migration");
          setShowMigrationResult(false);
          setSelectedPlaylists({});
        }}
        onKeepInSync={handleKeepInSync}
      />
      <SyncPreferencesDialog
        isOpen={showSyncPreferences}
        onClose={() => setShowSyncPreferences(false)}
        onConfirm={handleSyncPreferencesConfirm}
        playlistName={migrationResults.playlistName}
      />
      <ConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        onClose={() => setConfirmationDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmationDialog.onConfirm}
        title={confirmationDialog.title}
        message={confirmationDialog.message}
        confirmText={confirmationDialog.confirmText}
        confirmVariant={confirmationDialog.confirmVariant}
      />
      <RenamePlaylistDialog
        isOpen={renameDialog.isOpen}
        onClose={() => setRenameDialog((prev) => ({ ...prev, isOpen: false }))}
        playlistId={renameDialog.playlistId}
        currentName={renameDialog.currentName}
        onRename={handleRenameConfirm}
      />
      <DeletePlaylistDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog((prev) => ({ ...prev, isOpen: false }))}
        playlistId={deleteDialog.playlistId}
        playlistName={deleteDialog.playlistName}
        onDelete={handleDeleteConfirm}
      />
      <EmptyPlaylistDialog
        isOpen={emptyDialog.isOpen}
        onClose={() => setEmptyDialog((prev) => ({ ...prev, isOpen: false }))}
        playlistId={emptyDialog.playlistId}
        playlistName={emptyDialog.playlistName}
        songCount={emptyDialog.songCount}
        onEmpty={handleEmptyConfirm}
      />

      {/* Delete Song Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteSongDialog.isOpen}
        onClose={() => setDeleteSongDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={() => {
          if (deleteSongDialog.platform === "spotify" || deleteSongDialog.platform === "youtube") {
            handleDeleteSongConfirm(deleteSongDialog.playlistId, deleteSongDialog.songId, deleteSongDialog.platform);
          }
        }}
        title="Remove Song"
        message={`Are you sure you want to remove "${deleteSongDialog.songTitle}" from "${deleteSongDialog.playlistName}"? This action cannot be undone.`}
        confirmText="Remove Song"
        confirmVariant="destructive"
      />
      
      {/* Toast Notification */}
      {showToast && (
        <div 
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform ${
            showToast.isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          } ${
            showToast.type === 'success' 
              ? 'bg-green-600 text-white border border-green-500' 
              : 'bg-red-600 text-white border border-red-500'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">{showToast.message}</span>
            <button
              onClick={() => setShowToast(null)}
              className="ml-2 text-white/80 hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}