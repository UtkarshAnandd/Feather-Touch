/**
 * Seed content for the PostgreSQL-managed tables.
 *
 * SOURCE OF TRUTH
 * - Programme names, taglines and focus areas: copied verbatim from the Eleventy
 *   file src/_data/programmes.json (kept untouched until cutover). A unit test
 *   (tests/unit/seed-data.test.ts) fails if the two drift apart.
 * - Programme ages: client-approved values supplied for V1
 *   (Play Group 2–3, Nursery 3–4, KG 1 4–5, KG 2 5–6). Day Care age is TBD → null.
 * - FAQ: copied verbatim from src/_data/faq.json.
 *
 * DO NOT add school facts here (contact details, timings, Day Care age, logo,
 * photos, videos, reviews) until the school supplies them.
 */

export type ProgrammeSeed = {
  slug: string;
  name: string;
  tagline: string | null;
  focusAreas: string[];
  ageMinYears: number | null;
  ageMaxYears: number | null;
  sortOrder: number;
};

export const PROGRAMMES: readonly ProgrammeSeed[] = [
  {
    slug: "play-group",
    name: "Play Group",
    tagline: "Learning Begins With Wonder",
    focusAreas: [
      "Socialisation",
      "Language development",
      "Motor skills",
      "Sensory exploration",
      "Music & movement",
      "Creative expression",
      "Basic concepts",
    ],
    ageMinYears: 2,
    ageMaxYears: 3,
    sortOrder: 1,
  },
  {
    slug: "nursery",
    name: "Nursery",
    tagline: "Explore. Discover. Learn.",
    focusAreas: [
      "Letters and sounds",
      "Numbers and basic concepts",
      "Colours and shapes",
      "Rhymes and stories",
      "Art & craft",
      "Environmental awareness",
      "Fine and gross motor activities",
      "Social and emotional skills",
    ],
    ageMinYears: 3,
    ageMaxYears: 4,
    sortOrder: 2,
  },
  {
    slug: "kg-1",
    name: "KG 1",
    tagline: "Growing Confidence, Growing Knowledge",
    focusAreas: [
      "English language",
      "Early literacy",
      "Numeracy",
      "General awareness",
      "Rhymes and storytelling",
      "Art & craft",
      "Creative activities",
      "Physical development",
      "Social skills",
    ],
    ageMinYears: 4,
    ageMaxYears: 5,
    sortOrder: 3,
  },
  {
    slug: "kg-2",
    name: "KG 2",
    tagline: "Preparing Children for the Next Big Step",
    focusAreas: [
      "Reading readiness",
      "Writing skills",
      "Number concepts",
      "Communication",
      "Logical thinking",
      "General awareness",
      "Creative expression",
      "Confidence and independence",
    ],
    ageMinYears: 5,
    ageMaxYears: 6,
    sortOrder: 4,
  },
  {
    // Day Care copy (heading/lead/inclusions) is static content for Phase 2.
    // Age range is TBD by the school: must remain null.
    slug: "day-care",
    name: "Day Care",
    tagline: null,
    focusAreas: [],
    ageMinYears: null,
    ageMaxYears: null,
    sortOrder: 5,
  },
];

export type FaqSeed = {
  key: string;
  question: string;
  answer: string;
  group: string;
  showOnHome: boolean;
  sortOrder: number;
};

export const FAQS: readonly FaqSeed[] = [
  {
    key: "classes",
    question: "What classes are offered?",
    answer: "We offer Play Group, Nursery, KG 1 and KG 2. Day Care is also available.",
    group: "programmes",
    showOnHome: true,
    sortOrder: 1,
  },
  {
    key: "day-care",
    question: "Is Day Care available?",
    answer: "Yes. Feather Touch provides a Day Care facility for children who require extended care.",
    group: "programmes",
    showOnHome: true,
    sortOrder: 2,
  },
  {
    key: "methodology",
    question: "What teaching methodology is followed?",
    answer: "We use a child-friendly combination of play-based, activity-based and experiential learning.",
    group: "learning",
    showOnHome: true,
    sortOrder: 3,
  },
  {
    key: "activities",
    question: "Are extracurricular activities conducted?",
    answer:
      "Yes. Children participate in age-appropriate creative, cultural, physical and educational activities throughout the academic year.",
    group: "learning",
    showOnHome: false,
    sortOrder: 4,
  },
  {
    key: "enquire",
    question: "How can I enquire about admission?",
    answer:
      "Parents can contact the school directly by phone/WhatsApp or visit the school for an admission enquiry.",
    group: "admissions",
    showOnHome: true,
    sortOrder: 5,
  },
  {
    key: "visit",
    question: "Can parents visit the school?",
    answer: "Yes. Parents are welcome to schedule a school visit and understand our programmes.",
    group: "admissions",
    showOnHome: true,
    sortOrder: 6,
  },
];
