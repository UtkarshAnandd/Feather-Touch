# Feather Touch V3 — Design Source Record

Status: **ingested, not implemented.** Records only what the approved V3 handoff establishes.
Nothing here is invented. Where the handoff is silent, this document says so.

- Handoff archive: `web/docs/design/feather-touch-v3-design-handoff.zip` (62 entries, ~27 MB unpacked)
- Inspected copy (temporary, untracked): `web/docs/design/_v3-handoff-extract/design-handoff/`
- Ingested: 2026-10-07, against Phase 1A commit `6b1f0d02d4804749a46b6b297eadb2b378cef17b`

## Legend

| Tag     | Meaning                                                                                                  |
| ------- | -------------------------------------------------------------------------------------------------------- |
| **[E]** | Exact value, read verbatim from `reference/prototype.css`, `reference/homepage.html` or `PROMPT.md`.     |
| **[P]** | Stated in words in the approved PDF or `PROMPT.md`, without a numeric value.                             |
| **[O]** | Visual observation from the PDF pages or `reference/screens/*`; not a specified value. Verify, never trust as a token. |

---

## 1. Handoff contents

| Path (inside `design-handoff/`)                         | What it is                                                                                                           |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `Feather-Touch-Website-Design-V3-Visual-Direction.pdf`  | 20-page client deck ("Prepared for design review · September 2026"). Source of truth #1 per `PROMPT.md`.             |
| `reference/screens/` (31 JPGs)                          | 2× screenshots. `d_*` = 1280 px desktop (2560 px wide), `m_*` = 390 px mobile (780 px wide), `slide_0..2` = the three slideshow states. |
| `reference/prototype.css`                               | "Exact values reference. Not production CSS (uses sprites + container queries)."                                    |
| `reference/homepage.html`                               | Static prototype markup of the full homepage. Structural reference only.                                            |
| `reference/mobile-menu.html`                            | Static prototype of the open mobile menu.                                                                            |
| `reference/slideshow-behaviour.js`                      | Slideshow state logic (React-style class) to port.                                                                   |
| `reference/assets/sprite-*.{png,jpg}`                   | Prototype CSS sprites. **Do not ship** (`PROMPT.md`: "do not copy its CSS sprites").                                |
| `assets/` (10 files)                                    | Approved production images and marks (see §11).                                                                      |
| `fonts/` (4 woff2)                                      | Variable fonts: Bricolage Grotesque, Atkinson Hyperlegible Next (roman + italic), Fredoka.                           |
| `PROMPT.md`                                             | Implementation brief written **for the Eleventy codebase** (see §15 — conflicts).                                    |
| `../README.txt`                                         | "Copy the design-handoff folder into the root … then give Claude Code the prompt in PROMPT.md."                     |

Reference screens present: `d_hero, d_why, d_prog, d_dc, d_life, d_art, d_day, d_safe, d_part, d_adm, d_faq, d_ftr, d_full_top, d_full_lower` and `m_screen1, m_home_screen, m_nav, m_ss, m_prog, m_prog_screen, m_dc, m_dc_screen, m_life, m_life_screen, m_art, m_day, m_adm, m_full_top, m_full_lower`. There are **no tablet (768/1024) references**, and no mobile reference for Safety, Partnership, FAQ or Footer outside the `m_full_*` long captures.

**PDF approval page (p.19):** the checklist (overall direction, homepage layout, colour, typography, hero & photo treatment, slideshow concept, mobile direction, child-friendly visual language) is **blank in the file** — no ticks, reviewer or date. Approval is recorded here on the project owner's statement, not on the document.

---

## 2. Design principles [P] (PDF p.2)

