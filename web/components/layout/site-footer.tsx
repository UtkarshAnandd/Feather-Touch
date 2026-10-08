import Image from "next/image";
import { ContentRequired } from "@/components/ui/content-required";
import { Container } from "@/components/ui/layout";
import { FOOTER_NAV, SHELL_COPY } from "@/content/shell";
import { logo } from "./brand";

// Build-time year (the site is statically rendered; rebuilt at least yearly).
const YEAR = new Date().getFullYear();

/**
 * V3 footer (V3-DESIGN-SOURCE §8.14): ink band, logo + name + tagline, Visit,
 * Contact and Explore columns, copyright row. School facts are not supplied
 * yet, so Visit/Contact show preview-only content-required flags; they are
 * wired to SiteSettings in a later phase.
 *
 * Column headings are <h2> (prototype used <h3>) so heading order stays valid
 * on pages whose content has no <h2>, e.g. /privacy.
 */
export function SiteFooter() {
  const heading = "mb-14 type-footer-heading text-paper";
  return (
    <footer className="on-dark bg-ink text-paper pt-56 pb-32 sm:pt-72 sm:pb-44">
      <Container className="grid gap-y-32 sm:grid-cols-[minmax(0,4fr)_repeat(3,minmax(0,2.4fr))] sm:gap-x-48">
        <div>
          <Image src={logo} alt="Feather Touch" sizes="150px" className="block h-auto w-150" />
          <p className="text-16 mt-18 max-w-[18em] font-bold">{SHELL_COPY.footerName}</p>
          <p className="type-accent text-16 text-leaf mt-8">{SHELL_COPY.footerTagline}</p>
        </div>

        <div>
          <h2 className={heading}>Visit</h2>
          <p className="mb-8">
            <ContentRequired label="Address" tone="on-dark" />
          </p>
          <p className="mb-8">
            <ContentRequired label="Visiting hours" tone="on-dark" />
          </p>
        </div>

        <div>
          <h2 className={heading}>Contact</h2>
          <p className="mb-8">
            <ContentRequired label="Phone" tone="on-dark" />
          </p>
          <p className="mb-8">
            <ContentRequired label="WhatsApp" tone="on-dark" />
          </p>
          <p className="mb-8">
            <ContentRequired label="Email" tone="on-dark" />
          </p>
        </div>

        <nav aria-labelledby="footer-explore">
          <h2 id="footer-explore" className={heading}>
            Explore
          </h2>
          <ul>
            {FOOTER_NAV.map((item) => (
              <li key={item.href + item.label} className="my-6">
                <a href={item.href} className="text-paper inline-block no-underline hover:underline">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      <Container className="text-14 mt-40 flex flex-col gap-8 border-t border-(--paper-on-ink-20) pt-20 text-(--paper-on-ink-80) sm:mt-56 sm:flex-row sm:justify-between sm:gap-24">
        <p>
          © {YEAR} {SHELL_COPY.copyrightHolder}
        </p>
        <p>
          <ContentRequired label="Privacy policy" status="approval" tone="on-dark" />
        </p>
      </Container>
    </footer>
  );
}
