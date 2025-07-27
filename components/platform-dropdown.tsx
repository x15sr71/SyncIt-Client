"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, Music2, Youtube } from "lucide-react"

interface PlatformDropdownProps {
  label: string
  selectedPlatform: "spotify" | "youtube"
  onPlatformChange: (platform: "spotify" | "youtube") => void
  disabled?: boolean
}

const platforms = [
  {
    id: "spotify" as const,
    name: "Spotify",
    icon: Music2,
    color: "text-green-600",
    bgColor: "bg-green-500/20",
    borderColor: "border-green-500/30",
  },
  {
    id: "youtube" as const,
    name: "YouTube Music",
    icon: Youtube,
    color: "text-red-600",
    bgColor: "bg-red-500/20",
    borderColor: "border-red-500/30",
  },
]

export function PlatformDropdown({
  label,
  selectedPlatform,
  onPlatformChange,
  disabled = false,
}: PlatformDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedPlatformData = platforms.find((p) => p.id === selectedPlatform)

  return (
    <div className="relative">
      <p className="text-secondary-dark mb-2 font-medium text-center">{label}</p>
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-40 justify-between rounded-2xl border-2 ${selectedPlatformData?.borderColor} ${selectedPlatformData?.bgColor} hover:bg-opacity-30 focus-visible:outline-2 focus-visible:outline-gray-800 focus-visible:outline-offset-2 shadow-lg`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          role="combobox"
        >
          <div className="flex items-center gap-2">
            {selectedPlatformData && (
              <>
                <selectedPlatformData.icon className={`w-4 h-4 ${selectedPlatformData.color}`} />
                <span className="text-primary-dark font-medium">{selectedPlatformData.name}</span>
              </>
            )}
          </div>
          <ChevronDown className={`w-4 h-4 text-secondary-dark transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </Button>

        {isOpen && (
          <Card className="absolute top-full left-0 right-0 mt-2 z-50 glass-card border-white/40 shadow-xl">
            <CardContent className="p-2">
              <div role="listbox" aria-label={`Select ${label.toLowerCase()} platform`}>
                {platforms.map((platform) => (
                  <Button
                    key={platform.id}
                    variant="ghost"
                    onClick={() => {
                      onPlatformChange(platform.id)
                      setIsOpen(false)
                    }}
                    className={`w-full justify-start rounded-xl mb-1 last:mb-0 hover:bg-white/20 ${
                      selectedPlatform === platform.id ? "bg-white/10" : ""
                    }`}
                    role="option"
                    aria-selected={selectedPlatform === platform.id}
                  >
                    <platform.icon className={`w-4 h-4 mr-2 ${platform.color}`} />
                    <span className="text-primary-dark">{platform.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
