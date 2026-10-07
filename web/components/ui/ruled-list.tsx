import { cx } from "@/lib/cx";

/**
 * V3 ruled list: 1.5px rules between items (top of each, bottom of the last).
 * `columns={2}` splits into two columns from 601px. Tones: default (line),
 * `warm` (Day Care, ink 16%), `inverse` (on navy/ink, paper 22%).
 */
const TONE = {
  default: "border-line",
  warm: "border-(--ink-16)",
  inverse: "border-(--paper-on-ink-22)",
} as const;

export function RuledList({
  items,
  columns = 1,
  tone = "default",
  className,
}: {
  items: readonly string[];
  columns?: 1 | 2;
  tone?: keyof typeof TONE;
  className?: string;
}) {
  return (
    <ul className={cx(columns === 2 && "sm:grid sm:grid-cols-2 sm:gap-x-28", className)}>
      {items.map((item) => (
        <li
          key={item}
          className={cx(
            "text-16 leading-list border-t-[1.5px] py-8 last:border-b-[1.5px]",
            TONE[tone],
            columns === 2 && "sm:nth-last-2:border-b-[1.5px]",
          )}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
