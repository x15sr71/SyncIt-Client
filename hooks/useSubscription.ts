"use client";

/**
 * Reads the current user's normalized subscription state from the backend
 * (`GET /billing/subscription`). The client only REFLECTS this state — it never
 * grants access on its own. Entitlements come straight from the backend.
 *
 * Ready to wire into any gated surface (e.g. show "Current plan", disable a
 * CTA, or open the customer portal). Until the backend endpoint exists, `error`
 * is populated and `data` stays null.
 */

import { useEffect, useState } from "react";
import { getSubscription } from "@/lib/payments/billing-api";
import type { SubscriptionState } from "@/lib/payments/types";

export interface UseSubscriptionResult {
  data: SubscriptionState | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useSubscription(): UseSubscriptionResult {
  const [data, setData] = useState<SubscriptionState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let active = true;

    setIsLoading(true);
    setError(null);

    getSubscription()
      .then((sub) => {
        if (active) setData(sub);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error ? err : new Error("Failed to load subscription"),
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [nonce]);

  return {
    data,
    isLoading,
    error,
    refetch: () => setNonce((n) => n + 1),
  };
}
