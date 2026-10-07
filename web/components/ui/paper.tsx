import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/**
 * Paper-craft vocabulary (V3-DESIGN-SOURCE §7, §9). Use ONLY where the design
 * places them: mounts behind photos/posters, tape captions, poster tape strips.
 */

const MOUNT_TONE = {
  leaf: "bg-leaf",
  marigold: "bg-marigold",
  "marigold-soft": "bg-marigold-soft",
} as const;

export type MountTone = keyof typeof MOUNT_TONE;

/**
 * A coloured sheet rotated behind a photo or poster. Place inside a `relative`
 * box. `photo` inset = -12/-15/-15/-12 (phones -8/-9/-9/-8); `even` = -12 all
 * round (posters); `art` = -16 (phones -10). Rotation is per-placement (1.5–3°).
 */
const MOUNT_INSET = {
  photo: "-top-8 -right-9 -bottom-9 -left-8 sm:-top-12 sm:-right-15 sm:-bottom-15 sm:-left-12",
  even: "-inset-12",
  art: "-inset-10 sm:-inset-16",
} as const;

export function PaperMount({
  tone,
  rotate,
  inset = "photo",
  className,
}: {
  tone: MountTone;
  rotate: number;
  inset?: keyof typeof MOUNT_INSET;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "rounded-paper ease-standard absolute transition-[background-color,transform] duration-700",
        MOUNT_TONE[tone],
        MOUNT_INSET[inset],
        className,
      )}
      style={{ transform: `rotate(${rotate}deg)` }}
    />
  );
}

/** Photo on a paper mount: 22px-radius frame above a rotated coloured sheet. */
export function MountedPhoto({
  tone,
  rotate,
  className,
  frameClassName,
  children,
}: {
  tone: MountTone;
  rotate: number;
  className?: string;
  frameClassName?: string;
  children: ReactNode;
}) {
  return (
    <div className={cx("relative", className)}>
      <PaperMount tone={tone} rotate={rotate} />
      <div className={cx("rounded-photo bg-paper-deep absolute inset-0 overflow-hidden", frameClassName)}>
        {children}
      </div>
    </div>
  );
}

const TAPE_TONE = {
  paper: "bg-paper-raised",
  leaf: "bg-leaf-3",
  "marigold-soft": "bg-marigold-soft",
} as const;

/** Paper-tape caption/eyebrow: Fredoka, ragged edges, rotated −2°. */
export function Tape({
  tone = "paper",
  as: Tag = "span",
  className,
  children,
}: {
  tone?: keyof typeof TAPE_TONE;
  as?: "span" | "p" | "figcaption";
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={cx(
        "tape-edge type-accent text-15 leading-tape text-ink inline-block -rotate-2 px-15 pt-7 pb-8",
        TAPE_TONE[tone],
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** Translucent tape strip across the top of a pinned poster (decorative). */
export function TapeStrip({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "tape-strip-edge absolute -top-26 left-1/2 z-2 -ml-52 h-30 w-104 -rotate-4 bg-(--tape-strip)",
        className,
      )}
    />
  );
}