Warm (cream paper, marigold and leaf from the logo) · Playful (paper, tape and brush strokes from classroom displays, "used lightly") · Premium (generous space, confident type, calm layout) · Child-friendly (real school moments and children's work) · Authentic ("Only real Feather Touch photographs and material. Nothing staged or invented.") · Trustworthy (clear information, easy on phone or computer).

---

## 3. Colour tokens [E]

From `prototype.css` (`.ft` custom properties). `PROMPT.md` gives the same hex values with semantic names; both names are listed.

| prototype var | PROMPT name       | Hex       | Role                                                                 |
| ------------- | ----------------- | --------- | -------------------------------------------------------------------- |
| `--paper`     | paper             | `#FFF6E6` | Page background                                                      |
| `--paper-2`   | paper-raised      | `#FFFBF3` | Header bar, shelves, form card, Why/Partnership bands, tape          |
| `--paper-3`   | paper-deep        | `#F6E7CA` | Slideshow frame bg, active tab bg, Menu button, `+` icon circles    |
| `--kraft`     | kraft             | `#F1DDB8` | Children's Work band                                                 |
| `--line`      | line              | `#E2CFA8` | Hairlines, borders                                                   |
| `--ink`       | ink               | `#1E3A2B` | All text; footer band; counter chip                                  |
| `--ink-2`     | ink-soft          | `#4A5A4E` | Lead/secondary text                                                  |
| `--mari`      | marigold          | `#E88640` | Primary button fill, number circles, mounts, progress fill          |
| `--mari-hi`   | marigold-hover    | `#F1964F` | Primary button hover                                                 |
| `--ledge`     | marigold-ledge    | `#B5601F` | Primary button / number-circle bottom ledge                          |
| `--mtext`     | marigold-display  | `#C1570F` | Display text ≥ 40 px only (hero clause, `+`/`=` operators)          |
| `--mtint`     | marigold-tint     | `#FFE5C2` | Day Care band                                                        |
| `--msoft`     | marigold-soft     | `#FFD29B` | Mount (slide 3), tape variant, need-panel title on navy             |
| `--leaf`      | leaf              | `#A9CF48` | Mount (slide 1), step 4 block, link underline, footer tagline text  |
| `--leaf-2`    | leaf-2            | `#C8E283` | Step 3 block                                                         |
| `--leaf-3`    | leaf-3            | `#DDEDB0` | Step 2 block, leaf tape variant                                      |
| `--leaf-tint` | leaf-tint         | `#EEF6D6` | Step 1 block, Admissions band                                        |
| `--ldeep`     | leaf-deep         | `#3E6A12` | Radio `accent-color`                                                 |
| `--navy`      | navy              | `#22305A` | Safety band only                                                     |
| `--flag`      | flag              | `#6B551F` | Content-required flag text                                           |
| `--flag-line` | flag-line         | `#B9A06A` | Dashed flag/need borders                                             |

Additional literal values used in the prototype [E]:

| Value                                   | Where                                         |
| --------------------------------------- | --------------------------------------------- |
| `#C9B58C`                               | Input and chip borders (1.5 px)               |
| `#FFFFFF`                               | Input and chip background                     |
| `#6E7A70`                               | Input placeholder                             |
| `rgba(30,58,43,.05)`                    | Header bar shadow `0 2px 0`                   |
| `rgba(30,58,43,.07)` / `.13`            | Secondary button hover / active background    |
| `rgba(30,58,43,.2)` / `.24`             | Round button border / ledge shadow            |
| `rgba(30,58,43,.13)`                    | Progress-bar track                            |
| `rgba(30,58,43,.16)` / `.18`            | Day Care rules / quote rules                  |
| `rgba(30,58,43,.34)`                    | Staircase ruler ticks                         |
| `rgba(30,58,43,.4)`                     | Day sequence dashed line                      |
| `rgba(30,58,43,.55)`                    | Poster shadow `0 12px 24px -16px`             |
| `rgba(255,246,230,.88)` / `.22` / `.5`  | Text / rules / need border on navy            |
| `rgba(255,246,230,.2)` / `.45` / `.8` / `.92` | Footer base rule / flag border / base text / flag text |
| `rgba(255,251,243,.7)` / `.55` / `.92` / `.94` | Flag bg / need bg / tape-strip / swipe-hint bg |
| `rgba(255,255,255,.05)`                 | Need panel bg on navy                         |

### Colour rules [P] (`PROMPT.md`, PDF p.13)

- Marigold and leaf are **fills only, never text**. (Exception observed [E]: footer tagline uses `color: var(--leaf)` on the ink band.)
- `marigold-display #C1570F` for display text **40 px and larger only**.
- **Navy only in Safety.**
- Primary button = marigold fill + ink text + 4 px marigold-ledge bottom edge.
- No gradients, blobs, glassmorphism, emoji or additional colours. (The staircase ruler is a `repeating-linear-gradient` used as a tick pattern, not a colour gradient.)

---

## 4. Typography

### Families and files [E]

| Family                     | File                                              | Axes declared in prototype                      | Role [P]                                                                                   |
| -------------------------- | ------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Bricolage Grotesque        | `fonts/BricolageGrotesque-Variable.woff2` (131 KB)| weight 200–800, stretch 75–100 %                | Headings, display                                                                          |
| Atkinson Hyperlegible Next | `fonts/AtkinsonHyperlegibleNext-Variable.woff2` (34 KB) + `-Italic` (38 KB) | weight 200–800, normal + italic | Everything parents read; interface                                                        |
| Fredoka                    | `fonts/Fredoka-Variable.woff2` (68 KB)            | weight 300–700                                  | Accent only: tape captions, slide tabs, "Step n", one-line notes. Never headings/paragraphs |

Prototype uses `font-display:block`; **`PROMPT.md` overrides: `font-display: swap`, preload Bricolage and Atkinson.** Fallback stack in prototype: `system-ui, sans-serif`. Licence files for these variable fonts are **not included** in the handoff.

### Type styles [E]

| Style                    | Family     | Weight | Stretch | Size desktop / mobile | Line-height desktop / mobile | Tracking  |
| ------------------------ | ---------- | ------ | ------- | --------------------- | ---------------------------- | --------- |
| Body                     | Atkinson   | 400    | —       | 18 / 18               | 1.55                         | —         |
| `.disp` (display)        | Bricolage  | 760    | 88 %    | per use               | 0.98                         | −0.024em  |
| Hero H1 `.hero-h`        | disp       | 760    | 88 %    | 68 / 46               | 0.98 / 1                     | −0.024em  |
| Day Care H2 `.dc-h`      | disp       | 760    | 88 %    | 80 / 46               | 0.98                         | −0.024em  |
| Partnership `.part-eq`   | disp       | 760    | 88 %    | 66 / 42               | 1.02                         | −0.024em  |
| Why statement `.why-s`   | disp       | 720    | 92 %    | 54 / 28               | 1.07 / 1.14                  | −0.02em   |
| `.h2`                    | Bricolage  | 740    | 90 %    | 52 / 34               | 1.03 / 1.06                  | −0.02em   |
| `.h3`                    | Bricolage  | 700    | 94 %    | 28 / 24               | 1.1                          | −0.012em  |
| Step name                | Bricolage  | 760    | 88 %    | 38 / 30               | 1                            | −0.02em   |
| Day Care quote           | Bricolage  | 650    | 92 %    | 32 / 22               | 1.18                         | −0.01em   |
| Life group `.grp-h`      | Bricolage  | 720    | 92 %    | 22                    | 1.2                          | —         |
| FAQ summary              | Bricolage  | 680    | 94 %    | 22 / 19               | 1.25                         | —         |
| Mobile menu items        | Bricolage  | 720    | 90 %    | 28                    | —                            | —         |
| Footer heading           | Bricolage  | 700    | —       | 18                    | —                            | —         |
| Day number `.dn`         | Bricolage  | 760    | —       | 22                    | —                            | —         |
| `.h4`                    | Atkinson   | 800    | —       | 17                    | 1.3                          | —         |
| `.lead`                  | Atkinson   | 400    | —       | 20 / 17               | 1.55, max-width 34em, ink-2  | —         |
| Hero paragraph           | Atkinson   | 400    | —       | 20 / 17               | 1.55, max-width 29em         | —         |
| Why foot paragraph       | Atkinson   | 400    | —       | 19 / 17               | max-width 40em               | —         |
| Button                   | Atkinson   | 700    | —       | 17 (sm: 16)           | 1                            | —         |
| Nav link                 | Atkinson   | 700    | —       | 16                    | —                            | —         |
| Header sub-brand         | Atkinson   | 700    | —       | 13 / 12               | 1.22, width 122 / 118 px     | —         |
| Step tagline             | Atkinson   | 700    | —       | 17 / 16               | 1.3, max-width 14em          | —         |
| Step label / ruled list  | Atkinson   | 800 / 400 | —    | 14 / 16               | 1.35                         | —         |
| Form label / legend      | Atkinson   | 700    | —       | 16                    | 1.3                          | —         |
| Input                    | Atkinson   | 400    | —       | 17                    | —                            | —         |
| Chip                     | Atkinson   | 700    | —       | 15                    | —                            | —         |
| Flag `.cr` / `.cr b`     | Atkinson   | 700 / 800 | —    | 14 / 11 uppercase     | 1.3                          | .07em (b) |
| Need title `.need-t`     | Atkinson   | 800    | —       | 12 uppercase          | —                            | .08em     |
| Tape `.tape`             | Fredoka    | 500    | —       | 15 (slide cap mobile 13) | 1.25                      | —         |
| Tab word `.tw`           | Fredoka    | 600    | —       | 14 / 12               | 1                            | .05em     |
| Counter chip             | Fredoka    | 600    | —       | 14 / 13               | 1.2                          | —         |
| "Step n"                 | Fredoka    | 500    | —       | 15                    | 1                            | —         |
| Pin figcaption           | Fredoka    | 500    | —       | 16                    | 1.3                          | —         |
| Hero note                | Fredoka    | 500    | —       | 18 / 16               | 1.2                          | —         |
| Partnership closing      | Fredoka    | 500    | —       | 20                    | —                            | —         |
| Footer tagline           | Fredoka    | 500    | —       | 16, colour leaf       | —                            | —         |
| Swipe hint               | Fredoka    | 600    | —       | 15                    | —                            | —         |

`PROMPT.md` summarises: "display weight 760, font-stretch 88 %", "body 18/1.55, lead 20, interface 16–17 bold".

---

## 5. Layout, spacing and breakpoints [E]

- Container `.wrap`: `max-width:1280px; margin:0 auto; padding:0 40px` → mobile `padding:0 16px`.
- Section head `.sec-head`: grid `7fr / 5fr`, column-gap 56, `align-items:end`, margin-bottom 56 → mobile single column, row-gap 14, mb 32.
- **Prototype compositions are two only:** desktop (default) and ≤ 600 px container width (`@container ft (max-width:600px)`). The prototype has no intermediate breakpoint.
- `PROMPT.md` adds: full navigation at **≥ 1200 px**, "Menu" button below; verify at **320, 390, 430, 768, 1024, 1280, 1440+**; mobile-first media queries; no container-query scaffolding.

Section vertical padding (desktop → mobile) [E]:

| Section       | Desktop          | Mobile        | Band colour                          |
| ------------- | ---------------- | ------------- | ------------------------------------ |
| Header        | 16 40 0 (outer)  | 10 12 0       | paper                                |
| Hero          | 40 / 104         | 28 / 64       | paper                                |
| Why           | 120 / 112        | 72 / 64       | paper-2, 1.5 px line top+bottom      |
| Programmes    | 120 / 112        | 72            | paper                                |
| Day Care      | 104              | 72            | marigold-tint                        |
| School Life   | 120 / 112        | 72            | paper                                |
| Children's Work | 112            | 72            | kraft                                |
| A Day         | 112              | 72            | paper                                |
| Safety        | 112              | 72            | navy, paper text                     |
| Partnership   | 104              | 72            | paper-2, 1.5 px line top             |
| Admissions    | 112              | 72            | leaf-tint                            |
| FAQ           | 112              | 72            | paper                                |
| Footer        | 72 / 44          | 56 / 32       | ink, paper text                      |

---

## 6. Radii, borders, shadows [E]

| Token use                         | Value                                         |
| --------------------------------- | --------------------------------------------- |
| Paper mounts, posters (`.mount`)  | 5 px (poster mat 3 px)                        |
| Buttons, Menu button, need panels | 14 px                                         |
| Shelves, Day Care details, mobile menu bar | 18 px (form on mobile 18 px)         |
| Photos (slide frame), header bar, form card, Day Care asset slot | 22 px          |
| Slide tab / input / chip / step block | 12 / 12 / 12 / `14 14 3 3` px            |
| Thumbnail / flag / counter chip   | 8 / 8 / 10 px                                 |
| Round buttons, number circles     | 50 %                                          |
| Hairline                          | 1.5 px `--line`                               |
| Dashed (flags)                    | 1.5 px dashed `--flag-line`; need panels 2 px |
| Primary ledge                     | `0 4px 0 #B5601F` → hover `0 5px 0`, active `0 1px 0` + translateY(3px) |
| Round-button ledge                | `0 3px 0 rgba(30,58,43,.24)` → hover 4 px, active 1 px |

`PROMPT.md` summary: 5 px paper/posters, 14 px buttons/controls, 18 px shelves/forms, 22 px photos.

---

## 7. Components [E]

**Buttons** — `.btn` height 56, padding 0 24, gap 10, radius 14, 700/17, icon 20 px, transitions `transform .12s, box-shadow .12s, background-color .15s`.
- Primary: marigold bg, ink text, ledge; hover `#F1964F` + translateY(−1px); active translateY(3px).
- Secondary: transparent, ink text, `inset 0 0 0 2px ink`; hover/active ink 7 %/13 % tint, active translateY(1px).
- Disabled: opacity .45, no shadow/transform. Small (`btn-sm`): 48 high, padding 0 18, 16 px. Block: full width, centred.
- Round (`.rb`): 48×48 (mobile 44×44), paper-2 bg, 1.5 px ink-20 % border, ledge shadow.
- Text link (`.lnk`): 700, 2.5 px leaf bottom border, padding-bottom 3, gap 8, 18 px arrow; hover border marigold.

**Icons** — inline SVG 24 viewBox, 22 px default, stroke 2.4, round caps/joins (arrow, chevrons, menu, close, plus, pause, play). Hand-drawn arrows (`.hand`) stroke 2.6.

**Paper tape** — Fredoka 500/15, padding 7 15 8, paper-2 bg (variants leaf-3, marigold-soft), `rotate(-2deg)`, ragged `clip-path` polygon (12 points; exact polygon in `prototype.css` line 56).

**Tape strip on posters** — 104×30, `rgba(255,251,243,.92)`, `rotate(-4deg)`, top −26 px, own clip-path (line 199).

**Content-required flag `.cr`** — inline, 1.5 px dashed flag-line, radius 8, 14 px/700 flag colour, label + uppercase `<b>` 11 px/800 "CONTENT REQUIRED". Variants observed: "INTEGRATION REQUIRED" (form delivery), "APPROVAL REQUIRED" (privacy policy).

**Need panel `.need`** — 2 px dashed flag-line, radius 14, padding 18 20, title 12 px uppercase "ASSET REQUIRED" / "CONTENT REQUIRED FROM FEATHER TOUCH", body 15 px ink-2. Inverse variant on navy.

**Ruled list** — items padding 8 0, 1.5 px line top (last item also bottom), 16 px / 1.35; two-column variant `.cols2` gap 28.

**Paper mount** — coloured sheet behind photo/poster, rotated (−2.6 / 1.8 / −1.4 deg on slides; 1.8 deg Day Care; −1.5 deg artwork), inset −12 −15 −15 −12 desktop, −8 −9 −9 −8 mobile.

**Focus ring** — `outline:3px solid ink; outline-offset:3px`; paper-coloured on Safety and Footer.

---

## 8. Sections, in approved order

PDF p.3 order [P]: 1 Welcome and slideshow · 2 Our belief · 3 Programmes · 4 Day Care · 5 School life · 6 Children's work · 7 A day at Feather Touch · 8 Safety and wellbeing · 9 Parents and teachers · 10 Book a school visit · 11 Questions parents ask · 12 Footer. Header precedes all.

Prototype anchors [E]: `#top`, `#why`, `#programmes`, `#day-care`, `#school-life`, `#visit`, `#contact` (on the Admissions copy column). Children's Work, Day, Safety, Partnership and FAQ have **no id** in the prototype.

### 8.0 Header [E]
- Outer padding 16 40 0; bar height 80, padding 0 14 0 20, paper-2, 1.5 px line, radius 22, gap 24, shadow `0 2px 0 rgba(30,58,43,.05)`.
- Logo 108 × 55.3 + sub-brand "Foundation School<br> & Day Care Centre" (aria-hidden; link label "Feather Touch Foundation School and Day Care Centre, home").
- Nav (gap 20, links 16/700, padding 10 2): **Home, About, Programmes, Day Care, School Life, Admissions, Contact**. Current item gets lime brush underlay (`::after` left −6 right −8 bottom 5 height 11).
- CTA: `btn-primary btn-sm` "Book a school visit →".
- Mobile: bar 64 high, radius 18, padding 0 8 0 12, logo 84 × 43, sub 12 px; nav and CTA hidden; "Menu" button (48 high, padding 0 14, radius 14, paper-3, 700/15, hamburger icon).

### 8.1 Mobile menu (m_nav, PDF p.17) [E]
Full-screen paper panel, padding 10 12 24. Top bar copies header (64 high, radius 18) with "× Close". List: 7 items, Bricolage 720/28, min-height 60, 1.5 px line separators, chevron right; current item has brush underlay. Bottom (pushed with `margin-top:auto`): "Book a school visit →" primary block + "Enquire now" secondary block, gap 14; then flag "Call and WhatsApp — CONTENT REQUIRED".
Behaviour [P]: real `<button>`, `aria-expanded`, `aria-controls`, focus into panel, Escape/Close return focus, scroll lock.

### 8.2 Hero [E]
- Grid `1fr 472px`, gap 72, `align-items:center`.
- H1 (verbatim): "We believe children learn best **when they are happy.**" — clause "when they are happy." in `#C1570F`; lime brush under "happy." (`::after` left −4 % right −6 % bottom −0.03em height 0.22em). Desktop line breaks: "We believe children / learn best / when they are happy." Mobile: "We believe / children learn / best when / they are happy." (`<br class="bd|bm">`).
- Paragraph (verbatim): "Feather Touch is a nurturing early childhood education centre for Play Group, Nursery, KG 1 and KG 2, with Day Care for families who need extended care." (non-breaking spaces in programme names).
- CTAs: primary "Book a school visit →" (`#visit`), secondary "Explore programmes" (`#programmes`); gap 14, mt 36. Mobile: stacked, full width.
- Mobile only: "Swipe to look around" (Fredoka) with a hand-drawn down arrow, mt 30, between CTAs and slideshow.

### 8.3 Slideshow [E] (+ `slideshow-behaviour.js`)
- Stage 4:5 (472 wide desktop). Mount rotates/recolours per slide: slide 1 leaf −2.6°, slide 2 marigold 1.8°, slide 3 marigold-soft −1.4°, transition 0.7 s.
- Frame radius 22, paper-3 bg, `touch-action: pan-y`.
- Crossfade opacity 0.8 s; Ken-Burns scale 1.025 → 1 over 6.5 s ease-out on the active slide.
- Counter chip "1 / 3" bottom-left (14,18; mobile 10,14), ink bg, paper text, aria-hidden.
- Tape caption beside counter (left 68 / mobile 58, bottom 16 / 12).
- Prev/next round buttons bottom-right (14,14 / 10,10), gap 10/8, labels "Previous photo" / "Next photo".
- Shelf below (mt 28 / 24): paper-2, 1.5 px line, radius 18, padding 8 / 6. Three tabs (thumb 40×50 radius 8, word, 5 px progress bar) + pause/play round button. Tab words: **WELCOME / PLAY / CREATE**. Active tab: paper-3 bg, thumb opacity 1 + 2.5 px ink ring; inactive thumb opacity .62 (hover .9). Mobile tab stacks thumb/word/bar vertically, centred.
- Progress bar: marigold fill animates 0 → 100 % over 6 s linear; paused freezes; two keyframe names alternate (`cy-a/cy-b`) to restart.
- Logic: index `i`, `paused`, interval **6000 ms**; `go(n)` wraps modulo 3 and **re-arms the timer**; toggle re-arms; pointerdown/up swipe with **40 px** threshold (left → next, right → prev).
- Reduced motion: start paused; no transitions; Ken-Burns off; progress bar static full.
- ARIA: region `aria-roledescription="carousel"` `aria-label="Photos from Feather Touch"`; slides `<figure aria-roledescription="slide" aria-label="n of 3">`, inactive `aria-hidden="true"`; tabs `aria-current="true|false"`, label "Show photo n of 3: {caption}"; pause label "Pause slideshow"/"Play slideshow"; `.sr` live region "Photo n of 3" with `aria-live` **polite only while paused**, else off.
- Slides (verbatim, from `images.json` + prototype):

| # | Asset              | Caption                                   | Alt                                                                                                      |
| - | ------------------ | ----------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 1 | `hero-welcome.jpg` | Welcome back to school.                   | A child stands between large paper flowers under a handmade Welcome Back to School sign at the school entrance. |
| 2 | `hero-puzzle.jpg`  | Solving a puzzle together in class.       | Two children in Feather Touch uniforms fit pieces into a foam puzzle together at a classroom table.      |
| 3 | `hero-colouring.jpg` | Colouring during an activity session.   | A child concentrates on colouring a sun in an activity book at a classroom table.                        |

PDF p.11 [P]: "The photos change gently every few seconds … pause, go back and forward, or swipe on a phone. **The final photos will be chosen from your original files, with parents' permission.**"

### 8.4 Why / Our belief [E]
- Visually hidden H2 "Why Feather Touch".
- Statement (disp 720/54): "Education at this stage should not be about ~~pressure or rote learning~~. It should be about curiosity, discovery, confidence and joy." — struck phrase in ink-2, `nowrap`, two hand-drawn marigold SVG strokes (stroke-width 5, non-scaling).
- Foot grid `1fr auto`, gap 48, mt 48: paragraph (verbatim `about.lead`) + link "About Feather Touch →".

### 8.5 Programmes [E]
- H2 "Nurturing little minds, building strong foundations." / lead "Four stages from Play Group to KG 2, and Day Care for families who need extended care."
- Desktop staircase `<ol>`: 4 columns, gap 20; ink baseline 2.5 px at top 278 px (extends 10 px each side). Blocks: margin-top 108/72/36/0, heights **170/206/242/278**, colours leaf-tint / leaf-3 / leaf-2 / leaf, radius `14 14 3 3`, padding 18 20 18 36, ruler ticks at left 13 px.
- Block: "Step n" (Fredoka), name (H3), tagline. Below (padding 28 2 0): "Focus areas" label, ruled list (full), flags "Age group — CONTENT REQUIRED", "Timings — CONTENT REQUIRED", link "More about {name} →".
- Taglines as rendered (sentence case): "Learning begins with wonder", "Explore. Discover. Learn.", "Growing confidence, growing knowledge", "Preparing children for the next big step".
- Mobile: single column, row-gap 22; block widths **74/82/91/100 %**, auto height, padding 16 16 16 32; native `<details>` (closed) with 48 px summary "{n} focus areas, age and timings" + `+` icon (rotates 45° open); inside: "**Focus areas:** a, b, c…" inline, flags in a row, link.
- PDF p.14 says "with Day Care alongside" — **no Day Care step is drawn** in the staircase; Day Care appears only as its own section.

### 8.6 Day Care [E]
- Tape eyebrow (marigold-soft) "Day Care Centre"; H2 disp 80/46 "Caring beyond the classroom" (max-width 10em).
- Grid `1fr 400px`, gap 96, mt 52 → mobile single column, row-gap 44.
- Left: lead (dayCare.lead); blockquote with leaf-in-hand mark (92 × 47.5 / 64 × 33) "“Because your child deserves care that feels like home.”" (Bricolage 650/32), 2 px ink-18 % rules; H3 (h4 style) "What Day Care includes"; 2-column ruled list (8 items, verbatim); secondary button "Ask about Day Care →" (`#visit`).
- Right: 4:5 stage (mobile **3:2**), marigold mount 1.8°, paper-2 slot with "ASSET REQUIRED — A real Day Care moment at Feather Touch: a camera-original photograph, with consent confirmed." Below: details shelf `<dl>` (Hours / Age range / Meals / Pickup, each CONTENT REQUIRED), visually hidden H3 "Practical details".

### 8.7 School Life [E]
- Grid `5fr 7fr`, gap 72; right column poster wall min-height 650.
- H2 "Festivals, crafts, stories and sports"; lead "Children take part in age-appropriate creative, cultural, physical and educational activities throughout the academic year."
- Groups (dashed 2 px line separators, H3 Bricolage 720/22, body 17):
  - **Celebrations** — Guru Purnima, Janmashtami, Ganesh Chaturthi, Gandhi Jayanti, Diwali, Children's Day, Christmas and Republic Day
  - **Nature and healthy habits** — Green Day, Plantation Activities and Healthy Tiffin Day
  - **Making and performing** — Colouring Competition, Fancy Dress Competition, Rakhi Making, Poem Recitation and Storytelling
  - **Learning by doing** — Parent-Child Fireless Cooking, Community Helpers Role Play and Sports Activities
- Wall: Janmashtami poster 368×368 on marigold mount, −2°, at (16, 36), caption "Our Janmashtami poster"; World Environment Day poster 196×392 on leaf mount, 2.4°, right 24 top 8, caption "World Environment Day"; tape strips on both; need panel bottom (height 128) "Camera-original photos from Annual Day, Diwali or Sports Activities, with consent confirmed."
- Mobile: posters become a horizontal **scroll-snap** strip (gap 34, bleed −16 px, padding 34 30 22; Jan 250×250, WED 136×272, need 220×250). Order: heading, lead, strip, groups. `PROMPT.md`: "the only intended horizontal scroll."
- Alt text [E]: Janmashtami "Feather Touch Janmashtami greeting poster showing children dressed as Krishna and Radha in a decorated classroom." · WED "Feather Touch World Environment Day poster: a teacher and a child hold a potted plant."

### 8.8 Children's Work [E]
- Kraft band; grid 6fr/6fr, gap 64.
- Left: artwork (`art-colouring-detail.jpg`, 4:3) on marigold mount (inset −16), −1.5°, tape caption "Colouring during an activity session." at bottom-left. Alt: "A child's hands on an activity book, colouring a smiling sun."
- Right: H2 "Made by little hands"; lead "Creative activities help children express ideas and emotions."; 2×2 ASSET REQUIRED panels (16:11): Leaf-art Ganesha (photo of the artwork from the original file) · Rakhi Making (finished rakhis photographed flat) · Colouring Competition (scanned drawings with names removed) · Any classroom paper craft, photographed without faces.

### 8.9 A day at Feather Touch [E]
- Centred head (max 760): H2 "A day at Feather Touch", lead "The shape of a typical school day, from arrival to goodbye.", flag "Timings — CONTENT REQUIRED".
- Desktop: 9-column `<ol>`, dashed 2.5 px line through circle centres; 48 px marigold circles with ledge, number Bricolage 760/22; label 16/700 below.
- Mobile: left-aligned head; vertical list, dashed line on the left, circle + label rows.
- Labels as rendered: Welcome & settling in · Circle time · Concept-based learning · Rhymes & music · Activity, art & craft · Snack and healthy tiffin · Outdoor and physical activity · Storytelling & creative learning · Recap & goodbye.

### 8.10 Safety [E]
- Navy band; grid 5fr/6fr, gap 80.
- H2 "A safe childhood is the first step towards a strong future"; lead; italic note "We also believe that child protection is a shared responsibility between school, parents and the community."
- Right: h4 "What children learn about staying safe"; 2-col ruled list (8 topics verbatim from `about.safety.topics`); inverse need panel "CONTENT REQUIRED FROM FEATHER TOUCH — How the school keeps children safe day to day, for example arrival and pickup, supervision and visitors."

### 8.11 Parent Partnership [E]
- Grid 6fr/5fr. H2 (disp 66/42): "Parents **+** Teachers / **=** Stronger foundations" (operators `#C1570F`).
- Lead "A child's development becomes stronger when parents and teachers work together."; 2-col ruled list (6 items); closing (Fredoka 20) "Together, we help children grow."

### 8.12 Admissions / Book a school visit [E]
- Leaf-tint band; grid 5fr/6fr.
- Left (`id="contact"`): leaf tape "Admissions" + flag "Session — CONTENT REQUIRED"; H2 "Book a school visit"; lead "Parents are welcome to schedule a school visit and understand our programmes."; `<dl>` Call / WhatsApp / Email / Address (each CONTENT REQUIRED); footprints SVG (140×110 / 100×80, marigold).
- Right: form card (paper-2, line, radius 22, padding 36 / 22): H3 "Request a visit"; fields **Parent's name** (text), **Phone number** (tel), **Programme you are interested in** (radio chips: Play Group, Nursery, KG 1, KG 2, Day Care), **Preferred day or time** (placeholder "For example, a weekday morning"); primary block button "Request a visit →"; flag "Form delivery — INTEGRATION REQUIRED".
- Input 52 high, radius 12, 1.5 px `#C9B58C`, white; chip min-height 44, radius 12, radio 18 px `accent-color #3E6A12`.
- [O] In `d_adm.jpg` the submit button text renders lighter/larger than other buttons. Cause: prototype rule `.ft button{font:inherit}` out-specifies `.btn`. Treat as a prototype artefact; the button spec (700/17) applies.

### 8.13 FAQ [E]
- Grid 4fr/7fr. H2 "Questions parents ask". Native `<details>`, **first open**; summary Bricolage 680/22 (mobile 19), padding 22 0, `+` in 36 px paper-3 circle rotating 45°; answer ink-2, max 38em.
- Six Q&As (verbatim from prototype; differ slightly from `faq.json`, see §15): classes · Day Care · methodology · extracurricular · enquire ("…by phone or WhatsApp…") · visit.

### 8.14 Footer [E]
- Ink band; grid `4fr 2.4fr 2.4fr 2.4fr`, gap 48 → single column mobile.
- Col 1: logo 150 × 76.8 (interim PNG on ink), name "Feather Touch Foundation School and Day Care Centre" (700/16), tagline "Nurturing little minds, building strong foundations." (Fredoka, leaf).
- Visit: flags Address, Visiting hours. Contact: flags Phone, WhatsApp, Email. Explore (`<nav aria-label="Footer">`): About, Programmes, Day Care, School Life, Admissions.
- Base row (rule 1 px paper-20 %, 14 px, paper-80 %): "© 2026 Feather Touch Foundation School and Day Care Centre" · flag "Privacy policy — APPROVAL REQUIRED".

---

## 9. Decorative language [P] (`PROMPT.md` "only where specified", PDF p.18)

| Element                        | Asset / technique                       | Allowed placement                                  |
| ------------------------------ | --------------------------------------- | -------------------------------------------------- |
| Paper mount                    | coloured div, rotated 1.5–3°            | Behind photos and posters                          |
| Paper-tape caption             | Fredoka, ragged clip-path, −2°          | Slide captions, artwork caption, eyebrows          |
| Brush stroke                   | `assets/brush-lime.png`                 | Under "happy." and under current nav item **only** |
| Marker strike                  | inline SVG, marigold                    | Why statement only                                 |
| Leaf-in-hand mark              | `assets/mark-leaf-in-hand.png`          | Day Care only                                      |
| Footprints                     | inline SVG, marigold                    | Admissions only                                    |
| Hand-drawn arrows              | inline SVG                              | Hero "Swipe to look around" (mobile)               |

"Nothing else decorative." PDF: leaf-in-hand and brush come from the logo; footprints from painted footprints at the school entrance. PDF p.12 shows a "✦" glyph in the Fredoka specimen only; it is not used on the page.

---

## 10. Motion [E]

| Element                    | Motion                                                        | Reduced motion          |
| -------------------------- | ------------------------------------------------------------- | ----------------------- |
| Slide crossfade            | opacity .8 s ease                                             | none                    |
| Slide zoom                 | scale 1.025 → 1, 6.5 s ease-out                               | none (scale 1)          |
| Mount                      | background-color + rotate .7 s ease                           | none                    |
| Progress bar               | width 0 → 100 %, 6 s linear; paused = `animation-play-state` | static 100 %            |
| Autoplay                   | 6000 ms interval                                              | starts paused           |
| Buttons                    | transform/box-shadow .12 s, bg .15 s                          | none                    |
| Disclosure `+` icons       | rotate 45°, .2 s                                              | (not specified)         |
| Thumbnail opacity/ring     | .2 s                                                          | (not specified)         |

No scroll-triggered, parallax or entrance animations exist in the handoff.

---

## 11. Approved assets [E]

| File                                 | Pixels      | Use                                              |
| ------------------------------------ | ----------- | ------------------------------------------------ |
| `hero-welcome.jpg`                   | 880 × 1100  | Slide 1                                          |
| `hero-puzzle.jpg`                    | 880 × 1100  | Slide 2                                          |
| `hero-colouring.jpg`                 | 880 × 1100  | Slide 3                                          |
| `art-colouring-detail.jpg`           | 560 × 420   | Children's Work                                  |
| `poster-janmashtami.jpg`             | 1092 × 1092 | School Life                                      |
| `poster-world-environment-day.jpg`   | 588 × 1176  | School Life                                      |
| `logo-feather-touch-INTERIM.png`     | 1532 × 784  | Header, menu, footer (interim until vector)      |
| `mark-leaf-in-hand.png`              | 300 × 155   | Day Care quote                                   |
| `brush-lime.png`                     | 554 × 99    | Hero "happy.", current nav item                  |
| `brush-marigold.png`                 | 554 × 99    | **No placement specified** in any handoff file   |

`PROMPT.md`: "Use only the images in design-handoff/assets/. Never use stock, AI-generated, background-removed or edited photographs." Hero slide images max out at 880 px wide (2× of ~440 CSS px; the frame is 472 CSS px — slightly under 2× density at desktop).

---

## 12. Accessibility requirements [P]/[E]

One `h1`, logical heading order; sections `aria-labelledby`; focus ring 3 px ink, 3 px offset (paper on dark bands); touch targets ≥ 44 px; WCAG 2.2 AA contrast; meaningful alt from `images.json`; mobile menu focus management + Escape + scroll lock; slideshow carousel semantics (§8.3), pause always available; `<details>` for disclosure; visually hidden headings where the design has none (Why, Day Care details); decorative SVG/marks `aria-hidden`.

---

## 13. Performance requirements [P] (`PROMPT.md`)

`<img>` with explicit width/height, `srcset`/`sizes`, AVIF/WebP; first hero image `eager` + `fetchpriority="high"`, all others lazy; JS ≈ 6 KB, no dependencies; no layout shift; Lighthouse mobile a11y 100, perf ≥ 90, CLS < 0.05.

---

## 14. Outstanding items named by the handoff [P]

- Content: admissions session; programme ages and timings; Day Care hours, ages, meals, pickup; daily timings; school safety practices; phone, WhatsApp, email, address, visiting hours; privacy policy; form delivery.
- Assets: vector logo; parental consent for every child photograph; poster usage rights; a Day Care photograph; additional artwork; Annual Day/Diwali/Sports photographs.

---

## 15. Items the handoff does **not** establish

- Tablet layouts (768/1024): no references; prototype has only ≤ 600 / > 600 compositions; nav switch at 1200 px is the only stated intermediate breakpoint.
- Hover/focus visuals for nav links, footer links beyond underline, tabs (beyond thumb opacity), chips (checked state), inputs (focus), FAQ summary.
- Form validation, error, success, loading states; required-field marking.
- Videos, parent reviews/testimonials, gallery, contact section separate from Admissions: **not present in V3**.
- Behaviour for more than three slides (tab-shelf layout, tab words, mount colour cycle).
- Inner pages (About, Programmes detail, etc.). Nav items point to homepage anchors in the prototype.
- Favicon, OG image, 404 styling, admin UI styling.
- Font licence files for the variable fonts.
