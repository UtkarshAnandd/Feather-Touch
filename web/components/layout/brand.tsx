import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/brand/logo-feather-touch-interim.png";
import { HOME_LINK_LABEL, SHELL_COPY } from "@/content/shell";

/**
 * Logo + "Foundation School & Day Care Centre" lockup (header and menu bar).
 * Logo: 84×43 on phones, 108×55.3 from 601px. INTERIM PNG until the school
 * supplies the vector logo. The visible sub-brand is aria-hidden; the link
 * carries the full accessible name.
 *
 * Below 375px the sub-brand is hidden: the 390px composition does not fit
 * logo + sub-brand + Menu at 320–374px (documented Phase 1B deviation).
 */
export function BrandLockup() {
  return (
    <Link
      href="/"
      aria-label={HOME_LINK_LABEL}
      className="flex min-h-44 flex-none items-center gap-12 no-underline"
    >
      <Image
        src={logo}
        alt=""
        loading="eager"
        sizes="(min-width: 37.5625rem) 108px, 84px"
        className="h-auto w-84 sm:w-108"
      />
      <span
        aria-hidden="true"
        className="text-12 leading-label text-ink-soft sm:text-13 w-118 font-bold max-[23.4375rem]:hidden sm:w-122"
      >
        {SHELL_COPY.subBrand[0]}
        <br /> {SHELL_COPY.subBrand[1]}
      </span>
    </Link>
  );
}

export { logo };
