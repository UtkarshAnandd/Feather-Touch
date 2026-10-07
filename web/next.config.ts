import type { NextConfig } from "next";
import { PRIVATE_ROUTE_HEADERS, buildSecurityHeaders } from "./lib/security-headers";

const isDev = process.env.NODE_ENV !== "production";

function mediaOrigin(): string | null {
  const raw = process.env.NEXT_PUBLIC_MEDIA_BASE_URL;
  if (!raw) return null;
  try {
    return new URL(raw).origin;
  } catch {
    return null;
  }
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  reactStrictMode: true,
  typedRoutes: true,
  images: {
    // AVIF first, WebP fallback (V3 spec §9). Next 16 requires an explicit
    // qualities allowlist. Remote media origins are added with R2 (later phase).
    formats: ["image/avif", "image/webp"],
    qualities: [75],
  },
  turbopack: {
    // This app lives in web/ next to the untouched Eleventy project (which has its
    // own package-lock.json). Pin the root so the workspace is not mis-detected.
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      { source: "/:path*", headers: buildSecurityHeaders({ isDev, mediaOrigin: mediaOrigin() }) },
      { source: "/admin/:path*", headers: PRIVATE_ROUTE_HEADERS },
      { source: "/admin", headers: PRIVATE_ROUTE_HEADERS },
      { source: "/api/:path*", headers: PRIVATE_ROUTE_HEADERS },
    ];
  },
};

export default nextConfig;
