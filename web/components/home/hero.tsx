import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/layout";
import { BrushUnderline } from "@/components/ui/marks";
import { HERO } from "@/content/home";
import type { SlideshowSlide } from "@/lib/slideshow";
import { AnchorAlias } from "./anchor-alias";
import { HeroSlideshow } from "./hero-slideshow";

/**
 * V3 hero (V3-DESIGN-SOURCE §8.2). Desktop (≥1200px): copy left, 472px 4:5
 * slideshow right. Below: copy → CTAs → "Swipe to look around" (phones) →
 * slideshow. Line breaks follow the prototype's desktop/mobile sets.
 */
export function Hero({ slides }: { slides: readonly SlideshowSlide[] }) {
  const hasSlides = slides.length > 0;
  return (
    <Section id="home" labelledBy="hero-heading" className="pt-28 pb-64 sm:pt-40 sm:pb-104">
      <AnchorAlias ids={["top"]} />
      <Container
        className={
          hasSlides ? "nav:grid nav:grid-cols-[minmax(0,1fr)_472px] nav:items-center nav:gap-x-72" : undefined
        }
      >
        <div>
          <h1 id="hero-heading" className="type-hero">
            We believe
            <br className="sm:hidden" /> children
            <br className="max-sm:hidden" /> learn
            <br className="sm:hidden" /> best
            <br className="max-sm:hidden" />{" "}
            <span className="text-marigold-display">
              when
              <br className="sm:hidden" /> they are{" "}
              <BrushUnderline placement="display">{HERO.headingBrushed}</BrushUnderline>
            </span>
          </h1>
          <p className="text-17 sm:text-20 text-ink-soft mt-18 max-w-[29em] leading-[1.55] sm:mt-28">
            {HERO.lead}
          </p>
          <div className="mt-26 flex flex-col gap-14 sm:mt-36 sm:flex-row sm:flex-wrap">
            <ButtonLink href={HERO.primaryCta.href} arrow className="max-sm:w-full max-sm:justify-center">
              {HERO.primaryCta.label}
            </ButtonLink>
            <ButtonLink
              href={HERO.secondaryCta.href}
              variant="secondary"
              className="max-sm:w-full max-sm:justify-center"
            >
              {HERO.secondaryCta.label}
            </ButtonLink>
          </div>
          {hasSlides && slides.length > 1 && (
            <p className="type-accent text-16 mt-30 flex items-center gap-8 pl-4 sm:hidden">
              {HERO.swipeNote}
              <svg
                viewBox="0 0 28 46"
                aria-hidden="true"
                focusable="false"
                className="-mb-22 block h-46 w-28 overflow-visible"
              >
                {["M16 3 C 4 15, 24 25, 13 40", "M5 33 L13 42 L21 34"].map((d) => (
                  <path
                    key={d}
                    d={d}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
              </svg>
            </p>
          )}
        </div>
        {hasSlides && (
          <div className="nav:mt-0 nav:mx-0 mt-26 w-full sm:mx-auto sm:mt-56 sm:max-w-[472px]">
            <HeroSlideshow label={HERO.carouselLabel} slides={slides} />
          </div>
        )}
      </Container>
    </Section>
  );
}
