"use client";

import { useState } from "react";
import apiClient from "../utils/api";

type Platform = "spotify" | "youtube";

export interface EnableAutoSyncParams {
  playlistId: string;
  sourcePlatform: Platform;
  destinationPlatform: Platform;
  intervalMinutes: number;
}

/** Maps the sync-preferences dialog options to backend minutes. */
export const FREQUENCY_TO_MINUTES: Record<string, number> = {
  hourly: 60,
  "3hours": 180,
  daily: 1440,
};

export default function useAutoSync() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enableAutoSync = async (params: EnableAutoSyncParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post("/api/auto-sync/enable", {
        playlistId: params.playlistId,
        sourcePlatform: params.sourcePlatform.toUpperCase(),
        destinationPlatform: params.destinationPlatform.toUpperCase(),
        intervalMinutes: params.intervalMinutes,
      });
      return response.data;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to enable auto-sync";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const disableAutoSync = async (
    params: Omit<EnableAutoSyncParams, "intervalMinutes">,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post("/api/auto-sync/disable", {
        playlistId: params.playlistId,
        sourcePlatform: params.sourcePlatform.toUpperCase(),
        destinationPlatform: params.destinationPlatform.toUpperCase(),
      });
      return response.data;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to disable auto-sync";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { enableAutoSync, disableAutoSync, loading, error };
}
