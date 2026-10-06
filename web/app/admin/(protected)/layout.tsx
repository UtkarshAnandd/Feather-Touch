import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ADMIN_NAV } from "@/components/admin/admin-nav";
import { SignOutButton } from "@/components/admin/sign-out-button";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Feather Touch Admin" },
  robots: { index: false, follow: false },
};

/**
 * Admin shell (unstyled in Phase 1A).
 *
 * SECURITY: this layout does NOT authorize anything. Every page and every
 * Server Action under /admin calls requireAdmin() itself. The session read
 * happens inside each page, behind this Suspense boundary (Cache Components).
 */
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <>
      <header>
        <p>Feather Touch — Admin</p>
        <nav aria-label="Admin">
          <ul>
            {ADMIN_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <SignOutButton />
      </header>
      <main id="main-content" tabIndex={-1}>
        <Suspense fallback={<p>Loading…</p>}>{children}</Suspense>
      </main>
    </>
  );
}
