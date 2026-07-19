import type { Metadata } from "next";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { PricingSection } from "@/components/pricing/pricing-section";

export const metadata: Metadata = {
  title: "Pricing — SyncIt",
  description:
    "Simple SyncIt pricing. Start free, or unlock automated daily sync, bidirectional auto-sync, and unsynced-song email reports with Pro.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen gradient-background">
      <Header />
      {/* Clears the fixed header before the pricing section. */}
      <main className="pt-16">
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
