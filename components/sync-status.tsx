"use client"

import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, XCircle, Music } from "lucide-react"

interface SyncStatusProps {
  playlistName: string
  status: "success" | "in-progress" | "failed"
  timestamp: string
  tracksCount: number
}

export function SyncStatus({ playlistName, status, timestamp, tracksCount }: SyncStatusProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "in-progress":
        return <Clock className="w-4 h-4 text-yellow-600 animate-spin" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />
    }
  }

  const getStatusBadge = () => {
    switch (status) {
      case "success":
        return (
          <Badge variant="secondary" className="bg-green-500/20 text-green-700 rounded-xl">
            Success
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 rounded-xl">
            In Progress
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="secondary" className="bg-red-500/20 text-red-700 rounded-xl">
            Failed
          </Badge>
        )
    }
  }

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors">
      <div className="flex items-center space-x-3">
        {getStatusIcon()}
        <div>
          <p className="text-sm font-medium text-primary-dark">{playlistName}</p>
          <div className="flex items-center space-x-2 text-xs text-secondary-dark">
            <Music className="w-3 h-3" />
            <span>{tracksCount} tracks</span>
            <span>•</span>
            <span>{timestamp}</span>
          </div>
        </div>
      </div>
      {getStatusBadge()}
    </div>
  )
}
