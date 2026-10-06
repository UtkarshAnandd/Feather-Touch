/**
 * Baseline HTTP security headers (consumed by next.config.ts).
 *
 * Phase 1A baseline. Known follow-ups (documented in docs/PHASE-1A.md):
 *  - Nonce-based CSP (removing 'unsafe-inline' for scripts) once the V3 pages
 *    exist and their rendering mode is settled.
 *  - Add the R2 media origin (NEXT_PUBLIC_MEDIA_BASE_URL) to img-src/media-src.
 */
export type HeaderEntry = { key: string; value: string };

export function buildContentSecurityPolicy(opts: { isDev: boolean; mediaOrigin?: string | null }): string {
  const media = opts.mediaOrigin ? ` ${opts.mediaOrigin}` : "";
  const directives: Record<string, string> = {
    "default-src": "'self'",
    // Next.js inlines bootstrap scripts; React dev tooling needs eval in development only.
    "script-src": `'self' 'unsafe-inline'${opts.isDev ? " 'unsafe-eval'" : ""}`,
    "style-src": "'self' 'unsafe-inline'",
    "img-src": `'self' data: blob:${media}`,
    "media-src": `'self'${media}`,
    "font-src": "'self'",
    "connect-src": `'self'${opts.isDev ? " ws: wss:" : ""}`,
    "frame-src": "'none'",
    "frame-ancestors": "'none'",
    "object-src": "'none'",
    "base-uri": "'self'",
    "form-action": "'self'",
    "manifest-src": "'self'",
    "worker-src": "'self' blob:",
  };
  const policy = Object.entries(directives).map(([k, v]) => `${k} ${v}`);
  if (!opts.isDev) policy.push("upgrade-insecure-requests");
  return policy.join("; ");
}

export function buildSecurityHeaders(opts: { isDev: boolean; mediaOrigin?: string | null }): HeaderEntry[] {
  const headers: HeaderEntry[] = [
    { key: "Content-Security-Policy", value: buildContentSecurityPolicy(opts) },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
    },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ];
  if (!opts.isDev) {
    headers.push({ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" });
  }
  return headers;
}

/** Extra headers for /admin and /api: never cached, never indexed. */
export const PRIVATE_ROUTE_HEADERS: HeaderEntry[] = [
  { key: "Cache-Control", value: "no-store, max-age=0" },
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
];
