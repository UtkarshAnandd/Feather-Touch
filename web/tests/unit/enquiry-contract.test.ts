import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  ENQUIRY_FIELD_NAMES,
  ENQUIRY_FORM_ID,
  FORM_FEEDBACK_ID,
  HONEYPOT_FIELD_NAME,
  PROGRAMME_INTEREST_BY_LEGACY_VALUE,
} from "@/lib/enquiry-contract";

const eleventyIndex = fileURLToPath(new URL("../../../src/index.njk", import.meta.url));
const eleventyJs = fileURLToPath(new URL("../../../src/assets/js/main.js", import.meta.url));

describe("enquiry compatibility contract", () => {
  it("pins the load-bearing identifiers", () => {
    expect(HONEYPOT_FIELD_NAME).toBe("extra_notes");
    expect(FORM_FEEDBACK_ID).toBe("form-feedback");
    expect(ENQUIRY_FORM_ID).toBe("enquiry-form");
  });

  // Cross-checks against the untouched Eleventy implementation while it exists.
  it.runIf(existsSync(eleventyIndex))("matches the Eleventy form markup", () => {
    const html = readFileSync(eleventyIndex, "utf8");
    expect(html).toContain(`name="${HONEYPOT_FIELD_NAME}"`);
    expect(html).toContain(`id="${FORM_FEEDBACK_ID}"`);
    expect(html).toContain(`id="${ENQUIRY_FORM_ID}"`);
    for (const name of Object.values(ENQUIRY_FIELD_NAMES)) expect(html).toContain(`name="${name}"`);
    for (const legacy of Object.keys(PROGRAMME_INTEREST_BY_LEGACY_VALUE)) {
      expect(html).toContain(`value="${legacy}"`);
    }
  });

  it.runIf(existsSync(eleventyJs))("matches the Eleventy client script hooks", () => {
    const js = readFileSync(eleventyJs, "utf8");
    expect(js).toContain(`input[name="${HONEYPOT_FIELD_NAME}"]`);
    expect(js).toContain(`'${FORM_FEEDBACK_ID}'`);
  });
});
