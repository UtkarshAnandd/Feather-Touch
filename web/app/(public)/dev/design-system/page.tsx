import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { ContentRequired, NeedPanel } from "@/components/ui/content-required";
import { Icon, type IconName } from "@/components/ui/icon";
import { Container, PaperSurface, Section } from "@/components/ui/layout";
import { BrushUnderline, MarkerStrike } from "@/components/ui/marks";
import { MountedPhoto, Tape } from "@/components/ui/paper";
import { RoundButton } from "@/components/ui/round-button";
import { RuledList } from "@/components/ui/ruled-list";
import { TextLink } from "@/components/ui/text-link";
import { getSiteMode } from "@/lib/server/env";

export const metadata: Metadata = {
  title: "V3 design system (preview)",
  robots: { index: false, follow: false },
};

/**
 * DEV/PREVIEW-ONLY inspection page for the V3 tokens, primitives and shell
 * (Phase 1B). Returns 404 when SITE_MODE=production. Sample strings are taken
 * verbatim from the approved V3 prototype; no school facts are shown.
 */
const SWATCHES = [
  ["paper", "#FFF6E6", "bg-paper"],
  ["paper-raised", "#FFFBF3", "bg-paper-raised"],
  ["paper-deep", "#F6E7CA", "bg-paper-deep"],
  ["kraft", "#F1DDB8", "bg-kraft"],
  ["line", "#E2CFA8", "bg-line"],
  ["ink", "#1E3A2B", "bg-ink"],
  ["ink-soft", "#4A5A4E", "bg-ink-soft"],
  ["marigold", "#E88640", "bg-marigold"],
  ["marigold-hover", "#F1964F", "bg-marigold-hover"],
  ["marigold-ledge", "#B5601F", "bg-marigold-ledge"],
  ["marigold-display", "#C1570F", "bg-marigold-display"],
  ["marigold-tint", "#FFE5C2", "bg-marigold-tint"],
  ["marigold-soft", "#FFD29B", "bg-marigold-soft"],
  ["leaf", "#A9CF48", "bg-leaf"],
  ["leaf-2", "#C8E283", "bg-leaf-2"],
  ["leaf-3", "#DDEDB0", "bg-leaf-3"],
  ["leaf-tint", "#EEF6D6", "bg-leaf-tint"],
  ["leaf-deep", "#3E6A12", "bg-leaf-deep"],
  ["navy", "#22305A", "bg-navy"],
  ["flag", "#6B551F", "bg-flag"],
  ["flag-line", "#B9A06A", "bg-flag-line"],
] as const;

const ICONS: IconName[] = [
  "arrow-right",
  "chevron-left",
  "chevron-right",
  "menu",
  "close",
  "plus",
  "pause",
  "play",
];

function Group({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <Section labelledBy={id} className="border-line border-t-[1.5px] py-40">
      <h2 id={id} className="type-h3 mb-24">
        {title}
      </h2>
      {children}
    </Section>
  );
}

