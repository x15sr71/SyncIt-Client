"use client";

import { useState } from "react";

import { getPaymentProvider } from "@/lib/payments";
import { PLANS, type PaidPlanKey, type PlanKey } from "@/lib/pricing/plans";
import { PricingCard } from "./pricing-card";

export function PricingSection() {
  const [loadingKey, setLoadingKey] = useState<PlanKey | null>(null);
  const [errors, setErrors] = useState<Partial<Record<PlanKey, string>>>({});

  async function handleCheckout(planKey: PaidPlanKey) {
    setErrors((prev) => ({ ...prev, [planKey]: undefined }));
    setLoadingKey(planKey);
    try {
      // On success the provider redirects the browser, so control won't return.
      await getPaymentProvider().startSubscriptionCheckout({ planKey });
    } catch (err) {
      console.error("Failed to start checkout", err);
      setErrors((prev) => ({
        ...prev,
        [planKey]: "Couldn’t start checkout. Please try again.",
      }));
      setLoadingKey(null);
    }
  }

  return (
    <section
      className="py-20 relative scroll-mt-20"
      role="region"
      aria-labelledby="pricing-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <div className="text-sm font-medium logo-gradient inline-block mb-2">
            Pricing
          </div>
          <h2
            id="pricing-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-4"
          >
            Simple pricing that scales with your library.
          </h2>
          <p className="text-lg text-muted-foreground">
            Start free. Upgrade when you want automated, hands-off syncing.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-stretch stagger">
          {PLANS.map((plan) => (
            <PricingCard
              key={plan.key}
              plan={plan}
              isLoading={loadingKey === plan.key}
              error={errors[plan.key] ?? null}
              onCheckout={
                plan.cta.kind === "checkout"
                  ? () => handleCheckout(plan.key as PaidPlanKey)
                  : undefined
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
