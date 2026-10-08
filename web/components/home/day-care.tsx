import Image from "next/image";
import leafInHand from "@/assets/brand/mark-leaf-in-hand.png";
import { ButtonLink } from "@/components/ui/button";
import { Fact, NeedPanel, showFact } from "@/components/ui/content-required";
import { Container, Section } from "@/components/ui/layout";
import { PaperMount, Tape } from "@/components/ui/paper";
import { RuledList } from "@/components/ui/ruled-list";
import { DAY_CARE } from "@/content/home";
import { AnchorAlias } from "./anchor-alias";

/**
 * V3 Day Care (V3-DESIGN-SOURCE §8.6): marigold-tint band, tape eyebrow, 80px
 * heading, quote with the leaf-in-hand mark (Day Care ONLY), includes list,
 * and a photo slot + practical-details shelf. No Day Care photograph or details
 * have been supplied, so those render as preview-only required states.
 */
export function DayCare({ isPreview }: { isPreview: boolean }) {
  const details = DAY_CARE.details.filter((d) => showFact(d.value));
  return (
    <Section id="day-care" band="marigold-tint" labelledBy="day-care-heading" className="py-72 sm:py-104">
      <AnchorAlias ids={["daycare"]} />
      <Container>
        <Tape as="p" tone="marigold-soft" className="mb-20">
          {DAY_CARE.eyebrow}
        </Tape>
        <h2 id="day-care-heading" className="type-daycare max-w-[10em]">
          {DAY_CARE.heading}
        </h2>

        <div className="mt-28 grid gap-y-44 sm:mt-52 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-x-96">
          <div>
            <p className="type-lead">{DAY_CARE.lead}</p>
            <blockquote className="type-quote mt-28 grid grid-cols-[64px_minmax(0,1fr)] items-center gap-x-16 border-y-2 border-(--ink-18) py-28 sm:mt-40 sm:grid-cols-[92px_minmax(0,1fr)] sm:gap-x-24">
              <Image
                src={leafInHand}
                alt=""
                sizes="(min-width: 37.5625rem) 92px, 64px"
                className="h-auto w-64 sm:w-92"
              />
              <p>{DAY_CARE.quote}</p>
            </blockquote>
            <h3 className="type-h4 mt-36">{DAY_CARE.includesHeading}</h3>
            <RuledList items={DAY_CARE.includes} columns={2} tone="warm" className="mt-12" />
            <ButtonLink href={DAY_CARE.cta.href} variant="secondary" arrow className="mt-36">
              {DAY_CARE.cta.label}
            </ButtonLink>
          </div>

          {(isPreview || details.length > 0) && (
            <div className="w-full sm:max-w-[400px]">
              {isPreview && (
                <div className="relative aspect-[3/2] sm:aspect-[4/5]">
                  <PaperMount tone="marigold" rotate={1.8} />
                  <NeedPanel layout="slot">{DAY_CARE.photoNeed}</NeedPanel>
                </div>
              )}
              {details.length > 0 && (
                <>
                  <h3 className="sr-only">Practical details</h3>
                  <dl className="bg-paper-raised border-line rounded-shelf mt-30 grid grid-cols-[96px_minmax(0,1fr)] items-center gap-x-16 gap-y-12 border-[1.5px] px-18 py-16">
                    {details.map((d) => (
                      <div key={d.label} className="contents">
                        <dt className="text-16 font-bold">{d.label}</dt>
                        <dd>
                          <Fact label="" value={d.value} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </>
              )}
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
