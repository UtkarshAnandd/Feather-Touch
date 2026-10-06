import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PRESERVED_ANCHORS = [
  "home",
  "about",
  "programmes",
  "daycare",
  "learning",
  "routine",
  "activities",
  "safety",
  "partnership",
  "gallery",
  "testimonials",
  "admissions",
  "faq",
  "contact",
];

test.describe("public shell (Phase 1A, unstyled)", () => {
  test("renders landmarks, skip link and preserved Eleventy anchors", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en-IN");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(page.getByRole("navigation", { name: "Main" })).toBeVisible();
    for (const id of PRESERVED_ANCHORS) await expect(page.locator(`#${id}`)).toHaveCount(1);
  });

  test("skip link moves focus to main content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to main content" });
    await expect(skip).toBeFocused();
    await skip.press("Enter");
    await expect(page).toHaveURL(/#main-content$/);
  });

  test("preview builds are not indexable", async ({ page, request }) => {
    await page.goto("/");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toMatch(/Disallow: \/\s*$/m);
  });

  test("has no axe accessibility violations", async ({ page }) => {
    for (const path of ["/", "/privacy", "/admin/login"]) {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(results.violations, path).toEqual([]);
    }
  });

  test("sends baseline security headers", async ({ request }) => {
    const res = await request.get("/");
    const h = res.headers();
    expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(h["x-content-type-options"]).toBe("nosniff");
    expect(h["x-frame-options"]).toBe("DENY");
    expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(h["x-powered-by"]).toBeUndefined();
  });
});

test.describe("admin area", () => {
  test("anonymous visitors are redirected to the login page", async ({ page }) => {
    for (const path of ["/admin", "/admin/enquiries", "/admin/settings", "/admin/account"]) {
      await page.goto(path);
      await expect(page).toHaveURL(/\/admin\/login$/);
    }
    await expect(page.getByRole("heading", { name: "Admin sign in" })).toBeVisible();
  });

  test("a forged session cookie does not grant access (server-side check)", async ({ page, context }) => {
    await context.addCookies([
      { name: "ft-admin.session_token", value: "forged.value", domain: "127.0.0.1", path: "/" },
    ]);
    await page.goto("/admin/enquiries");
    await expect(page).toHaveURL(/\/admin\/login$/);
  });

  test("admin and API responses are private", async ({ request }) => {
    const res = await request.get("/admin/login");
    expect(res.headers()["cache-control"]).toContain("no-store");
    expect(res.headers()["x-robots-tag"]).toContain("noindex");
  });

  test("public sign-up endpoint is disabled", async ({ request, baseURL }, testInfo) => {
    // Viewport-independent API check: run once. Running it in every project from the
    // same IP trips better-auth's (correct) strict sign-up rate limit with a 429.
    test.skip(testInfo.project.name !== "desktop-1280", "API check runs in one project only");
    const res = await request.post("/api/auth/sign-up/email", {
      headers: { origin: baseURL! },
      data: { email: "visitor@example.test", password: "a-long-password-123", name: "Visitor" },
    });
    expect(res.status()).toBe(400);
    expect(JSON.stringify(await res.json())).toMatch(/sign.?up.*disabled|disabled/i);
  });
});
