# Feather Touch V3 — Implementation Spec (Next.js / Tailwind)

Status: **spec only — nothing here is implemented yet.** Phase 1B has not started.
Design values come from [`V3-DESIGN-SOURCE.md`](./V3-DESIGN-SOURCE.md) (cited as **DS §n**).
Platform facts come from `web/docs/PHASE-1A.md` (commit `6b1f0d0`).

Order of authority when they disagree:

1. Project decisions already approved (Next.js + Tailwind + PostgreSQL/Prisma, ADMIN-only dashboard, the
   functional requirements in §3) — these override `PROMPT.md`'s architecture instructions.
2. V3 visual design (PDF → reference screens → `prototype.css` values) — overrides any Tailwind default
   and any older Eleventy styling.
3. Verbatim content in `src/_data/*` / Prisma seed — unless the copy decision in §14.1 says otherwise.

Never: invent school facts, testimonials, statistics, awards, timings, contact details or facilities;
substitute Tailwind defaults for V3 values; add decoration outside DS §9.

---

## 1. Stack constraints that shape the implementation

- Next.js 16.4 App Router, React 19.3, Cache Components, typed routes. Read
  `web/node_modules/next/dist/docs/` before writing code (`web/AGENTS.md`). Notes from that doc set:
  - `next/image`: `priority` is **deprecated** — use `preload` or `loading="eager"` + `fetchPriority="high"`;
    `images.qualities` is **required**; enable `formats: ['image/avif','image/webp']`.
  - `next/font/local`: variable fonts need no `weight` list; extra `@font-face` descriptors via
    `declarations` (needed for Bricolage `font-stretch: 75% 100%`).
- Tailwind v4 with the **default colour palette disabled** (`app/globals.css`). Phase 1B adds the V3
  palette only; never re-enable defaults.
- `prototype.css` is a value reference. Do **not** port its sprites, container queries, `.is-hover`
  demo classes or the `.ft button{font:inherit}` rule (DS §8.12 note).

---

## 2. Design tokens → Tailwind v4 `@theme`

Create `web/app/styles/tokens.css` (imported from `globals.css`). Exact values from DS §3–§7.

```css
@theme {
  --color-*: initial;                       /* keep defaults disabled */
  --color-transparent: transparent;
  --color-current: currentColor;
  --color-white: #FFFFFF;                   /* inputs/chips only (DS §3) */

  --color-paper: #FFF6E6;
  --color-paper-raised: #FFFBF3;
  --color-paper-deep: #F6E7CA;
  --color-kraft: #F1DDB8;
  --color-line: #E2CFA8;
  --color-ink: #1E3A2B;
  --color-ink-soft: #4A5A4E;
  --color-marigold: #E88640;
  --color-marigold-hover: #F1964F;
  --color-marigold-ledge: #B5601F;
  --color-marigold-display: #C1570F;        /* display text >= 40px ONLY */
  --color-marigold-tint: #FFE5C2;
  --color-marigold-soft: #FFD29B;
  --color-leaf: #A9CF48;
  --color-leaf-2: #C8E283;
  --color-leaf-3: #DDEDB0;
  --color-leaf-tint: #EEF6D6;
  --color-leaf-deep: #3E6A12;
  --color-navy: #22305A;                    /* Safety band ONLY */
  --color-flag: #6B551F;
  --color-flag-line: #B9A06A;
  --color-field-line: #C9B58C;
  --color-placeholder: #6E7A70;

  --font-display: var(--font-bricolage), system-ui, sans-serif;
  --font-body: var(--font-atkinson), system-ui, sans-serif;
  --font-accent: var(--font-fredoka), sans-serif;

  --radius-paper: 5px;  --radius-control: 14px; --radius-shelf: 18px; --radius-photo: 22px;
  --radius-field: 12px; --radius-thumb: 8px;    --radius-chip: 10px;

  --breakpoint-sm: 37.5625rem;  /* 601px: end of the 390px composition (prototype ≤600) */
  --breakpoint-nav: 75rem;      /* 1200px: full header nav (PROMPT.md) */
}
```

- Alpha tints (`rgba(30,58,43,.07)` etc., DS §3 table) are written with `color-mix()` or
  `bg-ink/7`-style opacity modifiers **only** where they reproduce the exact listed alpha.
