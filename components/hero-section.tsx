"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Sparkles } from "lucide-react"
import Link from "next/link"
import { AnimatedPhones } from "./animated-phones"

export function HeroSection() {
  return (
    <section className="pt-32 pb-20 relative overflow-hidden" role="main" aria-labelledby="hero-heading">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>Sync your music across all platforms</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1
                id="hero-heading"
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight"
              >
                Sync Your Music
                <br />
                <span className="logo-gradient">Everywhere</span>
              </h1>
              <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Seamlessly transfer and sync your playlists between Spotify, YouTube Music, and more. Never lose your
                favorite tracks again.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-white/90 font-semibold px-8 py-4 rounded-full transition-all hover:scale-105 shadow-xl focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                  aria-label="Start syncing your music now"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Syncing Now
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-full backdrop-blur-sm transition-all hover:scale-105 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 bg-transparent"
                onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                aria-label="Learn how SyncIt works"
              >
                How It Works
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/20">
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-white">50K+</div>
                <div className="text-sm text-white/70">Users</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-white">1M+</div>
                <div className="text-sm text-white/70">Songs Synced</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-white">99.9%</div>
                <div className="text-sm text-white/70">Uptime</div>
              </div>
            </div>
          </div>

          {/* Right Column - Animated Phones */}
          <div className="relative">
            <AnimatedPhones />
          </div>
        </div>
      </div>
    </section>
  )
}
