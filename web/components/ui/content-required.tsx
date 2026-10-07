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

/** Dashed panel marking where a real asset or block of content will go. */
export function NeedPanel({
  title = "Asset required",
  tone = "default",
  className,
  children,
}: {
  title?: string;
  tone?: keyof typeof PANEL_TONE;
  className?: string;
  children: ReactNode;
}) {
  if (getSiteMode() === "production") return null;
  const t = PANEL_TONE[tone];
  return (
    <div
      data-content-required="panel"
      className={cx(
        "rounded-control flex flex-col justify-center gap-8 border-2 border-dashed px-20 py-18",
        t.box,
        className,
      )}
    >
      <p className={cx("text-12 tracking-need font-extrabold uppercase", t.title)}>{title}</p>
      <p className={cx("text-14 sm:text-15 leading-[1.4]", t.body)}>{children}</p>
    </div>
  );
}
