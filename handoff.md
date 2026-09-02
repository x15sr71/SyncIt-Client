# SyncIt-Client — Next.js Frontend Handoff

**Written:** 2026-09-02 · **Repo:** `SyncIt-Client/` · **Branch:** `development` (= `origin/development`, **12 commits ahead of `origin/main`**, HEAD `9b16af4`)

Companion docs (read for backend context): `../IMPLEMENTATION_SUMMARY.md` (audit remediation log, 2026-07-09), `../SYNCIT_AUDIT_REPORT.md` (2026-07-08), `README.md`, `../SyncIt-Backend/README.md`.

---

## 1. Status in one paragraph

The frontend is a Next.js 15 App Router SPA-style client (all pages are `"use client"` except `/` and `/pricing`). The **landing → auth → connect → dashboard → migrate** path is real and wired to the backend. `/settings` and `/profile` are still **pure mockups**. `/sync` is a **dead legacy wizard**. Typecheck and production build are **clean**; there is **no test framework at all**. The largest live problem is not in this repo: the **checked-out backend (`main`) does not contain the endpoints this client depends on** — see Bug 1.

---

## 2. Stack & structure

- Next.js `^15.5.20` (App Router), React 19, TypeScript strict, Tailwind 3.4 + shadcn/ui (Radix), `lucide-react`, `axios`, `geist` fonts.
- **No** state library, **no** react-query. Data lives in per-page `useState` + custom hooks.
- `next.config.mjs` sets `ignoreBuildErrors: false` and `ignoreDuringBuilds: false` — type and lint errors **fail the build on purpose**. Don't relax these.

```
app/            routes (see §3)
components/     feature components (flat) + components/ui (shadcn) + components/sync (dead) + components/pricing
hooks/          all data fetching + dashboard state/handlers
lib/payments/   billing provider abstraction (Stripe/Razorpay) — backend not built
lib/pricing/    display-only plan data (no price IDs, no secrets)
utils/api.ts    the single axios instance — every call goes through it
```

Path alias `@/*` → repo root (`tsconfig.json`).

### Files that matter most

| File                                                     | Why                                                         |
| -------------------------------------------------------- | ----------------------------------------------------------- |
| `utils/api.ts`                                           | Sole source of the backend base URL; dev/prod switch.       |
| `hooks/useMe.ts`                                         | Session + connections + stats. The auth source of truth.    |
| `app/dashboard/page.tsx` (499 lines)                     | Composition root; owns all dialogs and migration callbacks. |
| `hooks/useDashboardState.ts` / `useDashboardHandlers.ts` | State bag + handler bag injected into the dashboard.        |
| `hooks/useMigration.ts`                                  | Direction-dependent endpoint + payload shaping.             |
| `next.config.mjs`                                        | Prod same-origin `/api/backend/*` proxy (cookie strategy).  |

---

## 3. Routes

