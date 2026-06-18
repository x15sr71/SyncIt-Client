"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Zap, Users, Heart, Clock, Smartphone } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Sync thousands of songs in seconds with our optimized algorithms",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your data is encrypted and we never store your personal music preferences",
  },
  {
    icon: Users,
    title: "Multi-Platform",
    description:
      "Works seamlessly across Spotify, YouTube Music, Apple Music, and more",
  },
  {
    icon: Heart,
    title: "Smart Matching",
    description:
      "AI-powered song matching ensures you never lose your favorite tracks",
  },
  {
    icon: Clock,
    title: "Real-time Sync",
    description:
      "Keep your playlists updated automatically across all platforms",
  },
  {
    icon: Smartphone,
    title: "Mobile Ready",
    description:
      "Access your synced music anywhere with our mobile-optimized interface",
  },
];

export function WhyChooseSection() {
  return (
    <section
      id="features"
      className="py-20 relative scroll-mt-20"
      role="region"
      aria-labelledby="features-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <div className="text-sm font-medium logo-gradient inline-block mb-2">
            Why SyncIt
          </div>
          <h2
            id="features-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-4"
          >
            Built for people with too many playlists.
          </h2>
          <p className="text-lg text-muted-foreground">
            Six things we focused on so switching platforms feels effortless.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="hover-lift group"
              role="article"
              aria-labelledby={`feature-${index}-title`}
            >
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-gradStart to-brand-gradEnd flex items-center justify-center mb-3 shadow-soft">
                  <feature.icon
                    className="w-5 h-5 text-white"
                    aria-hidden="true"
                  />
                </div>
                <CardTitle
                  id={`feature-${index}-title`}
                  className="text-foreground text-base font-semibold"
                >
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
