# Feather Touch — Next.js application (`web/`)

The new Feather Touch Foundation School website + ADMIN area, being migrated from the Eleventy
site at the repository root. The Eleventy implementation stays untouched until this app is fully
validated.

- Stack: Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Prisma 7 + PostgreSQL (Neon) ·
  better-auth (ADMIN-only, TOTP 2FA) · Cloudflare R2 (media) · Resend (email) · Meta WhatsApp
  Business Cloud API — production providers are not connected yet.
- Current phase: **1A complete** (design-independent foundation). See
  [`docs/PHASE-1A.md`](docs/PHASE-1A.md) for what exists, commands, the security model and the
  inputs required for Phase 1B.

Quick start:

```bash
cp .env.example .env && npm ci && npm run services:up
npm run db:migrate && npm run db:seed
npm run dev
```
