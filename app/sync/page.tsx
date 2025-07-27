"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Youtube, ArrowLeftRight, PodcastIcon as SpotifyIcon } from "lucide-react"
import { Header } from "@/components/sync/header"
import { StepsProgress } from "@/components/sync/steps-progress"
import { PlatformConnect } from "@/components/sync/platform-connect"
import { SyncOptions } from "@/components/sync/sync-options"
import { PlaylistSelection } from "@/components/sync/playlist-selection"

type Platform = "youtube" | "spotify"
type SyncMode = "migrate" | "sync"
type ConnectionStatus = "idle" | "connecting" | "connected" | "error"

interface Step {
  title: string
  description: string
  icon: React.ReactNode
}

const steps: Step[] = [
  {
    title: "Connect YouTube Music",
    description: "Link your YouTube Music account to access your playlists",
    icon: <Youtube className="h-6 w-6" />,
  },
  {
    title: "Connect Spotify",
    description: "Link your Spotify account to enable playlist sync",
    icon: <SpotifyIcon className="h-6 w-6" />,
  },
  {
    title: "Choose Sync Options",
    description: "Select how you want to manage your playlists",
    icon: <ArrowLeftRight className="h-6 w-6" />,
  },
]

const samplePlaylists = [
  {
    id: "1",
    name: "My Favorites",
    songCount: 42,
    imageUrl: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "2",
    name: "Workout Mix",
    songCount: 28,
    imageUrl: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "3",
    name: "Chill Vibes",
    songCount: 35,
    imageUrl: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "4",
    name: "Road Trip",
    songCount: 67,
    imageUrl: "/placeholder.svg?height=50&width=50",
  },
]

const currentUser = {
  name: "Alex Johnson",
  avatar: "/placeholder.svg?height=40&width=40",
  premium: true,
}

export default function SyncPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(0)
  const [connectionStatus, setConnectionStatus] = useState<{
    [key in Platform]?: ConnectionStatus
  }>({
    youtube: "idle",
    spotify: "idle",
  })
  const [syncMode, setSyncMode] = useState<SyncMode>("migrate")
  const [selectedPlaylists, setSelectedPlaylists] = useState<{
    [key: string]: boolean
  }>({})
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const youtubeLoginSuccess = searchParams.get("youtubeLoginSuccess")
    const spotifyLoginSuccess = searchParams.get("spotifyLoginSuccess")

    if (youtubeLoginSuccess === "true") {
      setConnectionStatus((prev) => ({
        ...prev,
        youtube: "connected",
      }))
      setCurrentStep(1)
    }

    if (spotifyLoginSuccess === "true") {
      setConnectionStatus((prev) => ({
        ...prev,
        spotify: "connected",
      }))
      setCurrentStep(2)
    }
  }, [searchParams])

  const handlePlatformConnect = (platform: Platform) => {
    setConnectionStatus((prev) => ({
      ...prev,
      [platform]: "connecting",
    }))

    // Simulate OAuth connection
    setTimeout(() => {
      setConnectionStatus((prev) => ({
        ...prev,
        [platform]: "connected",
      }))
      if (platform === "youtube") {
        setCurrentStep(1)
      } else if (platform === "spotify") {
        setCurrentStep(2)
      }
    }, 2000)
  }

  const handleDisconnect = (platform: Platform) => {
    setConnectionStatus((prev) => ({
      ...prev,
      [platform]: "idle",
    }))
    if (platform === "youtube") {
      setCurrentStep(0)
    } else if (platform === "spotify" && currentStep > 1) {
      setCurrentStep(1)
    }
  }

  const togglePlaylist = (id: string) => {
    setSelectedPlaylists((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleContinue = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsProcessing(true)
      setTimeout(() => {
        setIsProcessing(false)
        router.push("/dashboard")
      }, 3000)
    }
  }

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return "complete"
    if (stepIndex === currentStep) return "current"
    return "upcoming"
  }

  const toggleAllPlaylists = () => {
    const allSelected = Object.values(selectedPlaylists).every((selected) => selected)

    if (allSelected) {
      setSelectedPlaylists({})
    } else {
      const newSelectedPlaylists: { [key: string]: boolean } = {}
      samplePlaylists.forEach((playlist) => {
        newSelectedPlaylists[playlist.id] = true
      })
      setSelectedPlaylists(newSelectedPlaylists)
    }
  }

  const isStepCompleted = (step: number) => {
    if (step === 0) return connectionStatus.youtube === "connected"
    if (step === 1) return connectionStatus.spotify === "connected"
    if (step === 2) return Object.keys(selectedPlaylists).length > 0
    return false
  }

  return (
    <div className="min-h-screen gradient-background">
      <Header currentUser={currentUser} />

      <section className="pt-28 pb-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <StepsProgress steps={steps} currentStep={currentStep} getStepStatus={getStepStatus} />

          <div className="max-w-4xl mx-auto glass-effect rounded-3xl p-8 md:p-10">
            {currentStep === 0 && (
              <PlatformConnect
                platform="youtube"
                connectionStatus={connectionStatus.youtube ?? "idle"}
                handlePlatformConnect={handlePlatformConnect}
                handleDisconnect={handleDisconnect}
                isStepCompleted={isStepCompleted}
                handleContinue={handleContinue}
                step={0}
              />
            )}

            {currentStep === 1 && connectionStatus.youtube === "connected" && (
              <PlatformConnect
                platform="spotify"
                connectionStatus={connectionStatus.spotify ?? "idle"}
                handlePlatformConnect={handlePlatformConnect}
                handleDisconnect={handleDisconnect}
                isStepCompleted={isStepCompleted}
                handleContinue={handleContinue}
                step={1}
              />
            )}

            {currentStep === 2 && (
              <SyncOptions syncMode={syncMode} setSyncMode={setSyncMode} handleContinue={handleContinue} />
            )}

            {currentStep === 3 && (
              <PlaylistSelection
                playlists={samplePlaylists}
                selectedPlaylists={selectedPlaylists}
                togglePlaylist={togglePlaylist}
                toggleAllPlaylists={toggleAllPlaylists}
                isProcessing={isProcessing}
                syncMode={syncMode}
                handleContinue={() => {
                  setIsProcessing(true)
                  setTimeout(() => {
                    setIsProcessing(false)
                    setCurrentStep(4)
                  }, 3000)
                }}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
