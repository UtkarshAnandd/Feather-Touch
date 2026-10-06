import type { MetadataRoute } from "next";

/**
 * Preview builds: disallow everything. Production: allow the public site,
 * never the admin area or APIs. (sitemap.xml is added once the canonical
 * school domain is confirmed.)
 */
export default function robots(): MetadataRoute.Robots {
  if (process.env.SITE_MODE !== "production") {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }] };
}
