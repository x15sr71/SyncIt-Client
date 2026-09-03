"use client";

import { Button } from "@/components/ui/button";
import { Youtube, Music, Check, Loader2, X } from "lucide-react";

type Platform = "youtube" | "spotify";
type ConnectionStatus = "idle" | "connecting" | "connected" | "error";

interface PlatformConnectProps {
  platform: Platform;
  connectionStatus: ConnectionStatus;
  handlePlatformConnect: (platform: Platform) => void;
  handleDisconnect: (platform: Platform) => void;
  isStepCompleted: (step: number) => boolean;
  handleContinue: () => void;
  step: number;
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
      color: "bg-[#ff3b3b]",
      hoverColor: "hover:bg-[#e62e2e]",
      description:
        "Connect your YouTube Music account to access your playlists and start syncing your music.",
    },
    spotify: {
      name: "Spotify",
      icon: Music,
      color: "bg-[#1db954]",
      hoverColor: "hover:bg-[#179c45]",
      description:
        "Connect your Spotify account to enable seamless playlist synchronization.",
    },
  };

  const config = platformConfig[platform];
  const Icon = config.icon;

  return (
    <div className="text-center fade-in-up">
      <div className="mb-8">
        <div
          className={`w-20 h-20 ${config.color} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-soft`}
        >
          <Icon className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-2">
          Connect {config.name}
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          {config.description}
        </p>
      </div>

      <div className="space-y-6">
        {connectionStatus === "idle" && (
          <Button
            onClick={() => handlePlatformConnect(platform)}
            className={`${config.color} ${config.hoverColor} text-white px-6 py-3`}
          >
            Connect {config.name}
          </Button>
        )}

        {connectionStatus === "connecting" && (
          <div className="flex items-center justify-center space-x-3">
            <Loader2 className="w-5 h-5 text-brand-500 animate-spin" />
            <span className="text-foreground">
              Connecting to {config.name}...
            </span>
          </div>
        )}

        {connectionStatus === "connected" && (
          <div className="space-y-5">
            <div className="flex items-center justify-center space-x-2 text-emerald-600 dark:text-emerald-400">
              <Check className="w-6 h-6" />
              <span className="text-base font-medium">
                Successfully connected to {config.name}!
              </span>
            </div>
            <div className="flex space-x-3 justify-center">
              <Button
                onClick={() => handleDisconnect(platform)}
                variant="outline"
              >
                <X className="w-4 h-4" />
                Disconnect
              </Button>
              <Button onClick={handleContinue}>Continue</Button>
            </div>
          </div>
        )}

        {connectionStatus === "error" && (
          <div className="text-center">
            <div className="text-red-600 dark:text-red-400 font-medium mb-4">
              Failed to connect to {config.name}. Please try again.
            </div>
            <Button
              onClick={() => handlePlatformConnect(platform)}
              className={`${config.color} ${config.hoverColor} text-white px-6 py-3`}
            >
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