export default function DesignSystemPage() {
  if (getSiteMode() === "production") notFound();

  return (
    <Container className="py-40 sm:py-72">
      <h1 className="type-display text-46 sm:text-68">V3 design system</h1>
      <p className="type-lead mt-18">
        Phase 1B preview of the approved V3 tokens and primitives. Not part of the public site.
      </p>

      <Group id="ds-colour" title="Colour tokens">
        <ul className="nav:grid-cols-6 grid grid-cols-2 gap-x-24 gap-y-28 sm:grid-cols-4">
          {SWATCHES.map(([name, hex, cls]) => (
            <li key={name}>
              <span className={`rounded-field block h-72 border-[1.5px] border-(--ink-13) ${cls}`} />
              <span className="text-16 mt-10 block font-extrabold">{name}</span>
              <span className="text-14 text-ink-soft block">{hex}</span>
            </li>
          ))}
        </ul>
      </Group>

      <Group id="ds-type" title="Typography">
        <div className="space-y-28">
          <p className="type-display text-46 sm:text-68">
            We believe children learn best{" "}
            <span className="text-marigold-display">
              when they are <BrushUnderline placement="display">happy.</BrushUnderline>
            </span>
          </p>
          <p className="type-display text-46 sm:text-80">Caring beyond the classroom</p>
          <p className="type-h2">Nurturing little minds, building strong foundations.</p>
          <p className="type-h3">Request a visit</p>
          <p className="type-h4">What Day Care includes</p>
          <p className="type-lead">
            Parents are welcome to schedule a school visit and understand our programmes.
          </p>
          <p>
            Feather Touch is a nurturing early childhood education centre for Play Group, Nursery, KG 1 and KG
            2.
          </p>
          <p className="italic">
            We also believe that child protection is a shared responsibility between school, parents and the
            community.
          </p>
          <p className="type-accent text-18">Swipe to look around</p>
        </div>
      </Group>

      <Group id="ds-buttons" title="Buttons and links">
        <div className="flex flex-wrap items-center gap-14">
          <ButtonLink href="#ds-buttons" arrow>
            Book a school visit
          </ButtonLink>
          <ButtonLink href="#ds-buttons" variant="secondary">
            Explore programmes
          </ButtonLink>
          <ButtonLink href="#ds-buttons" size="sm" arrow>
            Book a school visit
          </ButtonLink>
          <Button disabled>Request a visit</Button>
        </div>
        <div className="mt-24 flex flex-wrap items-center gap-14">
          <RoundButton icon="chevron-left" label="Previous photo" />
          <RoundButton icon="chevron-right" label="Next photo" />
          <RoundButton icon="pause" label="Pause slideshow" />
          <TextLink href="#ds-buttons">More about Play Group</TextLink>
        </div>
        <div className="mt-24 max-w-[358px]">
          <Button block arrow>
            Request a visit
          </Button>
        </div>
      </Group>

      <Group id="ds-paper" title="Paper, tape and marks">
        <div className="grid gap-56 sm:grid-cols-2">
          <MountedPhoto tone="leaf" rotate={-2.6} className="aspect-[4/5] max-w-[358px]">
            <div className="text-16 text-ink-soft grid size-full place-items-center p-24 text-center">
              Photo frame (22px radius) on a leaf mount, −2.6°
            </div>
          </MountedPhoto>
          <div className="space-y-24">
            <div className="flex flex-wrap gap-14">
              <Tape>Welcome back to school.</Tape>
              <Tape tone="leaf">Admissions</Tape>
              <Tape tone="marigold-soft">Day Care Centre</Tape>
            </div>
            <PaperSurface className="p-16">Raised paper shelf (18px radius)</PaperSurface>
          </div>
        </div>
        <p className="type-display text-28 sm:text-54 mt-56 max-w-[1060px]">
          Education at this stage should not be about <MarkerStrike>pressure or rote learning</MarkerStrike>.
          It should be about curiosity, discovery, confidence and joy.
        </p>
      </Group>

      <Group id="ds-lists" title="Ruled lists">
        <RuledList
          columns={2}
          items={[
            "Safe and supervised care",
            "Rest and relaxation",
            "Creative activities",
            "Storytelling",
            "Indoor play",
            "Age-appropriate learning activities",
          ]}
        />
      </Group>

      <Group id="ds-required" title="Content-required states">
        <div className="flex flex-wrap gap-14">
          <ContentRequired label="Age group" />
          <ContentRequired label="Form delivery" status="integration" />
          <ContentRequired />
        </div>
        <NeedPanel className="mt-24 max-w-[420px]">
          A real Day Care moment at Feather Touch: a camera-original photograph, with consent confirmed.
        </NeedPanel>
      </Group>

      <Group id="ds-icons" title="Icons">
        <ul className="flex flex-wrap gap-24">
          {ICONS.map((name) => (
            <li key={name} className="text-14 flex flex-col items-center gap-8">
              <Icon name={name} />
              {name}
            </li>
          ))}
        </ul>
      </Group>

      <Section
        band="navy"
        labelledBy="ds-navy"
        className="rounded-photo -mx-16 px-16 py-40 sm:-mx-0 sm:px-40"
      >
        <h2 id="ds-navy" className="type-h2">
          A safe childhood is the first step towards a strong future
        </h2>
        <RuledList
          tone="inverse"
          columns={2}
          className="mt-14"
          items={["Personal safety", "Safe and unsafe touch", "Respect for others", "Asking for help"]}
        />
        <NeedPanel tone="inverse" title="Content required from Feather Touch" className="mt-32">
          How the school keeps children safe day to day, for example arrival and pickup, supervision and
          visitors.
        </NeedPanel>
        <p className="mt-24">
          <a href="#ds-navy" className="text-paper">
            Focus ring on dark bands is paper-coloured
          </a>
        </p>
      </Section>
    </Container>
  );
}
