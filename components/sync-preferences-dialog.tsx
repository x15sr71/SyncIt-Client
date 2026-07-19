"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Clock, FolderSyncIcon as Sync, CheckCircle } from "lucide-react";

interface SyncPreferencesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (frequency: string) => void;
  playlistName: string;
}

const syncOptions = [
  {
    id: "hourly",
    label: "Every hour",
    description: "Keep playlists perfectly in sync",
    badge: "Recommended",
    badgeColor: "bg-green-50 text-green-700 border-green-200",
  },
  {
    id: "3hours",
    label: "Every 3 hours",
    description: "Good balance of sync and API usage",
    badge: "Popular",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: "daily",
    label: "Every 24 hours",
    description: "Minimal API usage, daily updates",
    badge: "Efficient",
    badgeColor: "bg-brand-50 text-brand-700 border-brand-200",
  },
];

export function SyncPreferencesDialog({
  isOpen,
  onClose,
  onConfirm,
  playlistName,
}: SyncPreferencesDialogProps) {
  const [selectedFrequency, setSelectedFrequency] = useState("hourly");

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(selectedFrequency);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/40 backdrop-blur-sm fade-in-up">
      <Card className="w-full max-w-md shadow-elev">
        <CardHeader className="pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-gradStart to-brand-gradEnd rounded-lg flex items-center justify-center shadow-soft">
                <Sync className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-foreground text-lg font-semibold">
                  Sync Preferences
                </CardTitle>
                <p className="text-muted-foreground text-sm">
                  Choose sync frequency
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              aria-label="Close sync preferences"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 pt-6">
          {/* Playlist Info */}
          <div className="text-center p-4 rounded-lg border border-border bg-muted/40">
            <h3 className="text-foreground font-semibold mb-0.5">
              "{playlistName}"
            </h3>
            <p className="text-muted-foreground text-sm">
              will be kept in sync automatically
            </p>
          </div>

          {/* Sync Frequency Options */}
          <div className="space-y-2">
            <h4 className="text-foreground font-medium text-sm">
              How often should we sync?
            </h4>
            {syncOptions.map((option) => (
              <Card
                key={option.id}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedFrequency === option.id
                    ? "border-brand-300 ring-2 ring-brand-200"
                    : "hover:bg-accent/40"
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
                        className="w-4 h-4 accent-brand-500"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground font-medium text-sm">
                            {option.label}
                          </span>
                          {option.badge && (
                            <Badge
                              variant="outline"
                              className={`${option.badgeColor} text-xs`}
                            >
                              {option.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm mt-0.5">
                          {option.description}
                        </p>
                      </div>
                    </div>
                    {selectedFrequency === option.id && (
                      <CheckCircle className="w-5 h-5 text-brand-500" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Info */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-700 text-sm">
              <strong>Note:</strong> You can change these settings anytime in
              your dashboard. Sync will automatically pause if API limits are
              reached.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleConfirm} className="flex-1">
              Enable Sync
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
