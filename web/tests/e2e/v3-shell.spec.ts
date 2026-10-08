import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/**
 * Phase 1B — V3 visual foundation, header, mobile menu and footer.
 * References: docs/design/V3-DESIGN-SOURCE.md §4, §8.0, §8.1, §8.14.
 */

const NAV_LABELS = ["Home", "About", "Programmes", "Day Care", "School Life", "Admissions", "Contact"];
const WCAG = ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"];
const PHONE = { width: 390, height: 844 };

const once = (projectName: string) => projectName !== "desktop-1280";

async function noHorizontalOverflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
}

test.describe("V3 typography", () => {
  test("loads the three V3 variable fonts and applies them by role", async ({ page }) => {
    await page.goto("/dev/design-system");

    // Bricolage + Atkinson roman are preloaded; italic and Fredoka are not.
    await expect(page.locator('link[rel="preload"][as="font"]')).toHaveCount(2);

    const loaded = await page.evaluate(async () => {
      const probe = async (spec: string) => (await document.fonts.load(spec)).length > 0;
      await document.fonts.ready;
      return {
        bricolage: await probe("760 52px bricolage"),
        atkinson: await probe("400 18px atkinson"),
        atkinsonItalic: await probe("italic 400 18px atkinson"),
        fredoka: await probe("500 15px fredoka"),
      };
    });
    expect(loaded).toEqual({ bricolage: true, atkinson: true, atkinsonItalic: true, fredoka: true });

    const body = await page.evaluate(() => {
      const cs = getComputedStyle(document.body);
      return { family: cs.fontFamily, size: cs.fontSize, color: cs.color, bg: cs.backgroundColor };
    });
    expect(body.family).toMatch(/^atkinson\b/);
    expect(body.size).toBe("18px");
    expect(body.color).toBe("rgb(30, 58, 43)"); // ink
    expect(body.bg).toBe("rgb(255, 246, 230)"); // paper

    const h1 = await page.getByRole("heading", { level: 1 }).evaluate((el) => {
      const cs = getComputedStyle(el);
      return { family: cs.fontFamily, weight: cs.fontWeight, stretch: cs.fontStretch };
    });
    expect(h1.family).toMatch(/^bricolage\b/);
    expect(h1.weight).toBe("760");
    expect(h1.stretch).toBe("88%");
  });

  test("the Bricolage width axis is real (88% renders narrower than 100%)", async ({ page }, info) => {
    test.skip(once(info.project.name), "font check runs once");
    await page.goto("/dev/design-system");
    const widths = await page.evaluate(async () => {
      await document.fonts.load("760 52px bricolage");
      const measure = (stretch: string) => {
        const el = document.createElement("span");
        el.textContent = "Caring beyond the classroom";
        el.style.cssText = `font-family: bricolage; font-weight: 760; font-size: 52px; font-stretch: ${stretch}; position: absolute; white-space: nowrap;`;
        document.body.append(el);
        const w = el.getBoundingClientRect().width;
        el.remove();
        return w;
      };
      return { narrow: measure("88%"), normal: measure("100%") };
    });
    expect(widths.narrow).toBeLessThan(widths.normal * 0.97);
  });
});

test.describe("V3 header", () => {
  test("desktop (≥1200px): full navigation and CTA inside the 80px bar", async ({ page }, info) => {
    test.skip(once(info.project.name), "explicit viewports below");
    for (const width of [1200, 1280, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const nav = page.getByRole("navigation", { name: "Main" });
      await expect(nav).toBeVisible();
      await expect(nav.getByRole("link")).toHaveText(NAV_LABELS);
      await expect(nav.getByRole("link", { name: "Home", exact: true })).toHaveAttribute(
        "aria-current",
        "page",
      );
      await expect(page.getByRole("button", { name: "Menu", exact: true })).toBeHidden();

      const bar = page.locator("header > div").first();
      const cta = page.getByRole("banner").getByRole("link", { name: "Book a school visit" });
      await expect(cta).toBeVisible();
      await expect(cta).toHaveAttribute("href", "/#visit");
      const [barBox, ctaBox] = [await bar.boundingBox(), await cta.boundingBox()];
      expect(barBox!.height, `bar height @${width}`).toBe(80);
      expect(ctaBox!.x + ctaBox!.width, `CTA inside bar @${width}`).toBeLessThanOrEqual(
        barBox!.x + barBox!.width,
      );
    }
  });

  test("below 1200px: Menu button replaces the navigation", async ({ page }, info) => {
    test.skip(once(info.project.name), "explicit viewports below");
    for (const [width, barHeight] of [
      [320, 64],
      [390, 64],
      [430, 64],
      [768, 80],
      [1024, 80],
    ] as const) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/");
      await expect(page.getByRole("button", { name: "Menu", exact: true })).toBeVisible();
      await expect(page.getByRole("navigation", { name: "Main" })).toBeHidden();
      const bar = await page.locator("header > div").first().boundingBox();
      expect(bar!.height, `bar height @${width}`).toBe(barHeight);
      expect(await noHorizontalOverflow(page), `overflow @${width}`).toBe(true);
    }
  });

  test("logo link has the full accessible name", async ({ page }) => {
    await page.goto("/");
    await expect(
      page
        .getByRole("banner")
        .getByRole("link", { name: "Feather Touch Foundation School and Day Care Centre, home" }),
    ).toBeVisible();
  });
});

