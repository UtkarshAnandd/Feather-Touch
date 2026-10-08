import { describe, expect, it } from "vitest";
import { MAX_HERO_SLIDES, selectPublicSlides, type SlideshowRecord } from "@/lib/slideshow";

/**
 * The admin-managed slideshow contract: whatever the source (Phase 2A seed or
 * Phase 2B database), the homepage gets active, ordered, consent-gated slides,
 * at most seven.
 */
const image = { src: "/x.jpg", width: 880, height: 1100 };
const rec = (id: string, over: Partial<SlideshowRecord> = {}): SlideshowRecord => ({
  id,
  image,
  alt: `Alt text for ${id}`,
  caption: `Caption ${id}`,
  tabLabel: id,
  sortOrder: 0,
  isActive: true,
  consentConfirmed: true,
  ...over,
});

describe("selectPublicSlides", () => {
  it("orders by sortOrder, not by array position", () => {
    const out = selectPublicSlides(
      [rec("c", { sortOrder: 3 }), rec("a", { sortOrder: 1 }), rec("b", { sortOrder: 2 })],
      {
        mode: "production",
      },
    );
    expect(out.map((s) => s.id)).toEqual(["a", "b", "c"]);
  });

  it("drops inactive records in every mode", () => {
    const records = [rec("on"), rec("off", { isActive: false })];
    expect(selectPublicSlides(records, { mode: "preview" }).map((s) => s.id)).toEqual(["on"]);
    expect(selectPublicSlides(records, { mode: "production" }).map((s) => s.id)).toEqual(["on"]);
  });

  it("requires consent in production; preview may show pending consent", () => {
    const records = [rec("ok"), rec("pending", { consentConfirmed: false })];
    expect(selectPublicSlides(records, { mode: "production" }).map((s) => s.id)).toEqual(["ok"]);
    expect(selectPublicSlides(records, { mode: "preview" }).map((s) => s.id)).toEqual(["ok", "pending"]);
  });

  it("never shows placeholder slots in production, even if marked consented", () => {
    const records = [rec("photo"), rec("slot", { isPlaceholder: true, consentConfirmed: true })];
    expect(selectPublicSlides(records, { mode: "production" }).map((s) => s.id)).toEqual(["photo"]);
    const preview = selectPublicSlides(records, { mode: "preview" });
    expect(preview.map((s) => [s.id, s.isPlaceholder])).toEqual([
      ["photo", false],
      ["slot", true],
    ]);
  });

  it("skips records without alt text or caption", () => {
    const out = selectPublicSlides([rec("a", { alt: " " }), rec("b", { caption: "" }), rec("c")], {
      mode: "preview",
    });
    expect(out.map((s) => s.id)).toEqual(["c"]);
  });

  it(`caps the homepage at ${MAX_HERO_SLIDES} slides`, () => {
    const many = Array.from({ length: 10 }, (_, i) => rec(`s${i}`, { sortOrder: i }));
    const out = selectPublicSlides(many, { mode: "production" });
    expect(MAX_HERO_SLIDES).toBe(7);
    expect(out).toHaveLength(7);
    expect(out.map((s) => s.id)).toEqual(["s0", "s1", "s2", "s3", "s4", "s5", "s6"]);
  });

  it("exposes only presentation fields to the public component", () => {
    const [slide] = selectPublicSlides([rec("a", { focal: "40% 60%" })], { mode: "production" });
    expect(Object.keys(slide!).sort()).toEqual([
      "alt",
      "caption",
      "focal",
      "id",
      "image",
      "isPlaceholder",
      "tabLabel",
    ]);
  });
});
