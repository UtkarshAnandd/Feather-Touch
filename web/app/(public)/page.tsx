import { Admissions, type ContactDetails } from "@/components/home/admissions";
import { ChildrensWork } from "@/components/home/childrens-work";
import { DayCare } from "@/components/home/day-care";
import { DaySequence } from "@/components/home/day-sequence";
import { Faq } from "@/components/home/faq";
import { Hero } from "@/components/home/hero";
import { Moments } from "@/components/home/moments";
import { ParentReviews } from "@/components/home/parent-reviews";
import { Partnership } from "@/components/home/partnership";
import { Programmes } from "@/components/home/programmes";
import { Safety } from "@/components/home/safety";
import { SchoolLife } from "@/components/home/school-life";
import { Why } from "@/components/home/why";
import { PROGRAMMES } from "@/content/home";
import { POSTERS } from "@/content/media";
import {
  getArtwork,
  getGallery,
  getHeroSlides,
  getParentReviews,
  getPosters,
  getVideos,
  isPreview,
} from "@/lib/server/public-media";

/**
 * Feather Touch homepage (Phase 2A) — the approved V3 design, in the approved
 * narrative order (content/sections.ts). Content is static for now; the media
 * getters are the seam for admin-managed content in a later phase.
 */

// School contact facts: none supplied yet (SiteSettings is empty). Never invent.
const CONTACT: ContactDetails = { phone: null, whatsapp: null, email: null, address: null, session: null };

export default function HomePage() {
  const preview = isPreview();
  const posters = getPosters();
  const byId = (id: string) => posters.find((p) => p.id === id);

  return (
    <>
      <Hero slides={getHeroSlides()} />
      <Why />
      <Programmes programmes={PROGRAMMES} />
      <DayCare isPreview={preview} />
      <SchoolLife
        isPreview={preview}
        posters={{
          janmashtami: byId(POSTERS.janmashtami.id),
          environmentDay: byId(POSTERS.environmentDay.id),
        }}
      />
      <ChildrensWork artwork={getArtwork()} isPreview={preview} />
      <DaySequence />
      <Safety />
      <Partnership />
      <Moments videos={getVideos()} gallery={getGallery()} />
      <ParentReviews reviews={getParentReviews()} />
      <Admissions contact={CONTACT} />
      <Faq />
    </>
  );
}
