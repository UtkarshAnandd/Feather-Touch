import "server-only";
import {
  ARTWORK,
  GALLERY,
  HERO_SLIDESHOW_SEED,
  PARENT_REVIEWS,
  POSTERS,
  VIDEOS,
  type ParentReview,
  type Photo,
} from "@/content/media";
import { selectPublicSlides, type SlideshowSlide } from "@/lib/slideshow";
import { getSiteMode } from "./env";

/**
 * Public media policy. Preview builds show approved assets while consent is
 * pending; production shows a child photograph, poster or video ONLY when
 * consent is confirmed, and a parent review ONLY when it is approved AND
 * consented. (Spec §9 and F3.)
 */
function allowed<T extends { consentConfirmed: boolean }>(items: readonly T[]): T[] {
  return getSiteMode() === "production" ? items.filter((i) => i.consentConfirmed) : [...items];
}

/**
 * Hero slides for the homepage. Phase 2A source: the static seed. Phase 2B:
 * replace HERO_SLIDESHOW_SEED with the admin-managed records (same shape);
 * the selection rules and the component stay as they are.
 */
export const getHeroSlides = (): SlideshowSlide[] =>
  selectPublicSlides(HERO_SLIDESHOW_SEED, { mode: getSiteMode() });
export const getVideos = () => allowed(VIDEOS);
export const getGallery = () => allowed(GALLERY);
export const getArtwork = (): Photo | null => allowed([ARTWORK])[0] ?? null;
export const getPosters = () => allowed([POSTERS.janmashtami, POSTERS.environmentDay]);

/** Reviews are never shown unapproved — in any build mode. */
export function getParentReviews(): ParentReview[] {
  return PARENT_REVIEWS.filter((r) => r.approved && r.consentConfirmed);
}

export const isPreview = () => getSiteMode() !== "production";
