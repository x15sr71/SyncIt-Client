/**
 * Placeholder for the future Razorpay provider.
 *
 * Implements the same `PaymentProvider` interface as Stripe so that call sites
 * never change. When the backend gains Razorpay support, fill these in (open
 * the Razorpay Checkout modal with `keyId` + `subscriptionId` returned by
 * `POST /billing/checkout-session`) and select it via
 * `NEXT_PUBLIC_PAYMENT_PROVIDER=razorpay`.
 */

import type { PaymentProvider } from "./types";

const NOT_IMPLEMENTED = "Razorpay provider is not implemented yet.";

export class RazorpayProvider implements PaymentProvider {
  readonly id = "razorpay" as const;

  // Signatures intentionally omit the params (still assignable to the
  // interface) since this stub doesn't use them yet.
  async startSubscriptionCheckout(): Promise<void> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async openCustomerPortal(): Promise<void> {
    throw new Error(NOT_IMPLEMENTED);
  }
}
