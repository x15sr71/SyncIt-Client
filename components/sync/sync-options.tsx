"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeftRight, Copy } from "lucide-react";

type SyncMode = "migrate" | "sync";

interface SyncOptionsProps {
  syncMode: SyncMode;
  setSyncMode: (mode: SyncMode) => void;
  handleContinue: () => void;
}

export function SyncOptions({
  syncMode,
  setSyncMode,
  handleContinue,
}: SyncOptionsProps) {
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
      description:
        "Keep your playlists synchronized across platforms automatically",
      icon: ArrowLeftRight,
      recommended: false,
    },
  ];

  return (
    <div className="text-center fade-in-up">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-2">
          Choose Your Sync Method
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Select how you want to manage your playlists across platforms
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8 text-left">
        {options.map((option) => {
          const Icon = option.icon;
          return (
            <Card
              key={option.id}
              className={`cursor-pointer transition-all duration-200 ${
                syncMode === option.id
                  ? "border-brand-300 ring-2 ring-brand-200"
                  : "hover:bg-accent/40"
              }`}
              onClick={() => setSyncMode(option.id)}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-brand-gradStart to-brand-gradEnd rounded-lg flex items-center justify-center shadow-soft">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  {option.recommended && (
                    <span className="text-[0.72rem] font-medium px-2.5 py-0.5 rounded-full border border-brand-200 bg-brand-50 text-brand-700">
                      Recommended
                    </span>
                  )}
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1">
                  {option.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Button onClick={handleContinue} className="px-6">
        Continue with {syncMode === "migrate" ? "Migration" : "Sync"}
      </Button>
    </div>
  );
}
