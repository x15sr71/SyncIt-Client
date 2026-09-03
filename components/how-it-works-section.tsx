"use client";

const steps = [
  {
    title: "Connect Your Accounts",
    description:
      "Link your Spotify, YouTube Music, and other streaming accounts securely",
  },
  {
    title: "Select Playlists",
    description: "Choose which playlists you want to sync across platforms",
  },
  {
    title: "Enjoy Synced Music",
    description:
      "Your music is now available everywhere, automatically updated",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-24 sm:py-32 scroll-mt-20 border-t border-border/50"
      role="region"
      aria-labelledby="how-it-works-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-16 sm:mb-20">
          <p className="text-sm text-muted-foreground tracking-wide mb-3">
            How it works
          </p>
          <h2
            id="how-it-works-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-foreground text-balance"
          >
            Three steps. About a minute.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Connect your accounts, pick what moves, and let it run.
          </p>
        </div>

        <ol className="grid md:grid-cols-3 gap-12 md:gap-8 max-w-5xl mx-auto stagger">
          {steps.map((step, index) => (
            <li
              key={index}
              className="md:pl-6 md:border-l md:border-border/60 first:md:border-l-0 first:md:pl-0"
            >
              <div className="text-5xl font-semibold tracking-tight text-muted-foreground/25 tabular-nums mb-5">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="text-foreground text-[0.98rem] font-medium mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
