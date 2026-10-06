import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { FAQS, PROGRAMMES } from "@/prisma/seed-data";

const legacy = (file: string) => fileURLToPath(new URL(`../../../src/_data/${file}`, import.meta.url));

describe("seed data", () => {
  it("uses exactly the client-approved programme ages", () => {
    const ages = Object.fromEntries(PROGRAMMES.map((p) => [p.name, [p.ageMinYears, p.ageMaxYears]]));
    expect(ages).toEqual({
      "Play Group": [2, 3],
      Nursery: [3, 4],
      "KG 1": [4, 5],
      "KG 2": [5, 6],
      "Day Care": [null, null], // TBD by the school — must not be invented
    });
  });

  it("does not invent programme facts the school has not supplied", () => {
    for (const p of PROGRAMMES) {
      expect(Object.keys(p)).not.toContain("timings");
      expect(Object.keys(p)).not.toContain("overview");
    }
    const dayCare = PROGRAMMES.find((p) => p.slug === "day-care");
    expect(dayCare?.tagline).toBeNull();
  });

  it.runIf(existsSync(legacy("programmes.json")))(
    "programme copy matches src/_data/programmes.json verbatim",
    () => {
      const source = JSON.parse(readFileSync(legacy("programmes.json"), "utf8")) as Array<{
        slug: string;
        name: string;
        tagline: string;
        focusAreas: string[];
      }>;
      for (const s of source) {
        const seeded = PROGRAMMES.find((p) => p.slug === s.slug);
        expect(seeded, s.slug).toBeDefined();
        expect(seeded).toMatchObject({ name: s.name, tagline: s.tagline, focusAreas: s.focusAreas });
      }
    },
  );

  it.runIf(existsSync(legacy("faq.json")))("FAQ copy matches src/_data/faq.json verbatim", () => {
    const source = JSON.parse(readFileSync(legacy("faq.json"), "utf8")) as Array<{
      id: string;
      question: string;
      answer: string;
      group: string;
      showOnHome: boolean;
    }>;
    expect(FAQS).toHaveLength(source.length);
    for (const s of source) {
      expect(FAQS.find((f) => f.key === s.id)).toMatchObject({
        question: s.question,
        answer: s.answer,
        group: s.group,
        showOnHome: s.showOnHome,
      });
    }
  });
});
