"use client"
import { Button } from "@/components/ui/button"
import { Music, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 py-4 backdrop-blur-lg border-b border-white/10"
      role="banner"
      style={{ background: "transparent" }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 rounded-xl p-2"
            aria-label="SyncIt - Home"
          >
            <div className="logo-icon animate-pulse-glow" aria-hidden="true">
              <Music className="h-6 w-6 text-white absolute inset-0 m-auto" />
            </div>
            <span className="text-xl sm:text-2xl font-bold logo-gradient">SyncIt</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" role="navigation" aria-label="Main navigation">
            <button
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              className="text-white/90 hover:text-white transition-all duration-300 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 rounded-lg px-3 py-2 hover:bg-white/10"
            >
              Features
            </button>
            <button
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              className="text-white/90 hover:text-white transition-all duration-300 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 rounded-lg px-3 py-2 hover:bg-white/10"
            >
              How it works
            </button>
            <button
              onClick={() => document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" })}
              className="text-white/90 hover:text-white transition-all duration-300 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 rounded-lg px-3 py-2 hover:bg-white/10"
            >
              FAQ
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button
                className="px-4 sm:px-6 py-2 rounded-full bg-white text-purple-600 font-semibold hover:bg-white/90 transition-all hover:scale-105 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 shadow-lg"
                aria-label="Get started with SyncIt"
              >
                Get Started
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 rounded-xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav
            id="mobile-menu"
            className="md:hidden mt-4 pb-4 border-t border-white/20 pt-4 glass-effect"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col space-y-4 p-4">
              <button
                onClick={() => {
                  document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
                  setIsMenuOpen(false)
                }}
                className="text-white/90 hover:text-white transition-all duration-300 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 rounded-lg px-3 py-2 hover:bg-white/10 text-left"
              >
                Features
              </button>
              <button
                onClick={() => {
                  document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })
                  setIsMenuOpen(false)
                }}
                className="text-white/90 hover:text-white transition-all duration-300 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 rounded-lg px-3 py-2 hover:bg-white/10 text-left"
              >
                How it works
              </button>
              <button
                onClick={() => {
                  document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" })
                  setIsMenuOpen(false)
                }}
                className="text-white/90 hover:text-white transition-all duration-300 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 rounded-lg px-3 py-2 hover:bg-white/10 text-left"
              >
                FAQ
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
