# Phase 1A — Design-independent foundation

Status: **complete** on branch `feat/nextjs-foundation`. Phase 1B (V3 visual system) has **not** started.

The Eleventy site at the repository root (`src/`, root `package.json`, `scripts/`, legacy prototype
files) is **untouched** and still builds. The new application lives entirely in `web/`.

---

## 1. What Phase 1A established

| Area           | What exists now                                                                                                                                                                                     |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| App            | Next.js 16.4 App Router, React 19.3, TypeScript (strict + `noUncheckedIndexedAccess`), Cache Components + Partial Prefetching, typed routes                                                         |
| Styling        | Tailwind CSS v4 with the **default colour palette disabled** (`app/globals.css`) so no unapproved colours can be used before V3 tokens arrive                                                       |
| Lint/format    | ESLint (next core-web-vitals + TS) with **boundary rules**, Prettier (+ Tailwind class sorting)                                                                                                     |
| Env            | `lib/server/env.ts` — lazy, per-feature validation; nothing required at build time; errors name variables, never values                                                                             |
| Database       | Prisma 7.10 (`prisma-client` generator, `@prisma/adapter-pg`), full V1 schema, initial migration, idempotent seed                                                                                   |
| Local services | `docker-compose.yml`: Postgres 17 (dev/test/shadow DBs), MinIO (R2 stand-in) + bucket bootstrap, Mailpit (email capture)                                                                            |
| Auth           | better-auth 1.7.7 — ADMIN-only email+password (sign-up disabled), argon2id, DB sessions, DB rate limiting, TOTP 2FA + backup codes, `requireAdmin()` / `assertAdmin()` boundary, `admin:create` CLI |
| Notifications  | `EmailProvider` + `WhatsAppProvider` interfaces with **local/test implementations only** (memory, Mailpit, log). Production Resend / Meta Cloud API are deliberately **not connected**              |
| Routes         | Unstyled public skeleton (preserved Eleventy anchors), `/privacy` placeholder, admin login, 13 guarded admin module placeholders + account/2FA page, `/api/auth/*`, `/api/health`, `robots.txt`     |
| Security       | Baseline headers (CSP, HSTS in prod, nosniff, DENY framing, referrer & permissions policy), `no-store` + `noindex` on `/admin` and `/api`, preview builds `noindex`                                 |
| Tests          | Vitest unit (no services), Vitest integration (real Postgres + real better-auth handler), Playwright E2E + axe across 360/768/1280 px + reduced motion                                              |
| CI             | `.github/workflows/ci.yml`: separate **Eleventy** job (unchanged build) and **web** job (validate → drift check → typecheck → lint → format → unit → integration → secret-free build → E2E/axe)     |

---

## 2. Directory map (`web/`)

```
app/
  layout.tsx                 root <html lang="en-IN">, skip link, metadata (noindex unless SITE_MODE=production)
  (public)/layout.tsx        UNSTYLED structural header/nav/footer + preview banner
  (public)/page.tsx          section stubs with preserved anchor IDs (content/sections.ts)
  (public)/privacy/page.tsx  placeholder — school-approved text required before launch
  admin/login/               sign-in (+ TOTP / backup-code step)
  admin/(protected)/         layout (nav only — NOT an auth boundary) + guarded pages
    account/                 the only page reachable before 2FA enrolment
  api/auth/[...all]/         better-auth handler (lazy init)
  api/health/                liveness, no DB/secrets
  robots.ts, not-found.tsx, globals.css
components/admin/            nav list, placeholder, sign-out button
content/                     static, verbatim copy (site identity, section registry)
lib/
  server/                    server-only: env, db, auth/*, notifications/*
  auth-client.ts             browser auth client (admin only, no secrets)
  auth-constants.ts          cookie prefix + admin paths (no secrets)
  enquiry-contract.ts        extra_notes / #form-feedback / field names (pinned by tests)
  security-headers.ts        header builders used by next.config.ts
  whatsapp-link.ts           public wa.me builder (returns null when number unknown)
  generated/prisma/          generated client (gitignored; `postinstall` regenerates)
prisma/
  schema.prisma, migrations/, seed.ts, seed-data.ts, client-factory.ts
scripts/create-admin.ts
tests/{unit,integration,e2e,support}/
docker/postgres/init/        creates feather_touch_test + feather_touch_shadow
proxy.ts                     optimistic /admin redirect (cookie presence only)
```

---

## 3. Commands (run from `web/`)

```bash
cp .env.example .env              # then fill BETTER_AUTH_SECRET etc. (see comments)
npm ci                            # also runs `prisma generate`
npm run services:up               # Postgres + MinIO + Mailpit (Docker)
npm run db:migrate                # apply migrations to the dev DB
npm run db:seed                   # programmes (approved ages), FAQ, empty SiteSettings
npm run admin:create -- --email you@school.org --name "Your Name"   # password prompted, hidden
npm run dev                       # http://localhost:3000  (admin: /admin/login)

npm run typecheck | lint | format:check
npm test                          # unit
npm run test:integration          # needs TEST_DATABASE_URL (Docker)
npm run build && npm run test:e2e # Playwright + axe against a production build
npm run db:check                  # migrations ⇄ schema drift check
```

Mailpit UI: http://127.0.0.1:8025 · MinIO console: http://127.0.0.1:9001

---

## 4. Security model (as built)

