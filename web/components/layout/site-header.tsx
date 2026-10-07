import { ButtonLink } from "@/components/ui/button";
import { ContentRequired } from "@/components/ui/content-required";
import { PRIMARY_NAV, VISIT_CTA } from "@/content/shell";
import { getSiteMode } from "@/lib/server/env";
import { BrandLockup } from "./brand";
import { MobileMenu } from "./mobile-menu";
import { HeaderNavLink } from "./nav-link";

/**
 * V3 header (V3-DESIGN-SOURCE §8.0): a rounded raised paper bar.
 * - < 601px: 64px bar, 18px radius, 84px logo.
 * - ≥ 601px: 80px bar, 22px radius, 108px logo.
 * - ≥ 1200px: seven navigation items + "Book a school visit"; below that, "Menu".
 * Not sticky (the design does not specify it).
 */
export function SiteHeader() {
  // Call/WhatsApp are not supplied yet; the flag is preview-only.
  const menuContact =
    getSiteMode() === "production" ? undefined : <ContentRequired label="Call and WhatsApp" />;

  return (
    <header className="max-w-page relative z-5 mx-auto px-12 pt-10 sm:px-40 sm:pt-16">
      <div className="rounded-shelf border-line bg-paper-raised shadow-bar sm:rounded-photo flex h-64 items-center gap-10 border-[1.5px] pr-8 pl-12 sm:h-80 sm:gap-24 sm:pr-14 sm:pl-20">
        <BrandLockup />

        <nav aria-label="Main" className="nav:block ml-auto hidden">
          {/* 20px gaps (V3) only fit from ~1240px; between the 1200px switch and
              1280px the gap eases down to 12px so the CTA stays inside the bar. */}
          <ul className="flex gap-[clamp(12px,calc(20px-(1280px-100vw)*0.1),20px)]">
            {PRIMARY_NAV.map((item) => (
              <li key={item.href + item.label}>
                <HeaderNavLink item={item} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav:block hidden flex-none">
          <ButtonLink href={VISIT_CTA.href} size="sm" arrow>
            {VISIT_CTA.label}
          </ButtonLink>
        </div>

        <div className="nav:hidden ml-auto">
          <MobileMenu brand={<BrandLockup />} contact={menuContact} />
        </div>
      </div>
    </header>
  );
}
