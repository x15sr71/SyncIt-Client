import { useState } from "react";

export function useDashboardState() {
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
    type: "success" | "error";
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

  const [pendingSongDeletion, setPendingSongDeletion] = useState<{
    playlistId: string;
    songId: string;
    songTitle: string;
    platform: "spotify" | "youtube";
    animateRemoval: (songId: string) => Promise<void>;
    animateOnly?: (songId: string) => Promise<void>;
    removeFromState?: (songId: string) => void;
    cancelAnimation?: (songId: string) => void;
    setAPILoading?: (loading: boolean) => void;
  } | null>(null);

  return {
    darkMode,
    setDarkMode,
    selectedSource,
    setSelectedSource,
    selectedTarget,
    setSelectedTarget,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    selectedPlaylists,
    setSelectedPlaylists,
    showMigrationDialog,
    setShowMigrationDialog,
    selectedPlaylistForMigration,
    setSelectedPlaylistForMigration,
    isMigrating,
    setIsMigrating,
    showMigrationResult,
    setShowMigrationResult,
    showSyncPreferences,
    setShowSyncPreferences,
    migrationResults,
    setMigrationResults,
    showToast,
    setShowToast,
    confirmationDialog,
    setConfirmationDialog,
    renameDialog,
    setRenameDialog,
    deleteDialog,
    setDeleteDialog,
    emptyDialog,
    setEmptyDialog,
    deleteSongDialog,
    setDeleteSongDialog,
    pendingSongDeletion,
    setPendingSongDeletion,
  };
}
