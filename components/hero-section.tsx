"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import Link from "next/link";
import { AnimatedPhones } from "./animated-phones";

export function HeroSection() {
  return (
    <section
      className="pt-36 pb-28 sm:pt-44 sm:pb-36 relative overflow-hidden"
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
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Column */}
          <div className="text-center lg:text-left space-y-8 fade-in-up">
            <div className="inline-flex items-center gap-2 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              <Sparkles className="w-3 h-3 text-brand-500" aria-hidden="true" />
              <span>Sync across every platform</span>
            </div>

            <div className="space-y-6">
              <h1
                id="hero-heading"
                className="text-[2.75rem] sm:text-6xl lg:text-7xl font-semibold tracking-[-0.035em] text-foreground leading-[0.95]"
              >
                Sync Your Music
                <br />
                <span className="logo-gradient">Everywhere</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Seamlessly transfer and sync your playlists between Spotify,
                YouTube Music, and more. Never lose your favorite tracks again.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-1">
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

            <div className="grid grid-cols-3 gap-8 pt-12">
              <div className="text-center lg:text-left">
                <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
                  50K+
                </div>
                <div className="mt-1 text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
                  Users
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
                  1M+
                </div>
                <div className="mt-1 text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
                  Songs synced
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
                  99.9%
                </div>
                <div className="mt-1 text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
                  Uptime
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Animated Phones */}
          <div
            className="relative fade-in-up"
            style={{ animationDelay: "120ms" }}
          >
            <AnimatedPhones />
          </div>
        </div>
      </div>
    </section>
  );
}
