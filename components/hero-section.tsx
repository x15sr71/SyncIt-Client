"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { AnimatedPhones } from "./animated-phones";

const stats = [
  { value: "50K+", label: "Users" },
  { value: "1M+", label: "Songs synced" },
  { value: "99.9%", label: "Uptime" },
];

export function HeroSection() {
  return (
    <section
      className="pt-36 pb-24 sm:pt-40 sm:pb-28"
      role="main"
      aria-labelledby="hero-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left Column */}
          <div className="text-center lg:text-left fade-in-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card border border-border text-[0.72rem] sm:text-[0.78rem] font-medium text-muted-foreground max-w-full">
              <Sparkles
                className="w-3.5 h-3.5 text-brand-500"
                aria-hidden="true"
              />
              <span>Sync your music across YouTube and Spotify</span>
            </div>

            <h1
              id="hero-heading"
              className="mt-5 text-[2.15rem] sm:text-6xl lg:text-[4.25rem] font-semibold tracking-[-0.035em] text-foreground leading-[1.02] text-balance"
            >
              Move your playlists.
              <br />
              Keep them in sync.
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-md mx-auto lg:mx-0 leading-relaxed text-pretty">
              Transfer playlists between streaming services without losing a
              track. Connect once, sync whenever.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="rounded-full px-8 w-full sm:w-auto"
                  aria-label="Start syncing your music now"
                >
                  Start syncing
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="lg"
                className="rounded-full px-6 text-muted-foreground hover:text-foreground w-full sm:w-auto"
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                aria-label="Learn how SyncIt works"
              >
                How it works
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <dl className="mt-14 grid grid-cols-3 gap-4 sm:gap-8 pt-8 border-t border-border/60 max-w-md mx-auto lg:mx-0">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="text-2xl sm:text-[1.75rem] font-medium tracking-tight text-foreground tabular-nums">
                    {stat.value}
                  </dd>
                  <dd className="mt-1 text-[0.8rem] text-muted-foreground">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
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
