/**
 * Client-side validation for the V3 "Request a visit" form (Phase 2A).
 * Deliberately light: the backend phase adds server validation and E.164
 * normalisation. Messages are the approved microcopy.
 */
export const VISIT_FORM_ERRORS = {
  parentName: "Enter the parent's name.",
  phone: "Enter a phone number with at least 10 digits.",
  programme: "Choose a programme.",
} as const;

export type VisitFormField = keyof typeof VISIT_FORM_ERRORS;
export type VisitFormErrors = Partial<Record<VisitFormField, string>>;

/** Validation order = on-screen order (used to focus the first invalid field). */
export const VISIT_FORM_FIELD_ORDER: readonly VisitFormField[] = ["parentName", "phone", "programme"];

const PHONE_CHARS = /^[0-9+()\s-]+$/;

/** Digits only, spaces / + ( ) - allowed as separators; 10–13 digits. */
export function isPlausiblePhone(raw: string): boolean {
  const value = raw.trim();
  if (!PHONE_CHARS.test(value)) return false;
  const digits = value.replace(/\D/g, "").length;
  return digits >= 10 && digits <= 13;
}

export function validateVisitForm(values: {
  parentName: string;
  phone: string;
  programme: string | null;
}): VisitFormErrors {
  const errors: VisitFormErrors = {};
  if (values.parentName.trim().length === 0) errors.parentName = VISIT_FORM_ERRORS.parentName;
  if (!isPlausiblePhone(values.phone)) errors.phone = VISIT_FORM_ERRORS.phone;
  if (!values.programme) errors.programme = VISIT_FORM_ERRORS.programme;
  return errors;
}
