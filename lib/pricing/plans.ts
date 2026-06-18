/**
 * Plan catalog — display config for the pricing page.
 *
 * This file holds ONLY public, display-safe data. It contains no Stripe price
 * IDs, secrets, or entitlement logic — the backend maps `planKey` -> the real
 * provider Price ID and is the source of truth for what a plan unlocks.
 */

export type PlanKey = "free" | "monthly" | "early_bird";

/** Plans that initiate a provider checkout (everything except the free tier). */
export type PaidPlanKey = Exclude<PlanKey, "free">;

export interface PlanCta {
  label: string;
  /** "link" -> navigate (free/signup flow). "checkout" -> start provider checkout. */
  kind: "link" | "checkout";
  /** Destination for "link" CTAs. */
  href?: string;
}

export interface PlanDisplay {
  key: PlanKey;
  name: string;
  tagline: string;
  /** Live price, e.g. "$0", "$5", "$2.50". */
  price: string;
  /** e.g. "/mo". Omitted for the free tier. */
  priceSuffix?: string;
  /** Struck-through original price shown on the early-bird card. */
  originalPrice?: string;
  /** Highlight badge, e.g. "50% OFF — Early Access". */
  badge?: string;
  /** Visually emphasise this card (elevation + accent border + filled CTA). */
  highlighted?: boolean;
  features: string[];
  cta: PlanCta;
}

/** Free-tier usage cap — lifetime track transfers. Enforced by the backend. */
export const FREE_TRANSFER_LIMIT = 300;

/** Shared unlock list for the paid tiers (Monthly and Early-bird are identical). */
const PAID_FEATURES: string[] = [
  "Everything in Free",
  "Unlimited track transfers",
  "Daily automated & scheduled sync",
  "Bidirectional auto-sync",
  "Email reports for unsynced songs",
];

export const PLANS: PlanDisplay[] = [
  {
    key: "free",
    name: "Free",
    tagline: "Get started — no card required.",
    price: "$0",
    features: [
      "Manual sync & migration",
      `Up to ${FREE_TRANSFER_LIMIT} track transfers`,
      "Spotify ↔ YouTube Music",
    ],
    cta: { label: "Get Started Free", kind: "link", href: "/dashboard" },
  },
  {
    key: "monthly",
    name: "Monthly",
    tagline: "For power users who sync often.",
    price: "$5",
    priceSuffix: "/mo",
    features: PAID_FEATURES,
    cta: { label: "Subscribe", kind: "checkout" },
  },
  {
    key: "early_bird",
    name: "Early-bird",
    tagline: "Lock in half price as an early adopter.",
    price: "$2.50",
    priceSuffix: "/mo",
    originalPrice: "$5",
    badge: "50% OFF — Early Access",
    highlighted: true,
    features: PAID_FEATURES,
    cta: { label: "Get Early Access", kind: "checkout" },
  },
];
