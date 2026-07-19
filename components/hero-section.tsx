"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import Link from "next/link";
import { AnimatedPhones } from "./animated-phones";

export function HeroSection() {
  return (
    <section
      className="pt-32 pb-20 relative overflow-hidden"
      role="main"
      aria-labelledby="hero-heading"
    >
      {/* Soft background depth */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <span
          className="blob blob-a animate-float"
          style={{ top: "-120px", right: "-80px" }}
        />
        <span
          className="blob blob-b animate-float"
          style={{
            bottom: "-160px",
            left: "-100px",
            animationDelay: "2s",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column */}
          <div className="text-center lg:text-left space-y-7 fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-[0.78rem] font-medium text-muted-foreground">
              <Sparkles
                className="w-3.5 h-3.5 text-brand-500"
                aria-hidden="true"
              />
              <span>Sync your music across all platforms</span>
            </div>

            <div className="space-y-4">
              <h1
                id="hero-heading"
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight text-foreground leading-[1.05]"
              >
                Sync Your Music
                <br />
                <span className="logo-gradient">Everywhere</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Seamlessly transfer and sync your playlists between Spotify,
                YouTube Music, and more. Never lose your favorite tracks again.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="px-6"
                  aria-label="Start syncing your music now"
                >
                  <Play className="w-4 h-4" />
                  Start Syncing Now
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                aria-label="Learn how SyncIt works"
              >
                How It Works
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-semibold text-foreground">
                  50K+
                </div>
                <div className="text-sm text-muted-foreground">Users</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-semibold text-foreground">
                  1M+
                </div>
                <div className="text-sm text-muted-foreground">
                  Songs Synced
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-semibold text-foreground">
                  99.9%
                </div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>

          {/* Right Column - Animated Phones */}
          <div className="relative fade-in-up" style={{ animationDelay: "120ms" }}>
            <AnimatedPhones />
          </div>
        </div>
      </div>
    </section>
  );
}
