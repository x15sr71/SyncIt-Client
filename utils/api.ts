import axios from "axios";

// In production every browser call (XHR *and* the OAuth login/callback
// navigations) goes through the same-origin Next.js rewrite
// (/api/backend/* -> backend), so the session cookie is first-party and
// sameSite: "lax" keeps working across separately-hosted client/backend.
// In dev we talk to the backend directly on 127.0.0.1 — not localhost:
// Spotify only accepts loopback-IP redirect URIs and cookies are
// host-scoped, so every dev URL must agree on the host.
export const backendBaseUrl =
  process.env.NODE_ENV === "production"
    ? "/api/backend"
    : (process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://127.0.0.1:3002");

/** Absolute-or-proxied URL for top-level navigations (OAuth flows). */
export const backendUrl = (path: string) => `${backendBaseUrl}${path}`;

const apiClient = axios.create({
  baseURL: backendBaseUrl,
  withCredentials: true,
});

export default apiClient;
