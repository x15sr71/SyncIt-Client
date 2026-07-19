"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, Music } from "lucide-react";

interface SyncStatusProps {
  playlistName: string;
  status: "success" | "in-progress" | "failed";
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
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-600 animate-spin" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case "success":
        return (
          <Badge
            variant="outline"
            className="border-green-200 bg-green-50 text-green-700"
          >
            Success
          </Badge>
        );
      case "in-progress":
        return (
          <Badge
            variant="outline"
            className="border-blue-200 bg-blue-50 text-blue-700"
          >
            In Progress
          </Badge>
        );
      case "failed":
        return (
          <Badge
            variant="outline"
            className="border-red-200 bg-red-50 text-red-700"
          >
            Failed
          </Badge>
        );
    }
  };

  return (
    <div className="flex items-center justify-between p-2.5 rounded-lg hover:bg-accent/50 transition-colors">
      <div className="flex items-center space-x-3 min-w-0">
        {getStatusIcon()}
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {playlistName}
          </p>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Music className="w-3 h-3" />
            <span>{tracksCount} tracks</span>
            <span>•</span>
            <span>{timestamp}</span>
          </div>
        </div>
      </div>
      {getStatusBadge()}
    </div>
  );
}