- Shadows as named utilities: `shadow-ledge` (`0 4px 0 var(--color-marigold-ledge)`), `-hover` (5 px),
  `-active` (1 px); `shadow-round` (`0 3px 0 rgb(30 58 43 / .24)`); `shadow-bar` (header);
  `shadow-poster` (`0 12px 24px -16px rgb(30 58 43 / .55)`).
- Type styles as `@utility` classes (`type-display`, `type-h2`, `type-h3`, `type-h4`, `type-lead`,
  `type-tape`, `type-tab`, `type-flag` …) carrying family + weight + `font-stretch` + size + line-height +
  tracking exactly per DS §4, with mobile → desktop sizes switched at `sm`.
- Body: `bg-paper text-ink font-body text-[18px] leading-[1.55] antialiased`.
- Focus: global `:focus-visible { outline: 3px solid var(--color-ink); outline-offset: 3px }`; on
  `navy`/`ink` bands the outline colour is `paper`. Replace the Phase 1A `currentColor`/2 px rule.

### 2.1 Responsive model

Mobile-first. The design defines two compositions (DS §5):

| Range          | Composition                                                                                        |
| -------------- | -------------------------------------------------------------------------------------------------- |
| < 601 px       | 390 px composition (m_* screens): 16 px gutter, stacked grids, mobile type sizes                   |
| 601–1199 px    | Desktop composition with fluid grids; header shows **Menu** button (nav switch is 1200 px)          |
| ≥ 1200 px      | Desktop composition, full nav + header CTA                                                          |

Tablet (768/1024) is **not designed** (DS §15). Until the designer supplies tablet references, apply the
desktop composition from 601 px with these guards, and screenshot 768/1024 for client sign-off:
hero grid falls back to one column if the copy column would be < 420 px; staircase stays 4 columns
only when each column ≥ 160 px, else uses the mobile stack; 2-column ruled lists stay 2 columns.
Record each guard as a deviation in the Phase 1B report.

---

## 3. Approved functional requirements (project-level, not in the V3 handoff)

| # | Requirement | Implementation note |
| - | ----------- | ------------------- |
| F1 | Homepage slideshow of **6–7 images** | Admin-managed (`MediaPlacement` `HERO_SLIDESHOW`, `isActive`, `sortOrder`). V3 visuals designed for 3 → see §6.3 and §14.2. |
| F2 | **2–3 videos** | `Video` model (file + poster `MediaAsset`, captions key). No V3 design → §8.2, §14.3. |
| F3 | **Real parent reviews only** | `ParentReview`: render only `status=APPROVED` **and** `consentConfirmed=true`. Section absent when zero. No review/rating schema markup. Never seed or fake. |
| F4 | Programme ages | Play Group **2–3**, Nursery **3–4**, KG 1 **4–5**, KG 2 **5–6**, Day Care **TBD** (null → Content-required state). Already seeded. |
| F5 | Enquiry form | V3 "Request a visit" form, Server Action → PostgreSQL `Enquiry`. §7. |
| F6 | PostgreSQL + Prisma | Prisma 7.10, existing schema/migrations. |
| F7 | Email notification | `EmailProvider` → `NotificationJob` (outbox); Resend in production (not yet connected). |
| F8 | WhatsApp public CTA | `buildWhatsAppLink()` (`wa.me` click-to-chat); hidden when number is null. |
| F9 | Provider-ready WhatsApp notification architecture | `WhatsAppProvider` interface, template-based, Meta Cloud API only; local/log impl until connected. |
| F10 | **ADMIN-only dashboard** | better-auth, sign-up disabled, `requireAdmin()` on every page/action/route (test-enforced). |
| F11 | Admin media management | `MediaAsset` upload/alt/caption/focal point/consent; R2 storage. |
| F12 | Admin videos | CRUD on `Video`, max 3 active. |
| F13 | Admin parent reviews | Draft → Approved (records approver/time) → Archived; consent checkbox required to approve. |
| F14 | Enquiry management | List/filter by status, detail, notes, status history, duplicate hint, CSV export (audit-logged). |
| F15 | Public visitors require no login | No public accounts; `/admin` only is gated. |
| F16 | Preserve `extra_notes` compatibility | Honeypot input `name="extra_notes" id="extra_notes"` and live region `id="form-feedback"` (`lib/enquiry-contract.ts`, test-pinned). |
| F17 | No unofficial WhatsApp automation | Test already fails if an unofficial package is installed. No scraping/web-WhatsApp bots. |

