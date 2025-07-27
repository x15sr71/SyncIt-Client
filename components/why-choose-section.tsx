"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Zap, Users, Heart, Clock, Smartphone } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Sync thousands of songs in seconds with our optimized algorithms",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is encrypted and we never store your personal music preferences",
  },
  {
    icon: Users,
    title: "Multi-Platform",
    description: "Works seamlessly across Spotify, YouTube Music, Apple Music, and more",
  },
  {
    icon: Heart,
    title: "Smart Matching",
    description: "AI-powered song matching ensures you never lose your favorite tracks",
  },
  {
    icon: Clock,
    title: "Real-time Sync",
    description: "Keep your playlists updated automatically across all platforms",
  },
  {
    icon: Smartphone,
    title: "Mobile Ready",
    description: "Access your synced music anywhere with our mobile-optimized interface",
  },
]

export function WhyChooseSection() {
  return (
    <section id="features" className="py-20 relative scroll-mt-20" role="region" aria-labelledby="features-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 id="features-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Why Choose <span className="logo-gradient">SyncIt</span>?
          </h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            Experience the most advanced music synchronization platform with features designed for music lovers
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="glass-effect border-white/20 hover-lift group"
              role="article"
              aria-labelledby={`feature-${index}-title`}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" aria-hidden="true" />
                </div>
                <CardTitle id={`feature-${index}-title`} className="text-white text-xl font-semibold">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-white/80 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
