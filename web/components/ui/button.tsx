import type { ComponentProps, ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Icon } from "./icon";

/**
 * V3 buttons (V3-DESIGN-SOURCE §7).
 * - primary: marigold fill, ink text, 4px marigold-ledge bottom edge.
 * - secondary: transparent with a 2px inset ink outline.
 * - size md = 56px high; sm = 48px (header CTA). `block` = full width.
 * Hash/route links use <ButtonLink>; actions use <Button>.
 */
type Variant = "primary" | "secondary";
type Size = "md" | "sm";

type Style = { variant?: Variant; size?: Size; block?: boolean; arrow?: boolean };

const BASE =
  "inline-flex items-center gap-10 rounded-control border-0 font-body font-bold leading-none whitespace-nowrap no-underline cursor-pointer " +
  "transition-[transform,box-shadow,background-color] duration-(--dur-press) ease-standard " +
  "disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none disabled:transform-none " +
  "aria-disabled:cursor-not-allowed aria-disabled:opacity-45 aria-disabled:shadow-none aria-disabled:transform-none";

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-marigold text-ink shadow-ledge " +
    "hover:bg-marigold-hover hover:-translate-y-1 hover:shadow-ledge-hover " +
    "active:translate-y-3 active:shadow-ledge-active",
  secondary:
    "bg-transparent text-ink shadow-outline hover:bg-(--ink-07) active:bg-(--ink-13) active:translate-y-1",
};

const SIZE: Record<Size, string> = {
  md: "h-56 px-24 text-17",
  sm: "h-48 px-18 text-16",
};

export function buttonClasses(
  { variant = "primary", size = "md", block = false }: Style = {},
  className?: string,
) {
  return cx(BASE, VARIANT[variant], SIZE[size], block && "w-full justify-center", className);
}

function Content({ children, arrow }: { children: ReactNode; arrow?: boolean }) {
  return (
    <>
      {children}
      {arrow && <Icon name="arrow-right" size={20} />}
    </>
  );
}

export function Button({
  variant,
  size,
  block,
  arrow,
  className,
  children,
  type = "button",
  ...rest
}: Style & ComponentProps<"button">) {
  return (
    <button type={type} className={buttonClasses({ variant, size, block }, className)} {...rest}>
      <Content arrow={arrow}>{children}</Content>
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  block,
  arrow,
  className,
  children,
  ...rest
}: Style & ComponentProps<"a">) {
  return (
    <a className={buttonClasses({ variant, size, block }, className)} {...rest}>
      <Content arrow={arrow}>{children}</Content>
    </a>
  );
}
