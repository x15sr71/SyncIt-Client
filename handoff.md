# SyncIt — Handoff

**Updated:** 2026-09-04 · Client `development` @ `df9f072` · Backend `main` @ `824a1f1`

Supersedes every earlier version of this file. Companion docs `../RESEARCH_IMPLEMENTATION_GAPS.md`, `../IMPLEMENTATION_SUMMARY.md` and `../SYNCIT_AUDIT_REPORT.md` all predate deployment and are stale — see §9.

---

## 1. Status

**The app is deployed and reachable.** Frontend on Vercel at `https://syncit.org.in`, backend on a self-hosted VM behind a Cloudflare Tunnel at `https://api.syncit.org.in`, Postgres and Redis on the same VM. Pushing to backend `main` deploys automatically.

Sign-in, account connection, and playlist listing work end to end against live Google, Spotify and YouTube APIs.

**One thing blocks a useful migration:** `GOOGLE_API_KEY` is invalid. Track matching runs through Gemini, so every migration finishes with **0 tracks added**. This is a credential problem, not a code problem.

**And a reporting bug makes that failure look like a success** — see FE#32 in §8. This is the highest-value fix in the list.

---

## 2. Deployment topology

```
browser
  └── https://syncit.org.in                     Vercel · project "sync-it-client" · scope "chandragupt"
        └── /api/backend/*   (Next.js rewrite)  → BACKEND_INTERNAL_URL
              └── https://api.syncit.org.in     Cloudflare (DNS + tunnel, proxied)
                    └── cloudflared on the VM   systemd, enabled at boot
                          └── 127.0.0.1:3002    syncit-backend-1  (Docker)
                                ├── syncit-postgres-1  Postgres 15   (volume syncit_pgdata)
                                └── syncit-redis-1     Redis 7       (volume redisdata)
```

The browser only ever talks to `syncit.org.in`. Everything backend-bound goes through the same-origin rewrite in `next.config.mjs`, which is what keeps the session cookie first-party — see §4.

**No inbound port is open on the VM.** `cloudflared` dials out to Cloudflare. There is no reverse proxy, no origin certificate and no firewall rule to maintain; TLS terminates at Cloudflare's edge. The backend publishes on `127.0.0.1` only (`BIND_ADDR` in `docker-compose.prod.yml`).

### The VM

Ubuntu 24.04, **aarch64**, 2 cores, 11 GB RAM, disk **89 % full** (`~/cc/sample` alone holds 94 GB — unrelated to SyncIt, do not delete).

The architecture matters: images must be built for arm64. The deploy workflow uses a native `ubuntu-24.04-arm` runner rather than QEMU emulation.

Deployment lives in `~/syncit/` on the VM: `docker-compose.prod.yml` (copied by CI each deploy) and `.env` (**hand-managed, never written by CI** — this is why only four GitHub secrets exist).

A k3s cluster running Argo Workflows for unrelated unikernel research was stopped and disabled on 2026-09-03 to free memory. Restore with `sudo systemctl enable --now k3s`; nothing was deleted.

---

## 3. Deployment pipeline

`.github/workflows/deploy.yaml` in **SyncIt-Backend**, on push to `main` (plus `workflow_dispatch`):

1. build `linux/arm64` on a native arm64 runner
2. push to `ghcr.io/x15sr71/syncit-backend` — tagged with the 12-char commit SHA **and** `latest`
3. ssh to the VM, copy the compose file, `docker compose pull`
4. `prisma migrate deploy` as a one-shot, before the container swap
5. `docker compose up -d`
6. poll `/health` for 30 s — a bad env var or unreachable DB fails the deploy
7. prune images older than a week (the disk runs hot)

**Rollback** = re-run the workflow at an older SHA; the running container is always traceable to a commit.

**Required GitHub secrets** (all set): `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`, `DEPLOY_KNOWN_HOSTS`. GHCR push uses the built-in `GITHUB_TOKEN`.