---

## 4. File / component structure

```
web/
  app/
    styles/tokens.css               @theme tokens + @utility type styles (§2)
    fonts.ts                        next/font/local declarations (§5)
    globals.css                     imports tokens, base layer, reduced-motion rules
    layout.tsx                      <html lang="en-IN" className={font variables}>
    (public)/layout.tsx             <SiteHeader/>, <main>, <SiteFooter/>, preview banner (preview only)
    (public)/page.tsx               composes the homepage sections in V3 order (§6)
  components/
    ui/                             server components unless noted
      button.tsx                    Button / ButtonLink: variant primary|secondary, size md|sm, block
      round-button.tsx              48/44 px circular control ("use client" only where interactive)
      text-link.tsx                 .lnk with leaf underline + arrow
      icon.tsx                      inline SVG set: arrow, chevron-l/r, menu, close, plus, pause, play
      tape.tsx                      paper-tape label: tone paper|leaf|marigold-soft
      content-required.tsx          inline flag (.cr): label + "CONTENT/INTEGRATION/APPROVAL REQUIRED"
      need-panel.tsx                dashed ASSET/CONTENT REQUIRED panel; inverse tone for navy
      ruled-list.tsx                ruled list, columns 1|2, tone default|daycare|inverse
      paper-mount.tsx               rotated coloured sheet behind media
      brush-underline.tsx           lime brush under a word (hero, current nav item only)
      marker-strike.tsx             Why statement only
      footprints.tsx                Admissions only
      section.tsx                   <section aria-labelledby> + band colour + V3 padding
    layout/
      site-header.tsx               logo, sub-brand, desktop nav, CTA
      mobile-menu.tsx               "use client" — button + dialog panel (§6.1)
      site-footer.tsx
      preview-banner.tsx
    home/
      hero.tsx                      server; renders <HeroSlideshow> island
      hero-slideshow.tsx            "use client" (§6.3)
      why.tsx, programmes.tsx, programme-step.tsx, day-care.tsx, school-life.tsx,
      childrens-work.tsx, day-sequence.tsx, safety.tsx, partnership.tsx,
      admissions.tsx, enquiry-form.tsx ("use client" for pending/feedback state), faq.tsx,
      videos.tsx (F2), parent-reviews.tsx (F3)
  content/                          verbatim static copy (V3 strings), typed
  lib/content-state.ts              resolve(value) → {kind:'value'|'required'} + launch-gate registry
  public/brand/                     logo-feather-touch-INTERIM.png, mark-leaf-in-hand.png, brush-lime.png
  public/media/seed/                the 6 approved photographs/posters (until R2 is live, §9)
```

Rules: server components by default; client islands only for slideshow, mobile menu, enquiry form state
(and video player if a custom control is needed). No UI kits, carousel libraries or animation libraries.

---

## 5. Typography implementation

- Copy the four handoff woff2 files to `web/app/fonts/` (not the Eleventy 600/700 static files).
- `next/font/local`, `display: 'swap'`, CSS variables `--font-bricolage`, `--font-atkinson`,
  `--font-fredoka`:
  - Bricolage: `weight: '200 800'`, `declarations: [{ prop: 'font-stretch', value: '75% 100%' }]`, preload.
  - Atkinson: two `src` entries (normal + italic), `weight: '200 800'`, preload.
  - Fredoka: `weight: '300 700'`, **`preload: false`** (accent only, below-fold usage dominates).
  - `adjustFontFallback` on (default) to limit CLS from swap.
- Display styles must set `font-stretch` (88/90/92/94 %) and non-standard weights (760, 740, 720, 680, 650)
  exactly; verify the variable axes render them (a stretch-less fallback is a defect).
- Fredoka may be used **only** for: tape captions/eyebrows, slide tab words, counter chip, "Step n",
  pin captions, hero note, partnership closing, footer tagline, swipe hint. Lint-able via a
  `font-accent` usage review in PR checklist.
