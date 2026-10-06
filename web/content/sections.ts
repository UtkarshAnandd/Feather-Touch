/**
 * Public homepage section registry for the Phase 1A skeleton.
 *
 * Anchor IDs are preserved from the Eleventy site (src/index.njk) so existing
 * links keep working. Labels are the V1 requirement names — NOT V3 copy.
 * Section order/visual treatment will be replaced by the approved V3 design in
 * Phase 1B/2; if V3 introduces different anchors, update here + docs.
 */
export type SectionStub = { id: string; label: string };

export const PUBLIC_SECTIONS: readonly SectionStub[] = [
  { id: "home", label: "Hero slideshow" },
  { id: "about", label: "About" },
  { id: "programmes", label: "Programmes" },
  { id: "daycare", label: "Day Care" },
  { id: "learning", label: "How Children Learn" },
  { id: "routine", label: "School Life — daily routine" },
  { id: "activities", label: "School Life — activities" },
  { id: "videos", label: "Videos" },
  { id: "safety", label: "Safety & Wellbeing" },
  { id: "partnership", label: "Parent Partnership" },
  { id: "gallery", label: "Gallery" },
  { id: "testimonials", label: "Parent reviews" },
  { id: "admissions", label: "Admissions & enquiry" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];
