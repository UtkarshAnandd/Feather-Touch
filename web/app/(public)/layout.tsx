import Link from "next/link";
import { PUBLIC_SECTIONS } from "@/content/sections";
import { SITE } from "@/content/site";

/**
 * PHASE 1A STRUCTURAL SHELL — intentionally unstyled.
 * The approved V3 header/footer replace this in Phase 1B. Do not add colours,
 * fonts, imagery or decorative layout here.
 */
const isPreview = process.env.SITE_MODE !== "production";

export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      {isPreview && (
        <aside className="preview-banner" aria-label="Preview build notice">
          Preview build — not the approved V3 design. Not for public use.
        </aside>
      )}
      <header>
        <Link href="/">{SITE.shortName}</Link>
        <nav aria-label="Main">
          <ul>
            {PUBLIC_SECTIONS.filter((s) => s.id !== "home").map((s) => (
              <li key={s.id}>
                <a href={`/#${s.id}`}>{s.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <footer>
        <p>{SITE.name}</p>
        <p>
          <Link href="/privacy">Privacy</Link>
        </p>
      </footer>
    </>
  );
}
