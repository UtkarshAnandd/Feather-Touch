import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/**
 * Hand-made marks (V3-DESIGN-SOURCE §9). Each is allowed in ONE place only:
 * - BrushUnderline "display": under "happy." in the hero.
 * - BrushUnderline "nav" / "menu": under the current navigation item.
 * - MarkerStrike: the Why statement.
 * The words stay real text; the marks are decorative.
 */
const BRUSH = {
  display: "after:-right-[6%] after:-bottom-[0.03em] after:-left-[4%] after:h-[0.22em]",
  // Prototype offsets are relative to the <a> (padding 10px 2px): left −6,
  // right −8, bottom 5. Re-based onto the inner text span: −8 / −10 / −5.
  nav: "after:-right-10 after:-bottom-5 after:-left-8 after:h-11",
  menu: "after:-right-[8%] after:-bottom-2 after:-left-[5%] after:h-11",
} as const;

export function BrushUnderline({
  placement,
  className,
  children,
}: {
  placement: keyof typeof BRUSH;
  className?: string;
  children: ReactNode;
}) {
  return <span className={cx("brush-underlay inline-block", BRUSH[placement], className)}>{children}</span>;
}

export function MarkerStrike({ children }: { children: ReactNode }) {
  return (
    <span className="text-ink-soft relative whitespace-nowrap">
      {children}
      <svg
        viewBox="0 0 200 20"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
        className="text-marigold absolute top-1/2 -left-[2%] -mt-[0.17em] h-[0.42em] w-[104%] overflow-visible"
      >
        {["M2 12 C 40 5, 90 16, 140 9 S 188 7, 198 11", "M8 15 C 60 10, 120 18, 194 12"].map((d) => (
          <path
            key={d}
            d={d}
            fill="none"
            stroke="currentColor"
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
    </span>
  );
}