Three bugs were found and fixed by actually running it — worth knowing before editing the workflow:

- `github.repository` preserves repo casing; registry paths must be lowercase (`${GITHUB_REPOSITORY,,}`).
- **`docker compose run` attaches stdin.** The remote script is piped to `bash -s`, so `compose run migrate` swallowed the rest of the script — `up -d` never ran and the step still exited 0. Fixed with `-T` and `< /dev/null`. Do not remove either.
- The failure-path log dump must not call `docker compose` (no compose variables in that ssh session); it addresses the container by name.

---

## 4. Auth and the same-origin proxy

The backend sets `httpOnly`, `sameSite: 'lax'`, `secure: true` in production, and **no cookie domain** — so the cookie belongs to whichever host served the response.

Consequence, and it is easy to get wrong: **OAuth redirect URIs must point at the client origin**, not at `api.syncit.org.in`. A callback delivered straight to the backend host sets the cookie on the wrong host and login fails silently.

Registered and verified:

```
https://syncit.org.in/api/backend/google/callback
https://syncit.org.in/api/backend/youtube/callback
https://syncit.org.in/api/backend/spotify/callback
```

Local `http://127.0.0.1:3002/...` entries are kept for dev. Google client `938768625729-qm63…` lives in GCP project **`syncit-432814`** (not the `SyncIt` Gemini project). `gcloud` cannot edit web-client redirect URIs — Console only.

`/spotify/login` and `/youtube/login` sit behind `sessionMiddleware`, so Google sign-in must happen first.

---

## 5. Environment

**VM `~/syncit/.env`** — the only place backend credentials live. `TOKEN_ENC_KEY` is **mandatory**: the app refuses to boot in production without it.

`TOKEN_ENC_KEY` does _not_ break existing plaintext token rows. `tokenCrypto.ts:51-53` passes legacy plaintext through and re-encrypts on next write. Earlier handoffs claimed otherwise; verified false.

`TRUST_PROXY=false` today. All traffic now arrives via Vercel → Cloudflare → tunnel, so the backend sees proxy IPs and **per-IP rate limiting currently treats every user as one client**. Revisit — see BE#45.

**Vercel** (`sync-it-client`, scope `chandragupt` — a different account from `chandragupt-singhs-projects`): `BACKEND_INTERNAL_URL=https://api.syncit.org.in`. Read at build time inside `rewrites()`, so a change needs a redeploy.

---

## 6. Database

