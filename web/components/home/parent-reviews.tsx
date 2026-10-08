import { Container, Section } from "@/components/ui/layout";
import { REVIEWS } from "@/content/home";
import type { ParentReview } from "@/content/media";
import { AnchorAlias } from "./anchor-alias";

/**
 * Parent reviews (project requirement F3). Renders ONLY reviews that are
 * approved and consented (filtered upstream in lib/server/public-media.ts).
 * With none, nothing is rendered in any mode (the legacy #testimonials anchor
 * is kept). No review/rating schema markup.
 *
 * V3 has no reviews section; the quote treatment reuses the V3 Day Care quote
 * style (Bricolage 650, ink rules) on a paper-raised band.
 */
export function ParentReviews({ reviews }: { reviews: readonly ParentReview[] }) {
  // Not part of the approved V3 homepage: render only with real, approved reviews.
  if (reviews.length === 0) return <AnchorAlias ids={["testimonials"]} />;
  return (
    <Section
      id="testimonials"
      band="paper-raised"
      labelledBy="reviews-heading"
      className="border-line border-t-[1.5px] py-72 sm:py-104"
    >
      <Container>
        <h2 id="reviews-heading" className="type-h2 mb-32 sm:mb-56">
          {REVIEWS.heading}
        </h2>
        <ul className="grid gap-x-56 gap-y-40 lg:grid-cols-2">
          {reviews.map((r) => (
            <li key={r.id}>
              <figure className="m-0 border-y-2 border-(--ink-18) py-28">
                <blockquote className="type-quote">
                  <p>{r.quote}</p>
                </blockquote>
                <figcaption className="text-16 mt-18 font-bold">
                  {r.displayName}
                  {r.context && <span className="text-ink-soft font-regular">, {r.context}</span>}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
