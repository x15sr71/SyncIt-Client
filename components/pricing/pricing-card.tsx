"use client";

import Link from "next/link";
import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PlanDisplay } from "@/lib/pricing/plans";

interface PricingCardProps {
  plan: PlanDisplay;
  /** Provided for "checkout" CTAs; the section owns the checkout call. */
  onCheckout?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export function PricingCard({
  plan,
  onCheckout,
  isLoading = false,
  error = null,
}: PricingCardProps) {
  const buttonVariant = plan.highlighted ? "default" : "outline";

  return (
    <Card
      className={cn(
        "hover-lift relative flex flex-col",
        plan.highlighted && "border-brand-300 shadow-elev",
      )}
    >
      {plan.badge && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap shadow-soft">
          {plan.badge}
        </Badge>
      )}

      <CardHeader className="pb-4">
        <h3 className="text-base font-semibold text-foreground">{plan.name}</h3>
        <p className="text-sm text-muted-foreground">{plan.tagline}</p>
        <div className="mt-3 flex items-baseline gap-2">
          {plan.originalPrice && (
            <span className="text-lg font-medium text-muted-foreground line-through">
              {plan.originalPrice}
            </span>
          )}
          <span className="text-4xl font-semibold tracking-tight text-foreground">
            {plan.price}
          </span>
          {plan.priceSuffix && (
            <span className="text-sm text-muted-foreground">
              {plan.priceSuffix}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col">
        <ul role="list" className="space-y-3">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5">
              <Check
                className="mt-0.5 h-4 w-4 shrink-0 text-brand-500"
                aria-hidden="true"
              />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 pt-2">
          {plan.cta.kind === "link" ? (
            <Button
              asChild
              variant={buttonVariant}
              size="lg"
              className="w-full"
            >
              <Link href={plan.cta.href ?? "/dashboard"}>{plan.cta.label}</Link>
            </Button>
          ) : (
            <Button
              variant={buttonVariant}
              size="lg"
              className="w-full"
              onClick={onCheckout}
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? "Starting checkout…" : plan.cta.label}
            </Button>
          )}

          {error && (
            <p role="alert" className="mt-2 text-xs text-destructive">
              {error}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
