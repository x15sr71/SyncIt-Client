"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Music,
  Settings,
  User,
  Moon,
  Sun,
  Menu,
  X,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { SyncStatus } from "@/components/sync-status";
import { PlatformDropdown } from "@/components/platform-dropdown";
import { PlaylistPreview } from "@/components/playlist-preview";
import { MigrationConfirmationDialog } from "@/components/migration-confirmation-dialog";
import { MigrationLoadingCard } from "@/components/migration-loading-card";
import { MigrationResultCard } from "@/components/migration-result-card";
import { SyncPreferencesDialog } from "@/components/sync-preferences-dialog";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { RenamePlaylistDialog } from "@/components/rename-playlist-dialog";
import { DeletePlaylistDialog } from "@/components/delete-playlist-dialog";
import { EmptyPlaylistDialog } from "@/components/empty-playlist-dialog";
import { ArrowLeftRight } from "lucide-react";
import { SiSpotify, SiYoutubemusic } from "react-icons/si";

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
            <Card
              className="glass-card border-white/40 hover-lift min-w-0"
              role="region"
              aria-labelledby="connected-accounts-heading"
            >
              <CardHeader>
                <CardTitle
                  id="connected-accounts-heading"
                  className="text-primary-dark"
                >
                  Connected Accounts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 min-w-0">
                  <div className="flex items-center space-x-2 bg-green-500/20 px-4 py-3 rounded-2xl flex-1 border border-green-500/30 min-w-0">
                    <div
                      className="w-3 h-3 bg-green-500 rounded-full"
                      aria-hidden="true"
                    ></div>
                    <span className="text-primary-dark font-medium">
                      Spotify
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-green-500/20 text-green-700 ml-auto rounded-xl"
                    >
                      Connected
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 bg-red-500/20 px-4 py-3 rounded-2xl flex-1 border border-red-500/30 min-w-0">
                    <div
                      className="w-3 h-3 bg-red-500 rounded-full"
                      aria-hidden="true"
                    ></div>
                    <span className="text-primary-dark font-medium">
                      YouTube Music
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-red-500/20 text-red-700 ml-auto rounded-xl"
                    >
                      Connected
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Selection */}

            <Card
              className="glass-card border-white/40 hover-lift min-w-0"
              role="region"
              aria-labelledby="platform-selection-heading"
            >
              <CardHeader>
                <CardTitle
                  id="platform-selection-heading"
                  className="text-primary-dark"
                >
                  Select Migration Platforms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <div className="flex flex-col sm:grid sm:grid-cols-[1fr_auto_1fr] sm:place-items-center items-center justify-center gap-4 sm:gap-6">
                    {/* From Platform */}
                    <div className="w-[160px] flex flex-col items-center text-center">
                      <p className="text-muted-foreground text-sm mb-1">From</p>
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-medium text-sm capitalize
            ${
              selectedSource === "spotify"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
                      >
                        {selectedSource === "spotify" ? (
                          <>
                            <SiSpotify className="w-4 h-4" /> Spotify
                          </>
                        ) : (
                          <>
                            <SiYoutubemusic className="w-4 h-4" /> YouTube Music
                          </>
                        )}
                      </div>
                    </div>

                    {/* Swap Button */}
                    <div className="flex-shrink-0 pt-4 sm:pt-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="group h-9 w-9 rounded-lg backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 shadow-md hover:shadow-xl transition-all"
                        aria-label="Swap platforms"
                        onClick={() => {
                          const temp = selectedSource;
                          setSelectedSource(selectedTarget);
                          setSelectedTarget(temp);
                        }}
                      >
                        <ArrowLeftRight className="h-4 w-4 sm:rotate-0 rotate-90 text-white/90 drop-shadow-sm group-hover:text-white transition-colors" />
                      </Button>
                    </div>

                    {/* To Platform */}
                    <div className="w-[160px] flex flex-col items-center text-center">
                      <p className="text-muted-foreground text-sm mb-1">To</p>
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-medium text-sm capitalize
            ${
              selectedTarget === "spotify"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
                      >
                        {selectedTarget === "spotify" ? (
                          <>
                            <SiSpotify className="w-4 h-4" /> Spotify
                          </>
                        ) : (
                          <>
                            <SiYoutubemusic className="w-4 h-4" /> YouTube Music
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* YouTube Music API Limitation Notice */}
                {(selectedSource === "youtube" ||
                  selectedTarget === "youtube") && (
                  <div className="mt-6 p-5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/40 rounded-2xl shadow-lg min-w-0">
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="w-12 h-12 bg-yellow-500/30 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <AlertTriangle className="w-6 h-6 text-yellow-700" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-yellow-800 font-bold text-lg mb-2 break-words">
                          YouTube Music API Limitation
                        </h4>
                        <p className="text-yellow-900 text-sm leading-relaxed break-words">
                          YouTube Music allows only{" "}
                          <span className="font-semibold">
                            100 tracks per day
                          </span>{" "}
                          via API. Large playlists will be migrated over
                          multiple days to comply with these restrictions.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Playlists Display */}
            <div className="grid md:grid-cols-2 gap-6 w-full min-w-0">
              {/* Source Playlists */}
              <Card
                className="glass-card border-white/40 hover-lift min-w-0"
                role="region"
                aria-labelledby="source-playlists-heading"
              >
                <CardHeader>
                  <CardTitle
                    id="source-playlists-heading"
                    className="text-primary-dark capitalize truncate"
                  >
                    {selectedSource} Playlists
                  </CardTitle>
                  <p className="text-sm text-secondary-dark">
                    Select playlists to migrate
                  </p>
                </CardHeader>
                <CardContent className="space-y-4 max-h-96 overflow-y-auto min-w-0 break-words">
                  {sourcePlaylists.map((playlist) => (
                    <PlaylistPreview
                      key={playlist.id}
                      playlist={playlist}
                      isSelected={selectedPlaylists[playlist.id] || false}
                      onToggle={togglePlaylist}
                      showCheckbox={true}
                      onRename={handleRenamePlaylist}
                      onEmpty={handleEmptyPlaylist}
                      onDelete={handleDeletePlaylist}
                    />
                  ))}
                </CardContent>
              </Card>

              {/* Target Playlists */}
              <Card
                className="glass-card border-white/40 hover-lift min-w-0"
                role="region"
                aria-labelledby="target-playlists-heading"
              >
                <CardHeader>
                  <CardTitle
                    id="target-playlists-heading"
                    className="text-primary-dark capitalize truncate"
                  >
                    {selectedTarget} Playlists
                  </CardTitle>
                  <p className="text-sm text-secondary-dark">
                    Your existing playlists
                  </p>
                </CardHeader>
                <CardContent className="space-y-4 max-h-96 overflow-y-auto min-w-0 break-words">
                  {targetPlaylists.map((playlist) => (
                    <PlaylistPreview
                      key={playlist.id}
                      playlist={playlist}
                      isSelected={false}
                      onToggle={() => {}}
                      showCheckbox={false}
                      onRename={handleRenamePlaylist}
                      onEmpty={handleEmptyPlaylist}
                      onDelete={handleDeletePlaylist}
                    />
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Migration Action */}
            <div className="flex justify-center min-w-0">
              <Button
                size="lg"
                onClick={handleStartMigration}
                disabled={
                  Object.keys(selectedPlaylists).filter(
                    (id) => selectedPlaylists[id]
                  ).length === 0
                }
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl px-8 py-4 focus-visible:outline-2 focus-visible:outline-purple-400 focus-visible:outline-offset-2 transition-all hover:scale-105 shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Start Migration (
                {
                  Object.keys(selectedPlaylists).filter(
                    (id) => selectedPlaylists[id]
                  ).length
                }{" "}
                selected)
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 w-full min-w-0">
            {/* Recent Syncs */}
            <Card
              className="glass-card border-white/40 hover-lift min-w-0"
              role="region"
              aria-labelledby="recent-syncs-heading"
            >
              <CardHeader>
                <CardTitle
                  id="recent-syncs-heading"
                  className="text-primary-dark truncate"
                >
                  Recent Syncs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 min-w-0 break-words">
                <SyncStatus
                  playlistName="My Favorites"
                  status="success"
                  timestamp="2 hours ago"
                  tracksCount={127}
                />
                <SyncStatus
                  playlistName="Workout Mix"
                  status="in-progress"
                  timestamp="Just now"
                  tracksCount={45}
                />
                <SyncStatus
                  playlistName="Chill Vibes"
                  status="failed"
                  timestamp="1 day ago"
                  tracksCount={89}
                />
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card
              className="glass-card border-white/40 hover-lift min-w-0"
              role="region"
              aria-labelledby="quick-stats-heading"
            >
              <CardHeader>
                <CardTitle
                  id="quick-stats-heading"
                  className="text-primary-dark"
                >
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 min-w-0 break-words">
                <div className="flex justify-between">
                  <span className="text-secondary-dark">Total Syncs</span>
                  <span className="text-primary-dark font-semibold">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-dark">Success Rate</span>
                  <span className="text-green-600 font-semibold">95%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-dark">Tracks Synced</span>
                  <span className="text-primary-dark font-semibold">2,847</span>
                </div>
              </CardContent>
            </Card>
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
