"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music, ArrowLeft, Shield, Check, RefreshCw } from "lucide-react";
import Link from "next/link";
import useMe, { type ConnectionStatus } from "@/hooks/useMe";
import { backendUrl } from "@/utils/api";

/**
 * Connection state comes from GET /me. This page used to be entirely static —
 * it claimed both platforms were "Active" and "Connected 2 hours ago"
 * regardless of reality, and its four preference switches were local useState
 * that reset on navigation.
 *
 * Controls with no backend are not rendered rather than shown as decoration:
 * there is no disconnect endpoint, and no preference persistence of any kind.
 */
const PLATFORMS = [
  {
    key: "spotify" as const,
    label: "Spotify",
    colour: "#1db954",
    scopes: "Read and modify your playlists",
  },
  {
    key: "youtube" as const,
    label: "YouTube Music",
    colour: "#ff3b3b",
    scopes: "Read and modify your playlists",
  },
];

function statusBadge(status?: ConnectionStatus) {
  if (!status || !status.connected) {
    return (
      <Badge variant="outline" className="bg-muted text-muted-foreground">
        Not connected
      </Badge>
    );
  }
  if (status.needsReconnect) {
    return (
      <Badge
        variant="outline"
        className="border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400"
      >
        Reconnect needed
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
    >
      <Check className="w-3 h-3" />
      Connected
    </Badge>
  );
}

export default function SettingsPage() {
  const { me, loading, error, unauthenticated } = useMe();
  const router = useRouter();

  useEffect(() => {
    if (unauthenticated) router.push("/auth");
  }, [unauthenticated, router]);

  const connect = (platform: "spotify" | "youtube") => {
    const redirectAfter = encodeURIComponent("/settings");
    window.location.href = backendUrl(
      `/${platform}/login?redirect_after=${redirectAfter}`,
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header
        className="border-b border-border/60 bg-background/70 backdrop-blur-xl backdrop-saturate-150 sticky top-0 z-40"
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-muted-foreground hover:text-foreground"
                aria-label="Go back to dashboard"
              >
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
            <div className="logo-icon" aria-hidden="true">
              <Music className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-base sm:text-lg font-semibold text-foreground">
              Settings
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {error && (
          <Card>
            <CardContent className="py-6 text-center text-sm text-red-600 dark:text-red-400">
              {error}
            </CardContent>
          </Card>
        )}

        <Card
          className="hover-lift"
          role="region"
          aria-labelledby="connected-accounts-settings-heading"
        >
          <CardHeader>
            <CardTitle
              id="connected-accounts-settings-heading"
              className="text-foreground flex items-center"
            >
              <Shield className="w-4 h-4 mr-2 text-muted-foreground" />
              Connected accounts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {PLATFORMS.map((platform) => {
              const status = me?.connections[platform.key];
              const connected = !!status?.connected;
              return (
                <div
                  key={platform.key}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: platform.colour }}
                      aria-hidden="true"
                    >
                      <Music className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-foreground font-medium text-sm">
                        {platform.label}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {loading
                          ? "Checking…"
                          : connected && status?.username
                            ? status.username
                            : platform.scopes}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {statusBadge(status)}
                    {(!connected || status?.needsReconnect) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => connect(platform.key)}
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        {status?.needsReconnect ? "Reconnect" : "Connect"}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
            <p className="text-xs text-muted-foreground">
              Revoke access from your{" "}
              <a
                className="logo-gradient font-medium hover:underline"
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google
              </a>{" "}
              or{" "}
              <a
                className="logo-gradient font-medium hover:underline"
                href="https://www.spotify.com/account/apps/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Spotify
              </a>{" "}
              account settings. SyncIt does not yet support disconnecting from
              here.
            </p>
          </CardContent>
        </Card>

        <Card
          className="hover-lift"
          role="region"
          aria-labelledby="sync-heading"
        >
          <CardHeader>
            <CardTitle id="sync-heading" className="text-foreground">
              Automatic syncing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Auto-sync is configured per playlist, not globally. Migrate a
              playlist, then choose “Keep in sync” to schedule it.
            </p>
            <p className="text-sm text-foreground">
              Currently active auto-syncs:{" "}
              <span className="font-semibold">
                {me?.stats.activeAutoSyncs ?? "—"}
              </span>
            </p>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Go to dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
