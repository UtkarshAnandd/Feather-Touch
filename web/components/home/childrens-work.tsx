import Image from "next/image";
import { NeedPanel } from "@/components/ui/content-required";
import { Container, Section } from "@/components/ui/layout";
import { PaperMount, Tape } from "@/components/ui/paper";
import { CHILDRENS_WORK } from "@/content/home";
import type { Photo } from "@/content/media";

/**
 * V3 Children's Work (V3-DESIGN-SOURCE §8.8): kraft band, real artwork on a
 * marigold mount (−1.5°) with a tape caption; four slots for more artwork,
 * photographed flat so no faces are needed.
 */
export function ChildrensWork({ artwork, isPreview }: { artwork: Photo | null; isPreview: boolean }) {
  return (
    <Section id="childrens-work" band="kraft" labelledBy="childrens-work-heading" className="py-72 sm:py-112">
      <Container className="grid gap-y-48 lg:grid-cols-2 lg:items-center lg:gap-x-64">
        {artwork && (
          <figure className="relative m-14 mb-0 -rotate-[1.5deg] sm:m-16">
            <PaperMount tone="marigold" rotate={0} inset="art" />
            <Image
              src={artwork.src}
              alt={artwork.alt}
              sizes="(min-width: 64rem) 560px, calc(100vw - 60px)"
              className="rounded-mat relative block aspect-[4/3] h-auto w-full object-cover"
            />
            <Tape as="figcaption" className="absolute -bottom-20 left-22 z-2">
              {artwork.caption}
            </Tape>
          </figure>
        )}
        <div className={artwork ? undefined : "lg:col-span-2"}>
          <h2 id="childrens-work-heading" className="type-h2">
            {CHILDRENS_WORK.heading}
          </h2>
          <p className="type-lead mt-16">{CHILDRENS_WORK.lead}</p>
          {isPreview && (
            <div className="mt-32 grid grid-cols-2 gap-12 sm:gap-18">
              {CHILDRENS_WORK.needs.map((need) => (
                <NeedPanel key={need} layout="compact" className="min-h-150 sm:aspect-[16/11] sm:min-h-0">
                  {need}
                </NeedPanel>
              ))}
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
