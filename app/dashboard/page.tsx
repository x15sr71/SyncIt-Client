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
import useMe from "@/hooks/useMe";
import useAutoSync, { FREQUENCY_TO_MINUTES } from "@/hooks/useAutoSync";
import apiClient, { backendUrl } from "@/utils/api";
import { useRouter } from "next/navigation";
import useGetYoutubePlaylists from "@/hooks/getYoutubePlaylists";
import useSpotifyActions from "@/hooks/useSpotifyActions";
import useYouTubeActions from "@/hooks/useYouTubeActions";
// import { Playlist } from "@/hooks/useTransformedPlaylists"; // If you want to use Playlist type further.

export default function DashboardPage() {
  const dashboard = useDashboardState();
  const router = useRouter();

  // Session, connection status and sync stats from GET /me
  const { me, unauthenticated, refetch: refetchMe } = useMe();
  const { enableAutoSync } = useAutoSync();

  useEffect(() => {
    if (unauthenticated) {
      router.push("/auth");
    }
  }, [unauthenticated, router]);

  const handleConnectPlatform = (platform: "spotify" | "youtube") => {
    const redirectAfter = encodeURIComponent("/dashboard");
    window.location.href = backendUrl(
      `/${platform}/login?redirect_after=${redirectAfter}`,
    );
  };

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // best-effort — clear the client either way
    }
    router.push("/auth");
  };

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
          p.id === playlistId ? { ...p, name: newName } : p,
        ),
      );
      dashboard.setSelectedPlaylists((prev) => {
        const updated = { ...prev };
        delete updated[playlistId];
        return updated;
      });
    },
    onPlaylistDeleted: (playlistId) => {
      setLocalSpotifyPlaylists((prev) =>
        prev.filter((p: SpotifyPlaylist) => p.id !== playlistId),
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
    emptyPlaylist: emptyYouTubePlaylist,
    deleteSongFromPlaylist: deleteYouTubeSong,
  } = useYouTubeActions({
    onPlaylistRenamed: (playlistId, newName) => {
      setLocalYoutubePlaylists((prev) =>
        prev.map((p: any) =>
          p.id === playlistId
            ? { ...p, snippet: { ...p.snippet, title: newName } }
            : p,
        ),
      );
      dashboard.setSelectedPlaylists((prev) => {
        const updated = { ...prev };
        delete updated[playlistId];
        return updated;
      });
    },
    onPlaylistDeleted: (playlistId) => {
      setLocalYoutubePlaylists((prev) =>
        prev.filter((p: any) => p.id !== playlistId),
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
    (p) => p.id === dashboard.selectedPlaylistForMigration,
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
    emptyYouTubePlaylist,
    deleteSpotifySong,
    deleteYouTubeSong,
    fetchPlaylists,
    fetchYoutubePlaylists,
    showToast,
  });

  // Migration callback handlers
  const handleMigrationStart = () => {
    // Record which playlist this run is for. `selectedPlaylistForMigration`
    // had exactly one writer — `handlers.handleStartMigration`, which nothing
    // ever calls, because MigrationAction drives the migration directly. That
    // left the id empty forever, so "Keep in Sync" could only ever report
    // "Could not determine which playlist to keep in sync" and auto-sync was
    // unreachable from the UI despite being fully built on both sides.
    const firstSelectedId = Object.keys(dashboard.selectedPlaylists).find(
      (id) => dashboard.selectedPlaylists[id],
    );
    if (firstSelectedId) {
      dashboard.setSelectedPlaylistForMigration(firstSelectedId);
    }

    dashboard.setIsMigrating(true);
    showToast("Migration started...", "success");
  };

  const handleMigrationComplete = (results: any) => {
    const successCount = results.successCount || 0;
    const failedTracks = results.failedTracks || [];

    dashboard.setMigrationResults({
      successCount,
      failedTracks,
      playlistName: results.playlistName || "Unknown Playlist",
    });

    dashboard.setIsMigrating(false);

    // The request can return 200 having added nothing (e.g. every track failed
    // to match upstream). Reporting that as success is what previously told a
    // user their playlist had migrated when zero tracks reached Spotify.
    // Deliberately generic: the cause is upstream/internal detail and is
    // recorded in the backend logs, not surfaced to the user.
    if (successCount === 0) {
      showToast(
        "Migration failed — no tracks could be added. Please try again later.",
        "error",
      );
    } else if (failedTracks.length > 0) {
      showToast(
        `Migration finished with issues — ${successCount} added, ${failedTracks.length} could not be matched.`,
        "error",
      );
    } else {
      showToast(
        `Migration complete — ${successCount} tracks added.`,
        "success",
      );
    }

    dashboard.setShowMigrationResult(true);

    // Refresh /me so stats and recent syncs reflect the new run
    refetchMe();
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
          }
        : null;
    })
    .filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <div className="min-h-screen w-full gradient-background-subdued overflow-x-hidden">
      <DashboardHeader
        isMobileMenuOpen={dashboard.isMobileMenuOpen}
        setIsMobileMenuOpen={dashboard.setIsMobileMenuOpen}
        onLogout={handleLogout}
      />
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-w-0">
        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8 w-full min-w-0">
          <div className="lg:col-span-3 space-y-6 w-full min-w-0">
            <ConnectedAccounts
              spotify={me?.connections.spotify}
              youtube={me?.connections.youtube}
              spotifyPlaylistCount={
                localSpotifyPlaylists.length > 0
                  ? localSpotifyPlaylists.length
                  : undefined
              }
              youtubePlaylistCount={
                localYoutubePlaylists.length > 0
                  ? localYoutubePlaylists.length
                  : undefined
              }
              onConnect={handleConnectPlatform}
            />
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
                sourcePlatform={dashboard.selectedSource} // Pass the source platform
                targetPlatform={dashboard.selectedTarget} // Pass the target platform
                onMigrationStart={handleMigrationStart}
                onMigrationComplete={handleMigrationComplete}
                onMigrationError={handleMigrationError}
              />
            </div>
          </div>
          <div className="space-y-6 w-full min-w-0">
            <RecentSyncs
              syncs={me?.recentSyncs}
              resolvePlaylistName={(playlistId) =>
                [
                  ...transformedSpotifyPlaylists,
                  ...transformedYoutubePlaylists,
                ].find((p) => p.id === playlistId)?.name
              }
            />
            <QuickStats
              totalSyncs={me?.stats.totalSyncs}
              tracksMigrated={me?.stats.tracksMigrated}
              successRate={me?.stats.successRate}
              activeAutoSyncs={me?.stats.activeAutoSyncs}
            />
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
            (id) => dashboard.selectedPlaylists[id],
          ).length
        }
      />
      <MigrationLoadingCard
        isVisible={dashboard.isMigrating}
        sourcePlatform={dashboard.selectedSource}
        targetPlatform={dashboard.selectedTarget}
        playlists={migrationPlaylists}
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
        onConfirm={async (frequency) => {
          // Wire "Keep in Sync" to the auto-sync backend — the dialog
          // previously only cleared local state (audit P2-11).
          const playlistId = dashboard.selectedPlaylistForMigration;
          const intervalMinutes = FREQUENCY_TO_MINUTES[frequency] ?? 60;
          if (!playlistId) {
            showToast(
              "Could not determine which playlist to keep in sync",
              "error",
            );
            return;
          }
          try {
            await enableAutoSync({
              playlistId,
              sourcePlatform: dashboard.selectedSource,
              destinationPlatform: dashboard.selectedTarget,
              intervalMinutes,
            });
            showToast(
              `Auto-sync enabled (every ${intervalMinutes >= 1440 ? "24 hours" : intervalMinutes >= 180 ? "3 hours" : "hour"})`,
              "success",
            );
            refetchMe();
          } catch (err: any) {
            showToast(err?.message || "Failed to enable auto-sync", "error");
          }
          handlers.handleSyncPreferencesConfirm();
        }}
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
              dashboard.deleteSongDialog.platform,
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
