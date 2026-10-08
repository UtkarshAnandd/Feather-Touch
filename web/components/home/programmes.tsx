import { Fact, showFact } from "@/components/ui/content-required";
import { Icon } from "@/components/ui/icon";
import { Container, Section } from "@/components/ui/layout";
import { RuledList } from "@/components/ui/ruled-list";
import { PROGRAMMES_SECTION, formatAges, type Programme } from "@/content/home";
import { cx } from "@/lib/cx";

/**
 * V3 Programmes (V3-DESIGN-SOURCE §8.5).
 * - ≥1200px: four-step staircase (block heights 170/206/242/278, leaf-tint →
 *   leaf, ruler ticks, ink baseline) with the full focus-area list below.
 * - Below: blocks at 74/82/91/100% width; focus areas, age and timings sit in a
 *   native <details>, closed by default, with a 48px summary.
 * Ages are the client-confirmed ranges; timings are not supplied yet.
 * The prototype's "More about …" links are omitted until programme pages exist.
 */
const STEP = [
  { block: "bg-leaf-tint nav:mt-108 nav:h-170", width: "w-[74%]" },
  { block: "bg-leaf-3 nav:mt-72 nav:h-206", width: "w-[82%]" },
  { block: "bg-leaf-2 nav:mt-36 nav:h-242", width: "w-[91%]" },
  { block: "bg-leaf nav:mt-0 nav:h-278", width: "w-full" },
] as const;

function Flags({ programme, className }: { programme: Programme; className?: string }) {
  const age = programme.ages ? formatAges(programme.ages) : null;
  return (
    <div className={cx("flex flex-wrap items-start gap-8", className)}>
      {showFact(age) && <Fact label="Age group" value={age} />}
      {showFact(programme.timings) && <Fact label="Timings" value={programme.timings} />}
    </div>
  );
}

export function Programmes({ programmes }: { programmes: readonly Programme[] }) {
  return (
    <Section id="programmes" labelledBy="programmes-heading" className="py-72 sm:pt-120 sm:pb-112">
      <Container>
        <div className="mb-32 grid gap-y-14 lg:mb-56 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-x-56">
          <h2 id="programmes-heading" className="type-h2">
            {PROGRAMMES_SECTION.heading}
          </h2>
          <p className="type-lead">{PROGRAMMES_SECTION.lead}</p>
        </div>

        <ol className="nav:grid nav:grid-cols-4 nav:gap-x-20 nav:gap-y-0 nav:before:absolute nav:before:top-278 nav:before:-right-10 nav:before:-left-10 nav:before:h-[2.5px] nav:before:rounded-[2px] nav:before:bg-ink relative grid gap-y-22">
          {programmes.map((p, i) => {
            const step = STEP[i] ?? STEP[STEP.length - 1]!;
            return (
              <li key={p.slug} className="flex flex-col">
                <div
                  className={cx(
                    "ruler-ticks nav:w-full nav:rounded-[14px_14px_3px_3px] nav:py-18 nav:pr-20 nav:pl-36 rounded-control py-16 pr-16 pl-32",
                    step.block,
                    step.width,
                  )}
                >
                  <p className="type-accent text-15 leading-none">Step {i + 1}</p>
                  <h3 className="type-step-name mt-10">{p.name}</h3>
                  <p className="text-16 nav:text-17 mt-10 max-w-[14em] leading-[1.3] font-bold">
                    {p.tagline}
                  </p>
                </div>

                {/* Desktop: full list under the staircase */}
                <div className="nav:block hidden px-2 pt-28">
                  <p className="text-14 text-ink-soft mb-8 font-extrabold">Focus areas</p>
                  <RuledList items={p.focusAreas} />
                  <Flags programme={p} className="mt-18 flex-col" />
                </div>

                {/* Below 1200px: details closed by default */}
                <details className="group nav:hidden">
                  <summary className="border-line text-16 flex min-h-48 cursor-pointer list-none items-center justify-between gap-12 border-b-[1.5px] px-2 font-extrabold [&::-webkit-details-marker]:hidden">
                    <span>{p.focusAreas.length} focus areas, age and timings</span>
                    <span className="bg-paper-deep grid size-34 flex-none place-items-center rounded-full transition-transform duration-200 group-open:rotate-45">
                      <Icon name="plus" size={20} />
                    </span>
                  </summary>
                  <div className="px-2 pt-14 pb-4">
                    <p className="text-16 leading-[1.5]">
                      <b className="font-extrabold">Focus areas:</b> {p.focusAreas.join(", ")}
                    </p>
                    <Flags programme={p} className="mt-12" />
                  </div>
                </details>
              </li>
            );
          })}
        </ol>
      </Container>
    </Section>
  );
}
