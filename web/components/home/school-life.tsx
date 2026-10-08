import Image from "next/image";
import { NeedPanel } from "@/components/ui/content-required";
import { Container, Section } from "@/components/ui/layout";
import { PaperMount, TapeStrip } from "@/components/ui/paper";
import { SCHOOL_LIFE } from "@/content/home";
import type { Photo } from "@/content/media";
import { cx } from "@/lib/cx";
import { AnchorAlias } from "./anchor-alias";

/**
 * V3 School Life (V3-DESIGN-SOURCE §8.7).
 * - ≥1200px: copy + activity groups left; the school's own posters pinned on a
 *   wall right (mounts, tape strips, slight rotation).
 * - Below: heading, then the posters as a horizontal scroll-snap strip — the
 *   page's only intended horizontal scroll — then the groups.
 */
const PIN = {
  janmashtami: {
    tone: "marigold" as const,
    rotate: -2,
    figure: "nav:absolute nav:left-16 nav:top-36 w-250 nav:w-368",
    mat: "h-250 w-250 nav:h-368 nav:w-368",
    sizes: "(min-width: 75rem) 368px, 250px",
  },
  environmentDay: {
    tone: "leaf" as const,
    rotate: 2.4,
    figure: "nav:absolute nav:right-24 nav:top-8 w-136 nav:w-196",
    mat: "h-272 w-136 nav:h-392 nav:w-196",
    sizes: "(min-width: 75rem) 196px, 136px",
  },
};

function Poster({ photo, pin }: { photo: Photo; pin: (typeof PIN)[keyof typeof PIN] }) {
  return (
    <figure
      className={cx("relative m-0 flex-none snap-center", pin.figure)}
      style={{ transform: `rotate(${pin.rotate}deg)` }}
    >
      <PaperMount tone={pin.tone} rotate={0} inset="even" />
      <TapeStrip />
      <Image
        src={photo.src}
        alt={photo.alt}
        sizes={pin.sizes}
        className={cx("rounded-mat shadow-poster relative block object-cover", pin.mat)}
      />
      <figcaption className="type-accent text-16 relative mt-26 leading-[1.3]">{photo.caption}</figcaption>
    </figure>
  );
}

export function SchoolLife({
  posters,
  isPreview,
}: {
  posters: { janmashtami?: Photo; environmentDay?: Photo };
  isPreview: boolean;
}) {
  const hasWall = Boolean(posters.janmashtami || posters.environmentDay || isPreview);
  return (
    <Section id="school-life" labelledBy="school-life-heading" className="py-72 sm:pt-120 sm:pb-112">
      <AnchorAlias ids={["activities"]} />
      <Container className="nav:grid nav:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] nav:grid-rows-[auto_1fr] nav:gap-x-72">
        <div className="nav:col-start-1 nav:row-start-1">
          <h2 id="school-life-heading" className="type-h2">
            {SCHOOL_LIFE.heading}
          </h2>
          <p className="type-lead mt-20">{SCHOOL_LIFE.lead}</p>
        </div>

        {hasWall && (
          <div
            role="region"
            aria-label="School posters"
            tabIndex={0}
            className="nav:col-start-2 nav:row-span-2 nav:row-start-1 nav:block nav:m-0 nav:min-h-650 nav:overflow-visible nav:p-0 relative -mx-16 mt-30 flex snap-x snap-mandatory items-start gap-34 overflow-x-auto px-30 pt-34 pb-22 sm:-mx-40 sm:px-54"
          >
            {posters.janmashtami && <Poster photo={posters.janmashtami} pin={PIN.janmashtami} />}
            {posters.environmentDay && <Poster photo={posters.environmentDay} pin={PIN.environmentDay} />}
            {isPreview && (
              <NeedPanel className="nav:absolute nav:right-24 nav:bottom-0 nav:left-16 nav:h-128 nav:w-auto h-250 w-220 flex-none snap-center">
                {SCHOOL_LIFE.photoNeed}
              </NeedPanel>
            )}
          </div>
        )}

        <div className="nav:col-start-1 nav:row-start-2 nav:mt-40 mt-30">
          {SCHOOL_LIFE.groups.map((g) => (
            <div key={g.heading} className="border-line border-t-2 border-dashed pt-18 pb-20 last:border-b-2">
              <h3 className="type-group-heading">{g.heading}</h3>
              <p className="text-16 sm:text-17 mt-6 leading-[1.5]">{g.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
