"use client";

import { useCallback, useEffect, useState } from "react";
import apiClient from "../utils/api";

export interface ConnectionStatus {
  connected: boolean;
  needsReconnect: boolean;
  username: string | null;
}

export interface RecentSync {
  id: string;
  sourcePlaylistId: string;
  destinationPlaylistId: string | null;
  sourcePlatform: "SPOTIFY" | "YOUTUBE";
  destinationPlatform: "SPOTIFY" | "YOUTUBE";
  status: string | null;
  lastSyncAt: string | null;
  nextSyncAt: string | null;
  autoSyncEnabled: boolean;
  trackCount: number;
}

export interface MeResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    username: string;
    profilePicture: string | null;
  };
  connections: {
    spotify: ConnectionStatus;
    youtube: ConnectionStatus;
  };
  stats: {
    totalSyncs: number;
    tracksMigrated: number;
    successRate: number | null;
    activeAutoSyncs: number;
  };
  recentSyncs: RecentSync[];
}

/** Session + connection status from GET /me. 401 => unauthenticated. */
export default function useMe() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unauthenticated, setUnauthenticated] = useState(false);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<MeResponse>("/me");
      setMe(response.data);
      setUnauthenticated(false);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setUnauthenticated(true);
        setMe(null);
      } else {
        setError(err?.response?.data?.message || err?.message || "Failed to load account");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { me, loading, error, unauthenticated, refetch };
}
