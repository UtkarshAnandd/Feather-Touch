"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { ENQUIRE_CTA, PRIMARY_NAV, VISIT_CTA } from "@/content/shell";
import { MenuNavLink } from "./nav-link";

/** Matches --breakpoint-nav: the full header nav replaces the menu from here. */
const DESKTOP_NAV_QUERY = "(min-width: 75rem)";
export const MOBILE_MENU_ID = "mobile-menu";

type SavedOverflow = { current: string | null };

function lockScroll(saved: SavedOverflow) {
  if (saved.current !== null) return;
  saved.current = document.documentElement.style.overflow;
  document.documentElement.style.overflow = "hidden";
}

// Idempotent: runs synchronously on the menu's own close paths and again from
// the (asynchronous) native `close` event, which is the only signal for Escape.
function unlockScroll(saved: SavedOverflow) {
  if (saved.current === null) return;
  document.documentElement.style.overflow = saved.current;
  saved.current = null;
}

/**
 * V3 mobile menu (V3-DESIGN-SOURCE §8.1; m_nav.jpg).
 *
 * A real <button> (aria-expanded / aria-controls) opens a full-screen modal
 * <dialog>. The native modal dialog makes the rest of the page inert, so Tab
 * stays inside the menu. Focus moves to Close on open; Escape or Close closes
 * it and returns focus to the trigger. Page scrolling is locked while open.
 * There is no open/close animation (none is specified), so reduced motion
 * needs no special case.
 *
 * `brand` and `contact` arrive pre-rendered from the server header (the
 * content-required flag is preview-only and decided on the server).
 */
export function MobileMenu({ brand, contact }: { brand: ReactNode; contact?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(true);
  const savedOverflow = useRef<string | null>(null);

  function openMenu() {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    lockScroll(savedOverflow);
    dialog.showModal();
    restoreFocus.current = true;
    setOpen(true);
    closeRef.current?.focus();
  }

  function closeMenu({ returnFocus }: { returnFocus: boolean }) {
    restoreFocus.current = returnFocus;
    unlockScroll(savedOverflow);
    dialogRef.current?.close();
  }

  // Fires for Close, Escape (native cancel → close) and link navigation.
  function handleClosed() {
    unlockScroll(savedOverflow);
    setOpen(false);
    if (restoreFocus.current) triggerRef.current?.focus();
  }

  // If the viewport grows to the desktop layout while open, the trigger is
  // hidden; close without trying to restore focus to it.
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_NAV_QUERY);
    const onChange = () => {
      const dialog = dialogRef.current;
      if (!mq.matches || !dialog?.open) return;
      restoreFocus.current = false;
      unlockScroll(savedOverflow);
      dialog.close();
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Never leave the page scroll-locked if the component unmounts while open.
  useEffect(() => {
    const saved = savedOverflow;
    return () => {
      if (saved.current !== null) document.documentElement.style.overflow = saved.current;
    };
  }, []);

  const barButton =
    "inline-flex h-48 flex-none cursor-pointer items-center gap-8 rounded-control border-0 bg-paper-deep px-14 text-15 font-bold text-ink";

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={MOBILE_MENU_ID}
        aria-haspopup="dialog"
        onClick={openMenu}
        className={barButton}
      >
        <Icon name="menu" />
        <span>Menu</span>
      </button>

      <dialog
        ref={dialogRef}
        id={MOBILE_MENU_ID}
        aria-label="Menu"
        onClose={handleClosed}
        className="bg-paper text-ink m-0 size-full max-h-none max-w-none overflow-y-auto border-0 p-0 backdrop:bg-transparent"
      >
        <div className="max-w-page mx-auto flex min-h-full flex-col px-12 pt-10 pb-24 sm:px-40 sm:pt-16">
          <div className="rounded-shelf border-line bg-paper-raised sm:rounded-photo flex h-64 items-center gap-10 border-[1.5px] pr-8 pl-12 sm:h-80 sm:gap-24 sm:pr-14 sm:pl-20">
            {/* The logo link navigates too, so it closes the menu like the other links. */}
            <div
              className="contents"
              onClick={(e) => {
                if ((e.target as HTMLElement).closest("a")) closeMenu({ returnFocus: false });
              }}
            >
              {brand}
            </div>
            <button
              ref={closeRef}
              type="button"
              aria-label="Close menu"
              onClick={() => closeMenu({ returnFocus: true })}
              className={`${barButton} ml-auto`}
            >
              <Icon name="close" />
              <span>Close</span>
            </button>
          </div>

          <nav aria-label="Main">
            <ul className="mt-18 px-6">
              {PRIMARY_NAV.map((item) => (
                <li key={item.href + item.label} className="border-line border-b-[1.5px]">
                  <MenuNavLink item={item} onNavigate={() => closeMenu({ returnFocus: false })} />
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto flex flex-col gap-14 px-6 pt-32">
            <ButtonLink href={VISIT_CTA.href} block arrow onClick={() => closeMenu({ returnFocus: false })}>
              {VISIT_CTA.label}
            </ButtonLink>
            <ButtonLink
              href={ENQUIRE_CTA.href}
              variant="secondary"
              block
              onClick={() => closeMenu({ returnFocus: false })}
            >
              {ENQUIRE_CTA.label}
            </ButtonLink>
          </div>
          {contact && <p className="mt-16 px-6">{contact}</p>}
        </div>
      </dialog>
    </>
  );
}