**Migrated off Supabase on 2026-09-03** to self-hosted Postgres 15 on the VM (matching Supabase's 15.8).

Dumped with `pg_dump --schema=public --no-owner --no-privileges --no-acl` through the **session pooler on port 5432** — the direct host is IPv6-only on Supabase's free tier and unreachable from most networks, and the 6543 pooler is transaction-mode which `pg_dump` cannot use. Restored with `ON_ERROR_STOP=1`, zero errors, all row counts matched.

**Supabase was left untouched.** Rolling back is two lines in `~/syncit/.env`. Retire it once the VM database has proven itself.

`_prisma_migrations` carries 40 historical rows against 4 migration folders; `migrate deploy` reports "No pending migrations" and is happy.

---

## 7. Stack

Next 15.5.20, React 19, TypeScript strict, Tailwind 3.4 + shadcn/ui, `lucide-react`, `react-icons/si`, `next-themes`, `axios`, `geist`. No state library, no react-query — per-page `useState` plus custom hooks.

| File                          | Why it matters                                                                  |
| ----------------------------- | ------------------------------------------------------------------------------- |
| `utils/api.ts`                | Sole source of the backend base URL                                             |
| `next.config.mjs`             | The `/api/backend/*` rewrite — this is the cookie strategy, not an optimisation |
| `hooks/useMe.ts`              | Session + connections + stats; the auth source of truth                         |
| `app/dashboard/page.tsx`      | Composition root; owns every dialog and the migration callbacks                 |
| `components/ui/card.tsx`      | `Card` and `CardTitle` set the app-wide visual weight (§7.1)                    |
| `components/theme-toggle.tsx` | Shared by both headers                                                          |

`ignoreBuildErrors: false` and `ignoreDuringBuilds: false` are deliberate. Do not relax.

### 7.1 Design language (PR #34, merged)

Ornamental chrome removed in favour of type, whitespace and hairlines. Most of the reach comes from three primitives, so change these rather than editing pages one by one:

- `Card` — `shadow-none`, hairline `border-border/60`, `rounded-2xl`
- `CardTitle` — `text-base font-medium` (was `text-2xl`)
- `.hover-lift` — no glow; 1 px rise and a border tint

Status colours are alpha-based (`bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400`) because the previous light-only Tailwind shades were invisible in dark mode across ~22 files. Solid fills like `bg-amber-500` on icon tiles are intentional.

Verified on all 9 routes at 390 / 768 / 1280 in both themes, no horizontal overflow. The iPhone mockups (`animated-phones.tsx`, `iphone-frame.tsx`) are deliberately untouched; the white surfaces inside them are simulated device UI and correct.

---

## 8. Known bugs

### FE#32 — a failed migration is reported as a success · **highest value**

A run that adds **zero** tracks is displayed as successful in two places. Confirmed against the live database (`sourceTrackIds` = 0 recorded successes, `failedTracks` = 7, `lastSyncStatus` = `PARTIAL`).

Three independent defects stack up:

1. **Backend** — `youtubeToSpotify.ts:309` and `spotifyToYoutube.ts:342`: `lastSyncStatus = failedTrackDetails.length > 0 ? 'PARTIAL' : 'SUCCESS'`. `numberOfTracksAdded` is never consulted, so _0 added and 7 failed_ is stored as `PARTIAL`.
2. **Recent syncs** — `recentSyncs.tsx:14`: `if (status === 'SUCCESS' || status === 'PARTIAL') return 'success'`. `PARTIAL` renders a green **Success** badge. **This is what a user actually sees.**
3. **Result card** — `migration-result-card.tsx:52-53`: `hasFailures` is derived from `failedTracks.length` alone. Zero added with zero recorded failures shows "Migration Complete" and "Migration Successful!", and `successRate = Math.round(0/0*100)` renders **`NaN%`**.

The dashboard toast is already correct (`app/dashboard/page.tsx:230` fires an error when `successCount === 0`), so the UI currently contradicts itself: the toast says failed, the card and the widget say success.

`me.controller.ts:56` also counts `PARTIAL` toward the success-rate stat, inflating the profile figure.

Suggested fix: make "success" mean `addedCount > 0 && failedCount === 0` in one shared place, add a `NO_TRACKS_ADDED` status, and guard the `0/0` division.

### Other open issues

| Issue             | Detail                                                                                                                                                                             |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **BE#44**         | `GOOGLE_API_KEY` invalid → every migration adds 0 tracks. New key from AI Studio in project `gen-lang-client-0001455411`, update `~/syncit/.env`, `docker compose … up -d backend` |
| **FE#33**         | `/missing-tracks` renders the literal string `"undefined"` where each track's artist should be — data-shape issue                                                                  |
| **BE#45**         | `TRUST_PROXY=false` while behind Vercel + Cloudflare, so per-IP rate limits key on proxy IPs, not users                                                                            |
| **FE#24**         | Auto-sync `status` / `update-interval` / `sync-now` have no callers — an enabled auto-sync cannot be cancelled from the UI                                                         |
| **FE#27**         | Landing CTAs route to `/dashboard` with no auth guard; unguarded mount fetches produce unhandled rejections                                                                        |
| **FE#29**         | No frontend test framework. Start with pure functions: `useTransformedPlaylists`, `parseDetail`, `useMigration` payload shaping                                                    |
| **FE#30**         | `/pricing` checkout always fails — no billing backend exists                                                                                                                       |
| **FE#23**         | Pricing page claims features that do not exist (email reports, bidirectional auto-sync)                                                                                            |
| **BE#41**         | Failure records store `Channel: undefined` — built with `videoChannelTitle`, read as `channelName` at three sites; only `searchYoutube.ts:264` has the `??` fallback               |
| **BE#42 / BE#43** | Three Spotify 501 stubs; the 300-track cap is documented but unenforced                                                                                                            |
| **Ops**           | Spotify app is in **Development mode** — 25 users max, each added by email. Public use needs a quota extension                                                                     |
| **Ops**           | VM disk at 89 %. Each deploy pulls another ~848 MB image; CI prunes >7 days, but headroom is thin                                                                                  |
| **Sec**           | Leaked `firebase-adminsdk` key in `syncit-a9aac`, flagged in the July audit, still not revoked                                                                                     |

---

## 9. What changed, 2026-09-03 → 04

- **Frontend redesigned** across all 9 routes and merged (PR #34); dark mode fixed in ~22 files.
- **Backend `main` brought current** — it had been ~2 months behind. PRs #45, #47.
- **Deployment built from nothing**: Dockerised deploy workflow, prod compose, GHCR images (PRs #46, #48, #49).
- **Database migrated** off Supabase to the VM.
- **Cloudflare Tunnel** created; `api.syncit.org.in` now resolves to it (a stale A record pointed at `18.178.39.118`).
- **OAuth redirect URIs** corrected to the `/api/backend/...` proxy paths on both Google and Spotify.
- **k3s/Argo stopped** on the VM to free memory.
- `prisma` moved to `dependencies` and `prisma.config.ts` copied into the runtime image — both required for `migrate deploy` to run from the deployed image.
- `ease-spring` added to `tailwind.config.ts` (the arbitrary cubic-bezier triggered an ambiguous-class warning every build).

**Stale claims in older docs:** they describe the app as undeployed with `syncit.org.in` serving an unrelated Vite waitlist — no longer true. `lib/pricing/plans.ts:40` still says the 300-track cap is "enforced by the backend"; nothing enforces it. `package.json` is still named `my-v0-project`. PR #35 (an earlier handoff rewrite) was closed unmerged.

---

## 10. Decisions not to change without investigating

1. **The `/api/backend` same-origin proxy is the cookie strategy.** Removing it breaks auth in production.
2. **OAuth redirect URIs must be on the client origin**, never `api.syncit.org.in` (§4).
3. `127.0.0.1` everywhere in dev — Spotify redirect rules and cookie host-scoping.
4. One shared axios instance, relative paths only.
5. `ignoreBuildErrors: false` / `ignoreDuringBuilds: false`.
6. Sequential migration — parallel requests hit the per-user mutex and 409.
7. No Spotify refetch after rename; YouTube does refetch.
8. The client never grants entitlements; `lib/pricing/plans.ts` is display strings only.
9. `images: { unoptimized: true }` — playlist art comes from arbitrary CDN hosts.
10. **`compose run … -T … < /dev/null`** in the deploy workflow (§3).
11. The backend binds to `127.0.0.1`; the tunnel is the only ingress.

---

## 11. Next, in order

1. **FE#32** — stop reporting failed migrations as successful. Cheap, and it is actively misleading.
2. **BE#44** — replace `GOOGLE_API_KEY`; nothing else stands between here and a working migration.
3. Walk the full login → connect → migrate flow in a browser. Spotify's redirect URI has not been exercised end to end.
4. **BE#45** — set `TRUST_PROXY` correctly now that the proxy chain is settled.
5. **FE#33**, then **FE#24** and **FE#27**.
6. Reclaim VM disk before it becomes an incident.
7. Retire Supabase once the VM database has a few days of confidence.
