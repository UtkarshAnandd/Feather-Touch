import type { Metadata, Viewport } from "next";
import { SITE } from "@/content/site";
import { fontVariables } from "./fonts";
import "./globals.css";

const isProduction = process.env.SITE_MODE === "production";

function metadataBase(): URL | undefined {
  try {
    return process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined;
  } catch {
    return undefined;
  }
}

export const metadata: Metadata = {
  metadataBase: metadataBase(),
  title: { default: SITE.name, template: `%s | ${SITE.name}` },
  description: SITE.tagline,
  // Preview builds are never indexable. Production indexing is only enabled
  // once SITE_MODE=production (set after the launch gate passes).
  robots: isProduction ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fff6e6", // V3 paper
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={fontVariables}>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
