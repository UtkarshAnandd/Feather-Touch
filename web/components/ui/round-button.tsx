import type { ComponentProps } from "react";
import { cx } from "@/lib/cx";
import { Icon, type IconName } from "./icon";

/**
 * Round control (slideshow prev/next/pause): 44px on phones, 48px from 601px,
 * paper-raised with a soft ink ledge (V3-DESIGN-SOURCE §7). `label` is required
 * because the control is icon-only.
 */
export function RoundButton({
  icon,
  label,
  className,
  type = "button",
  ...rest
}: { icon: IconName; label: string } & Omit<ComponentProps<"button">, "children" | "aria-label">) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cx(
        "bg-paper-raised text-ink grid size-44 flex-none cursor-pointer place-items-center rounded-full border-[1.5px] border-(--ink-20) p-0 sm:size-48",
        "shadow-round ease-standard transition-[transform,box-shadow] duration-(--dur-press)",
        "hover:shadow-round-hover active:shadow-round-active hover:-translate-y-1 active:translate-y-2",
        "disabled:opacity-45",
        className,
      )}
      {...rest}
    >
      <Icon name={icon} />
    </button>
  );
}