1. **Authorization boundary = `requireAdmin()` / `assertAdmin()`** (`lib/server/auth/require-admin.ts`).
   Every admin page calls it; every future admin Server Action and admin API route must call it
   first. `tests/unit/boundaries.test.ts` fails the build if a protected page, a `"use server"`
   file under `app/admin`, or an `app/api/admin/**` route omits it.
2. `proxy.ts` and the admin layout are **UX only**. A forged cookie is rejected server-side
   (covered by E2E).
3. Sessions: DB-backed, 8 h sliding idle window, `__Secure-`/`ft-admin` cookies, `SameSite=Lax`,
   `HttpOnly`. A `session.create` database hook refuses sessions for non-admins and deactivated users;
   `requireAdmin()` re-reads the user on every call (no cookie cache) so deactivation is immediate.
4. 2FA: TOTP with backup codes and account lockout. When `ADMIN_REQUIRE_2FA=true` (default),
   un-enrolled admins can only reach `/admin/account`.
5. Rate limits (DB storage, multi-instance safe): sign-in 5 / 15 min, TOTP/backup verify 5 / 5 min.
6. Public sign-up is disabled (verified by integration + E2E tests). There are no public/parent accounts.
7. Secrets: only read through `lib/server/env.ts` (ESLint-enforced); `server-only` on every
   `lib/server/*` module (test-enforced); client components may not import server modules or read
   non-`NEXT_PUBLIC_` env (test-enforced); no `NEXT_PUBLIC_` variable may look like a secret.
8. WhatsApp: template-based interface for the **official** Meta Cloud API only; a test fails if
   an unofficial automation package is ever installed.

---

## 5. Data classification as implemented

| Class                  | Where                                                                                                |
| ---------------------- | ---------------------------------------------------------------------------------------------------- |
| A. Static content      | `content/*.ts` (verbatim from `src/_data`), programme/FAQ seed copy                                  |
| B. PostgreSQL-managed  | `Programme`, `Faq`, `ParentReview`, `SiteSettings`, `Enquiry*`, `NotificationJob`, `AuditLog`        |
| C. Admin-managed media | `MediaAsset` (metadata + storage keys only), `MediaPlacement`, `Video` — binaries go to R2 (Phase 7) |
| D. Env/config          | `.env.example` (documented; validated lazily per feature)                                            |
| E. Legacy              | Eleventy implementation at repo root — untouched until cutover                                       |

School facts (contact, address, hours, session label, Day Care age, timings, logo, photos, videos,
reviews) are **all null/empty**. Seeded programme ages are exactly: Play Group 2–3, Nursery 3–4,
KG 1 4–5, KG 2 5–6, Day Care **null (TBD)**.

---

## 6. Decisions & deviations to note

- **MinIO image:** MinIO no longer publishes community images to Docker Hub/Quay. Local dev uses
  `cgr.dev/chainguard/minio` (runs as root locally to write the volume). Production uses R2.
- **Integration DB reset:** Prisma 7 blocks `migrate reset` when invoked by an AI agent without
  explicit user consent. The suite therefore uses non-destructive `migrate deploy` on the dedicated
  `feather_touch_test` DB and tests clean up their own rows. CI uses a fresh DB every run.
- **Session lifetime:** better-auth supports a sliding expiry; the planned "7-day absolute cap" is
  not native. Current: 8 h sliding. Revisit if an absolute cap is required.
- **CSP:** baseline policy still allows `'unsafe-inline'` scripts (Next.js bootstrap). Nonce-based
  CSP is a Phase 9 hardening item; add the R2 media origin via `NEXT_PUBLIC_MEDIA_BASE_URL`.
- **2FA enrolment UI** shows the secret/URI as text (no QR library yet) — functional, unstyled.
- **`SCHOOL_PLUS_DAY_CARE`** enquiry option is carried over from the Eleventy form but still needs
  client confirmation that it is a real offering.
- **Node:** CI runs Node 22 (`.nvmrc`); the app also builds on newer Node locally.
- **npm 11 install-script allowlist:** `allowScripts` in `web/package.json` approves only the
  Prisma engines, esbuild and unrs-resolver install scripts.
- **Prisma CLI update notice:** Prisma suggests `8.0.0-rc`; we stay on stable **7.10.0**.

---

## 7. Explicitly NOT done in Phase 1A

- Any V3 visual work: colours, fonts (incl. Fredoka), imagery, layout, components.
- Migration of the content sections; the enquiry form; admin CRUD; media upload/R2 integration.
- Real email (Resend) or WhatsApp (Meta Cloud API) sending.
- Deleting/moving anything in the Eleventy implementation.

---

## 8. Phase 1B entry criteria (inputs required)

1. Approved V3 source: design file and/or HTML/CSS reference, **token sheet** (marigold / leaf / ink
   values, neutrals, radii, spacing, type scale, shadows/borders, motion), and reference
   screenshots at 360 / 768 / 1280 px for every section.
2. Fredoka font files (licensed, OFL) and the exact weights V3 uses; confirmation of Bricolage
   Grotesque / Atkinson Hyperlegible Next weights (existing woff2 files cover 600/700 and 400/600).
3. V3 section order, anchor IDs, header/footer/nav structure, and approved copy for any section
   whose wording differs from `src/_data/*`.
4. Agreement on re-baselined performance budgets for a React/Next.js site.
