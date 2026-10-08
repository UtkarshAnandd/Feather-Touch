import { NeedPanel } from "@/components/ui/content-required";
import { Container, Section } from "@/components/ui/layout";
import { RuledList } from "@/components/ui/ruled-list";
import { SAFETY } from "@/content/home";

/**
 * V3 Safety (V3-DESIGN-SOURCE §8.10) — the ONLY navy band. The school's own
 * day-to-day safety practices are still required, so that block is a
 * preview-only required panel.
 */
export function Safety() {
  return (
    <Section id="safety" band="navy" labelledBy="safety-heading" className="py-72 sm:py-112">
      <Container className="grid gap-y-40 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start lg:gap-x-80">
        <div>
          <h2 id="safety-heading" className="type-h2 max-w-[13em]">
            {SAFETY.heading}
          </h2>
          <p className="text-17 sm:text-20 mt-24 max-w-[34em] leading-[1.55] text-(--paper-on-ink-88)">
            {SAFETY.lead}
          </p>
          <p className="text-18 mt-22 max-w-[30em] text-(--paper-on-ink-88) italic">{SAFETY.note}</p>
        </div>
        <div>
          <h3 className="type-h4 text-paper">{SAFETY.topicsHeading}</h3>
          <RuledList items={SAFETY.topics} columns={2} tone="inverse" className="mt-14" />
          <NeedPanel tone="inverse" title="Content required from Feather Touch" className="mt-32">
            {SAFETY.practicesNeed}
          </NeedPanel>
        </div>
      </Container>
    </Section>
  );
}
