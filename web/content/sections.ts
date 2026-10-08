/**
 * Homepage section registry (Phase 2A): the approved narrative order, each
 * section's canonical V3 anchor, and the legacy Eleventy/Phase 1A anchors that
 * must keep working. Pinned by tests/e2e/home.spec.ts and shell.spec.ts.
 *
 * "Contact" is not a separate section: as in the approved V3 design it is the
 * Admissions copy column (#contact) plus the footer.
 */
export type SectionEntry = {
  id: string;
  label: string;
  /** Legacy fragment ids that resolve to this section. */
  aliases: readonly string[];
  /**
   * Not part of the approved V3 homepage: rendered only once real content
   * exists (otherwise only its id + aliases are kept as zero-size anchors).
   */
  conditional?: boolean;
};

export const HOME_SECTIONS: readonly SectionEntry[] = [
  { id: "home", label: "Hero", aliases: ["top"] },
  { id: "why", label: "Why Feather Touch", aliases: ["about", "learning"] },
  { id: "programmes", label: "Programmes", aliases: [] },
  { id: "day-care", label: "Day Care", aliases: ["daycare"] },
  { id: "school-life", label: "School Life", aliases: ["activities"] },
  { id: "childrens-work", label: "Children's Work", aliases: [] },
  { id: "day", label: "A day at Feather Touch", aliases: ["routine"] },
  { id: "safety", label: "Safety", aliases: [] },
  { id: "partnership", label: "Parent Partnership", aliases: [] },
  { id: "gallery", label: "Gallery and videos", aliases: ["videos"], conditional: true },
  { id: "testimonials", label: "Parent reviews", aliases: [], conditional: true },
  { id: "visit", label: "Admissions and contact", aliases: ["admissions", "enquire", "contact"] },
  { id: "faq", label: "FAQ", aliases: [] },
];

/** Every fragment id that existed on the Eleventy homepage. */
export const LEGACY_ANCHORS = [
  "home",
  "about",
  "programmes",
  "daycare",
  "learning",
  "routine",
  "activities",
  "safety",
  "partnership",
  "gallery",
  "testimonials",
  "admissions",
  "faq",
  "contact",
] as const;
