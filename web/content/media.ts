import type { StaticImageData } from "next/image";
import artColouring from "@/assets/media/art-colouring-detail.jpg";
import heroColouring from "@/assets/media/hero-colouring.jpg";
import heroPuzzle from "@/assets/media/hero-puzzle.jpg";
import heroWelcome from "@/assets/media/hero-welcome.jpg";
import heroSlidePlaceholder from "@/assets/media/placeholders/hero-slide-placeholder.svg";
import posterJanmashtami from "@/assets/media/poster-janmashtami.jpg";
import posterEnvironmentDay from "@/assets/media/poster-world-environment-day.jpg";
import type { SlideshowRecord } from "@/lib/slideshow";

/**
 * Approved media registry (Phase 2A, static).
 *
 * ONLY the photographs and posters approved in the V3 handoff
 * (design-handoff/assets/). Captions and alt text are verbatim from
 * src/_data/images.json / the V3 prototype. This module is the seam that a
 * later phase replaces with admin-managed MediaAsset/MediaPlacement/Video/
 * ParentReview rows; the shapes below mirror those models.
 *
 * `consentConfirmed` is false for every child photograph and poster until the
 * school confirms parental consent / usage rights. Production rendering filters
 * these out (lib/server/public-media.ts); preview builds show them.
 */

export type Photo = {
  id: string;
  src: StaticImageData;
  alt: string;
  caption: string;
  /** CSS object-position, from images.json focal points. */
  focal?: string;
  consentConfirmed: boolean;
};

/**
 * Hero slideshow — TEMPORARY Phase 2A seed establishing the 7-slide structure.
 *
 * The final slideshow (7 photos) is admin-managed from Phase 2B: this array is
 * replaced by database records with the same SlideshowRecord shape
 * (lib/slideshow.ts). Slides 1–3 are the three V3-approved photos. Slides 4–7
 * have no photo yet: they use one clearly labelled placeholder card (not a
 * photograph) and `isPlaceholder: true`, so they appear in preview only and are
 * never public. Never add stand-in or generated photos here.
 */
export const HERO_SLIDESHOW_SEED: readonly SlideshowRecord[] = [
  {
    id: "welcome-back",
    image: heroWelcome,
    alt: "A child stands between large paper flowers under a handmade 'Welcome Back to School' sign at the school entrance.",
    caption: "Welcome back to school.",
    tabLabel: "Welcome",
    focal: "48% 35%",
    sortOrder: 1,
    isActive: true,
    consentConfirmed: false,
  },
  {
    id: "classroom-puzzle",
    image: heroPuzzle,
    alt: "Two children in Feather Touch uniforms fit pieces into a foam puzzle together at a classroom table.",
    caption: "Solving a puzzle together in class.",
    tabLabel: "Play",
    focal: "50% 40%",
    sortOrder: 2,
    isActive: true,
    consentConfirmed: false,
  },
  {
    id: "classroom-colouring",
    image: heroColouring,
    alt: "A child concentrates on colouring a sun in an activity book at a classroom table.",
    caption: "Colouring during an activity session.",
    tabLabel: "Create",
    focal: "45% 55%",
    sortOrder: 3,
    isActive: true,
    consentConfirmed: false,
  },
  {
    id: "placeholder-learn",
    image: heroSlidePlaceholder,
    alt: "Placeholder card for slide 4: no school photo has been chosen yet.",
    caption: "Placeholder: the school will choose this photo.",
    tabLabel: "Learn",
    sortOrder: 4,
    isActive: true,
    consentConfirmed: false,
    isPlaceholder: true,
  },
  {
    id: "placeholder-celebrate",
    image: heroSlidePlaceholder,
    alt: "Placeholder card for slide 5: no school photo has been chosen yet.",
    caption: "Placeholder: the school will choose this photo.",
    tabLabel: "Celebrate",
    sortOrder: 5,
    isActive: true,
    consentConfirmed: false,
    isPlaceholder: true,
  },
  {
    id: "placeholder-grow",
    image: heroSlidePlaceholder,
    alt: "Placeholder card for slide 6: no school photo has been chosen yet.",
    caption: "Placeholder: the school will choose this photo.",
    tabLabel: "Grow",
    sortOrder: 6,
    isActive: true,
    consentConfirmed: false,
    isPlaceholder: true,
  },
  {
    id: "placeholder-together",
    image: heroSlidePlaceholder,
    alt: "Placeholder card for slide 7: no school photo has been chosen yet.",
    caption: "Placeholder: the school will choose this photo.",
    tabLabel: "Together",
    sortOrder: 7,
    isActive: true,
    consentConfirmed: false,
    isPlaceholder: true,
  },
];

export const POSTERS = {
  janmashtami: {
    id: "poster-janmashtami",
    src: posterJanmashtami,
    alt: "Feather Touch Janmashtami greeting poster showing children dressed as Krishna and Radha in a decorated classroom.",
    caption: "Our Janmashtami poster",
    consentConfirmed: false,
  },
  environmentDay: {
    id: "poster-world-environment-day",
    src: posterEnvironmentDay,
    alt: "Feather Touch World Environment Day poster: a teacher and a child hold a potted plant.",
    caption: "World Environment Day",
    consentConfirmed: false,
  },
} satisfies Record<string, Photo>;

export const ARTWORK: Photo = {
  id: "art-colouring-detail",
  src: artColouring,
  alt: "A child’s hands on an activity book, colouring a smiling sun.",
  caption: "Colouring during an activity session.",
  consentConfirmed: false,
};

/** School videos (2–3). None supplied yet — never invent sources. */
export type SchoolVideo = {
  id: string;
  title: string;
  description?: string;
  src: string;
  poster: StaticImageData | string;
  width: number;
  height: number;
  captionsSrc?: string;
  consentConfirmed: boolean;
};
export const VIDEOS: readonly SchoolVideo[] = [];

/** Additional gallery photographs beyond those used in sections. None yet. */
export const GALLERY: readonly Photo[] = [];

/**
 * Parent reviews. ONLY real reviews, each with the parent's permission and
 * approval recorded. None yet — never invent or paraphrase testimonials.
 */
export type ParentReview = {
  id: string;
  quote: string;
  displayName: string;
  context?: string;
  approved: boolean;
  consentConfirmed: boolean;
};
export const PARENT_REVIEWS: readonly ParentReview[] = [];
