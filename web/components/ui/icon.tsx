import { cx } from "@/lib/cx";

/**
 * V3 icon set (paths from reference/homepage.html): 24-unit viewBox, 2.4 stroke,
 * round caps/joins, currentColor. Always decorative — the control carries the label.
 */
const PATHS = {
  "arrow-right": ["M4 12h15", "M13 6l6 6-6 6"],
  "chevron-left": ["M15 5l-7 7 7 7"],
  "chevron-right": ["M9 5l7 7-7 7"],
  menu: ["M4 7h16", "M4 12h16", "M4 17h16"],
  close: ["M6 6l12 12", "M18 6L6 18"],
  plus: ["M12 5v14", "M5 12h14"],
  pause: ["M9 6v12", "M15 6v12"],
} as const;

export type IconName = keyof typeof PATHS | "play";

const SIZE = { 18: "size-18", 20: "size-20", 22: "size-22" } as const;

export function Icon({
  name,
  size = 22,
  className,
}: {
  name: IconName;
  size?: keyof typeof SIZE;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={cx("block flex-none", SIZE[size], className)}
    >
      {name === "play" ? (
        <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
      ) : (
        PATHS[name].map((d) => (
          <path
            key={d}
            d={d}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))
      )}
    </svg>
  );
}
