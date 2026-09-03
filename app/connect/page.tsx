"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music, Check, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { backendUrl } from "@/utils/api";
import useMe from "@/hooks/useMe";

export default function ConnectPage() {
  // Real connection status from GET /me — previously this state was never
  // set, so "Continue" could never enable.
  const { me, unauthenticated } = useMe();
  const [connections, setConnections] = useState({
    spotify: false,
    youtube: false,
  });
  const [loading, setLoading] = useState({
    spotify: false,
    youtube: false,
  });
  const router = useRouter();

  useEffect(() => {
    if (me) {
      setConnections({
        spotify:
          me.connections.spotify.connected &&
          !me.connections.spotify.needsReconnect,
        youtube:
          me.connections.youtube.connected &&
          !me.connections.youtube.needsReconnect,
      });
    }
  }, [me]);

  useEffect(() => {
    if (unauthenticated) {
      router.push("/auth");
    }
  }, [unauthenticated, router]);

  const handleConnect = async (platform: "spotify" | "youtube") => {
    setLoading((prev) => ({ ...prev, [platform]: true }));

    // Redirect to backend OAuth endpoint; come back to this page after.
    const redirectAfter = encodeURIComponent("/connect");
    window.location.href = backendUrl(
      `/${platform}/login?redirect_after=${redirectAfter}`,
    );
  };

  const canProceed = connections.spotify && connections.youtube;

  return (
    <div className="min-h-screen bg-background">
      <main className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-16">
        <div className="w-full max-w-md fade-in-up">
          <div className="mb-6">
            <Link href="/auth">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full -ml-2 text-muted-foreground hover:text-foreground"
                aria-label="Go back to sign in"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Button>
            </Link>
          </div>

          <Card
            role="main"
            aria-labelledby="connect-title"
            className="shadow-none border-border/60"
          >
            <CardHeader className="text-center pb-5 pt-8 px-6 sm:px-8">
              <div
                className="flex items-center justify-center mb-4"
                aria-hidden="true"
              >
                <div
                  className="logo-icon"
                  style={{ width: 52, height: 52, borderRadius: 16 }}
                >
                  <Music className="w-6 h-6 text-white" />
                </div>
              </div>
              <CardTitle
                id="connect-title"
                className="text-2xl sm:text-[1.75rem] font-semibold tracking-[-0.02em] text-foreground mb-2"
              >
                Connect Your Accounts
              </CardTitle>
              <p className="text-sm text-muted-foreground" role="doc-subtitle">
                Link your streaming platforms to start syncing.
              </p>
            </CardHeader>

            <CardContent className="space-y-2.5 px-6 sm:px-8 pb-8">
              {/* Spotify Connection */}
              <Card
                className="shadow-none border-border/60 transition-colors hover:border-border"
                role="region"
                aria-labelledby="spotify-heading"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                        style={{ background: "#1db954" }}
                        aria-hidden="true"
                      >
                        <Music className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <h3
                          id="spotify-heading"
                          className="text-foreground font-medium text-sm"
                        >
                          Spotify
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">
                          Read playlists &amp; library
                        </p>
                      </div>
                    </div>
                    {connections.spotify ? (
                      <Badge
                        variant="outline"
                        className="rounded-full border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        role="status"
                        aria-label="Spotify connected successfully"
                      >
                        <Check className="w-3 h-3" />
                        Connected
                      </Badge>
                    ) : (
                      <Button
                        onClick={() => handleConnect("spotify")}
                        disabled={loading.spotify}
                        variant="outline"
                        size="sm"
                        className="shrink-0 rounded-full px-4"
                        aria-describedby="spotify-description"
                      >
                        {loading.spotify ? (
                          <Loader2
                            className="w-4 h-4 animate-spin"
                            aria-hidden="true"
                          />
                        ) : (
                          "Connect"
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* YouTube Music Connection */}
              <Card
                className="shadow-none border-border/60 transition-colors hover:border-border"
                role="region"
                aria-labelledby="youtube-heading"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                        style={{ background: "#ff3b3b" }}
                        aria-hidden="true"
                      >
                        <Music className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <h3
                          id="youtube-heading"
                          className="text-foreground font-medium text-sm"
                        >
                          YouTube Music
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">
                          Read playlists &amp; library
                        </p>
                      </div>
                    </div>
                    {connections.youtube ? (
                      <Badge
                        variant="outline"
                        className="rounded-full border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        role="status"
                        aria-label="YouTube Music connected successfully"
                      >
                        <Check className="w-3 h-3" />
                        Connected
                      </Badge>
                    ) : (
                      <Button
                        onClick={() => handleConnect("youtube")}
                        disabled={loading.youtube}
                        variant="outline"
                        size="sm"
                        className="shrink-0 rounded-full px-4"
                        aria-describedby="youtube-description"
                      >
                        {loading.youtube ? (
                          <Loader2
                            className="w-4 h-4 animate-spin"
                            aria-hidden="true"
                          />
                        ) : (
                          "Connect"
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="pt-3">
                <Button
                  onClick={() => router.push("/dashboard")}
                  disabled={!canProceed}
                  className="w-full h-12 rounded-full"
                  aria-describedby="continue-description"
                >
                  Continue to Dashboard
                </Button>
                <p id="continue-description" className="sr-only">
                  {canProceed
                    ? "Both accounts connected. Click to continue to dashboard."
                    : "Connect both Spotify and YouTube Music to continue."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
