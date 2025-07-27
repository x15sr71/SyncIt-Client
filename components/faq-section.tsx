"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"

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
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-20 relative scroll-mt-20" role="region" aria-labelledby="faq-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 id="faq-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Frequently Asked <span className="logo-gradient">Questions</span>
          </h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">Everything you need to know about SyncIt</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="glass-effect border-white/20 hover-lift overflow-hidden" role="article">
              <CardHeader
                className="cursor-pointer transition-all duration-200 hover:bg-white/5"
                onClick={() => toggleFAQ(index)}
                role="button"
                tabIndex={0}
                aria-expanded={openIndex === index}
                aria-controls={`faq-content-${index}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    toggleFAQ(index)
                  }
                }}
              >
                <CardTitle className="flex justify-between items-center text-white text-lg font-semibold">
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-white/60 transition-all duration-300 ease-in-out ${
                      openIndex === index ? "rotate-180 text-white/80" : ""
                    }`}
                    aria-hidden="true"
                  />
                </CardTitle>
              </CardHeader>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <CardContent
                  id={`faq-content-${index}`}
                  className="pt-0 pb-6 px-6"
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                >
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-white/80 leading-relaxed animate-in fade-in-0 slide-in-from-top-2 duration-300">
                      {faq.answer}
                    </p>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
