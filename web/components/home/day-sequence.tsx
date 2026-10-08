import { Fact, showFact } from "@/components/ui/content-required";
import { Container, Section } from "@/components/ui/layout";
import { DAY } from "@/content/home";
import { AnchorAlias } from "./anchor-alias";

/**
 * V3 "A day at Feather Touch" (V3-DESIGN-SOURCE §8.9): nine numbered marigold
 * circles on a dashed line — a row at ≥1200px, a vertical list below (the row
 * labels need ~120px columns). Times are not supplied yet.
 */
export function DaySequence() {
  return (
    <Section id="day" labelledBy="day-heading" className="py-72 sm:py-112">
      <AnchorAlias ids={["routine"]} />
      <Container>
        <div className="nav:mx-auto nav:mb-56 nav:max-w-[760px] nav:text-center mb-32">
          <h2 id="day-heading" className="type-h2">
            {DAY.heading}
          </h2>
          <p className="type-lead nav:mx-auto mt-18">{DAY.lead}</p>
          {showFact(DAY.timings) && (
            <p className="mt-14">
              <Fact label="Timings" value={DAY.timings} />
            </p>
          )}
        </div>
        <ol className="nav:grid-cols-9 nav:gap-x-14 nav:before:top-23 nav:before:right-60 nav:before:bottom-auto nav:before:left-24 nav:before:border-t-[2.5px] nav:before:border-l-0 relative grid grid-cols-1 before:absolute before:top-30 before:bottom-30 before:left-23 before:border-l-[2.5px] before:border-dashed before:border-(--ink-40)">
          {DAY.steps.map((step, i) => (
            <li
              key={step}
              className="nav:block nav:py-0 relative grid grid-cols-[48px_1fr] items-center gap-x-18 py-7"
            >
              <span
                aria-hidden="true"
                className="bg-marigold shadow-ledge-sm type-day-number text-ink grid size-48 place-items-center rounded-full"
              >
                {i + 1}
              </span>
              <span className="text-17 nav:mt-16 nav:text-16 block leading-[1.3] font-bold">{step}</span>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
