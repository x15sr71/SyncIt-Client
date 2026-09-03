"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Music2, Link2, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Music2,
    title: "Connect Your Accounts",
    description:
      "Link your Spotify, YouTube Music, and other streaming accounts securely",
  },
  {
    icon: Link2,
    title: "Select Playlists",
    description: "Choose which playlists you want to sync across platforms",
  },
  {
    icon: CheckCircle,
    title: "Enjoy Synced Music",
    description:
      "Your music is now available everywhere, automatically updated",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-20 relative scroll-mt-20"
      role="region"
      aria-labelledby="how-it-works-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <div className="text-sm font-medium logo-gradient inline-block mb-2">
            How it works
          </div>
          <h2
            id="how-it-works-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-4"
          >
            Three steps. About a minute.
          </h2>
          <p className="text-lg text-muted-foreground">
            Get started in just three simple steps and enjoy your music
            everywhere.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 stagger">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="hover-lift"
              role="article"
              aria-labelledby={`step-${index}-title`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs font-mono text-muted-foreground tracking-wide">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-gradStart to-brand-gradEnd flex items-center justify-center shadow-soft">
                    <step.icon
                      className="w-4 h-4 text-white"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <h3
                  id={`step-${index}-title`}
                  className="text-foreground text-base font-semibold mb-1.5"
                >
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
