"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Music, ArrowLeft, TrendingUp, Award, Clock, Zap } from "lucide-react";
import Link from "next/link";
import useMe from "@/hooks/useMe";
import apiClient from "@/utils/api";

/**
 * Everything here comes from GET /me. The page previously rendered hardcoded
 * values ("John Doe", 24 syncs, 2,847 tracks, 95%) that looked real.
 *
 * Fields /me does not provide are not displayed rather than invented — that
 * is why there is no "Member since" tile (no createdAt in the contract) and
 * no plan/verification badges (no plan model exists on the backend at all).
 */
export default function ProfilePage() {
  const { me, loading, error, unauthenticated } = useMe();
  const router = useRouter();

  useEffect(() => {
    if (unauthenticated) router.push("/auth");
  }, [unauthenticated, router]);

  const handleSignOut = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // best-effort — clear the client either way
    }
    router.push("/auth");
  };

  const stats = [
    {
      label: "Total syncs",
      value: me?.stats.totalSyncs?.toLocaleString() ?? "—",
      icon: TrendingUp,
    },
    {
      label: "Tracks moved",
      value: me?.stats.tracksMigrated?.toLocaleString() ?? "—",
      icon: Music,
    },
    {
      label: "Success rate",
      value:
        me?.stats.successRate === null || me?.stats.successRate === undefined
          ? "—"
          : `${Math.round(me.stats.successRate)}%`,
      icon: Award,
    },
    {
      label: "Auto-syncs on",
      value: me?.stats.activeAutoSyncs?.toLocaleString() ?? "—",
      icon: Zap,
    },
  ];

  const initials = (me?.user.username || me?.user.email || "?")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen gradient-background-subdued">
      <header
        className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40"
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
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
              Profile
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {error && (
          <Card>
            <CardContent className="py-6 text-center text-sm text-red-600">
              {error}
            </CardContent>
          </Card>
        )}

        {/* Profile Info */}
        <Card
          className="hover-lift"
          role="region"
          aria-labelledby="profile-info-heading"
        >
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-20 h-20 border border-border shadow-elev">
                {me?.user.profilePicture && (
                  <AvatarImage src={me.user.profilePicture} />
                )}
                <AvatarFallback className="bg-gradient-to-br from-brand-gradStart to-brand-gradEnd text-white text-xl font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="text-center md:text-left flex-1 min-w-0">
                <h2
                  id="profile-info-heading"
                  className="text-2xl font-bold text-foreground mb-2 truncate"
                >
                  {loading ? "Loading…" : (me?.user.username ?? "—")}
                </h2>
                <p className="text-muted-foreground mb-4 truncate">
                  {me?.user.email ?? ""}
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge
                    variant="outline"
                    className={
                      me?.connections.spotify.connected
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    Spotify{" "}
                    {me?.connections.spotify.connected
                      ? "connected"
                      : "not connected"}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      me?.connections.youtube.connected
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    YouTube{" "}
                    {me?.connections.youtube.connected
                      ? "connected"
                      : "not connected"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="hover-lift" role="region">
              <CardContent className="p-6 text-center">
                <stat.icon className="w-6 h-6 text-brand-500 mx-auto mb-3" />
                <p className="text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </p>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity — real sync history from /me */}
        <Card
          className="hover-lift"
          role="region"
          aria-labelledby="recent-activity-heading"
        >
          <CardHeader>
            <CardTitle
              id="recent-activity-heading"
              className="text-foreground flex items-center"
            >
              <Clock className="w-5 h-5 mr-2" />
              Recent activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!me?.recentSyncs?.length ? (
              <p className="text-muted-foreground text-sm">
                No syncs yet — migrate a playlist to see it here.
              </p>
            ) : (
              me.recentSyncs.map((sync) => (
                <div
                  key={sync.id}
                  className="flex items-center gap-3 p-4 rounded-lg border border-border"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground text-sm font-medium truncate">
                      {sync.sourcePlatform.toLowerCase()} →{" "}
                      {sync.destinationPlatform.toLowerCase()} ·{" "}
                      {sync.trackCount} tracks
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {sync.lastSyncAt
                        ? new Date(sync.lastSyncAt).toLocaleString()
                        : "Not run yet"}
                    </p>
                  </div>
                  {sync.autoSyncEnabled && (
                    <Badge
                      variant="outline"
                      className="border-brand-200 bg-brand-50 text-brand-700 shrink-0"
                    >
                      Auto-sync on
                    </Badge>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Account Actions — only actions that actually exist. "Download my
            data" and "Export sync history" were removed: no such endpoints. */}
        <Card
          className="hover-lift"
          role="region"
          aria-labelledby="account-management-heading"
        >
          <CardHeader>
            <CardTitle
              id="account-management-heading"
              className="text-foreground"
            >
              Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link href="/settings">
                <Button variant="outline" className="w-full">
                  Account settings
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="border-red-500/50 text-red-600 hover:bg-red-500/10 bg-transparent"
              >
                Sign out
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
