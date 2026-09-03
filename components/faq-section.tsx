"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Which music platforms does SyncIt support?",
    answer:
      "SyncIt currently supports Spotify and YouTube Music, with Apple Music, Amazon Music, Tidal, and Deezer coming soon. We're constantly adding new platforms based on user demand.",
  },
  {
    question: "Is my music data secure?",
    answer:
      "We use industry-standard encryption and never store your personal music data. We only access the minimum information needed to sync your playlists, and you can revoke access at any time.",
  },
  {
    question: "How accurate is the song matching?",
    answer:
      "Our AI-powered matching system has a 95%+ accuracy rate. When exact matches aren't found, we suggest the closest alternatives and let you manually review any uncertain matches.",
  },
  {
    question: "Can I sync playlists in both directions?",
    answer:
      "Yes! You can sync from any supported platform to any other. Create a playlist on Spotify and sync it to YouTube Music, or vice versa.",
  },
  {
    question: "What happens if a song isn't available on the target platform?",
    answer:
      "We'll notify you of any songs that couldn't be found and suggest similar alternatives. You can also manually search for replacements or skip those tracks.",
  },
  {
    question: "Is there a limit to how many playlists I can sync?",
    answer:
      "Free users can sync up to 5 playlists. Premium users get unlimited playlist syncing, automatic updates every 20 minutes, and priority support.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="py-24 sm:py-32 scroll-mt-20 border-t border-border/50"
      role="region"
      aria-labelledby="faq-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-14 sm:mb-16">
          <p className="text-sm text-muted-foreground tracking-wide mb-3">
            FAQ
          </p>
          <h2
            id="faq-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-foreground"
          >
            Frequently asked.
          </h2>
        </div>

        <div className="max-w-2xl mx-auto divide-y divide-border/60 border-y border-border/60">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index}>
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-content-${index}`}
                  className="w-full flex items-center justify-between gap-6 py-5 text-left group focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 rounded-lg"
                >
                  <span className="text-[0.98rem] font-medium text-foreground group-hover:text-muted-foreground transition-colors duration-200">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-spring motion-reduce:transition-none ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                <div
                  id={`faq-content-${index}`}
                  className={`grid transition-all duration-300 ease-spring motion-reduce:transition-none ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-6 pr-10 text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