test.describe("V3 mobile menu", () => {
  test.use({ viewport: PHONE });
  // Phone viewport is forced, so run in two projects only: normal + reduced motion.
  test.beforeEach(({}, info) => {
    test.skip(!["mobile-360", "reduced-motion"].includes(info.project.name), "phone-only behaviour");
  });

  const trigger = (page: Page) => page.getByRole("button", { name: "Menu", exact: true });
  const dialog = (page: Page) => page.getByRole("dialog", { name: "Menu" });
  const htmlOverflow = (page: Page) => page.evaluate(() => document.documentElement.style.overflow);

  test("trigger is a real button wired with aria-expanded and aria-controls", async ({ page }) => {
    await page.goto("/");
    const btn = trigger(page);
    await expect(btn).toHaveAttribute("aria-expanded", "false");
    const controls = await btn.getAttribute("aria-controls");
    expect(controls).toBeTruthy();
    await expect(page.locator(`#${controls}`)).toHaveCount(1);
    await expect(dialog(page)).toBeHidden();
  });

  test("opens with focus inside, locks scroll, closes with Escape and returns focus", async ({ page }) => {
    await page.goto("/");
    const scrollY = () => page.evaluate(() => window.scrollY);

    // Keyboard open (the header is not sticky, so the trigger is at the top).
    await trigger(page).focus();
    await page.keyboard.press("Enter");
    await expect(dialog(page)).toBeVisible();
    await expect(trigger(page)).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("button", { name: "Close menu" })).toBeFocused();
    expect(await htmlOverflow(page)).toBe("hidden");

    // Scroll lock: wheel input does not move the page behind the menu.
    const before = await scrollY();
    await page.mouse.move(195, 600);
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(150);
    expect(await scrollY()).toBe(before);

    await page.keyboard.press("Escape");
    await expect(dialog(page)).toBeHidden();
    await expect(trigger(page)).toHaveAttribute("aria-expanded", "false");
    await expect(trigger(page)).toBeFocused();
    expect(await htmlOverflow(page)).toBe("");

    // Unlocked: the page scrolls again.
    await page.mouse.wheel(0, 600);
    await expect.poll(scrollY).toBeGreaterThan(before);
  });

  test("Close button closes and returns focus to the trigger", async ({ page }) => {
    await page.goto("/");
    await trigger(page).click();
    await page.getByRole("button", { name: "Close menu" }).click();
    await expect(dialog(page)).toBeHidden();
    await expect(trigger(page)).toBeFocused();
    expect(await htmlOverflow(page)).toBe("");
  });

  test("keyboard: Tab moves through the menu and focus never leaves it", async ({ page }) => {
    await page.goto("/");
    await trigger(page).click();
    const menu = dialog(page);
    await expect(menu.getByRole("navigation", { name: "Main" }).getByRole("link")).toHaveText(NAV_LABELS);

    // logo, Close, 7 links, 2 CTAs = 11 stops; go round more than once.
    for (let i = 0; i < 14; i++) {
      await page.keyboard.press("Tab");
      const inside = await page.evaluate(() => {
        const a = document.activeElement;
        return a === document.body || !!a?.closest("dialog[open]");
      });
      expect(inside, `Tab #${i + 1}`).toBe(true);
    }
  });

  test("choosing a link closes the menu and navigates", async ({ page }) => {
    await page.goto("/");
    await trigger(page).click();
    await dialog(page).getByRole("link", { name: "Programmes" }).click();
    await expect(dialog(page)).toBeHidden();
    await expect(page).toHaveURL(/\/#programmes$/);
    expect(await htmlOverflow(page)).toBe("");
  });

  test("the logo link inside the menu closes it and unlocks scroll", async ({ page }) => {
    await page.goto("/#faq");
    await trigger(page).click();
    await expect(dialog(page)).toBeVisible();
    await dialog(page)
      .getByRole("link", { name: "Feather Touch Foundation School and Day Care Centre, home" })
      .click();
    await expect(dialog(page)).toBeHidden();
    await expect(trigger(page)).toHaveAttribute("aria-expanded", "false");
    expect(await htmlOverflow(page)).toBe("");
  });

  test("menu marks the current page and shows both visit CTAs", async ({ page }) => {
    await page.goto("/");
    await trigger(page).click();
    const menu = dialog(page);
    await expect(menu.getByRole("link", { name: "Home", exact: true })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(menu.getByRole("link", { name: "Book a school visit" })).toHaveAttribute("href", "/#visit");
    await expect(menu.getByRole("link", { name: "Enquire now" })).toHaveAttribute("href", "/#visit");
  });

  test("growing to the desktop layout closes the menu and unlocks scroll", async ({ page }) => {
    await page.goto("/");
    await trigger(page).click();
    await expect(dialog(page)).toBeVisible();
    await page.setViewportSize({ width: 1280, height: 900 });
    // CSS hides the menu wrapper at 1200px before the media-query listener
    // closes the dialog, so wait for the real close + unlock.
    await expect.poll(() => page.evaluate(() => document.querySelector("dialog")?.open)).toBe(false);
    await expect.poll(() => htmlOverflow(page)).toBe("");
  });

  test("has no axe violations while open", async ({ page }) => {
    await page.goto("/");
    await trigger(page).click();
    const results = await new AxeBuilder({ page }).withTags(WCAG).analyze();
    expect(results.violations).toEqual([]);
  });

  test("reduced motion: the menu and buttons do not animate", async ({ page }, info) => {
    test.skip(info.project.name !== "reduced-motion", "reduced-motion project only");
    await page.goto("/");
    await trigger(page).click();
    const state = await page.evaluate(() => ({
      animations: document.getAnimations().length,
      buttonTransition: getComputedStyle(
        document.querySelector<HTMLElement>("dialog[open] a[href='/#visit']")!,
      ).transitionDuration,
    }));
    expect(state.animations).toBe(0);
    expect(parseFloat(state.buttonTransition)).toBeLessThan(0.001);
  });
});

test.describe("V3 footer", () => {
  test("renders brand, Visit, Contact, Explore and the copyright row", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    await expect(footer.getByRole("img", { name: "Feather Touch" })).toBeVisible();
    await expect(footer.getByText("Nurturing little minds, building strong foundations.")).toBeVisible();
    for (const h of ["Visit", "Contact", "Explore"]) {
      await expect(footer.getByRole("heading", { level: 2, name: h })).toBeVisible();
    }
    await expect(footer.getByRole("navigation", { name: "Explore" }).getByRole("link")).toHaveText([
      "About",
      "Programmes",
      "Day Care",
      "School Life",
      "Admissions",
    ]);
    await expect(
      footer.getByText(/^© \d{4} Feather Touch Foundation School and Day Care Centre$/),
    ).toBeVisible();
  });

  test("Explore links have a comfortable hit height (≥24px)", async ({ page }) => {
    await page.goto("/");
    const heights = await page
      .getByRole("navigation", { name: "Explore" })
      .getByRole("link")
      .evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height));
    expect(heights).toHaveLength(5);
    for (const h of heights) expect(h).toBeGreaterThanOrEqual(26);
  });

  test("unsupplied school facts show preview-only content-required flags", async ({ page }) => {
    await page.goto("/");
    const flags = page.getByRole("contentinfo").locator("[data-content-required]");
    await expect(flags).toHaveCount(6); // address, visiting hours, phone, WhatsApp, email, privacy
    await expect(flags.filter({ hasText: "Privacy policy" })).toContainText(/approval required/i);
  });
});

test.describe("V3 design-system preview route", () => {
  test("renders in preview builds without accessibility violations", async ({ page }) => {
    const res = await page.goto("/dev/design-system");
    expect(res?.status()).toBe(200);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    expect(await noHorizontalOverflow(page)).toBe(true);
    const results = await new AxeBuilder({ page }).withTags(WCAG).analyze();
    expect(results.violations).toEqual([]);
  });

  test("dark bands switch the focus ring to paper", async ({ page }) => {
    await page.goto("/dev/design-system");
    const link = page.getByRole("link", { name: "Focus ring on dark bands is paper-coloured" });
    await link.focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    const outline = await link.evaluate((el) => getComputedStyle(el).outlineColor);
    expect(outline).toBe("rgb(255, 246, 230)");
  });
});
