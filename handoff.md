# SyncIt-Client — Next.js Frontend Handoff

**Updated:** 2026-09-03 · **Branch:** `development` @ `c3fc2b6` · Backend `development` @ `f9d9191`

Companion docs: `../RESEARCH_IMPLEMENTATION_GAPS.md` (feature-level gap ledger), `../IMPLEMENTATION_SUMMARY.md` (audit remediation log, 2026-07-09), `../SYNCIT_AUDIT_REPORT.md` (2026-07-08). Both older docs predate this session and contain stale claims — see §11.

---

## 1. Status

Next.js 15 App Router client. Every page is `"use client"` except `/` and `/pricing`. The **landing → auth → connect → dashboard → migrate** path is wired end to end and verified against live Google/Spotify/YouTube APIs and a real Supabase database.

**One thing blocks a working migration:** `GOOGLE_API_KEY` in `SyncIt-Backend/.env` is invalid. Verified 2026-09-03 — a direct call to `generativelanguage.googleapis.com` returns `400 API key not valid`. Track matching runs through Gemini, so every migration completes with **0 tracks added**. Everything else works.

Both repos' `development` branches are green: backend tsc/build/format clean and **61/61 tests**; client tsc/format/build clean. `main` is **behind** `development` on both (backend 3 commits, client more) — nothing has been promoted to `main` since this session's work.

---

## 2. Stack and structure

Next 15.5.20, React 19, TypeScript strict, Tailwind 3.4 + shadcn/ui (Radix), `lucide-react`, `react-icons/si` (brand marks), `next-themes`, `axios`, `geist`.

No state library, no react-query. Data lives in per-page `useState` plus custom hooks.

```
app/              routes (§3)
components/       feature components (flat)
components/ui/    shadcn primitives
components/sync/  DEAD — see FE#28
components/pricing/
hooks/            all data fetching + dashboard state/handlers
lib/payments/     billing provider abstraction — no backend exists (FE#30)
lib/pricing/      display-only plan data
utils/api.ts      the single axios instance; every call goes through it
```

Path alias `@/*` → repo root.

| File                                                     | Why it matters                                                                             |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `utils/api.ts`                                           | Sole source of the backend base URL; dev/prod switch                                       |
| `hooks/useMe.ts`                                         | Session + connections + stats. The auth source of truth                                    |
| `app/dashboard/page.tsx` (523 lines)                     | Composition root; owns every dialog and the migration callbacks                            |
| `hooks/useDashboardState.ts` / `useDashboardHandlers.ts` | State bag + handler bag injected into the dashboard                                        |
| `hooks/useMigration.ts`                                  | Direction-dependent endpoint and payload shaping                                           |
| `next.config.mjs`                                        | Prod same-origin `/api/backend/*` proxy — this is the cookie strategy, not an optimisation |
| `components/iphone-frame.tsx`                            | Landing mockup frame; all dimensions derive from one `--pw` variable                       |
| `components/theme-toggle.tsx`                            | Shared by both headers                                                                     |

`next.config.mjs` sets `ignoreBuildErrors: false` and `ignoreDuringBuilds: false`. Type and lint errors fail the build **on purpose**. Do not relax these.

---

## 3. Routes

| Route             | State                                                                                                          |
| ----------------- | -------------------------------------------------------------------------------------------------------------- |
| `/`               | Done. Header, Hero, WhyChoose, HowItWorks, FAQ, Footer. Refined layout is in **open PR #34**, not yet merged   |
| `/auth`           | Done. Single button → `backendUrl("/google/login")`                                                            |
| `/connect`        | Done. Real status from `useMe()`; Continue enables only when both platforms are `connected && !needsReconnect` |
| `/dashboard`      | Working. Playlists, migration, auto-sync, widgets, dialogs, logout                                             |
| `/profile`        | **Now wired to `/me`** (was a hardcoded mock). Real user, stats, recent syncs                                  |
| `/settings`       | **Now wired to `/me`** (was static). Real connection status + Connect/Reconnect                                |
| `/missing-tracks` | Loads real `/getNotFoundTracks`. Unreachable and its actions don't persist — FE#25                             |
| `/pricing`        | UI done. Checkout always fails; advertises four features that don't exist — FE#23, FE#30                       |
| `/sync`           | **Dead.** `samplePlaylists` constants, nothing links to it — FE#28                                             |

`app/layout.tsx` mounts `ThemeProvider` (`attribute="class"`, `defaultTheme="light"`, `enableSystem`).

---

## 4. Authentication and session

