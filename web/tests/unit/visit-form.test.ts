import { describe, expect, it } from "vitest";
import { VISIT_FORM_ERRORS, isPlausiblePhone, validateVisitForm } from "@/lib/visit-form";

describe("visit form validation (client-side, Phase 2A)", () => {
  it("uses the approved error microcopy", () => {
    expect(VISIT_FORM_ERRORS).toEqual({
      parentName: "Enter the parent's name.",
      phone: "Enter a phone number with at least 10 digits.",
      programme: "Choose a programme.",
    });
  });

  it("flags every missing required field", () => {
    expect(validateVisitForm({ parentName: "  ", phone: "", programme: null })).toEqual(VISIT_FORM_ERRORS);
  });

  it("accepts a complete request (preferred time is optional and not validated)", () => {
    expect(validateVisitForm({ parentName: "A Parent", phone: "98765 43210", programme: "Nursery" })).toEqual(
      {},
    );
  });

  it.each([
    ["9876543210", true],
    ["+91 98765 43210", true],
    ["(022) 2345-6789", true],
    ["12345", false],
    ["98765abc10", false],
    ["+91 98765 43210 9999", false],
  ])("phone %s → %s", (phone, ok) => {
    expect(isPlausiblePhone(phone)).toBe(ok);
  });
});
