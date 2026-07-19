"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, Music2, Youtube } from "lucide-react";

interface PlatformDropdownProps {
  label: string;
  selectedPlatform: "spotify" | "youtube";
  onPlatformChange: (platform: "spotify" | "youtube") => void;
  disabled?: boolean;
}

const platforms = [
  {
    id: "spotify" as const,
    name: "Spotify",
    icon: Music2,
    color: "text-[#1db954]",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  {
    id: "youtube" as const,
    name: "YouTube Music",
    icon: Youtube,
    color: "text-[#ff3b3b]",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
];

export function PlatformDropdown({
  label,
  selectedPlatform,
  onPlatformChange,
  disabled = false,
}: PlatformDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedPlatformData = platforms.find((p) => p.id === selectedPlatform);

  return (
    <div className="relative">
      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1.5 font-medium text-center">
        {label}
      </p>
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-40 justify-between ${selectedPlatformData?.borderColor} ${selectedPlatformData?.bgColor}`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          role="combobox"
        >
          <div className="flex items-center gap-2">
            {selectedPlatformData && (
              <>
                <selectedPlatformData.icon
                  className={`w-4 h-4 ${selectedPlatformData.color}`}
                />
                <span className="text-foreground font-medium">
                  {selectedPlatformData.name}
                </span>
              </>
            )}
          </div>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </Button>

        {isOpen && (
          <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-elev">
            <CardContent className="p-1.5">
              <div
                role="listbox"
                aria-label={`Select ${label.toLowerCase()} platform`}
              >
                {platforms.map((platform) => (
                  <Button
                    key={platform.id}
                    variant="ghost"
                    onClick={() => {
                      onPlatformChange(platform.id);
                      setIsOpen(false);
                    }}
                    className={`w-full justify-start mb-0.5 last:mb-0 ${
                      selectedPlatform === platform.id ? "bg-accent" : ""
                    }`}
                    role="option"
                    aria-selected={selectedPlatform === platform.id}
                  >
                    <platform.icon
                      className={`w-4 h-4 mr-2 ${platform.color}`}
                    />
                    <span className="text-foreground">{platform.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