**Cookie-session only.** No tokens in JS, no `Authorization` header, no localStorage. The backend sets an `HttpOnly` `sessionId` cookie; axios is created once with `withCredentials: true`.

Verified: no controller returns `access_token` or `refresh_token`; `/me` uses explicit `select:` lists. The only `NEXT_PUBLIC_*` values are a backend URL and the string `"stripe"`. Nothing sensitive reaches the browser.

Base URL resolution (`utils/api.ts`):

```ts
backendBaseUrl =
  NODE_ENV === "production"
    ? "/api/backend" // same-origin Next rewrite
    : (process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://127.0.0.1:3002");
```

**Why the proxy exists — do not remove.** The backend session cookie is `sameSite: 'lax'`. With a separately hosted backend, cross-site XHR drops it. Routing _all_ browser traffic — XHR **and the top-level OAuth navigations** — through the client's own origin makes the cookie first-party. Consequence: production OAuth redirect URIs must be `https://<client-domain>/api/backend/{google,spotify,youtube}/callback`.

OAuth flows are full-page navigations to `backendUrl("/{provider}/login?redirect_after=/path")`. The backend validates `redirect_after` is a relative path (`src/auth/oauthState.ts`) and falls back to `/dashboard`.

---

## 5. Backend endpoints the frontend depends on

All paths are relative to `backendBaseUrl`. Registered in `SyncIt-Backend/src/backend/server.ts`.