| Route             | File                                      | State                                                                                                                                                    |
| ----------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`               | `app/page.tsx`                            | **Done.** Static marketing: Header, Hero, WhyChoose, HowItWorks, FAQ, Footer.                                                                            |
| `/auth`           | `app/auth/page.tsx`                       | **Done.** One button → `window.location.href = backendUrl("/google/login")`.                                                                             |
| `/connect`        | `app/connect/page.tsx`                    | **Done.** Reads real status from `useMe()`; "Continue" enables only when both platforms are `connected && !needsReconnect`. Redirects to `/auth` on 401. |
| `/dashboard`      | `app/dashboard/page.tsx`                  | **Mostly done**, see Bugs 2–5. Playlists, migration, widgets, dialogs, logout.                                                                           |
| `/missing-tracks` | `app/missing-tracks/page.tsx`             | **Data wired, actions fake.** Loads real `/getNotFoundTracks`; the Use-This/Skip/Search controls are local-only. **Unreachable — nothing links to it.**  |
| `/pricing`        | `app/pricing/page.tsx`                    | **UI done, backend absent.** Checkout always errors (Bug 11).                                                                                            |
| `/settings`       | `app/settings/page.tsx`                   | **Mock.** Zero API calls. Hardcoded "Connected 2 hours ago"; toggles are local `useState`.                                                               |
| `/profile`        | `app/profile/page.tsx`                    | **Mock.** Hardcoded stats ("24", "2,847", "95%") and activity feed. Zero API calls.                                                                      |
| `/sync`           | `app/sync/page.tsx` + `components/sync/*` | **Dead.** Uses `samplePlaylists` constants. No link anywhere. Superseded by `/connect` + `/dashboard`.                                                   |

`app/layout.tsx` is minimal — html/body + Geist font style tag. **No providers mounted** (see Bug 4).

---

## 4. Authentication & how the client talks to the backend

**Cookie-session only.** No tokens in JS, no `Authorization` header, no localStorage. The backend sets an `HttpOnly` `sessionId` cookie; `axios` is created once with `withCredentials: true`.

### Base URL resolution (`utils/api.ts`)

```ts
backendBaseUrl =
  NODE_ENV === "production"
    ? "/api/backend" // same-origin Next rewrite
    : (process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3002");
```

`next.config.mjs` rewrites `/api/backend/:path*` → `BACKEND_INTERNAL_URL ?? NEXT_PUBLIC_BACKEND_URL`.

**Why the proxy exists (do not undo):** the backend session cookie is `sameSite: 'lax'`. With a separately-hosted backend, cross-site XHR would drop it. Routing _all_ browser traffic — XHR **and the top-level OAuth navigations** — through the client's own origin makes the cookie first-party. Consequence: **OAuth provider redirect URIs must be `https://<client-domain>/api/backend/{google,spotify,youtube}/callback`.** The documented alternative (shared registrable domain + `sameSite: 'none'; secure`) is in both READMEs and is **not** wired.

### OAuth flows

- Login: `/auth` → `backendUrl("/google/login")` (full page navigation).
- Connect a platform: `backendUrl("/{spotify|youtube}/login?redirect_after=/connect")` (or `/dashboard` from the dashboard). The backend validates `redirect_after` is a relative path (`src/auth/oauthState.ts`) and redirects to `FRONTEND_BASE + path`.
- Logout: `POST /auth/logout`, best-effort (errors swallowed), then `router.push("/auth")`.

### Endpoints the frontend depends on

All paths are relative to `backendBaseUrl`.

| Method | Path                                                                                 | Called from                     | Contract notes                                                                                                                                                                                                                                                               |
| ------ | ------------------------------------------------------------------------------------ | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/me`                                                                                | `hooks/useMe.ts`                | `{success, user, connections:{spotify,youtube:{connected,needsReconnect,username}}, stats:{totalSyncs,tracksMigrated,successRate,activeAutoSyncs}, recentSyncs[]}`. **401 ⇒ unauthenticated.** Verified to match `me.controller.ts` on `origin/development` field-for-field. |
| POST   | `/auth/logout`                                                                       | dashboard                       | `{success:true}`                                                                                                                                                                                                                                                             |
| GET    | `/google/login`, `/{spotify,youtube}/login?redirect_after=`                          | `/auth`, `/connect`, dashboard  | top-level navigation, not XHR                                                                                                                                                                                                                                                |
| GET    | `/getSpotifyplaylists`                                                               | `hooks/getSpotifyPlaylists.tsx` | `{success, data: SpotifyPlaylist[]}`; client reads `p.tracks.total`, `p.images[0].url`, `p.public`                                                                                                                                                                           |
| GET    | `/getyoutubeplaylists`                                                               | `hooks/getYoutubePlaylists.ts`  | `{success, data: YoutubePlaylist[], totalResults}`; client reads `p.snippet.title`, `p.contentDetails.itemCount`, `p.status.privacyStatus`                                                                                                                                   |
| POST   | `/spotifyPlaylistContent` `{playlistIds}`                                            | `hooks/getSpotifyContent.ts`    | Returns a **flat array** `{success, data: Track[]}`; the hook re-keys it as `{[playlistIds[0]]: data}`                                                                                                                                                                       |
| POST   | `/youtubePlaylistContent` `{playlistIds}`                                            | `hooks/getYoutubeContent.ts`    | Returns a **keyed record** `{success, data: {[playlistId]: Track[]}}`                                                                                                                                                                                                        |
| POST   | `/spotify-to-youtube` `{spotifyPlaylistId, youtubePlaylistName, youtubePlaylistId?}` | `hooks/useMigration.ts`         | Note the key renaming in the hook                                                                                                                                                                                                                                            |
| POST   | `/youtube-to-spotify` `{playlistId, playlistName}`                                   | `hooks/useMigration.ts`         |                                                                                                                                                                                                                                                                              |
| POST   | `/spotify/{rename-playlist,delete-playlist,delete-song}`                             | `hooks/useSpotifyActions.ts`    | `delete-song` sends `trackUri`, auto-prefixed to `spotify:track:<id>`                                                                                                                                                                                                        |
| POST   | `/youtube/{rename-playlist,delete-playlist,delete-song}`                             | `hooks/useYouTubeActions.ts`    | `delete-song` sends `videoId`                                                                                                                                                                                                                                                |
| POST   | `/api/auto-sync/{enable,disable}`                                                    | `hooks/useAutoSync.ts`          | Platforms are **UPPERCASED** by the hook; `intervalMinutes` from `FREQUENCY_TO_MINUTES` (hourly 60 / 3hours 180 / daily 1440)                                                                                                                                                |
| GET    | `/getNotFoundTracks?platform={spotify\|youtube}`                                     | `/missing-tracks`               | `{success, data: {spotify\|youtube: [{playlistId, detail, lastSyncAt}]}}`; `detail` is a **human-readable string** parsed by `parseDetail()`                                                                                                                                 |
| —      | `/billing/{checkout-session,subscription,portal}`                                    | `lib/payments/billing-api.ts`   | **Do not exist.** Documented contract only.                                                                                                                                                                                                                                  |

**Error handling convention:** every hook reads `err.response.data.message → err.message → fallback string`. `useMigration` additionally maps HTTP **409** → "Another sync is already running…" and `ERR_NETWORK` → "Cannot connect to the migration server."

---

## 5. Environment & configuration

`.env.local` (dev):

```
NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:3002    # see Bug 7 — currently reverted to localhost in the working tree
NEXT_PUBLIC_PAYMENT_PROVIDER=stripe              # "stripe" | "razorpay"
```

Prod (Vercel): set `BACKEND_INTERNAL_URL` to the deployed backend. `NEXT_PUBLIC_BACKEND_URL` is unused in prod because the base URL is hardcoded to `/api/backend`.

**Dev host rule:** open the app at **`http://127.0.0.1:3000`, not `localhost:3000`.** Spotify only accepts loopback-IP redirect URIs, and cookies are host-scoped — a `localhost` page + `127.0.0.1` backend loses the session silently.

Commands: `npm run dev` · `npm run build` · `npm start` · `npm run lint` · `npm run format` / `format:check`.

---

## 6. Tests & validation — measured 2026-09-02

| Check                          | Result                                                                       |
| ------------------------------ | ---------------------------------------------------------------------------- |
| `npx tsc --noEmit`             | **PASS** (exit 0)                                                            |
| `npm run build`                | **PASS** — 12 static routes; dashboard 28.4 kB / 166 kB first load           |
| `npm run format:check`         | **FAIL — 9 files** (see Bug 6)                                               |
| Unit / integration / e2e tests | **None exist.** No jest/vitest/playwright, no `__tests__`, no `test` script. |

CI (`.github/workflows/format.yaml`, on PRs to `main`): three jobs — `format`, `typecheck`, `build`. `format` currently fails.

---

## 7. UI/UX decisions and patterns to preserve

- **Design system lives in `app/globals.css`** as HSL CSS custom properties (`--background`, `--primary: 249 47% 53%` brand purple, `--radius: 0.625rem`) consumed by `tailwind.config.ts`. A `.dark` block (globals.css:72) defines the full dark palette. Use tokens (`text-foreground`, `bg-card`, `border-border`), not raw hex — the only intentional hex literals are the platform brand chips (`#1db954` Spotify, `#ff3b3b` YouTube).
- **Custom utility classes** defined in globals.css and used everywhere: `.gradient-background` / `.gradient-background-subdued`, `.logo-icon`, `.logo-gradient`, `.glass-effect`, `.hover-lift`, `.fade-in-up`, `.stagger`, `.row-hover`, `.blob` / `.blob-a` / `.blob-b`, `.shadow-elev`, `.rounded-xl2`. All animation utilities have a `prefers-reduced-motion` opt-out (globals.css ~586). Preserve that.
- **Toasts:** the dashboard uses a **hand-rolled fixed-position div** with a 5s `setTimeout`, via a local `showToast(message, type)` passed down into the action hooks. `components/ui/toaster.tsx`, `components/ui/sonner.tsx` and `hooks/use-toast.ts` all exist but **none is mounted**. Don't introduce a fourth system — either wire one of the existing ones everywhere or keep the hand-rolled one.
- **Accessibility is deliberate and non-trivial:** `aria-labelledby` on every Card region, `role="status"` on connection badges, `aria-describedby` on CTAs, `sr-only` explanation text, `aria-hidden` on decorative icons. Don't strip these when refactoring.
- **No skeleton loaders** except `app/{sync,missing-tracks}/loading.tsx`. Loading is a `Loader2` spinner or an em-dash placeholder (`QuickStats` renders `"—"` for undefined stats).
- **Dashboard architecture:** `useDashboardState()` returns a flat state bag; the page spreads it plus derived data into `useDashboardHandlers({...})`, which returns a handler bag. It is verbose but intentional — the page is the only place dialogs and side effects meet. Keep new dashboard state in `useDashboardState`.
- **Optimistic updates:** rename/delete update `localSpotifyPlaylists` / `localYoutubePlaylists` **after** a successful response and deliberately do **not** refetch Spotify (comment in `useSpotifyActions.ts`: Spotify's API takes ~30s to reflect a rename, so refetching would clobber the UI with stale data). YouTube _does_ refetch. Preserve this asymmetry.
- **Migration is sequential, never parallel** (`components/migrationAction.tsx`) — it cooperates with the backend's per-user sync mutex, which returns 409 on concurrent runs.

---

## 8. Bugs and incomplete behavior

### Bug 1 — CRITICAL: the checked-out backend does not implement what this client calls

- **Symptom:** run backend + client locally and every page that needs a session breaks; `/dashboard` and `/connect` bounce to `/auth` in a loop, or hang blank.
- **Investigation:** grepped `SyncIt-Backend/src` for the routes the client uses.
- **Evidence:**
  - `SyncIt-Backend` working tree is on branch **`main`** (HEAD `3910c46`). `grep -rn '"/me"' src` → **no matches**. `grep -rn "logout" src` → **no matches**.
  - `src/backend/server.ts:78` uses `autoSyncRoutes` and `:80` calls `SyncCronJob.start()` with **no corresponding imports** → the backend on `main` does not even typecheck/boot.
  - `src/auth/spotify/spotify.ts:113` hardcodes `res.redirect("http://localhost:3000/dashboard")` and ignores `redirect_after` entirely (Google and YouTube honor it via `oauthState.ts`).
  - The remediated backend is on **`origin/development`** (HEAD `5916937`), which does have `me.controller.ts`, `app.get('/me', sessionMiddleware, meHandler)` (server.ts:107), `app.post('/auth/logout', …)` (:110), `app.use('/api/auto-sync', autoSyncRoutes)` (:108), and a `spotify.ts` that calls `generateOAuthState({redirectAfter})` + `buildRedirectUrl(stateData.redirectAfter)`.
  - `IMPLEMENTATION_SUMMARY.md` names the backend branch as `style/apply-prettier-formatting`; that is **stale** — that remote branch does not contain the work.
- **Root cause (CONFIRMED):** branch mismatch. The client on `development` was built against the backend on `origin/development`; the backend checkout is on `main`.
- **Correct solution:** `cd ../SyncIt-Backend && git checkout development`. Then merge both `development` branches to `main` together — they are a single release unit and must not be shipped separately.
- **Validation needed:** with backend on `development` and Redis+Postgres up, `curl -i localhost:3002/me` → `401`; after Google login through the browser → `200` with the shape in §4.

### Bug 2 — HIGH: "Keep in Sync" (auto-sync) is unreachable from the UI

- **Symptom:** after a migration, Keep in Sync → pick a frequency → Enable always toasts **"Could not determine which playlist to keep in sync"**. Auto-sync is never enabled.
- **Investigation:** traced `selectedPlaylistForMigration` from the dialog back to its only writer.
- **Evidence:** `app/dashboard/page.tsx:381` reads `dashboard.selectedPlaylistForMigration`; if falsy it shows that exact toast. `grep -rn "setSelectedPlaylistForMigration" app components hooks` → written in exactly one place, `hooks/useDashboardHandlers.ts:67`, inside `handleStartMigration`. `grep -n "handleStartMigration" app/dashboard/page.tsx` → **zero call sites**. The dashboard renders `<MigrationAction>` (line 300), whose button calls `startMigration()` directly.
- **Root cause (CONFIRMED):** `MigrationAction` was introduced as the migrate button and bypasses `handlers.handleStartMigration`. That orphaned both `selectedPlaylistForMigration` (never set, stays `""`) **and** `showMigrationDialog` (never set true → `MigrationConfirmationDialog` at line 328 is dead code, so the per-playlist rename / "use original names" options it collects are never applied).
- **Correct solution:** decide which flow is canonical. Cheapest correct fix: in `app/dashboard/page.tsx`, set `dashboard.setSelectedPlaylistForMigration(<first selected id>)` inside `handleMigrationStart` (line 193) — it already runs on every migration. If the confirmation dialog is meant to live, instead give `MigrationAction` an `onRequestConfirm` prop that calls `handlers.handleStartMigration`, and have `handleMigrationConfirm` actually invoke the migration (today it only flips two booleans, `useDashboardHandlers.ts:76-84`).
- **Validation needed:** migrate one playlist → Keep in Sync → Every hour → Enable → expect a success toast, and `GET /api/auto-sync/status` to return the row; Recent Syncs should then show auto-sync on after `refetchMe()`.

### Bug 3 — HIGH: the migration progress card fabricates results

- **Symptom:** the migration result card frequently shows numbers that don't match reality, always including a failed track named **"Rare Live Version" by "Indie Artist"**.
- **Investigation:** read `components/migration-loading-card.tsx`.
- **Evidence:** lines 47–80: a `setInterval(..., 4000)` walks the playlist list; on reaching the last one it waits 500 ms and calls `onComplete(results)` where `successCount: Math.floor(playlist.totalTracks * 0.9)` and `failedTracks` is a hardcoded literal. `app/dashboard/page.tsx:352` wires that to `handlers.handleMigrationComplete`, which sets `migrationResults` and opens the result card.
- **Root cause (CONFIRMED):** leftover UI-prototype simulation still wired to a real callback. It races the real completion path (`MigrationAction → onMigrationComplete → dashboard.handleMigrationComplete`, page.tsx:199). A real Spotify→YouTube migration (per-track Gemini match + YouTube search) takes far longer than 4.5 s, so **the fake result almost always wins**; the real one then overwrites it and re-opens the card.
- **Secondary defect (CONFIRMED):** the effect's dep array includes `playlists`, and `migrationPlaylists` is rebuilt by `.map()` on every dashboard render (page.tsx:268) → new array identity every render → the effect tears down and restarts the interval on unrelated re-renders (e.g. the 5 s toast timer), making progress timing nondeterministic.
- **Correct solution:** delete the `useEffect` and the `onComplete` prop from `MigrationLoadingCard`; make it purely presentational (indeterminate spinner + "migrating N playlists"). Remove `onComplete={handlers.handleMigrationComplete}` at page.tsx:352 and `handleMigrationComplete` from `useDashboardHandlers`. The real path at page.tsx:199 already does everything correctly, including `refetchMe()`.
- **Validation needed:** migrate a known playlist; the reported `successCount` must equal the backend's `numberOfTracksAdded`, and no "Rare Live Version" entry may appear.

### Bug 4 — MEDIUM: the dark-mode toggle does nothing

- **Symptom:** the Sun/Moon switch in the dashboard header flips but the page stays light. It also renders "on" at first paint while the UI is light.
- **Investigation:** traced `darkMode` from the switch to the DOM.
- **Evidence:** `components/dasboardHeader.tsx:60` — `onCheckedChange={setDarkMode}`. `hooks/useDashboardState.ts:4` — `useState(true)`. `grep -rn "darkMode" app components` shows no consumer beyond the switch's own `checked`/`aria-label`. Nothing ever touches `document.documentElement.classList`. `components/theme-provider.tsx` wraps `next-themes` but `grep -rn "ThemeProvider" app` → **not mounted in `app/layout.tsx`**.
- **Root cause (CONFIRMED):** the toggle writes React state that no one reads; the class that Tailwind needs is never applied. Note the CSS side is already finished — `tailwind.config.ts:6` is `darkMode: ["class"]` and `app/globals.css:72` defines the complete `.dark` palette.
- **Correct solution:** mount `<ThemeProvider attribute="class" defaultTheme="light" enableSystem>` in `app/layout.tsx` around `{children}`, then replace `darkMode`/`setDarkMode` in `useDashboardState` + `DashboardHeader` with `useTheme()` from `next-themes`. Drop the `darkMode` state entirely rather than syncing two sources. (`next-themes@^0.4.4` is already a dependency.)
- **Validation needed:** toggle → `<html class="dark">` in DevTools, palette flips, choice survives reload, no hydration-mismatch warning in console.

### Bug 5 — MEDIUM: logged-out visitors land on `/dashboard`, see a broken flash, then bounce

- **Symptom:** "Get Started" on the landing page shows a half-rendered dashboard with "Not connected" badges and console errors before redirecting to `/auth`.
- **Investigation:** followed the CTA targets and the dashboard's mount sequence.
- **Evidence:** `components/header.tsx:97` and `components/hero-section.tsx:59` both link to **`/dashboard`**, not `/auth`. `app/dashboard/page.tsx:43` redirects only _after_ `useMe()` resolves a 401 — i.e. after full render plus a network round-trip. Separately, `app/dashboard/page.tsx:152` fires `fetchPlaylists(); fetchYoutubePlaylists();` in a mount effect with **no `.catch()`**, and both hooks re-`throw` on failure (`getSpotifyPlaylists.tsx` catch block; `getYoutubePlaylists.ts` re-throws every non-401) → **unhandled promise rejections** whenever the user isn't connected or the backend is down.
- **Root cause (CONFIRMED):** no route guard; auth is checked client-side post-render, and playlist fetches are unconditional and unguarded.
- **Correct solution:** point the landing CTAs at `/auth` (the backend already routes a fresh Google login onward). Then gate the dashboard body on `useMe()`'s `loading`/`me` (render a skeleton until `me` exists) and move the playlist fetch into an effect keyed on `me?.connections.*.connected`, with `.catch()` on both calls. `useMe` already exposes `loading` and `error`, and the dashboard currently ignores both — also add an error state, since a network failure (not a 401) leaves the page permanently blank with no message.
- **Validation needed:** in a private window, click Get Started → land on `/auth` with no console errors; log in with only one platform connected → dashboard renders, no unhandled rejection.

### Bug 6 — MEDIUM: the `format` CI job fails on `development`

- **Symptom:** any PR from `development` to `main` fails the Format Check job.
- **Evidence:** `npm run format:check` → **9 files**: `app/profile/page.tsx`, `components/hero-section.tsx`, `components/pricing/pricing-card.tsx`, `components/sync/playlist-selection.tsx`, `components/sync/steps-progress.tsx`, `hooks/getSpotifyContent.ts`, `hooks/useSubscription.ts`, `lib/payments/index.ts`, `lib/payments/stripe-provider.ts`. Verified real (not a version skew): the lockfile pins `prettier@3.9.4`, same as the local binary; sample diff on `hero-section.tsx:109` is a genuine line-length wrap.
- **Root cause (CONFIRMED):** commit `9b16af4` formatted only "files touched in the remediation"; these nine were never covered.
- **Correct solution:** `npm run format` and commit as a standalone style commit.

### Bug 7 — MEDIUM: uncommitted working-tree changes contradict the documented dev-host decision

- **Evidence:** `git status` shows three modified files, all reverting `127.0.0.1` → `localhost`: `.env.example`, `.github/workflows/format.yaml`, and `utils/api.ts:13` (the dev fallback). The surrounding comments in all three files still say to use `127.0.0.1` and explain why.
- **Why it matters:** audit finding **P0-6** — Spotify only accepts loopback-IP redirect URIs, and cookies are host-scoped, so a `localhost` client + `127.0.0.1` backend loses the session on the Spotify callback.
- **Status:** HYPOTHESIS as to intent — this may be a deliberate local convenience edit or an accidental revert. Do not commit it as-is.
- **Correct solution:** confirm with the author. If it was convenience, `git restore .env.example .github/workflows/format.yaml utils/api.ts`. If `localhost` is genuinely wanted, the comments in all three files and both READMEs must change too — and Spotify connect must be re-tested end to end first.

### Bug 8 — `/settings` and `/profile` are mockups

`app/settings/page.tsx` and `app/profile/page.tsx` contain **zero** `apiClient`/`useMe` references (verified by grep). Settings shows "Connected 2 hours ago" for both platforms regardless of state; Disconnect/Refresh do nothing; the four toggles are local state that resets on navigation. Profile hardcodes "24 / 2,847 / 95% / Dec 2024" and a four-item activity feed. `GET /me` already returns everything both pages need (`user`, `connections`, `stats`, `recentSyncs`) — this is wiring work, not backend work, **except** Disconnect, which has no backend endpoint.

### Bug 9 — `/sync` is dead code

`app/sync/page.tsx` (259 lines) + `components/sync/*` (5 files) render `samplePlaylists` hardcoded constants. `grep -rn 'href="/sync"'` → no matches. It duplicates `/connect`. Recommend deleting both, or documenting it as an intentional WIP.

### Bug 10 — `/missing-tracks` is unreachable and its actions are cosmetic

`grep -rn "missing-tracks" app components` finds no link. The data loading is real and correct, but: `suggestions` is never populated by `toTracks()`, so the "Suggested matches" heading renders above nothing; the "Search for alternative…" `Input` has no handler; "Use This"/"Skip" only mutate local `status`, so a refresh restores everything. Needs a dashboard/result-card link plus backend endpoints for manual resolution.

### Bug 11 — Billing calls always fail

`lib/payments/billing-api.ts` targets `/billing/{checkout-session,subscription,portal}`; none exists on the backend (`grep -rni "billing|subscription" SyncIt-Backend/src` → no matches on either branch). Clicking a paid plan on `/pricing` shows the inline "Couldn't start checkout. Please try again." — it degrades gracefully, but the page is non-functional. `hooks/useSubscription.ts` has **zero callers** (verified), so no request fires on mount today.

### Bug 12 — OPEN HYPOTHESIS: Spotify may have renamed `tracks` → `items`

From the audit (2026-07-08), unverifiable without live credentials. `hooks/getSpotifyPlaylists.tsx` types `tracks: { total: number }` and `hooks/useTransformedPlaylists.ts:22` reads `p.tracks.total` **unguarded**. If the field really was renamed, this is not a blank song count — it is a `TypeError: Cannot read properties of undefined` that kills the whole Spotify playlist list. **Cheap defensive fix regardless: `p.tracks?.total ?? p.items?.total ?? 0`.** Confirm with one live `GET /v1/me/playlists?limit=1`.

### Bug 13 — Result-card actions that don't do what they say

In `app/dashboard/page.tsx:360-375`: `onManualMigrate` is `(trackId) => {}` (empty); `onRetryFailed` only sets `isMigrating(true)`, which re-triggers the fake progress card from Bug 3 and never contacts the backend; `onRevertMigration` just closes the card and clears selection — **nothing is reverted**. Either hide these buttons or implement them.

---

## 9. Decisions not to change without a good reason

1. **The same-origin `/api/backend` proxy** (`next.config.mjs`) — it is the cookie strategy, not an optimization. Removing it breaks auth in production. See §4.
2. **`127.0.0.1` everywhere in dev** — required by Spotify's redirect-URI rules and cookie host-scoping (P0-6).
3. **One shared axios instance** with `withCredentials: true`; every hook uses relative paths. No hook should build its own URL — the previous hardcoded `http://localhost:3002` was audit finding P0-4.
4. **`ignoreBuildErrors: false` / `ignoreDuringBuilds: false`** in `next.config.mjs`.
5. **Sequential migration** in `MigrationAction` — parallel requests hit the backend's per-user mutex and 409.
6. **No Spotify refetch after rename** (~30 s API propagation) while YouTube does refetch.
7. **Client never grants entitlements** — `hooks/useSubscription.ts` reflects backend state only. `lib/pricing/plans.ts` holds display strings only, no price IDs, no secrets.
8. **`images: { unoptimized: true }`** — playlist artwork comes from arbitrary Spotify/YouTube CDN hosts; enabling optimization requires an allowlist of remote patterns first.

---

## 10. Remaining work, in the order that makes sense

1. **Unblock local dev:** `SyncIt-Backend` → `git checkout development` (Bug 1). Nothing else can be verified until this is done.
2. **Fix the migration flow** — Bug 3 (delete the simulation) then Bug 2 (restore `selectedPlaylistForMigration` / decide the confirmation-dialog question). These are one coherent change and unblock auto-sync.
3. **Auth entry path & guards** — Bug 5 (CTAs → `/auth`, gate the dashboard on `useMe().loading`, catch the playlist fetches, add an error state).
4. **Dark mode** — Bug 4 (mount `ThemeProvider`, swap to `useTheme`).
5. **Green CI** — Bug 6 (`npm run format`), and resolve Bug 7 with the author.
6. **Wire `/settings` and `/profile` to `/me`** (Bug 8). Requires a new backend disconnect endpoint for the Disconnect buttons.
7. **Link `/missing-tracks`** from the dashboard or result card; then decide whether manual resolution ships (needs backend work) or the fake controls are removed (Bug 10).
8. **Delete `/sync` + `components/sync/*`** (Bug 9).
9. **Add a test setup.** There is none. Highest-value first targets: `useTransformedPlaylists` (pure), `parseDetail` in `/missing-tracks` (pure, three input formats), `useMigration`'s endpoint/payload shaping per direction, and `FREQUENCY_TO_MINUTES`.
10. **Billing** — blocked on the backend implementing the three `/billing/*` endpoints (Bug 11).
11. **Defensive `tracks?.total`** and, if credentials are available, resolve Bug 12.
12. **Merge `development` → `main` on both repos together.**

## 11. Backend behavior the frontend relies on

- **Session cookie** `sessionId`, `HttpOnly`, `sameSite=lax` (+`Secure` in prod), set on the client origin via the proxy. Redis-backed with a Postgres fallback if Redis is down.
- **`redirect_after` must be a relative path** — the backend rejects absolute/protocol-relative values and falls back to `/dashboard`.
- **Per-user sync mutex** → HTTP **409** on a concurrent migration; `useMigration` already surfaces a friendly message.
- **Rate limits** → 100 req/min/IP global, 10 syncs/hour/user, both returning **429 + `Retry-After`**. No frontend handling exists for 429 today — worth adding.
- **`needs_reconnect`** flips when a refresh token dies (Google OAuth app in Testing status kills them every 7 days). `/me` exposes it, and both `/connect` and `ConnectedAccounts` already render a **Reconnect** badge from it.
- **Failure details are unstructured strings** in `/getNotFoundTracks` (`detail`), parsed by regex client-side. If the backend ever returns structured fields, delete `parseDetail()`.
