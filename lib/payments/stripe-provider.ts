/**
 * Stripe implementation of the client PaymentProvider.
 *
 * It asks the backend to create a hosted Checkout Session (mode=subscription)
 * and redirects the browser to the returned URL. Card data is entered on
 * Stripe-hosted pages only (PCI SAQ A). No publishable key is required for a
 * pure URL redirect, and no secrets ever reach the client.
 */

import {
  BillingError,
  createCheckoutSession,
  createPortalSession,
} from "./billing-api";
import type { CreateCheckoutInput, PaymentProvider } from "./types";

function redirectToLogin(): void {
  if (typeof window !== "undefined") {
    window.location.assign(`${window.location.origin}/auth`);
  }
}

export class StripeProvider implements PaymentProvider {
  readonly id = "stripe" as const;

  async startSubscriptionCheckout({
    planKey,
  }: CreateCheckoutInput): Promise<void> {
    const origin = window.location.origin;
    try {
      const res = await createCheckoutSession({
        planKey,
        successUrl: `${origin}/dashboard?billing=success`,
        cancelUrl: `${origin}/pricing?billing=cancelled`,
      });

      if (res.checkout.type === "redirect") {
        window.location.assign(res.checkout.url);
        return;
      }

      throw new Error(
        `Unexpected checkout descriptor for Stripe: ${res.checkout.type}`,
      );
    } catch (err) {
      // Not signed in -> send to the existing auth flow rather than erroring.
      if (err instanceof BillingError && err.status === 401) {
        redirectToLogin();
        return;
      }
      throw err;
    }
  }

  async openCustomerPortal(): Promise<void> {
    const origin = window.location.origin;
    try {
      const { url } = await createPortalSession(`${origin}/settings`);
      window.location.assign(url);
    } catch (err) {
      if (err instanceof BillingError && err.status === 401) {
        redirectToLogin();
        return;
      }
      throw err;
    }
  }
}