| Method | Path                                                     | Caller                          | Contract notes                                                                                                                                                                                                                                     |
| ------ | -------------------------------------------------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/me`                                                    | `hooks/useMe.ts`                | `{success, user, connections:{spotify,youtube:{connected,needsReconnect,username}}, stats:{totalSyncs,tracksMigrated,successRate,activeAutoSyncs}, recentSyncs[]}`. **401 ⇒ unauthenticated.** Verified field-for-field against `me.controller.ts` |
| POST   | `/auth/logout`                                           | dashboard, profile              | `{success:true}`                                                                                                                                                                                                                                   |
| GET    | `/getSpotifyplaylists`                                   | `hooks/getSpotifyPlaylists.tsx` | `{success, data: SpotifyPlaylist[]}`; client reads `p.tracks.total` **unguarded** — FE#31                                                                                                                                                          |
| GET    | `/getyoutubeplaylists`                                   | `hooks/getYoutubePlaylists.ts`  | `{success, data, totalResults}`; reads `p.snippet.title`, `p.contentDetails.itemCount`                                                                                                                                                             |
| POST   | `/spotifyPlaylistContent`                                | `hooks/getSpotifyContent.ts`    | Returns a **flat array**; the hook re-keys it as `{[playlistIds[0]]: data}`                                                                                                                                                                        |
| POST   | `/youtubePlaylistContent`                                | `hooks/getYoutubeContent.ts`    | Returns a **keyed record**. Asymmetric with Spotify by design                                                                                                                                                                                      |
| POST   | `/spotify-to-youtube`                                    | `hooks/useMigration.ts`         | Body `{spotifyPlaylistId, youtubePlaylistName, youtubePlaylistId?}` — note the key renaming                                                                                                                                                        |
| POST   | `/youtube-to-spotify`                                    | `hooks/useMigration.ts`         | Body `{playlistId, playlistName}`                                                                                                                                                                                                                  |
| POST   | `/spotify/{rename-playlist,delete-playlist,delete-song}` | `hooks/useSpotifyActions.ts`    | `delete-playlist` returns **501** — Spotify has no delete API                                                                                                                                                                                      |
| POST   | `/youtube/{rename-playlist,delete-playlist,delete-song}` | `hooks/useYouTubeActions.ts`    |                                                                                                                                                                                                                                                    |
| DELETE | `/emptyYouTubePlaylist`                                  | `hooks/useYouTubeActions.ts`    | Body `{playlistId}`. Spotify has no equivalent; the UI hides the action for Spotify                                                                                                                                                                |
| POST   | `/api/auto-sync/{enable,disable}`                        | `hooks/useAutoSync.ts`          | Platforms **UPPERCASED** by the hook; `intervalMinutes` from `FREQUENCY_TO_MINUTES` (60/180/1440)                                                                                                                                                  |
| GET    | `/api/auto-sync/status`                                  | **no caller**                   | Returns rows under a `syncStatus` key — FE#24                                                                                                                                                                                                      |
| POST   | `/api/auto-sync/{update-interval,sync-now}`              | **no caller**                   | FE#24                                                                                                                                                                                                                                              |
| GET    | `/getNotFoundTracks?platform=`                           | `/missing-tracks`               | `detail` is a human-readable string parsed by `parseDetail()`                                                                                                                                                                                      |
| —      | `/billing/*`                                             | `lib/payments/billing-api.ts`   | **Do not exist** — FE#30                                                                                                                                                                                                                           |

**Error handling convention:** every hook reads `err.response.data.message → err.message → fallback`. `useMigration` maps **409** to "Another sync is already running" and `ERR_NETWORK` to a connection message. The backend also returns **401 `ACCOUNT_NOT_CONNECTED`** when a provider account is missing or revoked, mapped once in both migration controllers.

### Backend behaviour that constrains the frontend

- **Per-user sync mutex** → HTTP 409 on concurrent migration. This is why `MigrationAction` migrates sequentially, never in parallel.
- **Rate limits:** 100 req/min/IP global, 10 syncs/hour/user (keyed on session id, not spoofable). Both return 429 + `Retry-After`. **No client handles 429 today.**
- **`needs_reconnect`** flips when a refresh token dies. Google OAuth apps in Testing status kill refresh tokens every 7 days. `/me` exposes it; `/connect`, `ConnectedAccounts` and `/settings` render a Reconnect badge from it.
- **Migration can return HTTP 200 having added nothing.** The client must read `successCount`, not the status code — see §9 Bug B.
- **`sourceTrackIds` is an append-only ledger.** Scheduled syncs only _add_ newly seen tracks; deletions never propagate. What ships is an incremental one-way copy, not two-way sync.

---

## 6. UI/UX patterns to preserve

- **Design tokens live in `app/globals.css`** as HSL custom properties consumed by `tailwind.config.ts`. Use tokens (`text-foreground`, `bg-card`, `border-border`), not raw hex. The only intentional hex are platform brand chips (`#1db954`, `#ff3b3b`) and the in-mockup app colours.
- **Custom utilities** in globals.css: `.gradient-background(-subdued)`, `.logo-icon`, `.logo-gradient`, `.glass-effect`, `.hover-lift`, `.fade-in-up`, `.stagger`, `.row-hover`, `.blob*`, `.shadow-elev`, `.rounded-xl2`. All animation utilities have a `prefers-reduced-motion` opt-out — preserve it.
- **Toasts:** the dashboard uses a **hand-rolled fixed div** with a 5s timeout, via a local `showToast(message, type)` passed into the action hooks. `components/ui/toaster.tsx`, `ui/sonner.tsx` and `hooks/use-toast.ts` exist but **none is mounted**. Don't add a fourth system.
- **Accessibility is deliberate:** `aria-labelledby` on Card regions, `role="status"` on connection badges, `sr-only` explanations, `aria-hidden` on decorative icons. The FAQ uses real `<button>` elements. Don't strip these.
- **Optimistic updates:** rename/delete update local playlist state _after_ a successful response and deliberately do **not** refetch Spotify — its API takes ~30s to reflect a rename, so refetching clobbers the UI with stale data. YouTube _does_ refetch. Preserve this asymmetry.
- **No fabricated data.** Controls with no backend were removed rather than left as decoration (plan badges, Download My Data, Export Sync History, the Settings preference switches). If a backend can't do it, don't render a button for it.

---

## 7. Environment and running locally

```
# SyncIt-Client/.env.local
NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:3002
NEXT_PUBLIC_PAYMENT_PROVIDER=stripe
```

**Use `127.0.0.1`, never `localhost`.** Spotify only accepts loopback-IP redirect URIs, and cookies are host-scoped — every dev URL must agree on the host.

**Port note:** `:3000` is occupied by a Docker Desktop container on this machine, so Next must be started explicitly:

```
cd SyncIt-Client && npm run dev -- -p 3001
```

Backend (from `SyncIt-Backend/`), with overrides so it matches the client's port:

```
TRUST_PROXY=false FRONTEND_URL="http://127.0.0.1:3001" \
CORS_ORIGINS="http://127.0.0.1:3001,http://localhost:3001" npm run dev
```

`.env` supplies the Supabase connection. `TRUST_PROXY=false` is correct locally (no proxy in front). `TOKEN_ENC_KEY` is deliberately **unset** — tokens are stored plaintext-passthrough; setting a key now would make existing rows undecryptable.

Registered OAuth redirect URIs (verified in the consoles 2026-09-02):

| Provider | Registered                                                                       |
| -------- | -------------------------------------------------------------------------------- |
| Google   | `http://localhost:3002/google/callback`, `http://127.0.0.1:3002/google/callback` |
| YouTube  | `http://127.0.0.1:3002/youtube/callback`                                         |
| Spotify  | `http://127.0.0.1:3002/spotify/callback`                                         |

The Google OAuth client lives in project **`syncit-432814`**, not `syncit-a9aac` (which has no OAuth clients).

---

## 8. Tests and validation

| Check          | Backend               | Client                 |
| -------------- | --------------------- | ---------------------- |
| `tsc --noEmit` | pass                  | pass                   |
| build          | pass                  | pass                   |
| `format:check` | pass                  | pass                   |
| tests          | **61/61** (11 suites) | **none exist** — FE#29 |

Backend integration tests need a database:

```
createdb syncit_it
INTEGRATION_DB_URL="postgresql://<user>@127.0.0.1:5432/syncit_it" npm test
```

⚠️ That suite is **not hermetic** — it uses the real Redis rate limiter, so load-testing the backend within the preceding 60s makes it fail with 429s. Reproduced and documented in BE#44.

⚠️ **Do not run `npm run build` in the client while `next dev` is running.** It overwrites the shared `.next` directory and the dev server starts throwing `Cannot find module './<id>.js'`. Recovery: kill next, `rm -rf .next`, restart.

---

## 9. Bug investigations

Five defects were found and fixed this session by running the app end to end. Each is recorded because the _reasoning_ matters for anyone touching the same code.

### A. Server-killing crash on an unconnected Spotify account — FIXED

**Symptom:** `ERR_CONNECTION_REFUSED` on `:3002` after loading `/dashboard`.
**Investigation:** backend log showed the process exiting, not a network fault.
**Evidence:**

```
Unhandled Rejection: Error: Spotify account not connected for this user
  at get_SpotifyAccessToken (spotifyTokenUtil.ts:23)
  at getPlaylistsHandler (getSpotifyPlaylists.controller.ts:20)
Received unhandledRejection, cleaning up...
```

**Root cause (CONFIRMED):** `get_SpotifyAccessToken` is typed `Promise<string>` and **throws**; the controller awaited it bare and then null-checked — a branch that can never run. Express 4 doesn't trap async handler rejections, so it reached `process.on('unhandledRejection')` → `cleanup()` → exit. **Every new user's first dashboard visit took the server down for everyone.** The YouTube controller had the identical call correctly wrapped, which is why it returned a clean 401 in the same request batch.
**Fix:** try/catch returning 401; global Express error handler; `unhandledRejection` now logs and continues (`uncaughtException` stays fatal).
**Validation:** reproduced with a real session cookie — now 401 JSON, server alive across 5 consecutive triggers.

### B. UI reported success for a migration that added nothing — FIXED

**Symptom:** UI showed success; the playlist never appeared in Spotify.
**Evidence:** backend logged `added 0 tracks` for the same run while the UI showed success.
**Root cause (CONFIRMED):** `MigrationLoadingCard` ran a `setInterval` that invented `successCount = totalTracks * 0.9` plus a hardcoded failed track ("Rare Live Version" / "Indie Artist") and handed it to the dashboard as if it were the backend's answer. On a 4.5s timer it usually beat the real request, so the fabricated numbers were what users saw. It also rendered a hardcoded **75%** progress bar.
**Fix:** card is now purely presentational (real names/counts, indeterminate spinner — the backend exposes no per-track progress, so no percentage is shown). The dashboard reads the real response and distinguishes failure / partial / success.
**Validation:** verified against a real failing migration; the failure now surfaces honestly. Dashboard "Recent syncs" showed `0 tracks · Failed`.

### C. Auto-sync was unreachable — FIXED

**Root cause (CONFIRMED):** `selectedPlaylistForMigration` had exactly one writer — `handlers.handleStartMigration` — which has **zero call sites**, because `MigrationAction` drives migration directly. The id stayed `""`, so "Keep in sync" could only hit the `if (!playlistId)` branch. A fully built backend feature (enable/disable/status, 10-min cron, atomic claim, per-user mutex) was unreachable over one unset variable.
**Fix:** set it in `handleMigrationStart`, which already runs on every migration.
**Validation:** live — enable returned 200 with `nextSyncAt` scheduled; disable returned 200.

### D. Dead YouTube API key broke both migration directions — FIXED

**Root cause (CONFIRMED):** `videos.list` and `search.list` were sent a `key` alongside an OAuth Bearer token; the key had been deleted from Google Cloud, so the API returned `400 API Key not found`. The key is redundant — every call site already carries OAuth.
**Trap worth knowing:** `filterValidVideos` passed the key with **no Authorization header at all**. Deleting the key there would have swapped one failure for another, so the caller's access token was threaded through instead.
**Validation:** `grep YOUTUBE_API_KEY src/` → no matches; 61/61 tests pass.

### E. Per-IP rate limit was bypassable — FIXED

**Root cause (CONFIRMED):** `trust proxy` was hardcoded to `1`, so `X-Forwarded-For` was believed from whoever opened the socket.
**Evidence:** 150 requests with a rotating header produced **zero** 429s; the same 150 with `TRUST_PROXY=false` produced 100 × 401 then 50 × 429.
**Fix:** `TRUST_PROXY` env accepting `false`, a hop count, or an IP/CIDR list, plus a production boot warning when unset.
**Note:** this is defence in depth. The real fix is a network boundary — the backend should only be reachable through the client's `/api/backend` proxy.

### Open, unfixed — see the tracked issues

| Issue                                            | Confidence                                                                                                                                                              |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FE#31 `p.tracks.total` unguarded                 | **Confirmed** the access is unguarded. The Spotify `tracks`→`items` rename is an **unverified hypothesis** — settle it with one live `GET /v1/me/playlists?limit=1`     |
| BE#41 failure records store `Channel: undefined` | **Confirmed** — tracks are built with `videoChannelTitle` (`searchYoutube.ts:115`) but three sites read `youtubeTrack.channelName`; only line 264 has the `??` fallback |
| FE#27 landing CTAs → `/dashboard`                | **Confirmed** — plus unhandled rejections from unguarded mount fetches                                                                                                  |
| FE#23 pricing claims                             | **Confirmed** — no email infra, no plan model, one-way-only auto-sync                                                                                                   |

---

## 10. Decisions that must not be changed without investigation

1. **The same-origin `/api/backend` proxy** is the cookie strategy. Removing it breaks auth in production.
2. **`127.0.0.1` everywhere in dev** — Spotify redirect-URI rules and cookie host-scoping.
3. **One shared axios instance**, relative paths only. No hook should build its own URL.
4. **`ignoreBuildErrors: false` / `ignoreDuringBuilds: false`.**
5. **Sequential migration** — parallel requests hit the per-user mutex and 409.
6. **No Spotify refetch after rename**; YouTube does refetch.
7. **The client never grants entitlements.** `lib/pricing/plans.ts` holds display strings only.
8. **`images: { unoptimized: true }`** — playlist art comes from arbitrary CDN hosts; enabling optimisation needs a remote-pattern allowlist first.
9. **`TOKEN_ENC_KEY` unset locally** — setting it now breaks existing plaintext rows.

---

## 11. Discrepancies in the older docs

- `IMPLEMENTATION_SUMMARY.md` says the backend work landed on `style/apply-prettier-formatting`. It did not — it is on `development`.
- Both older docs describe `/settings`, `/profile`, dark mode, the fabricated migration results and auto-sync reachability as broken. **All are fixed** — this file supersedes them on those points.
- `lib/pricing/plans.ts:40` comments that the 300-track cap is "Enforced by the backend". **Nothing enforces it** (BE#43).
- `package.json` is still named `my-v0-project`; `app/layout.tsx` metadata no longer carries the v0 generator tag.

---

## 12. Remaining work

**Blocking:** replace `GOOGLE_API_KEY` (AI Studio → the existing `SyncIt` project `gen-lang-client-0001455411`). Nothing else prevents a working migration.

**Open PR:** #34 — landing-page restraint/typography pass. If approved, the same treatment applies to dashboard, connect, auth, profile, settings, pricing, missing-tracks.

**Tracked issues:** 9 frontend (FE#23–31), 4 backend (BE#41–44). Highest value first:

1. FE#24 auto-sync management — `status` / `update-interval` / `sync-now` have no callers, so an enabled auto-sync can't be cancelled from the UI
2. FE#27 route guard + unhandled rejections
3. FE#29 frontend test framework — start with the pure functions (`useTransformedPlaylists`, `parseDetail`, `useMigration` payload shaping)
4. BE#41 one-line-per-site fix with a known correct pattern already in the file

**Needs a product decision, not code:** FE#23 pricing claims, BE#42 the three Spotify 501 stubs, BE#43 the per-user cap number.

**Owner-side, not in the repo:** revoke the leaked `firebase-adminsdk` key in `syncit-a9aac` (flagged in the July audit, still present); register production OAuth redirect URIs; Google OAuth verification; YouTube quota increase.

**Deployment:** there is none. `syncit.org.in` serves an unrelated Vite waitlist site and no backend is deployed, so all production hardening items are currently untestable.
