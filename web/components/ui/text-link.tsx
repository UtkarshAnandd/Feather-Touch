import type { ComponentProps } from "react";
import { cx } from "@/lib/cx";
import { Icon } from "./icon";

/** V3 text link (`.lnk`): bold, 2.5px leaf underline that turns marigold on hover, trailing arrow. */
export function TextLink({ className, children, ...rest }: ComponentProps<"a">) {
  return (
    <a
      className={cx(
        "border-leaf text-ink hover:border-marigold inline-flex items-center gap-8 border-b-[2.5px] pb-3 font-bold whitespace-nowrap no-underline",
        className,
      )}
      {...rest}
    >
      {children}
      <Icon name="arrow-right" size={18} />
    </a>
  );
}
