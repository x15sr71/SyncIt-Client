"use client";

import { useEffect, useState } from "react";
import { useDashboardState } from "@/hooks/useDashboardState";
import { useTransformedPlaylists } from "@/hooks/useTransformedPlaylists";
import { useDashboardHandlers } from "@/hooks/useDashboardHandlers";

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

import useGetSpotifyPlaylists, {
  SpotifyPlaylist,
} from "@/hooks/getSpotifyPlaylists";
import useGetYoutubePlaylists from "@/hooks/getYoutubePlaylists";
import useSpotifyActions from "@/hooks/useSpotifyActions";
import useYouTubeActions from "@/hooks/useYouTubeActions";
// import { Playlist } from "@/hooks/useTransformedPlaylists"; // If you want to use Playlist type further.

export default function DashboardPage() {
  const dashboard = useDashboardState();

  // Playlist fetches
  const { fetchPlaylists, spotifyPlaylists } = useGetSpotifyPlaylists();
  const [localSpotifyPlaylists, setLocalSpotifyPlaylists] = useState<
    SpotifyPlaylist[]
  >([]);
  useEffect(() => {
    setLocalSpotifyPlaylists(spotifyPlaylists);
  }, [spotifyPlaylists]);

  const { fetchYoutubePlaylists, youtubePlaylists } = useGetYoutubePlaylists();
  const [localYoutubePlaylists, setLocalYoutubePlaylists] =
    useState(youtubePlaylists);
  useEffect(() => {
    setLocalYoutubePlaylists(youtubePlaylists);
  }, [youtubePlaylists]);

  // showToast wrapper (do NOT pass setShowToast directly!)
  function showToast(message: string, type: "success" | "error") {
    dashboard.setShowToast({ message, type, isVisible: true });
    setTimeout(() => dashboard.setShowToast(null), 5000);
  }

  // ACTION HOOKS with wrapper
  const {
    renamePlaylist: renameSpotifyPlaylist,
    deletePlaylist: deleteSpotifyPlaylist,
    deleteSongFromPlaylist: deleteSpotifySong,
  } = useSpotifyActions({
    onPlaylistRenamed: (playlistId, newName) => {
      setLocalSpotifyPlaylists((prev) =>
        prev.map((p: SpotifyPlaylist) =>
          p.id === playlistId ? { ...p, name: newName } : p
        )
      );
      dashboard.setSelectedPlaylists((prev) => {
        const updated = { ...prev };
        delete updated[playlistId];
        return updated;
      });
    },
    onPlaylistDeleted: (playlistId) => {
      setLocalSpotifyPlaylists((prev) =>
        prev.filter((p: SpotifyPlaylist) => p.id !== playlistId)
      );
      dashboard.setSelectedPlaylists((prev) => {
        const updated = { ...prev };
        delete updated[playlistId];
        return updated;
      });
    },
    showToast,
  });

  const {
    renamePlaylist: renameYouTubePlaylist,
    deletePlaylist: deleteYouTubePlaylist,
    deleteSongFromPlaylist: deleteYouTubeSong,
  } = useYouTubeActions({
    onPlaylistRenamed: (playlistId, newName) => {
      setLocalYoutubePlaylists((prev) =>
        prev.map((p: any) =>
          p.id === playlistId
            ? { ...p, snippet: { ...p.snippet, title: newName } }
            : p
        )
      );
      dashboard.setSelectedPlaylists((prev) => {
        const updated = { ...prev };
        delete updated[playlistId];
        return updated;
      });
    },
    onPlaylistDeleted: (playlistId) => {
      setLocalYoutubePlaylists((prev) =>
        prev.filter((p: any) => p.id !== playlistId)
      );
      dashboard.setSelectedPlaylists((prev) => {
        const updated = { ...prev };
        delete updated[playlistId];
        return updated;
      });
    },
    refreshPlaylists: async () => {
      await fetchYoutubePlaylists();
    },
    showToast,
  });

  useEffect(() => {
    fetchPlaylists();
    fetchYoutubePlaylists();
  }, []);

  // Transform playlists (TIped)
  const { transformedSpotifyPlaylists, transformedYoutubePlaylists } =
    useTransformedPlaylists(localSpotifyPlaylists, localYoutubePlaylists);

  const sourcePlaylists =
    dashboard.selectedSource === "spotify"
      ? transformedSpotifyPlaylists
      : transformedYoutubePlaylists;
  const targetPlaylists =
    dashboard.selectedTarget === "spotify"
      ? transformedSpotifyPlaylists
      : transformedYoutubePlaylists;

  const selectedPlaylistData = sourcePlaylists.find(
    (p) => p.id === dashboard.selectedPlaylistForMigration
  );

  // Handlers with all dependencies injected
  const handlers = useDashboardHandlers({
    ...dashboard,
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
  });

  // Migration callback handlers
  const handleMigrationStart = () => {
    console.log("Dashboard: Migration started");
    dashboard.setIsMigrating(true);
    showToast("Migration started...", "success");
  };

  const handleMigrationComplete = (results: any) => {
    console.log("Dashboard: Migration completed", results);
    
    // Update migration results in dashboard state
    dashboard.setMigrationResults({
      successCount: results.successCount || 0,
      failedTracks: results.failedTracks || [],
      playlistName: results.playlistName || "Unknown Playlist",
    });
    
    // Stop migration loading state
    dashboard.setIsMigrating(false);
    
    // Show success toast
    showToast("Migration completed successfully!", "success");
    
    // Show migration results dialog
    dashboard.setShowMigrationResult(true);
  };

  const handleMigrationError = (error: string) => {
    console.log("Dashboard: Migration failed", error);
    
    // Stop migration loading state
    dashboard.setIsMigrating(false);
    
    // Show error toast
    showToast(`Migration failed: ${error}`, "error");
  };

  const migrationPlaylists = Object.keys(dashboard.selectedPlaylists)
    .filter((id) => dashboard.selectedPlaylists[id])
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
    .filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <div className="min-h-screen w-full gradient-background-subdued overflow-x-hidden">
      <DashboardHeader
        darkMode={dashboard.darkMode}
        setDarkMode={dashboard.setDarkMode}
        isMobileMenuOpen={dashboard.isMobileMenuOpen}
        setIsMobileMenuOpen={dashboard.setIsMobileMenuOpen}
      />
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-w-0">
        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8 w-full min-w-0">
          <div className="lg:col-span-3 space-y-6 w-full min-w-0">
            <ConnectedAccounts />
            <PlaylistSelection
              selectedSource={dashboard.selectedSource}
              setSelectedSource={dashboard.setSelectedSource}
              selectedTarget={dashboard.selectedTarget}
              setSelectedTarget={dashboard.setSelectedTarget}
            />
            <PlaylistsDisplay
              selectedSource={dashboard.selectedSource}
              selectedTarget={dashboard.selectedTarget}
              sourcePlaylists={sourcePlaylists}
              targetPlaylists={targetPlaylists}
              selectedPlaylists={dashboard.selectedPlaylists}
              togglePlaylist={handlers.togglePlaylist}
              handleRenamePlaylist={handlers.handleRenamePlaylist}
              handleEmptyPlaylist={handlers.handleEmptyPlaylist}
              handleDeletePlaylist={handlers.handleDeletePlaylist}
              handleDeleteSongFromPlaylist={
                handlers.handleDeleteSongFromPlaylistWithAnimation
              }
            />
            <div className="flex justify-center min-w-0">
              <MigrationAction 
                selectedPlaylists={dashboard.selectedPlaylists}
                sourcePlaylists={sourcePlaylists}
                onMigrationStart={handleMigrationStart}
                onMigrationComplete={handleMigrationComplete}
                onMigrationError={handleMigrationError}
              />
            </div>
          </div>
          <div className="space-y-6 w-full min-w-0">
            <RecentSyncs />
            <QuickStats />
          </div>
        </div>
      </main>
      <MigrationConfirmationDialog
        isOpen={dashboard.showMigrationDialog}
        onClose={() => dashboard.setShowMigrationDialog(false)}
        onConfirm={handlers.handleMigrationConfirm}
        originalPlaylistName={selectedPlaylistData?.name || ""}
        sourcePlatform={dashboard.selectedSource}
        destinationPlatform={dashboard.selectedTarget}
        trackCount={selectedPlaylistData?.songCount || 0}
        selectedPlaylists={Object.keys(dashboard.selectedPlaylists)
          .filter((id) => dashboard.selectedPlaylists[id])
          .map((id) => sourcePlaylists.find((p) => p.id === id))
          .filter((p): p is NonNullable<typeof p> => !!p)
          .map((p) => ({ id: p.id, name: p.name, songCount: p.songCount }))}
        selectedPlaylistCount={
          Object.keys(dashboard.selectedPlaylists).filter(
            (id) => dashboard.selectedPlaylists[id]
          ).length
        }
      />
      <MigrationLoadingCard
        isVisible={dashboard.isMigrating}
        sourcePlatform={dashboard.selectedSource}
        targetPlatform={dashboard.selectedTarget}
        playlists={migrationPlaylists}
        onComplete={handlers.handleMigrationComplete}
      />
      <MigrationResultCard
        isVisible={dashboard.showMigrationResult}
        onClose={() => {
          dashboard.setShowMigrationResult(false);
          dashboard.setSelectedPlaylists({});
        }}
        successCount={dashboard.migrationResults.successCount}
        failedTracks={dashboard.migrationResults.failedTracks}
        playlistName={dashboard.migrationResults.playlistName}
        onRetryFailed={() => {
          dashboard.setShowMigrationResult(false);
          dashboard.setIsMigrating(true);
        }}
        onManualMigrate={(trackId) => {}}
        onRevertMigration={() => {
          dashboard.setShowMigrationResult(false);
          dashboard.setSelectedPlaylists({});
        }}
        onKeepInSync={handlers.handleKeepInSync}
      />
      <SyncPreferencesDialog
        isOpen={dashboard.showSyncPreferences}
        onClose={() => dashboard.setShowSyncPreferences(false)}
        onConfirm={handlers.handleSyncPreferencesConfirm}
        playlistName={dashboard.migrationResults.playlistName}
      />
      <ConfirmationDialog
        isOpen={dashboard.confirmationDialog.isOpen}
        onClose={() =>
          dashboard.setConfirmationDialog((prev) => ({
            ...prev,
            isOpen: false,
          }))
        }
        onConfirm={dashboard.confirmationDialog.onConfirm}
        title={dashboard.confirmationDialog.title}
        message={dashboard.confirmationDialog.message}
        confirmText={dashboard.confirmationDialog.confirmText}
        confirmVariant={dashboard.confirmationDialog.confirmVariant}
      />
      <RenamePlaylistDialog
        isOpen={dashboard.renameDialog.isOpen}
        onClose={() =>
          dashboard.setRenameDialog((prev) => ({ ...prev, isOpen: false }))
        }
        playlistId={dashboard.renameDialog.playlistId}
        currentName={dashboard.renameDialog.currentName}
        onRename={handlers.handleRenameConfirm}
      />
      <DeletePlaylistDialog
        isOpen={dashboard.deleteDialog.isOpen}
        onClose={() =>
          dashboard.setDeleteDialog((prev) => ({ ...prev, isOpen: false }))
        }
        playlistId={dashboard.deleteDialog.playlistId}
        playlistName={dashboard.deleteDialog.playlistName}
        onDelete={handlers.handleDeleteConfirm}
      />
      <EmptyPlaylistDialog
        isOpen={dashboard.emptyDialog.isOpen}
        onClose={() =>
          dashboard.setEmptyDialog((prev) => ({ ...prev, isOpen: false }))
        }
        playlistId={dashboard.emptyDialog.playlistId}
        playlistName={dashboard.emptyDialog.playlistName}
        songCount={dashboard.emptyDialog.songCount}
        onEmpty={handlers.handleEmptyConfirm}
      />
      <ConfirmationDialog
        isOpen={dashboard.deleteSongDialog.isOpen}
        onClose={() =>
          dashboard.setDeleteSongDialog((prev) => ({ ...prev, isOpen: false }))
        }
        onConfirm={() => {
          if (
            dashboard.deleteSongDialog.platform === "spotify" ||
            dashboard.deleteSongDialog.platform === "youtube"
          ) {
            handlers.handleDeleteSongConfirm(
              dashboard.deleteSongDialog.playlistId,
              dashboard.deleteSongDialog.songId,
              dashboard.deleteSongDialog.platform
            );
          }
        }}
        title="Remove Song"
        message={`Are you sure you want to remove "${dashboard.deleteSongDialog.songTitle}" from "${dashboard.deleteSongDialog.playlistName}"? This action cannot be undone.`}
        confirmText="Remove Song"
        confirmVariant="destructive"
      />
      {dashboard.showToast && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform ${
            dashboard.showToast.isVisible
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0"
          } ${
            dashboard.showToast.type === "success"
              ? "bg-green-600 text-white border border-green-500"
              : "bg-red-600 text-white border border-red-500"
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">
              {dashboard.showToast.message}
            </span>
            <button
              onClick={() => dashboard.setShowToast(null)}
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