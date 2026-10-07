"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEventHandler } from "react";
import { BrushUnderline } from "@/components/ui/marks";
import { Icon } from "@/components/ui/icon";
import type { NavItem } from "@/content/shell";
import { cx } from "@/lib/cx";

/**
 * A primary navigation link. Only a route link (no hash) can be the current
 * page; it gets aria-current="page" and the lime brush underlay.
 */
function useIsCurrent(href: string) {
  const pathname = usePathname();
  return !href.includes("#") && href === pathname;
}

function Anchor({
  item,
  className,
  current,
  onClick,
  children,
}: {
  item: NavItem;
  className: string;
  current: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  children: React.ReactNode;
}) {
  const shared = { className, onClick, "aria-current": current ? ("page" as const) : undefined };
  return item.href === "/" ? (
    <Link href="/" {...shared}>
      {children}
    </Link>
  ) : (
    <a href={item.href} {...shared}>
      {children}
    </a>
  );
}

/** Desktop header link: 16px bold; brush underlay when current. */
export function HeaderNavLink({ item }: { item: NavItem }) {
  const current = useIsCurrent(item.href);
  return (
    <Anchor
      item={item}
      current={current}
      className="text-16 text-ink relative z-0 block px-2 py-10 font-bold whitespace-nowrap no-underline"
    >
      {current ? <BrushUnderline placement="nav">{item.label}</BrushUnderline> : item.label}
    </Anchor>
  );
}

/** Mobile menu row: Bricolage 28px, 60px min height, chevron. */
export function MenuNavLink({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const current = useIsCurrent(item.href);
  return (
    <Anchor
      item={item}
      current={current}
      onClick={onNavigate}
      className={cx("type-menu-item text-ink flex min-h-60 items-center justify-between no-underline")}
    >
      {current ? <BrushUnderline placement="menu">{item.label}</BrushUnderline> : <span>{item.label}</span>}
      <Icon name="chevron-right" />
    </Anchor>
  );
}
