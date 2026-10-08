"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { PaperMount, Tape, type MountTone } from "@/components/ui/paper";
import { RoundButton } from "@/components/ui/round-button";
import { cx } from "@/lib/cx";
import type { SlideshowSlide } from "@/lib/slideshow";

/**
 * V3 hero slideshow (V3-DESIGN-SOURCE §8.3), ported from the approved
 * reference/slideshow-behaviour.js and generalised from 3 to N slides (6–7).
 *
 * - 5s per slide (client requirement; the V3 prototype used 6s), 0.8s
 *   crossfade, 1.025 → 1 zoom over 6.5s on the active slide.
 * - Any manual navigation (tab, arrows, swipe) restarts the 5s timer.
 * - Swipe: horizontal drag > 40px on the frame (touch-action: pan-y).
 * - prefers-reduced-motion: starts paused (until the user presses play), no
 *   transitions, static full bar.
 * - Pause is always available; a polite live region announces the photo only
 *   while paused (never during autoplay).
 * - Autoplay also waits while the tab is hidden.
 *
 * Controls row by slide count (the slideshow is data-driven, up to 7 slides):
 * - ≤3 slides: the approved V3 row — thumbnail, tab word and progress bar per
 *   slide, plus pause.
 * - >3 slides, ≥601px: compact thumbnail tabs (no visible words — seven do not
 *   fit the 472px V3 column; ≥44px targets).
 * Tab words always come from data (`tabLabel`) and are part of each tab's
 * accessible name. Placeholder slots (preview only) carry data-placeholder.
 * - >3 slides, <601px: one progress segment per slide (decorative) plus pause;
 *   navigation is the 44px previous/next buttons, swipe and keyboard.
 */

const INTERVAL_MS = 5000;
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/** prefers-reduced-motion as external state (server render assumes motion OK). */
function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}
const SWIPE_PX = 40;

// Mount cycle from the prototype (.m0/.m1/.m2), repeated for slides 4–7.
const MOUNTS: readonly { tone: MountTone; rotate: number }[] = [
  { tone: "leaf", rotate: -2.6 },
  { tone: "marigold", rotate: 1.8 },
  { tone: "marigold-soft", rotate: -1.4 },
];

function ProgressFill({ cycle, paused }: { cycle: number; paused: boolean }) {
  return (
    <span
      key={cycle}
      className={cx(
        "bg-marigold progress-run block h-full w-0 rounded-[3px] motion-reduce:w-full motion-reduce:[animation:none]",
        paused && "[animation-play-state:paused]",
      )}
    />
  );
}

