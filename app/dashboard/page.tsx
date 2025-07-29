"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Music, Settings, User, Moon, Sun, Menu, X,
} from "lucide-react";
import Link from "next/link";
import { SyncStatus } from "@/components/sync-status";
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

// Sample data (unchanged)
const samplePlaylists = {
  spotify: [
    {
      id: "spotify-1",
      name: "My Favorites",
      songCount: 42,
      imageUrl: "/placeholder.svg?height=50&width=50",
      description: "My all-time favorite tracks",
      isPublic: true,
      songs: [
        {
          id: "1",
          title: "Blinding Lights",
          artist: "The Weeknd",
          duration: "3:20",
        },
        {
          id: "2",
          title: "Watermelon Sugar",
          artist: "Harry Styles",
          duration: "2:54",
        },
        { id: "3", title: "Levitating", artist: "Dua Lipa", duration: "3:23" },
        {
          id: "4",
          title: "Good 4 U",
          artist: "Olivia Rodrigo",
          duration: "2:58",
        },
        {
          id: "5",
          title: "Stay",
          artist: "The Kid LAROI & Justin Bieber",
          duration: "2:21",
        },
      ],
    },
    {
      id: "spotify-2",
      name: "Workout Mix",
      songCount: 28,
      imageUrl: "/placeholder.svg?height=50&width=50",
      description: "High energy tracks for workouts",
      isPublic: false,
      songs: [
        {
          id: "6",
          title: "Thunder",
          artist: "Imagine Dragons",
          duration: "3:07",
        },
        { id: "7", title: "Stronger", artist: "Kanye West", duration: "5:11" },
        {
          id: "8",
          title: "Till I Collapse",
          artist: "Eminem",
          duration: "4:57",
        },
      ],
    },
    {
      id: "spotify-3",
      name: "Chill Vibes",
      songCount: 35,
      imageUrl: "/placeholder.svg?height=50&width=50",
      description: "Relaxing tunes for unwinding",
      isPublic: true,
      songs: [
        {
          id: "9",
          title: "Sunflower",
          artist: "Post Malone & Swae Lee",
          duration: "2:38",
        },
        { id: "10", title: "Perfect", artist: "Ed Sheeran", duration: "4:23" },
        {
          id: "11",
          title: "Someone You Loved",
          artist: "Lewis Capaldi",
          duration: "3:02",
        },
      ],
    },
    {
      id: "spotify-4",
      name: "Ultimate Hits Collection",
      songCount: 150,
      imageUrl: "/placeholder.svg?height=50&width=50",
      description: "The biggest hits of all time",
      isPublic: true,
      songs: [
        {
          id: "12",
          title: "Hotel California",
          artist: "Eagles",
          duration: "6:30",
        },
        {
          id: "13",
          title: "Stairway to Heaven",
          artist: "Led Zeppelin",
          duration: "8:02",
        },
      ],
    },
  ],
  youtube: [
    {
      id: "youtube-1",
      name: "Discover Weekly",
      songCount: 30,
      imageUrl: "/placeholder.svg?height=50&width=50",
      description: "Your weekly music discovery",
      isPublic: false,
      songs: [
        {
          id: "12",
          title: "Heat Waves",
          artist: "Glass Animals",
          duration: "3:58",
        },
        {
          id: "13",
          title: "Industry Baby",
          artist: "Lil Nas X & Jack Harlow",
          duration: "3:32",
        },
        {
          id: "14",
          title: "Bad Habits",
          artist: "Ed Sheeran",
          duration: "3:51",
        },
      ],
    },
    {
      id: "youtube-2",
      name: "Road Trip Classics",
      songCount: 67,
      imageUrl: "/placeholder.svg?height=50&width=50",
      description: "Perfect songs for long drives",
      isPublic: true,
      songs: [
        {
          id: "15",
          title: "Don't Stop Believin'",
          artist: "Journey",
          duration: "4:10",
        },
        {
          id: "16",
          title: "Bohemian Rhapsody",
          artist: "Queen",
          duration: "5:55",
        },
        {
          id: "17",
          title: "Sweet Child O' Mine",
          artist: "Guns N' Roses",
          duration: "5:03",
        },
      ],
    },
  ],
};

