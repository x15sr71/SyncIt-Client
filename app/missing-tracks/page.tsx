"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Music, ArrowLeft, Search, X, Check } from "lucide-react"
import Link from "next/link"

interface MissingTrack {
  id: string
  originalTitle: string
  artist: string
  status: "pending" | "found" | "skipped"
  suggestions?: string[]
}

export default function MissingTracksPage() {
  const [missingTracks, setMissingTracks] = useState<MissingTrack[]>([
    {
      id: "1",
      originalTitle: "Rare Song Title",
      artist: "Obscure Artist",
      status: "pending",
      suggestions: ["Similar Song - Different Artist", "Rare Song - Cover Version"],
    },
    {
      id: "2",
      originalTitle: "Live Version Track",
      artist: "Famous Band",
      status: "pending",
      suggestions: ["Studio Version - Famous Band", "Live Album Version - Famous Band"],
    },
    {
      id: "3",
      originalTitle: "Remix Track",
      artist: "DJ Producer",
      status: "pending",
      suggestions: ["Original Version - Original Artist", "Different Remix - Another DJ"],
    },
  ])

  const handleTrackAction = (trackId: string, action: "found" | "skipped") => {
    setMissingTracks((prev) => prev.map((track) => (track.id === trackId ? { ...track, status: action } : track)))
  }

  const pendingTracks = missingTracks.filter((track) => track.status === "pending")
  const resolvedTracks = missingTracks.filter((track) => track.status !== "pending")

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-2 rounded-full">
              <Music className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Missing Tracks</h1>
            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
              {pendingTracks.length} remaining
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Unmatched Tracks</CardTitle>
            <p className="text-gray-300">
              These tracks couldn't be automatically matched. You can search manually or skip them.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingTracks.map((track) => (
              <Card key={track.id} className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-white font-medium">{track.originalTitle}</h3>
                      <p className="text-gray-400">{track.artist}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-gray-300">Suggested matches:</p>
                      {track.suggestions?.map((suggestion, index) => (
                        <div key={index} className="flex items-center justify-between bg-white/5 p-2 rounded">
                          <span className="text-white text-sm">{suggestion}</span>
                          <Button
                            size="sm"
                            onClick={() => handleTrackAction(track.id, "found")}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Use This
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex-1 relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          placeholder="Search for alternative..."
                          className="pl-10 bg-white/5 border-white/10 text-white"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTrackAction(track.id, "skipped")}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Skip
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {pendingTracks.length === 0 && (
              <div className="text-center py-8">
                <Check className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">All Done!</h3>
                <p className="text-gray-300">All tracks have been resolved.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {resolvedTracks.length > 0 && (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Resolved Tracks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {resolvedTracks.map((track) => (
                <div key={track.id} className="flex items-center justify-between p-2 bg-white/5 rounded">
                  <div>
                    <span className="text-white">{track.originalTitle}</span>
                    <span className="text-gray-400 ml-2">by {track.artist}</span>
                  </div>
                  <Badge
                    variant={track.status === "found" ? "default" : "secondary"}
                    className={
                      track.status === "found" ? "bg-green-500/20 text-green-300" : "bg-gray-500/20 text-gray-300"
                    }
                  >
                    {track.status === "found" ? "Found" : "Skipped"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="flex justify-center">
          <Link href="/dashboard">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              Complete Sync
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
