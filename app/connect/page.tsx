"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, Check, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ConnectPage() {
  const [connections, setConnections] = useState({
    spotify: false,
    youtube: false,
  })
  const [loading, setLoading] = useState({
    spotify: false,
    youtube: false,
  })
  const router = useRouter()

  const handleConnect = async (platform: "spotify" | "youtube") => {
    setLoading((prev) => ({ ...prev, [platform]: true }))

    // Simulate OAuth connection
    setTimeout(() => {
      setConnections((prev) => ({ ...prev, [platform]: true }))
      setLoading((prev) => ({ ...prev, [platform]: false }))
    }, 2000)
  }

  const canProceed = connections.spotify && connections.youtube

  return (
    <div className="min-h-screen gradient-background-subdued">
      <main className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 pt-20">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/auth">
              <Button
                variant="ghost"
                className="text-primary-dark hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-gray-800 focus-visible:outline-offset-2 rounded-xl backdrop-blur-sm"
                aria-label="Go back to sign in"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Button>
            </Link>
          </div>

          <Card className="glass-card animate-float border-white/40" role="main" aria-labelledby="connect-title">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center mb-4" aria-hidden="true">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-2xl animate-pulse-glow shadow-xl">
                  <Music className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle id="connect-title" className="text-2xl font-bold text-primary-dark mb-2">
                Connect Your Accounts
              </CardTitle>
              <p className="text-secondary-dark" role="doc-subtitle">
                Link your streaming platforms to start syncing
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Spotify Connection */}
              <Card
                className="glass-effect border-white/30 hover:border-white/50 transition-all hover-lift"
                role="region"
                aria-labelledby="spotify-heading"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg"
                        aria-hidden="true"
                      >
                        <Music className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 id="spotify-heading" className="text-primary-dark font-semibold">
                          Spotify
                        </h3>
                        <p className="text-secondary-dark text-sm">Connect your Spotify account</p>
                      </div>
                    </div>
                    {connections.spotify ? (
                      <div
                        className="bg-green-500 rounded-full p-2 shadow-lg"
                        role="status"
                        aria-label="Spotify connected successfully"
                      >
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleConnect("spotify")}
                        disabled={loading.spotify}
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white rounded-xl focus-visible:outline-2 focus-visible:outline-green-400 focus-visible:outline-offset-2 transition-all hover:scale-105 shadow-lg"
                        aria-describedby="spotify-description"
                      >
                        {loading.spotify ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : "Connect"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* YouTube Music Connection */}
              <Card
                className="glass-effect border-white/30 hover:border-white/50 transition-all hover-lift"
                role="region"
                aria-labelledby="youtube-heading"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg"
                        aria-hidden="true"
                      >
                        <Music className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 id="youtube-heading" className="text-primary-dark font-semibold">
                          YouTube Music
                        </h3>
                        <p className="text-secondary-dark text-sm">Connect your YouTube Music account</p>
                      </div>
                    </div>
                    {connections.youtube ? (
                      <div
                        className="bg-green-500 rounded-full p-2 shadow-lg"
                        role="status"
                        aria-label="YouTube Music connected successfully"
                      >
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleConnect("youtube")}
                        disabled={loading.youtube}
                        size="sm"
                        className="bg-red-500 hover:bg-red-600 text-white rounded-xl focus-visible:outline-2 focus-visible:outline-red-400 focus-visible:outline-offset-2 transition-all hover:scale-105 shadow-lg"
                        aria-describedby="youtube-description"
                      >
                        {loading.youtube ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : "Connect"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="pt-4">
                <Button
                  onClick={() => router.push("/dashboard")}
                  disabled={!canProceed}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-white rounded-2xl py-4 focus-visible:outline-2 focus-visible:outline-purple-400 focus-visible:outline-offset-2 transition-all hover:scale-105 shadow-lg font-semibold"
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
  )
}