export function HeroSlideshow({ slides, label }: { slides: readonly SlideshowSlide[]; label: string }) {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  // The user's explicit choice wins; until then, reduced motion means paused.
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const paused = userPaused ?? reducedMotion;
  // Incremented on every (re)start so the timer and progress bar restart.
  const [cycle, setCycle] = useState(0);
  const startX = useRef<number | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const regionRef = useRef<HTMLDivElement>(null);

  // Marks the carousel as interactive once hydrated (used by E2E tests; no re-render).
  useEffect(() => {
    if (regionRef.current) regionRef.current.dataset.hydrated = "true";
  }, []);

  // Autoplay timer: re-armed whenever the slide, pause state or cycle changes.
  useEffect(() => {
    if (paused || count < 2) return;
    const t = window.setTimeout(() => {
      if (document.hidden) setCycle((c) => c + 1);
      else {
        setIndex((i) => (i + 1) % count);
        setCycle((c) => c + 1);
      }
    }, INTERVAL_MS);
    return () => window.clearTimeout(t);
  }, [index, paused, cycle, count]);

  if (count === 0) return null;
  const mount = MOUNTS[index % MOUNTS.length]!;
  const compact = count > 3;

  function go(n: number) {
    setIndex(((n % count) + count) % count);
    setCycle((c) => c + 1);
  }

  // Pausing freezes the bar where it is; resuming restarts the 5s cycle.
  function togglePause() {
    if (paused) setCycle((c) => c + 1);
    setUserPaused(!paused);
  }

  function onPointerDown(e: PointerEvent) {
    if (e.isPrimary) startX.current = e.clientX;
  }

  function onPointerUp(e: PointerEvent) {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (dx < -SWIPE_PX) go(index + 1);
    else if (dx > SWIPE_PX) go(index - 1);
  }

  // Left/Right arrows move between the slide tabs (and show that slide).
  function onTabKeyDown(e: KeyboardEvent, n: number) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (n + (e.key === "ArrowRight" ? 1 : -1) + count) % count;
    go(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div
      ref={regionRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className="relative w-full"
      data-paused={paused ? "true" : "false"}
    >
      <div className="relative aspect-[4/5] w-full">
        <PaperMount tone={mount.tone} rotate={mount.rotate} />
        <div
          className="rounded-photo bg-paper-deep absolute inset-0 touch-pan-y overflow-hidden select-none"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (startX.current = null)}
        >
          {slides.map((slide, i) => {
            const on = i === index;
            return (
              <figure
                key={slide.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}`}
                aria-hidden={!on}
                data-active={on ? "true" : "false"}
                data-placeholder={slide.isPlaceholder ? "true" : undefined}
                className={cx(
                  "ease-standard absolute inset-0 m-0 transition-opacity duration-800",
                  on ? "opacity-100" : "opacity-0",
                )}
              >
                <div
                  className={cx(
                    "absolute inset-0 transition-transform duration-[6500ms] ease-out",
                    on ? "scale-100" : "scale-[1.025]",
                  )}
                >
                  <Image
                    src={slide.image.src}
                    alt={slide.alt}
                    fill
                    sizes="(min-width: 37.5625rem) 472px, calc(100vw - 32px)"
                    {...(slide.image.blurDataURL
                      ? { placeholder: "blur" as const, blurDataURL: slide.image.blurDataURL }
                      : {})}
                    draggable={false}
                    style={{ objectFit: "cover", objectPosition: slide.focal ?? "50% 50%" }}
                    {...(i === 0
                      ? { loading: "eager" as const, fetchPriority: "high" as const }
                      : { loading: "lazy" as const })}
                  />
                </div>
                <Tape
                  as="figcaption"
                  size="responsive"
                  className="absolute bottom-12 left-58 z-2 max-w-[calc(100%-58px-114px)] sm:bottom-16 sm:left-68 sm:max-w-[calc(100%-68px-134px)]"
                >
                  {slide.caption}
                </Tape>
              </figure>
            );
          })}

          <p
            aria-hidden="true"
            className="bg-ink text-paper type-accent rounded-chip text-13 sm:text-14 absolute bottom-14 left-10 z-3 px-10 pt-5 pb-6 leading-[1.2] font-semibold whitespace-nowrap sm:bottom-18 sm:left-14"
          >
            {index + 1} / {count}
          </p>

          {count > 1 && (
            <div className="absolute right-10 bottom-10 z-3 flex gap-8 sm:right-14 sm:bottom-14 sm:gap-10">
              <RoundButton icon="chevron-left" label="Previous photo" onClick={() => go(index - 1)} />
              <RoundButton icon="chevron-right" label="Next photo" onClick={() => go(index + 1)} />
            </div>
          )}
        </div>
      </div>

      {count > 1 && (
        <div className="bg-paper-raised border-line rounded-shelf mt-24 flex items-center gap-4 border-[1.5px] p-6 sm:mt-28 sm:gap-6 sm:p-8">
          {compact && (
            <div
              aria-hidden="true"
              data-slide-segments=""
              className="flex flex-1 items-center gap-4 px-6 sm:hidden"
            >
              {slides.map((slide, i) => (
                <span
                  key={slide.id}
                  data-slide-segment=""
                  className="block h-5 flex-1 overflow-hidden rounded-[3px] bg-(--ink-13)"
                >
                  {i === index && <ProgressFill cycle={cycle} paused={paused} />}
                </span>
              ))}
            </div>
          )}
          {slides.map((slide, i) => {
            const on = i === index;
            return (
              <button
                key={slide.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                aria-current={on ? "true" : "false"}
                aria-label={`Show photo ${i + 1} of ${count}: ${slide.tabLabel}`}
                onClick={() => go(i)}
                onKeyDown={(e) => onTabKeyDown(e, i)}
                data-slide-tab=""
                className={cx(
                  "group rounded-field grid min-h-44 min-w-0 flex-1 cursor-pointer border-0 text-center",
                  "grid-cols-1 justify-items-center gap-y-6 px-4 py-6",
                  compact
                    ? "min-w-44 max-sm:hidden"
                    : "sm:grid-cols-[40px_minmax(0,1fr)] sm:grid-rows-[auto_5px] sm:justify-items-stretch sm:gap-x-10 sm:gap-y-7 sm:px-8 sm:text-left",
                  on ? "bg-paper-deep" : "bg-transparent",
                )}
              >
                <Image
                  src={slide.image.src}
                  alt=""
                  width={40}
                  height={50}
                  sizes="40px"
                  loading="lazy"
                  className={cx(
                    "rounded-thumb h-50 w-40 object-cover transition-[opacity,box-shadow] duration-200",
                    !compact && "sm:row-span-2",
                    on
                      ? "opacity-100 shadow-[0_0_0_2.5px_var(--color-ink)]"
                      : "opacity-62 group-hover:opacity-90",
                  )}
                />
                {!compact && (
                  <span
                    aria-hidden="true"
                    className="type-accent tracking-tab text-12 sm:text-14 leading-none font-semibold uppercase"
                  >
                    {slide.tabLabel}
                  </span>
                )}
                <span
                  aria-hidden="true"
                  className="block h-5 w-full overflow-hidden rounded-[3px] bg-(--ink-13)"
                >
                  {on && <ProgressFill cycle={cycle} paused={paused} />}
                </span>
              </button>
            );
          })}
          <RoundButton
            icon={paused ? "play" : "pause"}
            label={paused ? "Play slideshow" : "Pause slideshow"}
            onClick={togglePause}
            className="ml-4"
          />
        </div>
      )}

      <p className="sr-only" aria-live={paused ? "polite" : "off"}>
        Photo {index + 1} of {count}
      </p>
    </div>
  );
}
