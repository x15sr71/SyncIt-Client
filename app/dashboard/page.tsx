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
  });

  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    playlistId: "",
    playlistName: "",
  });

  const [emptyDialog, setEmptyDialog] = useState({
    isOpen: false,
    playlistId: "",
    playlistName: "",
    songCount: 0,
  });

  const { fetchPlaylists, spotifyPlaylists } = useGetSpotifyPlaylists();
  const [localSpotifyPlaylists, setLocalSpotifyPlaylists] = useState<SpotifyPlaylist[]>([]);

  useEffect(() => {
    setLocalSpotifyPlaylists(spotifyPlaylists);
  }, [spotifyPlaylists]);

  const { fetchYoutubePlaylists, youtubePlaylists } = useGetYoutubePlaylists();

  const showToastMessage = (message: string, type: 'success' | 'error') => {
    setShowToast({ message, type, isVisible: true });
    // Auto-hide toast after 5 seconds
    setTimeout(() => {
      setShowToast(null);
    }, 5000);
  };

  const { renamePlaylist, deletePlaylist, deleteSongFromPlaylist } = useSpotifyActions({
    onPlaylistRenamed: (playlistId, newName) => {
      // Optimistically update the local state immediately
      setLocalSpotifyPlaylists((prev) =>
        prev.map((p) => (p.id === playlistId ? { ...p, name: newName } : p))
      );
      console.log(`UI updated: Playlist ${playlistId} renamed to "${newName}"`);
    },
    onPlaylistDeleted: (playlistId) => {
      // Remove playlist from local state immediately
      setLocalSpotifyPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
      console.log(`UI updated: Playlist ${playlistId} removed`);
    },
    showToast: showToastMessage,
    // Note: We removed refreshPlaylists from here to avoid overwriting optimistic updates
    // The hook will no longer call fetchPlaylists() after successful operations
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

  const transformedYoutubePlaylists: Playlist[] = youtubePlaylists.map((playlist) => ({
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
      });
    }
  };

  const handleRenameConfirm = async (playlistId: string, newName: string) => {
    try {
      await renamePlaylist(playlistId, newName);
      setRenameDialog((prev) => ({ ...prev, isOpen: false }));
      console.log("Playlist rename completed successfully");
    } catch (err) {
      console.error("Failed to rename playlist:", err);
      // The error will be handled by the hook, and optimistic update won't happen if API fails
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
      });
    }
  };

  const handleEmptyConfirm = (playlistId: string) => {
    console.log(`Emptying playlist ${playlistId}`);
  };

  const handleDeletePlaylist = (playlistId: string) => {
    const playlist = [...sourcePlaylists, ...targetPlaylists].find((p) => p.id === playlistId);
    if (playlist) {
      setDeleteDialog({
        isOpen: true,
        playlistId,
        playlistName: playlist.name,
      });
    }
  };

  const handleDeleteConfirm = (playlistId: string) => {
    console.log(`Deleting playlist ${playlistId}`);
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