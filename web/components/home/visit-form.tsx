"use client";

import { useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ADMISSIONS } from "@/content/home";
import { cx } from "@/lib/cx";
import {
  ENQUIRY_ANCHOR_ID,
  ENQUIRY_FIELD_NAMES,
  ENQUIRY_FORM_ID,
  FORM_FEEDBACK_ID,
  HONEYPOT_FIELD_NAME,
} from "@/lib/enquiry-contract";
import {
  VISIT_FORM_FIELD_ORDER,
  validateVisitForm,
  type VisitFormErrors,
  type VisitFormField,
} from "@/lib/visit-form";

/**
 * V3 "Request a visit" form (V3-DESIGN-SOURCE §8.12).
 *
 * Phase 2A: presentation + client validation only. There is NO delivery yet
 * (no server action, email or WhatsApp — Phase 2B), so submitting never sends
 * data anywhere and says so plainly. The legacy contract is preserved:
 * #enquire / #enquiry-form, the `extra_notes` honeypot and the
 * `#form-feedback` live region (lib/enquiry-contract.ts).
 *
 * Privacy: the submit button stays disabled until the page is interactive, so
 * a no-JS or pre-hydration submit can never put the parent's details into a
 * URL; method="post" is a second safeguard.
 *
 * Validation: native bubbles are replaced by inline messages (aria-invalid +
 * aria-describedby on inputs; the programme error describes its fieldset, as
 * aria-invalid is not supported on radios); the first invalid field is focused.
 */
const PREFERRED_TIME_FIELD = "preferred_visit_time";
const ERROR_ID: Record<VisitFormField, string> = {
  parentName: "visit-parent-name-error",
  phone: "visit-phone-error",
  programme: "visit-programme-error",
};

const inputBase = "h-52 w-full rounded-field bg-field px-14 text-17 text-ink placeholder:text-placeholder";
const inputOk = "border-[1.5px] border-field-line";
const inputInvalid = "border-2 border-ink";
const label = "text-16 leading-ui font-bold";

const subscribeNoop = () => () => {};

function FieldError({ field, errors }: { field: VisitFormField; errors: VisitFormErrors }) {
  const message = errors[field];
  if (!message) return null;
  return (
    <p id={ERROR_ID[field]} className="text-15 leading-ui text-ink font-bold">
      {message}
    </p>
  );
}

