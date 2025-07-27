"use client"

import { Button } from "@/components/ui/button"
import { Youtube, Music, Check, Loader2, X } from "lucide-react"

type Platform = "youtube" | "spotify"
type ConnectionStatus = "idle" | "connecting" | "connected" | "error"

interface PlatformConnectProps {
  platform: Platform
  connectionStatus: ConnectionStatus
  handlePlatformConnect: (platform: Platform) => void
  handleDisconnect: (platform: Platform) => void
  isStepCompleted: (step: number) => boolean
  handleContinue: () => void
  step: number
}

export function PlatformConnect({
  platform,
  connectionStatus,
  handlePlatformConnect,
  handleDisconnect,
  isStepCompleted,
  handleContinue,
  step,
}: PlatformConnectProps) {
  const platformConfig = {
    youtube: {
      name: "YouTube Music",
      icon: Youtube,
      color: "bg-red-500",
      hoverColor: "hover:bg-red-600",
      description: "Connect your YouTube Music account to access your playlists and start syncing your music.",
    },
    spotify: {
      name: "Spotify",
      icon: Music,
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      description: "Connect your Spotify account to enable seamless playlist synchronization.",
    },
  }

  const config = platformConfig[platform]
  const Icon = config.icon

  return (
    <div className="text-center">
      <div className="mb-8">
        <div className={`w-24 h-24 ${config.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
          <Icon className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Connect {config.name}</h2>
        <p className="text-white/80 text-lg max-w-2xl mx-auto">{config.description}</p>
      </div>

      <div className="space-y-6">
        {connectionStatus === "idle" && (
          <Button
            onClick={() => handlePlatformConnect(platform)}
            className={`${config.color} ${config.hoverColor} text-white px-8 py-4 text-lg font-semibold rounded-full hover:scale-105 transition-all`}
          >
            Connect {config.name}
          </Button>
        )}

        {connectionStatus === "connecting" && (
          <div className="flex items-center justify-center space-x-3">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
            <span className="text-white text-lg">Connecting to {config.name}...</span>
          </div>
        )}

        {connectionStatus === "connected" && (
          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-3 text-green-400">
              <Check className="w-8 h-8" />
              <span className="text-xl font-semibold">Successfully connected to {config.name}!</span>
            </div>
            <div className="flex space-x-4 justify-center">
              <Button
                onClick={() => handleDisconnect(platform)}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <X className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
              <Button
                onClick={handleContinue}
                className="bg-white text-purple-600 hover:bg-white/90 px-8 py-2 font-semibold rounded-full hover:scale-105 transition-all"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {connectionStatus === "error" && (
          <div className="text-center">
            <div className="text-red-400 text-lg font-semibold mb-4">
              Failed to connect to {config.name}. Please try again.
            </div>
            <Button
              onClick={() => handlePlatformConnect(platform)}
              className={`${config.color} ${config.hoverColor} text-white px-8 py-4 text-lg font-semibold rounded-full hover:scale-105 transition-all`}
            >
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
