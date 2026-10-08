import type { ReactNode } from "react";
import { getSiteMode } from "@/lib/server/env";
import { cx } from "@/lib/cx";

/**
 * V3 "dashed label" states for facts the school has not supplied yet
 * (V3-DESIGN-SOURCE §7). They are PREVIEW-ONLY: in production (SITE_MODE=production)
 * they render nothing, so placeholder text can never ship. The launch gate
 * (spec §10) is responsible for ensuring nothing is unresolved at launch.
 *
 * Server components only (they read the site mode). Client components receive
 * them pre-rendered as props.
 */
const STATUS = {
  content: "Content required",
  integration: "Integration required",
  approval: "Approval required",
} as const;

export type RequiredStatus = keyof typeof STATUS;

const FLAG_TONE = {
  default: "border-flag-line bg-(--flag-bg) text-flag",
  "on-dark": "border-(--paper-on-ink-45) bg-transparent text-(--paper-on-ink-92)",
} as const;

/** Inline flag: optional label + uppercase status, e.g. "Phone  CONTENT REQUIRED". */
export function ContentRequired({
  label,
  status = "content",
  tone = "default",
  className,
}: {
  label?: string;
  status?: RequiredStatus;
  tone?: keyof typeof FLAG_TONE;
  className?: string;
}) {
  if (getSiteMode() === "production") return null;
  return (
    <span
      data-content-required={status}
      className={cx(
        "rounded-thumb text-14 leading-ui inline-flex items-center gap-8 border-[1.5px] border-dashed px-10 py-4 font-bold",
        FLAG_TONE[tone],
        className,
      )}
    >
      {label}
      <b className="text-11 tracking-flag font-extrabold uppercase">{STATUS[status]}</b>
    </span>
  );
}

const PANEL_TONE = {
  default: {
    box: "border-flag-line bg-(--need-bg)",
    title: "text-flag",
    body: "text-ink-soft",
  },
  inverse: {
    box: "border-(--paper-on-ink-50) bg-(--white-05)",
    title: "text-marigold-soft",
    body: "text-(--paper-on-ink-88)",
  },
} as const;

const PANEL_LAYOUT = {
  panel: "rounded-control px-20 py-18",
  // Fills a 22px-radius photo frame (Day Care photo slot, prototype .dc-need).
  slot: "rounded-photo absolute inset-0 p-20 sm:p-34",
  // Artwork grid tiles: 14px padding on phones (prototype .aw-needs .need).
  compact: "rounded-control p-14 sm:px-20 sm:py-18",
} as const;

/** Dashed panel marking where a real asset or block of content will go. */
export function NeedPanel({
  title = "Asset required",
  tone = "default",
  layout = "panel",
  className,
  children,
}: {
  title?: string;
  tone?: keyof typeof PANEL_TONE;
  layout?: keyof typeof PANEL_LAYOUT;
  className?: string;
  children: ReactNode;
}) {
  if (getSiteMode() === "production") return null;
  const t = PANEL_TONE[tone];
  // The slot sits on a photo mount, so it is opaque paper rather than a tint.
  const box = layout === "slot" ? t.box.replace("bg-(--need-bg)", "bg-paper-raised") : t.box;
  return (
    <div
      data-content-required="panel"
      className={cx(
        "flex flex-col justify-center gap-8 border-2 border-dashed",
        PANEL_LAYOUT[layout],
        box,
        className,
      )}
    >
      <p className={cx("text-12 tracking-need font-extrabold uppercase", t.title)}>{title}</p>
      <p className={cx("text-14 sm:text-15 leading-[1.4]", t.body)}>{children}</p>
    </div>
  );
}

/**
 * A labelled school fact: shows the value when supplied, otherwise the
 * preview-only content-required flag (nothing in production).
 * Value styling mirrors the flag's geometry with a solid rule and ink text —
 * V3 only shows the "required" state, so the supplied-value state is a
 * documented Phase 2A extrapolation.
 */
export function Fact({ label, value }: { label: string; value: string | null }) {
  if (value === null) return <ContentRequired label={label} />;
  return (
    <span className="rounded-thumb border-line text-14 leading-ui text-ink inline-flex items-center gap-8 border-[1.5px] bg-(--flag-bg) px-10 py-4 font-bold">
      {label}
      <b className="font-extrabold">{value}</b>
    </span>
  );
}

/** True when a fact should render at all (supplied, or preview build). */
export function showFact(value: string | null): boolean {
  return value !== null || getSiteMode() !== "production";
}
