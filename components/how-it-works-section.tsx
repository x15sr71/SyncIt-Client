"use client";

import { Music2, Link2, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Music2,
    title: "Connect Your Accounts",
    description:
      "Link your Spotify, YouTube Music, and other streaming accounts securely",
  },
  {
    icon: Link2,
    title: "Select Playlists",
    description: "Choose which playlists you want to sync across platforms",
  },
  {
    icon: CheckCircle,
    title: "Enjoy Synced Music",
    description:
      "Your music is now available everywhere, automatically updated",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-28 sm:py-36 relative scroll-mt-24"
      role="region"
      aria-labelledby="how-it-works-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-20">
          <div className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-muted-foreground mb-4">
            How it works
          </div>
          <h2
            id="how-it-works-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-foreground mb-5 leading-[1.05]"
          >
            Three steps. About a minute.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Get started in just three simple steps and enjoy your music
            everywhere.
          </p>
        </div>

        {/* Hairline dividers instead of cards — the columns already group
            the content, so borders on every side are redundant. */}
        <div className="grid md:grid-cols-3 gap-x-12 gap-y-14 max-w-5xl mx-auto stagger">
          {steps.map((step, index) => (
            <div
              key={index}
              className="md:border-l md:border-border md:pl-8 first:md:border-l-0 first:md:pl-0"
              role="article"
              aria-labelledby={`step-${index}-title`}
            >
              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-4xl font-semibold tracking-tight text-border select-none">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <step.icon
                  className="w-4 h-4 text-brand-500 shrink-0"
                  aria-hidden="true"
                />
              </div>
              <h3
                id={`step-${index}-title`}
                className="text-foreground text-[0.95rem] font-semibold tracking-tight mb-2"
              >
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
