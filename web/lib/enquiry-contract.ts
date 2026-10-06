/**
 * Enquiry form compatibility contract with the existing Eleventy implementation
 * (src/index.njk + src/assets/js/main.js). These identifiers are load-bearing:
 * the honeypot field name, the feedback live-region id and the anchors must be
 * preserved by the Next.js form (Phase 4). Pinned by tests/unit/enquiry-contract.test.ts.
 */
export const ENQUIRY_FORM_ID = "enquiry-form";
export const ENQUIRY_ANCHOR_ID = "enquire";
export const ADMISSIONS_ANCHOR_ID = "admissions";

/** Hidden honeypot input. Must stay name="extra_notes" (and id="extra_notes"). */
export const HONEYPOT_FIELD_NAME = "extra_notes";

/** Status/live region for submission feedback. Must stay id="form-feedback". */
export const FORM_FEEDBACK_ID = "form-feedback";

export const ENQUIRY_FIELD_NAMES = {
  parentName: "parent_name",
  phone: "phone",
  email: "email",
  childName: "child_name",
  programmeInterest: "programme_interest",
  message: "message",
} as const;

/**
 * Legacy <option value> strings → database enum (ProgrammeInterest).
 * "School + Day Care" exists in the Eleventy form; whether it is a real
 * offering is pending client confirmation.
 */
export const PROGRAMME_INTEREST_BY_LEGACY_VALUE = {
  "Play Group": "PLAY_GROUP",
  Nursery: "NURSERY",
  "KG 1": "KG1",
  "KG 2": "KG2",
  "Day Care": "DAY_CARE",
  "School + Day Care": "SCHOOL_PLUS_DAY_CARE",
} as const;
