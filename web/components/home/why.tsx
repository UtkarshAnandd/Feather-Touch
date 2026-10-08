import { Container, Section } from "@/components/ui/layout";
import { MarkerStrike } from "@/components/ui/marks";
import { WHY } from "@/content/home";
import { AnchorAlias } from "./anchor-alias";

/**
 * V3 "Our belief" (V3-DESIGN-SOURCE §8.4): the school's own statement with the
 * marker strike over "pressure or rote learning". The prototype's "About
 * Feather Touch" link is omitted until an About page exists (it would only
 * point back at this section).
 */
export function Why() {
  return (
    <Section
      id="why"
      band="paper-raised"
      labelledBy="why-heading"
      className="border-line border-y-[1.5px] pt-72 pb-64 sm:pt-120 sm:pb-112"
    >
      <AnchorAlias ids={["about", "learning"]} />
      <Container>
        <h2 id="why-heading" className="sr-only">
          {WHY.hiddenHeading}
        </h2>
        <p className="type-statement max-w-[1060px]">
          {WHY.statementBefore} <MarkerStrike>{WHY.statementStruck}</MarkerStrike>
          {WHY.statementAfter}
        </p>
        <p className="text-17 sm:text-19 text-ink-soft mt-30 max-w-[40em] sm:mt-48">{WHY.lead}</p>
      </Container>
    </Section>
  );
}
