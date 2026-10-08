import { ContentRequired, Fact, showFact } from "@/components/ui/content-required";
import { Container, Section } from "@/components/ui/layout";
import { Tape } from "@/components/ui/paper";
import { ADMISSIONS } from "@/content/home";
import { ADMISSIONS_ANCHOR_ID } from "@/lib/enquiry-contract";
import { AnchorAlias } from "./anchor-alias";
import { VisitForm } from "./visit-form";

/**
 * V3 Admissions / Book a school visit (V3-DESIGN-SOURCE §8.12) — also the page's
 * Contact block (#contact), as in the approved design. Contact details, the
 * admissions session and form delivery are not supplied yet; each shows a
 * preview-only required state (nothing in production).
 */
export type ContactDetails = {
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  session: string | null;
};

function Footprints() {
  const foot = (
    <>
      <path d="M0 -16 C 9 -16 11 -6 9 4 C 7 12 6 18 0 18 C -6 18 -7 10 -8 2 C -10 -8 -8 -16 0 -16 Z" />
      <circle cx="-6.5" cy="-22" r="3.6" />
      <circle cx="-1.5" cy="-25.5" r="3.2" />
      <circle cx="3.5" cy="-25.5" r="2.9" />
      <circle cx="7.8" cy="-23.5" r="2.6" />
      <circle cx="10.8" cy="-19.6" r="2.3" />
    </>
  );
  return (
    <svg
      viewBox="0 0 140 110"
      aria-hidden="true"
      focusable="false"
      className="text-marigold mt-24 block h-80 w-100 fill-current sm:mt-36 sm:h-110 sm:w-140"
    >
      <g transform="translate(40 78) rotate(-14)">{foot}</g>
      <g transform="translate(98 42) rotate(12) scale(-1 1)">{foot}</g>
    </svg>
  );
}

export function Admissions({ contact }: { contact: ContactDetails }) {
  const rows = [
    { label: "Call", value: contact.phone },
    { label: "WhatsApp", value: contact.whatsapp },
    { label: "Email", value: contact.email },
    { label: "Address", value: contact.address },
  ].filter((r) => showFact(r.value));

  return (
    <Section id="visit" band="leaf-tint" labelledBy="visit-heading" className="py-72 sm:py-112">
      <AnchorAlias ids={[ADMISSIONS_ANCHOR_ID]} />
      <Container className="grid gap-y-40 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start lg:gap-x-72">
        <div id="contact">
          <p className="mb-22 flex flex-wrap items-center gap-14">
            <Tape tone="leaf">{ADMISSIONS.eyebrow}</Tape>
            {showFact(contact.session) && <Fact label="Session" value={contact.session} />}
          </p>
          <h2 id="visit-heading" className="type-h2">
            {ADMISSIONS.heading}
          </h2>
          <p className="type-lead mt-20">{ADMISSIONS.lead}</p>
          {rows.length > 0 && (
            <dl className="mt-36 grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-16 gap-y-12">
              {rows.map((r) => (
                <div key={r.label} className="contents">
                  <dt className="font-bold">{r.label}</dt>
                  <dd>
                    <Fact label="" value={r.value} />
                  </dd>
                </div>
              ))}
            </dl>
          )}
          <Footprints />
        </div>

        <VisitForm
          deliveryNotice={
            showFact(null) ? <ContentRequired label="Form delivery" status="integration" /> : undefined
          }
        />
      </Container>
    </Section>
  );
}
