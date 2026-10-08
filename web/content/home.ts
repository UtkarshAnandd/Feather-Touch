import { FAQS as SEED_FAQS, PROGRAMMES as SEED_PROGRAMMES } from "@/prisma/seed-data";

/**
 * Homepage copy (Phase 2A).
 *
 * SOURCES — nothing here is invented:
 * - V3: verbatim from the approved prototype (docs/design/V3-DESIGN-SOURCE.md §8).
 *   V3 renders sentence case and lightly edited wording; those display strings are
 *   used as-is (V3-IMPLEMENTATION-SPEC §14.1).
 * - SEED: programme names, focus areas and the client-confirmed ages come from
 *   prisma/seed-data.ts (itself pinned to src/_data by a unit test).
 * - ELEVENTY: two headings V3 does not cover ("Moments at Feather Touch",
 *   "What Parents Say") are reused from the existing site; confirm with the client.
 *
 * School facts that are still unknown are `null` and render as preview-only
 * content-required states.
 */

export const HERO = {
  // H1 is split so "when they are happy." can take the display colour + brush.
  headingLead: "We believe children learn best",
  headingClause: "when they are",
  headingBrushed: "happy.",
  lead: "Feather Touch is a nurturing early childhood education centre for Play Group, Nursery, KG 1 and KG 2, with Day Care for families who need extended care.",
  primaryCta: { label: "Book a school visit", href: "#visit" },
  secondaryCta: { label: "Explore programmes", href: "#programmes" },
  swipeNote: "Swipe to look around",
  carouselLabel: "Photos from Feather Touch",
} as const;

export const WHY = {
  hiddenHeading: "Why Feather Touch",
  statementBefore: "Education at this stage should not be about",
  statementStruck: "pressure or rote learning",
  statementAfter: ". It should be about curiosity, discovery, confidence and joy.",
  lead: "Feather Touch Foundation School and Day Care Centre is a nurturing early childhood education centre dedicated to providing quality foundational education in a safe, caring and stimulating environment.",
} as const;

/** V3 display taglines (sentence case) keyed by programme slug. */
const V3_TAGLINES: Record<string, string> = {
  "play-group": "Learning begins with wonder",
  nursery: "Explore. Discover. Learn.",
  "kg-1": "Growing confidence, growing knowledge",
  "kg-2": "Preparing children for the next big step",
};

export type Programme = {
  slug: string;
  name: string;
  tagline: string;
  focusAreas: readonly string[];
  /** Client-confirmed age range in years, or null when not yet confirmed. */
  ages: { min: number; max: number } | null;
  /** Not yet supplied by the school. */
  timings: string | null;
};

export const PROGRAMMES: readonly Programme[] = SEED_PROGRAMMES.filter((p) => p.slug !== "day-care")
  .slice()
  .sort((a, b) => a.sortOrder - b.sortOrder)
  .map((p) => ({
    slug: p.slug,
    name: p.name,
    tagline: V3_TAGLINES[p.slug] ?? p.tagline ?? "",
    focusAreas: p.focusAreas,
    ages:
      p.ageMinYears !== null && p.ageMaxYears !== null ? { min: p.ageMinYears, max: p.ageMaxYears } : null,
    timings: null,
  }));

export const PROGRAMMES_SECTION = {
  heading: "Nurturing little minds, building strong foundations.",
  lead: "Four stages from Play Group to KG 2, and Day Care for families who need extended care.",
} as const;

export const DAY_CARE = {
  eyebrow: "Day Care Centre",
  heading: "Caring beyond the classroom",
  lead: "For working parents and families who need extended care, Feather Touch Day Care Centre provides a caring and comfortable environment where children can spend their time safely.",
  quote: "“Because your child deserves care that feels like home.”",
  includesHeading: "What Day Care includes",
  includes: [
    "Safe and supervised care",
    "Rest and relaxation",
    "Creative activities",
    "Storytelling",
    "Indoor play",
    "Age-appropriate learning activities",
    "Social interaction",
    "A warm and caring environment",
  ],
  cta: { label: "Ask about Day Care", href: "#visit" },
  photoNeed: "A real Day Care moment at Feather Touch: a camera-original photograph, with consent confirmed.",
  // Practical details: all still to be supplied by the school (Day Care age is TBD).
  details: [
    { label: "Hours", value: null },
    { label: "Age range", value: null },
    { label: "Meals", value: null },
    { label: "Pickup", value: null },
  ] as { label: string; value: string | null }[],
} as const;

