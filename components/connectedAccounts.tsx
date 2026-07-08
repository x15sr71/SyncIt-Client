import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ConnectionStatus } from "@/hooks/useMe";

interface ConnectedAccountsProps {
  spotify?: ConnectionStatus;
  youtube?: ConnectionStatus;
  spotifyPlaylistCount?: number;
  youtubePlaylistCount?: number;
  onConnect?: (platform: "spotify" | "youtube") => void;
}

function statusBadge(status?: ConnectionStatus) {
  if (!status || !status.connected) {
    return (
      <Badge variant="outline" className="border-border bg-muted text-muted-foreground">
        Not connected
      </Badge>
    );
  }
  if (status.needsReconnect) {
    return (
      <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
        Reconnect
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
      Active
    </Badge>
  );
}

export default function ConnectedAccounts({
  spotify,
  youtube,
  spotifyPlaylistCount,
  youtubePlaylistCount,
  onConnect,
}: ConnectedAccountsProps) {
  const accounts = [
    {
      key: "spotify" as const,
      label: "Spotify",
      color: "#1db954",
      initial: "S",
      status: spotify,
      playlistCount: spotifyPlaylistCount,
    },
    {
      key: "youtube" as const,
      label: "YouTube Music",
      color: "#ff3b3b",
      initial: "Y",
      status: youtube,
      playlistCount: youtubePlaylistCount,
    },
  ];

  return (
    <Card
      className="hover-lift min-w-0"
      role="region"
      aria-labelledby="connected-accounts-heading"
    >
      <CardHeader className="pb-3">
        <CardTitle
          id="connected-accounts-heading"
          className="text-foreground text-base font-semibold"
        >
          Connected accounts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 gap-3 min-w-0">
          {accounts.map((account) => (
            <div
              key={account.key}
              className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 min-w-0"
            >
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center text-white text-xs font-semibold shrink-0"
                style={{ background: account.color }}
                aria-hidden="true"
              >
                {account.initial}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-foreground truncate">
                  {account.label}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {account.status?.connected
                    ? account.playlistCount !== undefined
                      ? `${account.playlistCount} playlists`
                      : (account.status.username ?? "Connected")
                    : "Connect to start syncing"}
                </div>
              </div>
              {!account.status?.connected || account.status?.needsReconnect ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  onClick={() => onConnect?.(account.key)}
                >
                  {account.status?.needsReconnect ? "Reconnect" : "Connect"}
                </Button>
              ) : (
                statusBadge(account.status)
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
