"use client";

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
      className="py-24 sm:py-32 scroll-mt-20"
      role="region"
      aria-labelledby="features-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-16 sm:mb-20">
          <p className="text-sm text-muted-foreground tracking-wide mb-3">
            Why SyncIt
          </p>
          <h2
            id="features-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-foreground text-balance"
          >
            Built for people with too many playlists.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Six things we focused on so switching platforms feels effortless.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12 max-w-5xl mx-auto stagger">
          {features.map((feature, index) => (
            <article key={index} aria-labelledby={`feature-${index}-title`}>
              <div className="w-11 h-11 rounded-2xl bg-accent/70 border border-border/50 flex items-center justify-center mb-5">
                <feature.icon
                  className="w-[1.15rem] h-[1.15rem] text-foreground"
                  aria-hidden="true"
                />
              </div>
              <h3
                id={`feature-${index}-title`}
                className="text-foreground text-[0.98rem] font-medium mb-2"
              >
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
