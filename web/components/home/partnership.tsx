import { Container, Section } from "@/components/ui/layout";
import { RuledList } from "@/components/ui/ruled-list";
import { PARTNERSHIP } from "@/content/home";

/** V3 Parent Partnership (V3-DESIGN-SOURCE §8.11): the equation heading. */
export function Partnership() {
  return (
    <Section
      id="partnership"
      band="paper-raised"
      labelledBy="partnership-heading"
      className="border-line border-t-[1.5px] py-72 sm:py-104"
    >
      <Container className="grid gap-y-26 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center lg:gap-x-72">
        <h2 id="partnership-heading" className="type-equation">
          Parents <span className="text-marigold-display">+</span> Teachers
          <br />
          <span className="text-marigold-display">=</span> Stronger foundations
        </h2>
        <div>
          <p className="type-lead">{PARTNERSHIP.lead}</p>
          <RuledList items={PARTNERSHIP.items} columns={2} className="mt-22" />
          <p className="type-accent text-20 mt-22">{PARTNERSHIP.closing}</p>
        </div>
      </Container>
    </Section>
  );
}
