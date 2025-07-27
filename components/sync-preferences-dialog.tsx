"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Clock, FolderSyncIcon as Sync, CheckCircle } from "lucide-react"

interface SyncPreferencesDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (frequency: string) => void
  playlistName: string
}

const syncOptions = [
  {
    id: "hourly",
    label: "Every hour",
    description: "Keep playlists perfectly in sync",
    badge: "Recommended",
    badgeColor: "bg-green-500/20 text-green-300",
  },
  {
    id: "3hours",
    label: "Every 3 hours",
    description: "Good balance of sync and API usage",
    badge: "Popular",
    badgeColor: "bg-blue-500/20 text-blue-300",
  },
  {
    id: "daily",
    label: "Every 24 hours",
    description: "Minimal API usage, daily updates",
    badge: "Efficient",
    badgeColor: "bg-purple-500/20 text-purple-300",
  },
]

export function SyncPreferencesDialog({ isOpen, onClose, onConfirm, playlistName }: SyncPreferencesDialogProps) {
  const [selectedFrequency, setSelectedFrequency] = useState("hourly")

  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm(selectedFrequency)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md glass-card border-white/40 shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Sync className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-white">Sync Preferences</CardTitle>
                <p className="text-white/70 text-sm">Choose sync frequency</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white/70 hover:text-white hover:bg-white/20 rounded-xl"
              aria-label="Close sync preferences"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Playlist Info */}
          <div className="text-center p-4 bg-white/10 rounded-2xl">
            <h3 className="text-white font-semibold mb-1">"{playlistName}"</h3>
            <p className="text-white/70 text-sm">will be kept in sync automatically</p>
          </div>

          {/* Sync Frequency Options */}
          <div className="space-y-3">
            <h4 className="text-white font-medium">How often should we sync?</h4>
            {syncOptions.map((option) => (
              <Card
                key={option.id}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedFrequency === option.id
                    ? "bg-white/20 border-white/40 ring-2 ring-purple-500/50"
                    : "bg-white/5 border-white/20 hover:bg-white/10"
                }`}
                onClick={() => setSelectedFrequency(option.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={selectedFrequency === option.id}
                        onChange={() => setSelectedFrequency(option.id)}
                        className="w-4 h-4 text-purple-600 bg-white/20 border-white/30 focus:ring-purple-500 focus:ring-2"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-white/70" />
                          <span className="text-white font-medium">{option.label}</span>
                          {option.badge && (
                            <Badge className={`${option.badgeColor} rounded-lg text-xs`}>{option.badge}</Badge>
                          )}
                        </div>
                        <p className="text-white/70 text-sm mt-1">{option.description}</p>
                      </div>
                    </div>
                    {selectedFrequency === option.id && <CheckCircle className="w-5 h-5 text-purple-400" />}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Info */}
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <p className="text-blue-300 text-sm">
              <strong>Note:</strong> You can change these settings anytime in your dashboard. Sync will automatically
              pause if API limits are reached.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl border-white/30 text-white/70 hover:bg-white/10 hover:text-white bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold shadow-lg"
            >
              Enable Sync
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
