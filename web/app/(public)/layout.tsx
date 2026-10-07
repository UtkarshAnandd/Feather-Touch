import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getSiteMode } from "@/lib/server/env";

/**
 * Public shell: V3 header, main, V3 footer (Phase 1B).
 * Homepage sections are built in Phase 2.
 */
export default function PublicLayout({ children }: LayoutProps<"/">) {
  const isPreview = getSiteMode() !== "production";
  return (
    <>
      {isPreview && (
        <aside
          aria-label="Preview build notice"
          className="border-flag-line bg-paper-deep text-14 text-flag border-b-[1.5px] border-dashed px-16 py-6 text-center font-bold"
        >
          Preview build. Dashed labels mark details the school has not supplied yet. Not for public use.
        </aside>
      )}
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
