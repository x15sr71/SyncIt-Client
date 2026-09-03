/**
 * Payment provider factory.
 *
 * A single env flag (`NEXT_PUBLIC_PAYMENT_PROVIDER`) selects the active
 * provider. Defaults to Stripe. The returned instance is memoised.
 */

import { RazorpayProvider } from "./razorpay-provider";
import { StripeProvider } from "./stripe-provider";
import type { PaymentProvider, ProviderId } from "./types";

export type { PaymentProvider } from "./types";

let instance: PaymentProvider | null = null;

function createProvider(): PaymentProvider {
  const id = (process.env.NEXT_PUBLIC_PAYMENT_PROVIDER ??
    "stripe") as ProviderId;
  switch (id) {
    case "razorpay":
      return new RazorpayProvider();
    case "stripe":
    default:
      return new StripeProvider();
  }
}

export function getPaymentProvider(): PaymentProvider {
  if (!instance) {
    instance = createProvider();
  }
  return instance;
}