export function VisitForm({ deliveryNotice }: { deliveryNotice?: ReactNode }) {
  // false during SSR and hydration, true once React is interactive.
  const interactive = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
  const [errors, setErrors] = useState<VisitFormErrors>({});
  const [feedback, setFeedback] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const firstRadioRef = useRef<HTMLInputElement>(null);

  function clearError(field: VisitFormField) {
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const honeypot = data.get(HONEYPOT_FIELD_NAME);
    if (typeof honeypot === "string" && honeypot.length > 0) return;

    const found = validateVisitForm({
      parentName: String(data.get(ENQUIRY_FIELD_NAMES.parentName) ?? ""),
      phone: String(data.get(ENQUIRY_FIELD_NAMES.phone) ?? ""),
      programme: (data.get(ENQUIRY_FIELD_NAMES.programmeInterest) as string | null) ?? null,
    });
    setErrors(found);
    const first = VISIT_FORM_FIELD_ORDER.find((f) => found[f]);
    if (first) {
      setFeedback("");
      ({ parentName: nameRef, phone: phoneRef, programme: firstRadioRef })[first].current?.focus();
      return;
    }
    setFeedback(
      "Thank you. Online visit requests are not connected yet, so this request has not been sent. Nothing you entered has been stored.",
    );
  }

  return (
    <div
      id={ENQUIRY_ANCHOR_ID}
      className="bg-paper-raised border-line rounded-shelf sm:rounded-photo relative border-[1.5px] p-22 sm:p-36"
    >
      <form
        id={ENQUIRY_FORM_ID}
        method="post"
        noValidate
        aria-labelledby="visit-form-heading"
        aria-describedby="visit-form-note"
        onSubmit={onSubmit}
      >
        <h3 id="visit-form-heading" className="type-h3 mb-8">
          {ADMISSIONS.formHeading}
        </h3>
        <p id="visit-form-note" className="text-15 text-ink-soft mb-24">
          {ADMISSIONS.formNote}
        </p>

        {/* Honeypot: hidden from people and assistive technology. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={HONEYPOT_FIELD_NAME}>Leave this field empty</label>
          <input
            type="text"
            id={HONEYPOT_FIELD_NAME}
            name={HONEYPOT_FIELD_NAME}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="mb-20 flex flex-col gap-8">
          <label htmlFor="visit-parent-name" className={label}>
            Parent&rsquo;s name
          </label>
          <input
            ref={nameRef}
            id="visit-parent-name"
            name={ENQUIRY_FIELD_NAMES.parentName}
            type="text"
            autoComplete="name"
            required
            aria-invalid={errors.parentName ? true : undefined}
            aria-describedby={errors.parentName ? ERROR_ID.parentName : undefined}
            onChange={() => clearError("parentName")}
            className={cx(inputBase, errors.parentName ? inputInvalid : inputOk)}
          />
          <FieldError field="parentName" errors={errors} />
        </div>

        <div className="mb-20 flex flex-col gap-8">
          <label htmlFor="visit-phone" className={label}>
            Phone number
          </label>
          <input
            ref={phoneRef}
            id="visit-phone"
            name={ENQUIRY_FIELD_NAMES.phone}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={20}
            required
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? ERROR_ID.phone : undefined}
            onChange={() => clearError("phone")}
            className={cx(inputBase, errors.phone ? inputInvalid : inputOk)}
          />
          <FieldError field="phone" errors={errors} />
        </div>

        <fieldset
          className="mb-20 min-w-0 border-0 p-0"
          aria-describedby={errors.programme ? ERROR_ID.programme : undefined}
        >
          <legend className={`${label} mb-8`}>Programme you are interested in</legend>
          <div className="flex flex-wrap gap-8">
            {ADMISSIONS.programmeOptions.map((option, i) => (
              <label
                key={option}
                className="rounded-field border-field-line bg-field text-15 has-[:focus-visible]:outline-ink inline-flex min-h-44 cursor-pointer items-center gap-8 border-[1.5px] px-14 font-bold has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3"
              >
                <input
                  ref={i === 0 ? firstRadioRef : undefined}
                  type="radio"
                  name={ENQUIRY_FIELD_NAMES.programmeInterest}
                  value={option}
                  required
                  onChange={() => clearError("programme")}
                  className="accent-leaf-deep m-0 size-18 focus-visible:outline-none"
                />
                {option}
              </label>
            ))}
          </div>
          {errors.programme && (
            <div className="mt-8">
              <FieldError field="programme" errors={errors} />
            </div>
          )}
        </fieldset>

        <div className="mb-20 flex flex-col gap-8">
          <label htmlFor="visit-preferred-time" className={label}>
            Preferred day or time <span className="font-regular text-ink-soft">(optional)</span>
          </label>
          <input
            id="visit-preferred-time"
            name={PREFERRED_TIME_FIELD}
            type="text"
            placeholder={ADMISSIONS.preferredTimePlaceholder}
            className={cx(inputBase, inputOk)}
          />
        </div>

        <Button type="submit" block arrow disabled={!interactive}>
          Request a visit
        </Button>

        <p
          id={FORM_FEEDBACK_ID}
          role="status"
          aria-live="polite"
          className="text-16 mt-16 font-bold empty:hidden"
        >
          {feedback}
        </p>
        {deliveryNotice && <p className="mt-16">{deliveryNotice}</p>}
      </form>
    </div>
  );
}
