/**
 * V3 site shell content: navigation and fixed header/footer copy
 * (docs/design/V3-DESIGN-SOURCE.md §8.0, §8.1, §8.14).
 * Labels and order are verbatim from the approved prototype. Targets are the
 * V3 homepage anchors; those sections are built in Phase 2 (legacy anchors
 * stay as aliases — see V3-IMPLEMENTATION-SPEC §6).
 */
export type NavItem = { label: string; href: string };

export const PRIMARY_NAV: readonly NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#why" },
  { label: "Programmes", href: "/#programmes" },
  { label: "Day Care", href: "/#day-care" },
  { label: "School Life", href: "/#school-life" },
  { label: "Admissions", href: "/#visit" },
  { label: "Contact", href: "/#contact" },
];

export const FOOTER_NAV: readonly NavItem[] = [
  { label: "About", href: "/#why" },
  { label: "Programmes", href: "/#programmes" },
  { label: "Day Care", href: "/#day-care" },
  { label: "School Life", href: "/#school-life" },
  { label: "Admissions", href: "/#visit" },
];

export const VISIT_CTA: NavItem = { label: "Book a school visit", href: "/#visit" };
export const ENQUIRE_CTA: NavItem = { label: "Enquire now", href: "/#visit" };

/** Accessible name of the logo link (the visible sub-brand text is aria-hidden). */
export const HOME_LINK_LABEL = "Feather Touch Foundation School and Day Care Centre, home";

/** Shell copy, verbatim from the approved prototype (homepage.html header/footer). */
export const SHELL_COPY = {
  subBrand: ["Foundation School", "& Day Care Centre"],
  footerName: "Feather Touch Foundation School and Day Care Centre",
  // V3 renders the tagline in sentence case (src/_data/site.json has Title Case).
  footerTagline: "Nurturing little minds, building strong foundations.",
  copyrightHolder: "Feather Touch Foundation School and Day Care Centre",
} as const;
