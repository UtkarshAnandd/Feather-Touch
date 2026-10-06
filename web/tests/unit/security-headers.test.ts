import { describe, expect, it } from "vitest";
import {
  PRIVATE_ROUTE_HEADERS,
  buildContentSecurityPolicy,
  buildSecurityHeaders,
} from "@/lib/security-headers";

const get = (headers: { key: string; value: string }[], key: string) =>
  headers.find((h) => h.key === key)?.value;

describe("security headers", () => {
  it("production: HSTS on, no unsafe-eval, framing denied", () => {
    const headers = buildSecurityHeaders({ isDev: false });
    expect(get(headers, "Strict-Transport-Security")).toMatch(/max-age=\d+/);
    expect(get(headers, "X-Content-Type-Options")).toBe("nosniff");
    expect(get(headers, "X-Frame-Options")).toBe("DENY");
    const csp = get(headers, "Content-Security-Policy")!;
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).not.toContain("unsafe-eval");
  });

  it("development: no HSTS (localhost), eval allowed for React tooling", () => {
    const headers = buildSecurityHeaders({ isDev: true });
    expect(get(headers, "Strict-Transport-Security")).toBeUndefined();
    expect(get(headers, "Content-Security-Policy")).toContain("'unsafe-eval'");
  });

  it("adds the media CDN origin to img/media sources only when configured", () => {
    expect(buildContentSecurityPolicy({ isDev: false })).not.toContain("r2.example");
    const csp = buildContentSecurityPolicy({ isDev: false, mediaOrigin: "https://media.r2.example" });
    expect(csp).toContain("img-src 'self' data: blob: https://media.r2.example");
    expect(csp).toContain("media-src 'self' https://media.r2.example");
  });

  it("admin/api responses are never cached or indexed", () => {
    expect(get(PRIVATE_ROUTE_HEADERS, "Cache-Control")).toContain("no-store");
    expect(get(PRIVATE_ROUTE_HEADERS, "X-Robots-Tag")).toContain("noindex");
  });
});
