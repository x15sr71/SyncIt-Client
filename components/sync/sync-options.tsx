"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeftRight, Copy } from "lucide-react"

type SyncMode = "migrate" | "sync"

interface SyncOptionsProps {
  syncMode: SyncMode
  setSyncMode: (mode: SyncMode) => void
  handleContinue: () => void
}

export function SyncOptions({ syncMode, setSyncMode, handleContinue }: SyncOptionsProps) {
  const options = [
    {
      id: "migrate" as SyncMode,
      title: "One-time Migration",
      description: "Transfer your playlists once from one platform to another",
      icon: Copy,
      recommended: true,
    },
    {
      id: "sync" as SyncMode,
      title: "Continuous Sync",
      description: "Keep your playlists synchronized across platforms automatically",
      icon: ArrowLeftRight,
      recommended: false,
    },
  ]

  return (
    <div className="text-center">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Choose Your Sync Method</h2>
        <p className="text-white/80 text-lg max-w-2xl mx-auto">
          Select how you want to manage your playlists across platforms
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {options.map((option) => {
          const Icon = option.icon
          return (
            <Card
              key={option.id}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                syncMode === option.id
                  ? "bg-white/20 border-white/40 ring-2 ring-white/50"
                  : "bg-white/10 border-white/20 hover:bg-white/15"
              }`}
              onClick={() => setSyncMode(option.id)}
            >
              <CardContent className="p-6 text-center">
                {option.recommended && (
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">
                    RECOMMENDED
                  </div>
                )}
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{option.title}</h3>
                <p className="text-white/80">{option.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Button
        onClick={handleContinue}
        className="bg-white text-purple-600 hover:bg-white/90 px-8 py-3 text-lg font-semibold rounded-full hover:scale-105 transition-all"
      >
        Continue with {syncMode === "migrate" ? "Migration" : "Sync"}
      </Button>
    </div>
  )
}
