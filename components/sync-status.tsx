"use client";

import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  XCircle,
  Music,
  AlertTriangle,
} from "lucide-react";

interface SyncStatusProps {
  playlistName: string;
  status: "success" | "partial" | "in-progress" | "failed";
  timestamp: string;
  tracksCount: number;
}

export function SyncStatus({
  playlistName,
  status,
  timestamp,
  tracksCount,
}: SyncStatusProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "success":
        return (
          <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        );
      case "in-progress":
        return (
          <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" />
        );
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case "success":
        return (
          <Badge
            variant="outline"
            className="border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          >
            Success
          </Badge>
        );
      case "partial":
        return (
          <Badge
            variant="outline"
            className="border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400"
          >
            Partial
          </Badge>
        );
      case "in-progress":
        return (
          <Badge
            variant="outline"
            className="border-blue-500/25 bg-blue-500/10 text-blue-600 dark:text-blue-400"
          >
            In Progress
          </Badge>
        );
      case "failed":
        return (
          <Badge
            variant="outline"
            className="border-red-500/25 bg-red-500/10 text-red-600 dark:text-red-400"
          >
            Failed
          </Badge>
        );
    }
  };

  return (
    <div className="flex items-start justify-between gap-2 p-2.5 rounded-xl hover:bg-accent/50 transition-colors">
      <div className="flex items-start gap-2.5 min-w-0">
        {getStatusIcon()}
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {playlistName}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
            <Music className="w-3 h-3 shrink-0" />
            <span className="truncate">
              {tracksCount} tracks · {timestamp}
            </span>
          </div>
        </div>
      </div>
      <div className="shrink-0">{getStatusBadge()}</div>
    </div>
  );
}
