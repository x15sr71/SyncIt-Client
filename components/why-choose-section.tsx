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
      className="py-28 sm:py-36 relative scroll-mt-24"
      role="region"
      aria-labelledby="features-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-20">
          <div className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Why SyncIt
          </div>
          <h2
            id="features-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-foreground mb-5 leading-[1.05]"
          >
            Built for people with too many playlists.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Six things we focused on so switching platforms feels effortless.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-14 max-w-5xl mx-auto stagger">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group"
              role="article"
              aria-labelledby={`feature-${index}-title`}
            >
              <feature.icon
                className="w-5 h-5 text-brand-500 mb-5 transition-transform duration-500 ease-out group-hover:-translate-y-0.5 motion-reduce:transition-none"
                aria-hidden="true"
              />
              <h3
                id={`feature-${index}-title`}
                className="text-foreground text-[0.95rem] font-semibold tracking-tight mb-2"
              >
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