export default function DashboardPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [selectedSource, setSelectedSource] = useState<"spotify" | "youtube">(
    "spotify"
  );
  const [selectedTarget, setSelectedTarget] = useState<"spotify" | "youtube">(
    "youtube"
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedPlaylists, setSelectedPlaylists] = useState<{
    [key: string]: boolean;
  }>({});
  const [showMigrationDialog, setShowMigrationDialog] = useState(false);
  const [selectedPlaylistForMigration, setSelectedPlaylistForMigration] =
    useState<string>("");
  const [isMigrating, setIsMigrating] = useState(false);
  const [showMigrationResult, setShowMigrationResult] = useState(false);
  const [showSyncPreferences, setShowSyncPreferences] = useState(false);
  const [migrationResults, setMigrationResults] = useState<{
    successCount: number;
    failedTracks: any[];
    playlistName: string;
  }>({ successCount: 0, failedTracks: [], playlistName: "" });

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

  const [renameDialog, setRenameDialog] = useState<{
    isOpen: boolean;
    playlistId: string;
    currentName: string;
  }>({
    isOpen: false,
    playlistId: "",
    currentName: "",
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    playlistId: string;
    playlistName: string;
  }>({
    isOpen: false,
    playlistId: "",
    playlistName: "",
  });

  const [emptyDialog, setEmptyDialog] = useState<{
    isOpen: boolean;
    playlistId: string;
    playlistName: string;
    songCount: number;
  }>({
    isOpen: false,
    playlistId: "",
    playlistName: "",
    songCount: 0,
  });

  const togglePlaylist = (id: string) => {
    setSelectedPlaylists((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleStartMigration = () => {
    const selectedPlaylistIds = Object.keys(selectedPlaylists).filter(
      (id) => selectedPlaylists[id]
    );
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

  const handleMigrationComplete = (
    results: Array<{
      playlistId: string;
      playlistName: string;
      successCount: number;
      failedTracks: any[];
    }>
  ) => {
    // Use the first result for now (single playlist migration)
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
    const playlist = [...sourcePlaylists, ...targetPlaylists].find(
      (p) => p.id === playlistId
    );
    if (playlist) {
      setRenameDialog({
        isOpen: true,
        playlistId,
        currentName: playlist.name,
      });
    }
  };

  const handleRenameConfirm = (playlistId: string, newName: string) => {
    console.log(`Renaming playlist ${playlistId} to "${newName}"`);
    // Here you would typically update the playlist name in your state/API
    // For demo purposes, we'll just log it
  };

  const handleEmptyPlaylist = (playlistId: string) => {
    const playlist = [...sourcePlaylists, ...targetPlaylists].find(
      (p) => p.id === playlistId
    );
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
    // Here you would typically empty the playlist in your state/API
    // For demo purposes, we'll just log it
  };

  const handleDeletePlaylist = (playlistId: string) => {
    const playlist = [...sourcePlaylists, ...targetPlaylists].find(
      (p) => p.id === playlistId
    );
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
    // Here you would typically delete the playlist from your state/API
    // For demo purposes, we'll just log it
  };

  const sourcePlaylists = samplePlaylists[selectedSource] || [];
  const targetPlaylists = samplePlaylists[selectedTarget] || [];
  const selectedPlaylistData = sourcePlaylists.find(
    (p) => p.id === selectedPlaylistForMigration
  );

  // Create migration playlists data for MigrationLoadingCard
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
      {/* Header */}
      <header
        className="border-b border-white/20 backdrop-blur-lg"
        role="banner"
        style={{ background: "transparent" }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 min-w-0">
          <div className="flex items-center justify-between min-w-0">
            <div className="flex items-center space-x-4 min-w-0">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-2xl animate-pulse-glow shadow-xl"
                aria-hidden="true"
              >
                <Music className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-primary-dark truncate">
                SyncIt Dashboard
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4 min-w-0">
              <div className="flex items-center space-x-2 glass-effect px-4 py-2 min-w-0">
                <Sun
                  className="w-4 h-4 text-secondary-dark"
                  aria-hidden="true"
                />
                <Switch
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                  aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
                />
                <Moon
                  className="w-4 h-4 text-secondary-dark"
                  aria-hidden="true"
                />
              </div>

              <Link href="/settings">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary-dark hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-gray-800 focus-visible:outline-offset-2 rounded-xl backdrop-blur-sm"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>

              <Link href="/profile">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary-dark hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-gray-800 focus-visible:outline-offset-2 rounded-xl backdrop-blur-sm"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-primary-dark hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-gray-800 focus-visible:outline-offset-2 rounded-xl"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-dashboard-menu"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <nav
              id="mobile-dashboard-menu"
              className="lg:hidden mt-4 pb-4 border-t border-white/20 pt-4 glass-effect min-w-0"
              role="navigation"
              aria-label="Dashboard mobile navigation"
            >
              <div className="flex flex-col space-y-4 p-4 min-w-0">
                <div className="flex items-center justify-between min-w-0">
                  <span className="text-primary-dark font-medium">Theme</span>
                  <div className="flex items-center space-x-2">
                    <Sun
                      className="w-4 h-4 text-secondary-dark"
                      aria-hidden="true"
                    />
                    <Switch
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                      aria-label={`Switch to ${
                        darkMode ? "light" : "dark"
                      } mode`}
                    />
                    <Moon
                      className="w-4 h-4 text-secondary-dark"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <Link
                  href="/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-primary-dark hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-gray-800 focus-visible:outline-offset-2 rounded-xl"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-primary-dark hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-gray-800 focus-visible:outline-offset-2 rounded-xl"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-w-0">
        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8 w-full min-w-0">
          {/* Main Migration Panel */}
          <div className="lg:col-span-3 space-y-6 w-full min-w-0">
            {/* Connected Accounts */}
            <ConnectedAccounts />

            {/* Platform Selection */}

            <PlaylistSelection
              selectedSource={selectedSource}
              setSelectedSource={setSelectedSource}
              selectedTarget={selectedTarget}
              setSelectedTarget={setSelectedTarget}
            />

            {/* Playlists Display */}

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

            {/* Migration Action */}
            <div className="flex justify-center min-w-0">
              <MigrationAction
                handleStartMigration={handleStartMigration}
                selectedPlaylists={selectedPlaylists}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 w-full min-w-0">
            {/* Recent Syncs */}
            <RecentSyncs />

            {/* Quick Stats */}
            <QuickStats />
          </div>
        </div>
      </main>

      {/* Migration Confirmation Dialog */}
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
        selectedPlaylistCount={
          Object.keys(selectedPlaylists).filter((id) => selectedPlaylists[id])
            .length
        }
      />

      {/* Migration Loading Card */}
      <MigrationLoadingCard
        isVisible={isMigrating}
        sourcePlatform={selectedSource}
        targetPlatform={selectedTarget}
        playlists={migrationPlaylists}
        onComplete={handleMigrationComplete}
      />

      {/* Migration Result Card */}
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

      {/* Sync Preferences Dialog */}
      <SyncPreferencesDialog
        isOpen={showSyncPreferences}
        onClose={() => setShowSyncPreferences(false)}
        onConfirm={handleSyncPreferencesConfirm}
        playlistName={migrationResults.playlistName}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        onClose={() =>
          setConfirmationDialog((prev) => ({ ...prev, isOpen: false }))
        }
        onConfirm={confirmationDialog.onConfirm}
        title={confirmationDialog.title}
        message={confirmationDialog.message}
        confirmText={confirmationDialog.confirmText}
        confirmVariant={confirmationDialog.confirmVariant}
      />

      {/* Rename Playlist Dialog */}
      <RenamePlaylistDialog
        isOpen={renameDialog.isOpen}
        onClose={() => setRenameDialog((prev) => ({ ...prev, isOpen: false }))}
        playlistId={renameDialog.playlistId}
        currentName={renameDialog.currentName}
        onRename={handleRenameConfirm}
      />

      {/* Delete Playlist Dialog */}
      <DeletePlaylistDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog((prev) => ({ ...prev, isOpen: false }))}
        playlistId={deleteDialog.playlistId}
        playlistName={deleteDialog.playlistName}
        onDelete={handleDeleteConfirm}
      />

      {/* Empty Playlist Dialog */}
      <EmptyPlaylistDialog
        isOpen={emptyDialog.isOpen}
        onClose={() => setEmptyDialog((prev) => ({ ...prev, isOpen: false }))}
        playlistId={emptyDialog.playlistId}
        playlistName={emptyDialog.playlistName}
        songCount={emptyDialog.songCount}
        onEmpty={handleEmptyConfirm}
      />
    </div>
  );
}