export const SCHOOL_LIFE = {
  heading: "Festivals, crafts, stories and sports",
  lead: "Children take part in age-appropriate creative, cultural, physical and educational activities throughout the academic year.",
  groups: [
    {
      heading: "Celebrations",
      text: "Guru Purnima, Janmashtami, Ganesh Chaturthi, Gandhi Jayanti, Diwali, Children’s Day, Christmas and Republic Day",
    },
    { heading: "Nature and healthy habits", text: "Green Day, Plantation Activities and Healthy Tiffin Day" },
    {
      heading: "Making and performing",
      text: "Colouring Competition, Fancy Dress Competition, Rakhi Making, Poem Recitation and Storytelling",
    },
    {
      heading: "Learning by doing",
      text: "Parent-Child Fireless Cooking, Community Helpers Role Play and Sports Activities",
    },
  ],
  photoNeed: "Camera-original photos from Annual Day, Diwali or Sports Activities, with consent confirmed.",
} as const;

export const CHILDRENS_WORK = {
  heading: "Made by little hands",
  lead: "Creative activities help children express ideas and emotions.",
  needs: [
    "Leaf-art Ganesha: a photo of the artwork itself, from the original file.",
    "Rakhi Making: the finished rakhis, photographed flat.",
    "Colouring Competition: scanned drawings with names removed.",
    "Any classroom paper craft, photographed without faces.",
  ],
} as const;

export const DAY = {
  heading: "A day at Feather Touch",
  lead: "The shape of a typical school day, from arrival to goodbye.",
  // Times are not supplied yet; the sequence itself is approved.
  steps: [
    "Welcome & settling in",
    "Circle time",
    "Concept-based learning",
    "Rhymes & music",
    "Activity, art & craft",
    "Snack and healthy tiffin",
    "Outdoor and physical activity",
    "Storytelling & creative learning",
    "Recap & goodbye",
  ],
  timings: null as string | null,
} as const;

export const SAFETY = {
  heading: "A safe childhood is the first step towards a strong future",
  lead: "At Feather Touch, the safety and well-being of every child is a fundamental priority.",
  note: "We also believe that child protection is a shared responsibility between school, parents and the community.",
  topicsHeading: "What children learn about staying safe",
  topics: [
    "Personal safety",
    "Safe and unsafe touch",
    "Good and bad behaviour",
    "Respect for others",
    "Personal boundaries",
    "Asking for help",
    "Healthy habits",
    "Emotional well-being",
  ],
  practicesNeed:
    "How the school keeps children safe day to day, for example arrival and pickup, supervision and visitors.",
} as const;

export const PARTNERSHIP = {
  // Rendered as: Parents + Teachers / = Stronger foundations
  lead: "A child’s development becomes stronger when parents and teachers work together.",
  items: [
    "Parent-Teacher Meetings",
    "Progress discussions",
    "Activity updates",
    "School events",
    "Parent-child activities",
    "Feedback and interaction",
  ],
  closing: "Together, we help children grow.",
} as const;

export const MOMENTS = {
  heading: "Moments at Feather Touch", // ELEVENTY gallery heading (not in V3)
} as const;

export const REVIEWS = {
  heading: "What parents say", // Not in V3; sentence case per V3 headings
} as const;

export const ADMISSIONS = {
  eyebrow: "Admissions",
  heading: "Book a school visit",
  lead: "Parents are welcome to schedule a school visit and understand our programmes.",
  formHeading: "Request a visit",
  formNote: "All fields are required unless marked optional.",
  programmeOptions: ["Play Group", "Nursery", "KG 1", "KG 2", "Day Care"],
  preferredTimePlaceholder: "For example, a weekday morning",
} as const;

/**
 * FAQ: V3 shows all six questions; answers follow the V3 wording (the seed
 * says "phone/WhatsApp", V3 says "phone or WhatsApp").
 */
const V3_FAQ_ANSWERS: Record<string, string> = {
  enquire:
    "Parents can contact the school directly by phone or WhatsApp, or visit the school for an admission enquiry.",
};

export const FAQ = {
  heading: "Questions parents ask",
  items: SEED_FAQS.slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((f) => ({ key: f.key, question: f.question, answer: V3_FAQ_ANSWERS[f.key] ?? f.answer })),
} as const;

/** Format a confirmed age range, e.g. "2–3 years". */
export function formatAges(ages: { min: number; max: number }): string {
  return `${ages.min}–${ages.max} years`;
}
