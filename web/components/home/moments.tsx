import Image from "next/image";
import { Container, Section } from "@/components/ui/layout";
import { PaperMount, Tape } from "@/components/ui/paper";
import { MOMENTS } from "@/content/home";
import type { Photo, SchoolVideo } from "@/content/media";
import { AnchorAlias } from "./anchor-alias";

/**
 * Videos and gallery ("Gallery / School Life", project requirement F2).
 * V3 has no section for these, so it is assembled from V3 parts only:
 * paper-mounted 22px frames, tape captions and the section/heading styles.
 *
 * - Videos (2–3): native <video controls>, no autoplay, preload="none", a
 *   poster frame, captions track when supplied, intrinsic aspect ratio.
 * - Nothing is rendered (preview or production) until real, consented
 *   videos/photos exist; the legacy #gallery/#videos anchors are always kept.
 */
const MOUNTS = [
  { tone: "leaf", rotate: -1.5 },
  { tone: "marigold", rotate: 1.8 },
  { tone: "marigold-soft", rotate: -1.4 },
] as const;

function VideoCard({ video, i }: { video: SchoolVideo; i: number }) {
  const mount = MOUNTS[i % MOUNTS.length]!;
  return (
    <figure className="relative m-0">
      <div className="relative" style={{ aspectRatio: `${video.width} / ${video.height}` }}>
        <PaperMount tone={mount.tone} rotate={mount.rotate} />
        <video
          controls
          playsInline
          preload="none"
          poster={typeof video.poster === "string" ? video.poster : video.poster.src}
          width={video.width}
          height={video.height}
          className="rounded-photo bg-ink relative block size-full object-cover"
          aria-label={video.title}
        >
          <source src={video.src} />
          {video.captionsSrc && (
            <track kind="captions" src={video.captionsSrc} srcLang="en" label="English" default />
          )}
        </video>
      </div>
      <Tape as="figcaption" className="relative mt-18 ml-12">
        {video.title}
      </Tape>
    </figure>
  );
}

export function Moments({ videos, gallery }: { videos: readonly SchoolVideo[]; gallery: readonly Photo[] }) {
  // Not part of the approved V3 homepage: render only with real content.
  if (videos.length === 0 && gallery.length === 0) {
    return <AnchorAlias ids={["gallery", "videos"]} />;
  }
  return (
    <Section id="gallery" labelledBy="gallery-heading" className="py-72 sm:py-112">
      <AnchorAlias ids={["videos"]} />
      <Container>
        <h2 id="gallery-heading" className="type-h2 mb-32 sm:mb-56">
          {MOMENTS.heading}
        </h2>

        {videos.length > 0 && (
          <div className="nav:grid-cols-3 grid gap-x-40 gap-y-48 lg:grid-cols-2">
            {videos.slice(0, 3).map((v, i) => (
              <VideoCard key={v.id} video={v} i={i} />
            ))}
          </div>
        )}

        {gallery.length > 0 && (
          <ul className="mt-56 grid grid-cols-2 gap-24 lg:grid-cols-3">
            {gallery.map((photo, i) => {
              const mount = MOUNTS[i % MOUNTS.length]!;
              return (
                <li key={photo.id}>
                  <figure className="relative m-0">
                    <div className="relative aspect-[4/5]">
                      <PaperMount tone={mount.tone} rotate={mount.rotate} />
                      <div className="rounded-photo bg-paper-deep absolute inset-0 overflow-hidden">
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          sizes="(min-width: 64rem) 33vw, 50vw"
                          style={{ objectFit: "cover", objectPosition: photo.focal ?? "50% 50%" }}
                        />
                      </div>
                    </div>
                    <Tape as="figcaption" className="relative mt-18 ml-12">
                      {photo.caption}
                    </Tape>
                  </figure>
                </li>
              );
            })}
          </ul>
        )}
      </Container>
    </Section>
  );
}
