"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Music2, Link2, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: Music2,
    title: "Connect Your Accounts",
    description: "Link your Spotify, YouTube Music, and other streaming accounts securely",
  },
  {
    icon: Link2,
    title: "Select Playlists",
    description: "Choose which playlists you want to sync across platforms",
  },
  {
    icon: CheckCircle,
    title: "Enjoy Synced Music",
    description: "Your music is now available everywhere, automatically updated",
  },
]

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-20 relative scroll-mt-20"
      role="region"
      aria-labelledby="how-it-works-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 id="how-it-works-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            How It <span className="logo-gradient">Works</span>
          </h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            Get started in just three simple steps and enjoy your music everywhere
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative" role="article" aria-labelledby={`step-${index}-title`}>
              <Card className="glass-effect border-white/20 hover-lift text-center h-full">
                <CardContent className="p-8">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="mx-auto w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 mt-4">
                    <step.icon className="w-8 h-8 text-white" aria-hidden="true" />
                  </div>

                  {/* Content */}
                  <h3 id={`step-${index}-title`} className="text-white text-xl font-semibold mb-4">
                    {step.title}
                  </h3>
                  <p className="text-white/80 leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>

              {/* Arrow between steps */}
              {index < steps.length - 1 && (
                <div
                  className="hidden md:block absolute top-1/2 -right-6 lg:-right-8 transform -translate-y-1/2"
                  aria-hidden="true"
                >
                  <ArrowRight className="w-6 h-6 text-white/40" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
