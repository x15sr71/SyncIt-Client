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
      className="py-28 sm:py-36 relative scroll-mt-24"
      role="region"
      aria-labelledby="faq-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-muted-foreground mb-4">
            FAQ
          </div>
          <h2
            id="faq-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-foreground mb-5 leading-[1.05]"
          >
            Frequently asked.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Everything you need to know about SyncIt.
          </p>
        </div>

        {/* A divided list rather than six bordered cards: one hairline
            between rows is enough separation, and the questions read as a
            single list instead of six competing surfaces. */}
        <div className="max-w-2xl mx-auto divide-y divide-border border-y border-border">
          {faqs.map((faq, index) => (
            <div key={index} role="article">
              <button
                type="button"
                className="w-full flex items-center justify-between gap-6 py-6 text-left group focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-content-${index}`}
              >
                <span className="text-foreground text-[0.95rem] font-medium tracking-tight transition-colors duration-200 group-hover:text-brand-600">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-out motion-reduce:transition-none ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {/* max-height rather than the grid 0fr/1fr trick: the grid
                  variant resolved to 0px here even with the rule present and
                  the class applied, so the panel never opened. */}
              <div
                id={`faq-content-${index}`}
                className={`overflow-hidden transition-all duration-300 ease-out motion-reduce:transition-none ${
                  openIndex === index
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-sm text-muted-foreground leading-relaxed pb-6 pr-10">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
