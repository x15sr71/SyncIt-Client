/**
 * Provider-agnostic payment types.
 *
 * The client only ever deals with a `planKey` + normalized subscription state.
 * Concrete providers (Stripe today, Razorpay later) implement `PaymentProvider`
 * so call sites never change when the active provider is swapped via
 * `NEXT_PUBLIC_PAYMENT_PROVIDER`.
 */

import type { PaidPlanKey, PlanKey } from "@/lib/pricing/plans";

export type ProviderId = "stripe" | "razorpay";

/** Stripe subscription statuses (+ "none" when the user has no subscription). */
export type SubscriptionStatus =
  | "none"
  | "trialing"
  | "active"
  | "incomplete"
  | "incomplete_expired"
  | "past_due"
  | "unpaid"
  | "canceled"
  | "paused";

/**
 * Feature flags resolved by the backend from the verified subscription.
 * The client only REFLECTS these — it never computes entitlements itself.
 */
export interface Entitlements {
  dailyAutoSync: boolean;
  bidirectionalSync: boolean;
  emailNotifications: boolean;
  /** null = unlimited. */
  migrationLimit: number | null;
}

/** Normalized subscription state returned by `GET /billing/subscription`. */
export interface SubscriptionState {
  status: SubscriptionStatus;
  planKey: PlanKey;
  provider?: ProviderId;
  /** ISO-8601 timestamp; null/absent when not applicable. */
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd?: boolean;
  entitlements: Entitlements;
}

/** Stripe hosted Checkout returns a redirect URL. */
export interface StripeRedirectCheckout {
  type: "redirect";
  url: string;
}

/** Razorpay (future) returns data to open its client-side checkout modal. */
export interface RazorpayCheckout {
  type: "razorpay";
  keyId: string;
  subscriptionId: string;
}

export type CheckoutDescriptor = StripeRedirectCheckout | RazorpayCheckout;

/** Response body of `POST /billing/checkout-session`. */
export interface CreateCheckoutResponse {
  provider: ProviderId;
  checkout: CheckoutDescriptor;
}

/** What the UI passes when starting a checkout. */
export interface CreateCheckoutInput {
  planKey: PaidPlanKey;
}

/**
 * Common client-side payment interface. A concrete provider performs the
 * backend call AND launches the provider-specific flow (redirect or modal),
 * so the UI just calls `startSubscriptionCheckout` and forgets.
 */
export interface PaymentProvider {
  readonly id: ProviderId;
  startSubscriptionCheckout(input: CreateCheckoutInput): Promise<void>;
  openCustomerPortal(): Promise<void>;
}