- Licence: add the OFL texts for all three variable families to `web/app/fonts/` (handoff omits them;
  Bricolage and Atkinson OFL texts exist in `src/assets/fonts/`; Fredoka's must be sourced).

---

## 6. Homepage sections (V3 order)

Section order, ids and bands. **Canonical ids follow V3**; legacy Eleventy/Phase 1A ids are kept as
zero-size alias anchors so old links still land (`<span id="daycare" aria-hidden="true" />` inside the
section). Update `content/sections.ts` and its E2E test accordingly.

| # | Component        | Canonical id   | Legacy alias(es)            | Band            | Data source                                       |
| - | ---------------- | -------------- | --------------------------- | --------------- | ------------------------------------------------- |
| 0 | SiteHeader       | —              | —                           | paper           | content/site, nav                                 |
| 1 | Hero + slideshow | `top`          | `home`                      | paper           | content + `MediaPlacement(HERO_SLIDESHOW)`        |
| 2 | Why              | `why`          | `about`                     | paper-raised    | content (about.lead + statement)                  |
| 3 | Programmes       | `programmes`   | —                           | paper           | `Programme` (DB)                                  |
| 4 | Day Care         | `day-care`     | `daycare`                   | marigold-tint   | content + `Programme(day-care)` age; meals/pickup fields TBD |
| 5 | School Life      | `school-life`  | `activities`                | paper           | content (groups) + posters                        |
| 6 | Children's Work  | `childrens-work` | —                         | kraft           | content + artwork asset                           |
| 7 | A day            | `day`          | `routine`                   | paper           | content (daySequence) + timings                   |
| 8 | Safety           | `safety`       | —                           | navy            | content + SiteSettings/safety practices           |
| 9 | Partnership      | `partnership`  | —                           | paper-raised    | content                                           |
| 10| Admissions       | `visit`        | `admissions`, `enquire`, `contact` | leaf-tint | SiteSettings + enquiry form                      |
| 11| FAQ              | `faq`          | —                           | paper           | `Faq` (DB, `showOnHome`)                          |
| 12| SiteFooter       | —              | —                           | ink             | SiteSettings                                      |

Videos (F2) and Parent reviews (F3) have no V3 slot — placement pending, see §14.3.
`#routine` maps to "A day"; do not also alias it in School Life.

Per-section requirements (all measurements DS §8.x; mobile = < 601 px):

### 6.0 Header (DS §8.0)
- Sticky: **not specified** — keep static (do not add stickiness).
- Nav items: Home, About, Programmes, Day Care, School Life, Admissions, Contact → homepage anchors
  (`/#why`, `/#programmes`, `/#day-care`, `/#school-life`, `/#visit`, `/#contact`). "Home" carries
  `aria-current="page"` + brush underlay on `/`. Section-scroll highlighting is not specified — don't add.
- Logo `next/image` (interim PNG, 108 × 55.3 / 84 × 43, `alt=""` inside a link labelled
  "Feather Touch Foundation School and Day Care Centre, home"); sub-brand text `aria-hidden`.
- CTA `Button size=sm` "Book a school visit" → `/#visit`, hidden < 1200 px.

### 6.1 Mobile menu (DS §8.1)
- `<button aria-expanded aria-controls="mobile-menu">` "Menu"/"Close" (48 px high).
- Panel: full-viewport fixed layer, `role="dialog" aria-modal="true" aria-label="Menu"`, paper bg,
  replicates header bar with Close. Focus first link on open; trap Tab; Escape/Close → focus back to
  Menu button; `overflow:hidden` on `<html>` while open (restore scroll position); link click closes.
- Bottom: "Book a school visit" (primary, block) + "Enquire now" (secondary, block → `/#visit`);
  contact line: WhatsApp CTA when number known, else Content-required flag "Call and WhatsApp".
- Hidden ≥ 1200 px; panel must not render in DOM when closed (or `inert` + `hidden`).

### 6.2 Hero (DS §8.2)
- One `h1` per page (replaces Phase 1A's `SITE.name` h1). Line breaks: use responsive `<br>` exactly as
  the prototype (desktop vs mobile sets) — not `text-wrap: balance` substitutes.
- "when they are happy." in `marigold-display`; `<BrushUnderline>` under "happy.".
- "Swipe to look around" + hand arrow: mobile only, `aria-hidden` arrow.

### 6.3 Slideshow (DS §8.3) — `hero-slideshow.tsx`
State machine ported from `slideshow-behaviour.js`:

- State `{ index, paused, cycle }`; `setInterval` 6000 ms, cleared/re-armed on every `go()` and toggle;
  cleared on unmount and when `document.hidden` (resume on visible — standard hygiene, not a visual change).
- Swipe via Pointer Events on the frame: record `clientX` on `pointerdown`, on `pointerup` dx < −40 → next,
  dx > 40 → prev; `touch-action: pan-y`; ignore drags ≤ 40 px.
- Keyboard: tabs and arrows are `<button>`s (Enter/Space native). Left/Right arrow keys on the focused
  tab list move between tabs (optional enhancement; spec'd by PROMPT tests: "Enter and Space on tabs and arrows").
- `prefers-reduced-motion: reduce` → initial `paused=true`, no transitions/zoom, progress bar static full.
  Read via `matchMedia` in an effect; server render must output the paused-safe markup to avoid flash
  (render first slide, progress bar CSS-driven).
- Progress fill: CSS animation 6 s linear keyed by `cycle` (alternate two keyframe names or remount the
  fill element by `key={cycle}`); `animation-play-state: paused` when paused.
- ARIA exactly as DS §8.3; live region `aria-live={paused ? 'polite' : 'off'}` text "Photo n of N".
- **N slides (F1):** counter "n / N"; captions/alt from `MediaAsset.caption` / `altText` (required non-empty
  to activate a slide); mount colour cycles leaf → marigold → marigold-soft (`index % 3`) and rotations
  −2.6° / 1.8° / −1.4° likewise. Tab shelf for N > 3 is **undesigned** (§14.2) — do not ship > 3 tabs
  until the designer specifies it.
- Images: `next/image` `fill` inside the 4:5 frame, `sizes="(min-width:1200px) 472px, (min-width:601px) 40vw, calc(100vw - 32px)"`,
  `object-position` from focal point. Slide 1: `loading="eager" fetchPriority="high"`; others lazy but
  **pre-decoded before they fade in** (load next slide when current becomes active). Thumbnails 40 × 50.
- Only `consentConfirmed=true` assets may be placed in production (§9).

### 6.4 Why (DS §8.4)
Visually hidden `h2` "Why Feather Touch"; `<MarkerStrike>` on "pressure or rote learning" (SVG,
`aria-hidden`; the phrase stays real text). Link "About Feather Touch" → target page **not designed**;
point to `/#why` until an About page exists (§14.6).

### 6.5 Programmes (DS §8.5)
- Data from `Programme` where slug ≠ `day-care`, ordered by `sortOrder`, exactly 4 expected.
- Desktop staircase with fixed block heights 170/206/242/278 and margins 108/72/36/0; baseline at 278 px.
- Flags: **Age group** now renders the approved age (F4) instead of the flag — format
  "Ages 2–3" (en dash) pending copy confirmation (§14.4); styled as plain text in the flag position, not a
  dashed flag. **Timings** stays Content-required while `timings` is null.
- Mobile: native `<details>` closed by default, 48 px summary "{count} focus areas, age and timings",
  `+` rotates 45°. Counts computed from data.
- "More about {name}" link: target not designed → `/#programmes` until programme pages exist (§14.6).

### 6.6 Day Care (DS §8.6)
- Practical-details `<dl>`: Hours, Age range (Day Care age = TBD → Content-required), Meals, Pickup.
  `Programme`/`SiteSettings` currently lack `meals`/`pickup`/Day Care hours fields → schema addition in the
  content phase (`DayCareDetails` on SiteSettings or Programme); render flags until then.
- Photo slot: NeedPanel until an admin-placed, consent-confirmed Day Care photo exists (4:5 desktop, 3:2 mobile).

### 6.7 School Life (DS §8.7)
- Four groups: static content in `content/school-life.ts` (group headings + joined sentence exactly as V3).
  Do not reorder or date activities.
- Poster wall absolutely positioned at ≥ 601 px (min-height 650); < 601 px horizontal scroll-snap strip,
  the **only** horizontal scroll on the page; strip is a focusable region
  (`tabIndex=0`, `role="region"`, `aria-label="School posters"`) so keyboard users can scroll it.
- Posters are school-designed material containing children's photos → poster usage rights + consent gate (§9).

### 6.8 Children's Work (DS §8.8)
Artwork (4:3) on marigold mount −1.5°; tape caption; 4 NeedPanels with V3 copy verbatim.

### 6.9 A day (DS §8.9)
9-column row at ≥ 601 px with dashed connector; vertical list below. Timings flag while timings unknown;
when the school supplies times, show them under each label (layout for times **not designed**, §14.5).

### 6.10 Safety (DS §8.10)
Navy band, paper text, paper focus ring. Safety-practices NeedPanel (inverse) until `site.safety.practices`
content exists — storage location to be added in the content phase.

### 6.11 Partnership (DS §8.11)
Heading with `marigold-display` operators; the `<br>` before "=" is fixed.

### 6.12 Admissions (DS §8.12) — see §7 for the form.
Contact `<dl>`: Call (`tel:` link) / WhatsApp (F8 link) / Email (`mailto:`) / Address, each showing the
SiteSettings value or a Content-required flag. Session flag from `admissionsSessionLabel`.

### 6.13 FAQ (DS §8.13)
`Faq` where `isActive && showOnHome` by `sortOrder`; first `<details open>`. See §14.1 for copy differences.

### 6.14 Footer (DS §8.14)
Visit (address, visiting hours), Contact (phone, WhatsApp, email), Explore nav; base row with copyright
year from build time and Privacy link — shown as "Privacy policy — APPROVAL REQUIRED" flag until
`privacyPolicyApproved`, then a link to `/privacy`.

---

## 7. Enquiry form (F5, F7, F9, F16)

V3 fields: Parent's name, Phone number, Programme (radio chips: Play Group, Nursery, KG 1, KG 2, Day Care),
Preferred day or time. Implementation:

- `<form id="enquiry-form">` inside `#visit`, Server Action, progressive enhancement (works without JS).
- Honeypot: visually hidden `<input name="extra_notes" id="extra_notes" tabIndex={-1} autoComplete="off">`
  (F16). Non-empty → respond with the normal success state, store nothing.
- Feedback: `<p id="form-feedback" role="status" aria-live="polite">` (F16), replacing the V3
  "Form delivery — INTEGRATION REQUIRED" flag once the action is live. Error/success visuals are **not
  designed** (§14.7) — use V3 primitives (flag/need styles are not appropriate for errors; propose an
  ink-text message with icon for designer sign-off).
- Validation (zod, shared contract): name required; phone required, normalised to E.164 (`phoneE164`,
  keep `phoneRaw`); programme required (maps to `ProgrammeInterest`); preferred time optional.
  Field-level errors linked with `aria-describedby`, `aria-invalid`.
- **Schema gap:** `Enquiry` has no preferred-time column → add `preferredVisitTime String?` (migration in
  the form phase). Email, child name and message exist in the schema/legacy form but are **not in V3** —
  keep columns nullable; do not add fields to the V3 form without design approval (§14.7).
- `SCHOOL_PLUS_DAY_CARE` stays in the enum for legacy data; not offered as a chip.
- Privacy consent (`privacyConsentAt`) and WhatsApp opt-in (`whatsappOptIn`) controls are not in V3 —
  needed before launch; design required (§14.7).
- Abuse controls: `RateLimitBucket` per hashed IP + phone; `ipHash` salted; duplicate detection by
  `phoneE164` within a window → `possibleDuplicateOfId`.
- On success, in one transaction: create `Enquiry`, `EnquiryStatusChange(→NEW)`, and `NotificationJob`
  rows (EMAIL to the school inbox; WHATSAPP template job only when the official provider is configured).
  A worker/cron drains the outbox with retries (`attempts`, `nextAttemptAt`, `DEAD` after N).
  Parents never receive automated WhatsApp messages unless they opted in and an approved Meta template exists.

---

## 8. Admin (F10–F14)

No V3 admin design exists. Admin uses the V3 tokens and primitives (paper/ink/marigold, Atkinson,
14 px controls, focus ring) in a plain functional layout — no new colours, no Tailwind defaults.

- 8.1 Media (F11): upload to R2 via presigned URL → `MediaAsset(UPLOADING→PROCESSING→READY)`; variants
  (AVIF/WebP widths) recorded in `variants`; required alt text unless `isDecorative`; caption; focal point
  picker; **consent checkbox + note required before any placement can be activated**; soft delete.
  Placements: Hero slideshow (6–7 active, sortable), School Life, Gallery.
- 8.2 Videos (F12): 2–3 active; MP4 (H.264) + poster image (both `MediaAsset`), optional WebVTT captions
  (`captionsKey`); title/description. Public player: native `<video controls preload="none" poster>`,
  no autoplay, captions track when present, explicit width/height (16:9 unless the upload differs).
- 8.3 Reviews (F13): create/edit draft, consent fields, approve (records `approvedById/At`), archive,
  reorder. Public shows only approved + consented. Never import from Google or elsewhere automatically.
- 8.4 Enquiries (F14): table (status, programme, date, phone), filters, detail with notes and history,
  status transitions write `EnquiryStatusChange` + `AuditLog`; CSV export audit-logged; phone `tel:` and
  WhatsApp click-to-chat links for staff (manual, official wa.me only).
- Every admin page/action/route calls `requireAdmin()`/`assertAdmin()` first (boundary test enforces).

---

## 9. Images and media

- **Consent gate:** `images.json` marks all three slideshow photos `consentConfirmed: false`, and the
  handoff lists "parental consent for every child photograph" and "poster usage rights" as outstanding.
  Preview builds may show the approved assets; **production must not render any child photograph or poster
  without confirmed consent** (enforced by the launch gate, §10).
- Approved local assets (DS §11) are imported statically (`import hero from '…/hero-welcome.jpg'`) for
  intrinsic sizes and blur placeholders until R2 placements replace them. Map handoff names to
  `images.json` ids: `hero-welcome`↔`welcome-back`, `hero-puzzle`↔`classroom-puzzle`,
  `hero-colouring`↔`classroom-colouring`; reuse their alt/caption verbatim (V3 alt for welcome-back drops
  the quote marks around "Welcome Back to School" — use the images.json string, §14.1).
- `next.config.ts`: `images.formats ['image/avif','image/webp']`, `images.qualities` allowlist,
  `remotePatterns` for the R2/media origin, and add that origin to CSP `img-src`/`media-src`.
- Every image: explicit dimensions or `fill` inside an aspect-ratio box; `sizes` set; lazy except slide 1.
- Source resolution: hero JPGs are 880 px wide (< 2× of 472 px). Request originals from the school for
  sharper 2× output; do not upscale.
- Treatments: radius 22 photos / 3 px posters; paper mounts; no filters, no background removal,
  no AI edits, no stock.

---

## 10. Content-required states and the launch gate

- `lib/content-state.ts` registers every school fact the page needs (DS §14 list + Day Care meals/pickup,
  safety practices, programme timings, privacy policy, form delivery, consent per asset).
- Preview (`SITE_MODE!=='production'`): render V3 flags/need panels.
- Production: placeholders must never ship. Because facts live in PostgreSQL, the gate is a **deploy-time
  check** (`npm run launch:check`, queries SiteSettings/Programme/MediaAsset and lists every unresolved
  item, exit 1) wired into the production deploy pipeline, plus a runtime fallback that **omits** an
  unresolved element rather than showing a flag. Mirrors the Eleventy `check-launch-gate` intent.

---

## 11. Accessibility

DS §12 plus: skip link (exists) styled with tokens; `lang="en-IN"`; landmarks header/nav/main/footer;
headings h1 → h2 (sections) → h3 (steps, groups, form title, footer headings); every section
`aria-labelledby`; decorative images `alt=""`/`aria-hidden`; minimum 44 × 44 targets (chips 44, round
buttons 44/48, summaries 48); visible focus on all controls including tabs, chips (`:has(:focus-visible)`),
summary elements; colour contrast checked for every pairing actually used — notably `ink-soft` on
`paper-deep`/`marigold-tint`, `flag` on `paper-raised`, leaf text on ink (footer tagline) and
`marigold-display` (large text only); axe clean at all test viewports; zoom 200 % without loss.

---

## 12. Motion

Exactly DS §10. All transitions disabled under `prefers-reduced-motion` (Phase 1A global rule stays).
No added scroll/entrance/parallax animation. Autoplay must pause on: user pause, reduced motion,
tab hidden. Pause control always visible.

---

## 13. Performance

- Server components by default; client JS limited to slideshow, mobile menu, enquiry form (and video
  enhancement if any). PROMPT's "≈ 6 KB total JS" is an Eleventy budget; re-baseline for Next.js:
  target ≤ 10 KB gzipped of **first-party** client JS beyond the framework runtime, measured in CI.
- Fonts: 2 preloaded variable files (~165 KB woff2 combined); Fredoka not preloaded. Consider subsetting
  Bricolage to Latin if the build tooling allows without altering glyphs.
- LCP element = first slide image (desktop) or H1 (mobile): eager + high priority, AVIF/WebP, correct `sizes`.
- CLS < 0.05: aspect-ratio boxes for all media, font fallback metrics, no late-inserted banners.
- Lighthouse mobile targets: a11y 100, performance ≥ 90.
- Homepage rendered with Cache Components; DB reads cached and revalidated on admin edits (`revalidateTag`).

---

## 14. Open decisions (must be resolved by the owner / designer / school)

1. **Copy source of truth.** V3 renders sentence-case and lightly edited copy versus `src/_data` and the
   Prisma seed (which a test pins to `programmes.json`). Differences: programme taglines (e.g. "Learning
   begins with wonder" vs "Learning Begins With Wonder"), Day Care quote casing, Safety heading casing,
   Partnership heading/closing casing, daySequence labels ("Activity, art & craft" vs "Activity / Art &
   Craft", "Snack and healthy tiffin" vs "Snack / Healthy Tiffin", …), activity names ("Guru Purnima" vs
   "Guru Purnima Celebration"), FAQ "by phone or WhatsApp" vs "by phone/WhatsApp", welcome-back alt quotes.
   Recommendation: V3 strings are the approved display copy; update seed + drift test to pin V3 copy.
2. **6–7 slides vs a 3-tab shelf.** Designer must specify the shelf for N > 3 (e.g. thumbnails only,
   scrolling shelf, or dots). Until then the slideshow supports N but the shelf design is blocked.
3. **Videos and parent reviews** have no V3 section, position or styling. Need designer placement
   (suggested candidates, not decisions: Videos after School Life; Reviews before Admissions).
4. **Programme age display format** now that ages are approved ("Ages 2–3", "2–3 years", …).
5. **Day timings layout** once times exist.
6. **Inner pages** (About, Programmes detail, Day Care, Contact, Privacy) are not designed; nav targets
   are homepage anchors. Confirm one-page site for launch.
7. **Form**: success/error/loading visuals; privacy-consent and WhatsApp opt-in controls; whether email,
   child's name or message fields are wanted (legacy form had them; V3 does not).
8. **`brush-marigold.png`** is supplied but unplaced — confirm it is unused.
9. **Tablet layouts** (768/1024) — accept the §2.1 guards or supply references.
10. **Removed legacy sections** (How Children Learn, Recognition, Gallery, separate Contact) are not in V3 —
    confirm they are intentionally dropped from the homepage.

---

## 15. Phase 1B — scope (visual system and shell only)

In scope:

1. Copy approved fonts (+ OFL texts) and brand marks into `web/`; `next/font/local` setup (§5).
2. `tokens.css` with all V3 tokens and type utilities (§2); update `globals.css` base (paper bg, ink text,
   Atkinson 18/1.55, focus ring, reduced motion).
3. UI primitives in `components/ui/` (§4) with a dev-only `/dev/primitives` preview route (excluded from
   production and robots) showing every state at 390 and 1280.
4. `SiteHeader`, `MobileMenu`, `SiteFooter` built to DS §8.0/8.1/8.14 with Content-required flags,
   replacing the Phase 1A unstyled shell; preview banner restyled with tokens.
5. `next.config.ts` image config (formats, qualities) — no media origin yet.
6. Tests: unit tests for token presence (no default palette), Playwright header/menu/footer screenshots at
   320/390/430/768/1024/1280/1440 compared to `d_*`/`m_nav` references, mobile-menu behaviour
   (open, Escape, focus return, scroll lock), axe on the shell.
7. Phase 1B report: deviations, open-decision status, screenshots.

Out of scope for 1B: homepage section content, slideshow, form, admin UI styling, DB schema changes,
R2, any production provider. The Eleventy implementation stays untouched.
