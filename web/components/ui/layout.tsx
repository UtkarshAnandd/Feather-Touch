import type { ComponentProps, ReactNode } from "react";
import { cx } from "@/lib/cx";

/** `.wrap`: 1280px max (gutters included), 40px gutters → 16px below 601px. */
export function Container({ className, ...rest }: ComponentProps<"div">) {
  return <div className={cx("max-w-page mx-auto w-full px-16 sm:px-40", className)} {...rest} />;
}

/**
 * Section band. Each V3 section is a full-width band with its own colour and
 * vertical padding (V3-DESIGN-SOURCE §5); pass padding via `className`.
 * `labelledBy` is required: every section is labelled by its heading.
 * Bands clip horizontal overflow, as the prototype's root did
 * (`.ft{overflow:hidden}`): rotated paper mounts may bleed to the screen edge
 * but must never cause horizontal scrolling. (`clip`, unlike `hidden`, does
 * not create a scroll container, so the School Life strip can still scroll.)
 */
const BAND = {
  paper: "bg-paper",
  "paper-raised": "bg-paper-raised",
  kraft: "bg-kraft",
  "marigold-tint": "bg-marigold-tint",
  "leaf-tint": "bg-leaf-tint",
  navy: "on-dark bg-navy text-paper", // Safety ONLY
  ink: "on-dark bg-ink text-paper", // Footer ONLY
} as const;

export type Band = keyof typeof BAND;

export function Section({
  band = "paper",
  labelledBy,
  className,
  children,
  ...rest
}: { band?: Band; labelledBy: string; children: ReactNode } & Omit<
  ComponentProps<"section">,
  "aria-labelledby"
>) {
  return (
    <section aria-labelledby={labelledBy} className={cx("overflow-x-clip", BAND[band], className)} {...rest}>
      {children}
    </section>
  );
}

/** Raised paper surface: header bar, shelves, form card (1.5px line border). */
const SURFACE_RADIUS = { shelf: "rounded-shelf", photo: "rounded-photo" } as const;

export function PaperSurface({
  radius = "shelf",
  className,
  ...rest
}: { radius?: keyof typeof SURFACE_RADIUS } & ComponentProps<"div">) {
  return (
    <div
      className={cx("border-line bg-paper-raised border-[1.5px]", SURFACE_RADIUS[radius], className)}
      {...rest}
    />
  );
}
