import { afterEach, describe, expect, it } from "vitest";
import { DAY_CARE, FAQ, HERO, PROGRAMMES, formatAges } from "@/content/home";
import { HERO_SLIDESHOW_SEED, PARENT_REVIEWS, VIDEOS } from "@/content/media";
import heroSlidePlaceholder from "@/assets/media/placeholders/hero-slide-placeholder.svg";
import { MAX_HERO_SLIDES, selectPublicSlides } from "@/lib/slideshow";
import { HOME_SECTIONS, LEGACY_ANCHORS } from "@/content/sections";
import { getArtwork, getHeroSlides, getParentReviews, getPosters } from "@/lib/server/public-media";

/**
 * Phase 2A content rules: confirmed facts only, approved media only, and the
 * production consent gate.
 */
describe("homepage content", () => {
  it("uses the approved V3 hero heading", () => {
    expect(`${HERO.headingLead} ${HERO.headingClause} ${HERO.headingBrushed}`).toBe(
      "We believe children learn best when they are happy.",
    );
  });

  it("shows exactly the client-confirmed programme ages", () => {
    expect(PROGRAMMES.map((p) => [p.name, p.ages && formatAges(p.ages)])).toEqual([
      ["Play Group", "2–3 years"],
      ["Nursery", "3–4 years"],
      ["KG 1", "4–5 years"],
      ["KG 2", "5–6 years"],
    ]);
  });

  it("never invents Day Care age, hours, meals, pickup or programme timings", () => {
    expect(DAY_CARE.details.every((d) => d.value === null)).toBe(true);
    expect(PROGRAMMES.every((p) => p.timings === null)).toBe(true);
  });

  it("ships no invented reviews or videos", () => {
    expect(PARENT_REVIEWS).toEqual([]);
    expect(VIDEOS).toEqual([]);
  });

  it("FAQ keeps all six approved questions in order", () => {
    expect(FAQ.items.map((f) => f.key)).toEqual([
      "classes",
      "day-care",
      "methodology",
      "activities",
      "enquire",
      "visit",
    ]);
  });
});

describe("slideshow seed (temporary Phase 2A content)", () => {
  const labels = ["Welcome", "Play", "Create", "Learn", "Celebrate", "Grow", "Together"];

  it("has exactly seven active slots, ordered, with the default tab labels", () => {
    expect(HERO_SLIDESHOW_SEED).toHaveLength(MAX_HERO_SLIDES);
    expect(HERO_SLIDESHOW_SEED.map((s) => s.sortOrder)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(HERO_SLIDESHOW_SEED.map((s) => s.tabLabel)).toEqual(labels);
    for (const s of HERO_SLIDESHOW_SEED) {
      expect(s.alt.length, s.id).toBeGreaterThan(20);
      expect(s.caption.length, s.id).toBeGreaterThan(0);
      expect(s.isActive, s.id).toBe(true);
      expect(s.consentConfirmed, s.id).toBe(false); // consent still pending from the school
    }
  });

  it("slides 1–3 are the three V3-approved photos; 4–7 are marked placeholders, never photos", () => {
    const [photos, slots] = [HERO_SLIDESHOW_SEED.slice(0, 3), HERO_SLIDESHOW_SEED.slice(3)];
    expect(photos.map((s) => s.id)).toEqual(["welcome-back", "classroom-puzzle", "classroom-colouring"]);
    for (const s of photos) expect(s.isPlaceholder, s.id).toBeFalsy();
    for (const s of slots) {
      expect(s.isPlaceholder, s.id).toBe(true);
      expect(s.image, s.id).toBe(heroSlidePlaceholder);
      expect(s.alt, s.id).toMatch(/^Placeholder/);
      expect(s.caption, s.id).toMatch(/^Placeholder/);
    }
  });

  it("preview shows all seven; production shows no placeholder (and nothing unconsented)", () => {
    expect(selectPublicSlides(HERO_SLIDESHOW_SEED, { mode: "preview" })).toHaveLength(7);
    expect(selectPublicSlides(HERO_SLIDESHOW_SEED, { mode: "production" })).toEqual([]);
  });
});

describe("production consent gate", () => {
  const original = process.env.SITE_MODE;
  afterEach(() => {
    if (original === undefined) delete process.env.SITE_MODE;
    else process.env.SITE_MODE = original;
  });

  it("preview shows approved media while consent is pending", () => {
    delete process.env.SITE_MODE;
    expect(getHeroSlides()).toHaveLength(7);
    expect(getHeroSlides().filter((s) => s.isPlaceholder)).toHaveLength(4);
    expect(getPosters()).toHaveLength(2);
    expect(getArtwork()).not.toBeNull();
  });

  it("production hides every child photograph and poster without confirmed consent", () => {
    process.env.SITE_MODE = "production";
    expect(getHeroSlides()).toEqual([]);
    expect(getPosters()).toEqual([]);
    expect(getArtwork()).toBeNull();
  });

  it("reviews require approval AND consent in every mode", () => {
    delete process.env.SITE_MODE;
    expect(getParentReviews()).toEqual([]);
  });
});

describe("anchors", () => {
  it("every legacy Eleventy anchor resolves to a V3 section or alias", () => {
    const all = new Set(HOME_SECTIONS.flatMap((s) => [s.id, ...s.aliases]));
    for (const id of LEGACY_ANCHORS) expect(all.has(id), id).toBe(true);
  });

  it("ids are unique", () => {
    const ids = HOME_SECTIONS.flatMap((s) => [s.id, ...s.aliases]);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
