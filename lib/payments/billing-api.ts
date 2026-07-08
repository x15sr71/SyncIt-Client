/**
 * Thin HTTP client for the billing backend contract.
 *
 * Uses the same cookie-session auth as the rest of the app
 * (`credentials: "include"`) and the same base-URL pattern the existing pages
 * use (`NEXT_PUBLIC_BACKEND_URL` with a localhost fallback). No secrets here.
 *
 * NOTE: these endpoints do not exist on the backend yet — they are the
 * documented handoff contract. Until they ship, calls reject with BillingError.
 */

import type {
  CreateCheckoutInput,
  CreateCheckoutResponse,
  SubscriptionState,
} from "./types";
import { backendBaseUrl } from "@/utils/api";

const BACKEND_URL = backendBaseUrl;

export class BillingError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "BillingError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BACKEND_URL}${path}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
      ...init,
    });
  } catch {
    // Network/connection failure (e.g. backend not running yet).
    throw new BillingError("Network error reaching billing service.", 0);
  }

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = (await res.json()) as { message?: string };
      if (body?.message) detail = body.message;
    } catch {
      // non-JSON error body — keep statusText
    }
    throw new BillingError(detail || `Request failed (${res.status})`, res.status);
  }

  return (await res.json()) as T;
}

/** POST /billing/checkout-session */
export function createCheckoutSession(
  body: CreateCheckoutInput & { successUrl: string; cancelUrl: string },
): Promise<CreateCheckoutResponse> {
  return request<CreateCheckoutResponse>("/billing/checkout-session", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/** GET /billing/subscription */
export function getSubscription(): Promise<SubscriptionState> {
  return request<SubscriptionState>("/billing/subscription", { method: "GET" });
}

/** POST /billing/portal */
export function createPortalSession(returnUrl: string): Promise<{ url: string }> {
  return request<{ url: string }>("/billing/portal", {
    method: "POST",
    body: JSON.stringify({ returnUrl }),
  });
}
