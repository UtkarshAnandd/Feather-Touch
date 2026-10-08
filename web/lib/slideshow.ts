/**
 * Hero slideshow data contract (Phase 2A → 2B boundary).
 *
 * The slideshow is ADMIN-MANAGED in Phase 2B: an admin uploads/selects photos,
 * edits metadata, reorders and (de)activates them. The public component only
 * ever receives `SlideshowSlide[]` produced by `selectPublicSlides()`, so the
 * source can change from the Phase 2A static seed (content/media.ts) to
 * database rows (MediaAsset + MediaPlacement[HERO_SLIDESHOW]) without touching
 * the component.
 *
 * Phase 2B schema note: MediaAsset already has altText, caption, focalX/Y and
 * consentConfirmed; MediaPlacement has sortOrder and isActive. `tabLabel` has
 * no column yet and must be added in Phase 2B (no schema changes in 2A).
 * `isPlaceholder` is Phase 2A-only (seed slots awaiting a real photo); database
 * rows are always real uploads and never set it.
 */

/** Maximum active slides on the public homepage (client requirement: 7). */
export const MAX_HERO_SLIDES = 7;

/**
 * Image reference. A Phase 2A static import (StaticImageData) satisfies this
 * shape; a Phase 2B stored asset supplies the same fields from MediaAsset.
 */
export type SlideImage = { src: string; width: number; height: number; blurDataURL?: string };

/** One slideshow record as an admin manages it (source-agnostic). */
export type SlideshowRecord = {
  id: string;
  image: SlideImage;
  alt: string;
  caption: string;
  /**
   * Short tab word (V3: WELCOME / PLAY / CREATE …). Shown under the thumbnail
   * on the ≤3-slide controls and always part of the tab's accessible name.
   */
  tabLabel: string;
  /** CSS object-position for the 4:5 crop, e.g. "48% 35%". */
  focal?: string;
  sortOrder: number;
  isActive: boolean;
  /** Parental consent confirmed for every child shown. */
  consentConfirmed: boolean;
  /**
   * TEMPORARY slot with no real photo yet (preview only). Never public:
   * excluded in production regardless of any other field.
   */
  isPlaceholder?: boolean;
};

/** What the public slideshow renders. */
export type SlideshowSlide = Pick<
  SlideshowRecord,
  "id" | "image" | "alt" | "caption" | "tabLabel" | "focal"
> & {
  isPlaceholder: boolean;
};

/**
 * Records → public slides: active only; consented only in production (preview
 * may show approved assets while consent is pending); placeholders never in
 * production; ordered by sortOrder;
 * capped at MAX_HERO_SLIDES; records without alt text or caption are skipped.
 */
export function selectPublicSlides(
  records: readonly SlideshowRecord[],
  { mode }: { mode: "production" | "preview" },
): SlideshowSlide[] {
  return records
    .filter((r) => r.isActive)
    .filter((r) => mode !== "production" || (r.consentConfirmed && !r.isPlaceholder))
    .filter((r) => r.alt.trim().length > 0 && r.caption.trim().length > 0)
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, MAX_HERO_SLIDES)
    .map(({ id, image, alt, caption, tabLabel, focal, isPlaceholder }) => ({
      id,
      image,
      alt,
      caption,
      tabLabel,
      focal,
      isPlaceholder: isPlaceholder === true,
    }));
}
