import { expect, test, type Page } from "@playwright/test";

/**
 * 7-slide controls, exercised on the DEV-ONLY test fixture on
 * /dev/design-system (repeats the three approved preview photos; never on the
 * homepage, 404 in production). The homepage's own 7 slots (3 approved photos +
 * 4 marked placeholders) are covered in home.spec.ts.
 */
const PHONE = { width: 390, height: 844 };
const fixture = (page: Page) => page.getByRole("region", { name: "Seven-slide layout test fixture" });
const counter = async (page: Page) =>
  (await fixture(page).locator("p[aria-hidden=true]").first().textContent())?.trim();

async function open(page: Page, viewport: { width: number; height: number }) {
  await page.setViewportSize(viewport);
  await page.goto("/dev/design-system");
  await expect(fixture(page)).toHaveAttribute("data-hydrated", "true");
  await fixture(page).scrollIntoViewIfNeeded();
}

test.describe("7-slide controls (dev fixture)", () => {
  test.beforeEach(({}, info) => {
    test.skip(
      !["desktop-1280", "reduced-motion"].includes(info.project.name),
      "explicit viewports; two projects",
    );
  });

  test("≥601px: seven compact thumbnail tabs, each ≥44×44, no tab words", async ({ page }) => {
    for (const width of [768, 1024, 1280, 1440]) {
      await open(page, { width, height: 900 });
      const tabs = fixture(page).locator("[data-slide-tab]");
      await expect(tabs).toHaveCount(7);
      for (let i = 0; i < 7; i++) {
        const box = (await tabs.nth(i).boundingBox())!;
        expect(box.width, `tab ${i + 1} width @${width}`).toBeGreaterThanOrEqual(44);
        expect(box.height, `tab ${i + 1} height @${width}`).toBeGreaterThanOrEqual(44);
        await expect(tabs.nth(i)).toHaveAccessibleName(`Show photo ${i + 1} of 7: Test ${i + 1}`);
      }
      await expect(fixture(page).locator("[data-slide-segments]")).toBeHidden();
      await expect(fixture(page).getByText("Test 1", { exact: true })).toHaveCount(0);
      expect(await counter(page)).toBe("1 / 7");
    }
  });

  test("<601px: seven progress segments replace the tabs; arrows and pause stay ≥44px", async ({ page }) => {
    for (const width of [320, 390]) {
      await open(page, { width, height: 844 });
      await expect(fixture(page).locator("[data-slide-tab]:visible")).toHaveCount(0);
      const segments = fixture(page).locator("[data-slide-segment]");
      await expect(segments).toHaveCount(7);
      await expect(segments.first()).toBeVisible();
      for (const name of ["Previous photo", "Next photo", /^(Pause|Play) slideshow$/]) {
        const box = (await fixture(page).getByRole("button", { name }).boundingBox())!;
        expect(box.width, `${name} @${width}`).toBeGreaterThanOrEqual(44);
        expect(box.height, `${name} @${width}`).toBeGreaterThanOrEqual(44);
      }
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `@${width}`).toBe(0);
    }
  });

  test("autoplay, next/previous, swipe, keyboard and pause work with 7 slides", async ({ page }, info) => {
    test.skip(info.project.name === "reduced-motion", "autoplay test");
    await page.clock.install();
    await open(page, PHONE);
    await page.clock.runFor(5100);
    await expect.poll(() => counter(page)).toBe("2 / 7");
    await fixture(page).getByRole("button", { name: "Next photo" }).click();
    await expect.poll(() => counter(page)).toBe("3 / 7");
    await fixture(page).getByRole("button", { name: "Previous photo" }).click();
    await fixture(page).getByRole("button", { name: "Previous photo" }).click();
    await fixture(page).getByRole("button", { name: "Previous photo" }).click();
    await expect.poll(() => counter(page)).toBe("7 / 7"); // wraps

    const frame = fixture(page).locator("figure").first().locator("xpath=..");
    const box = (await frame.boundingBox())!;
    const y = box.y + box.height / 3;
    await page.mouse.move(box.x + 250, y);
    await page.mouse.down();
    await page.mouse.move(box.x + 120, y, { steps: 5 });
    await page.mouse.up();
    await expect.poll(() => counter(page)).toBe("1 / 7");

    // The active segment carries the progress fill.
    await expect(fixture(page).locator("[data-slide-segment]").nth(0).locator(".progress-run")).toHaveCount(
      1,
    );

    await fixture(page).getByRole("button", { name: "Pause slideshow" }).click();
    await expect(fixture(page).locator("[aria-live]")).toHaveAttribute("aria-live", "polite");
    await page.clock.runFor(20_000);
    expect(await counter(page)).toBe("1 / 7");

    await page.setViewportSize({ width: 1280, height: 900 });
    const tabs = fixture(page).locator("[data-slide-tab]");
    await tabs.nth(5).focus();
    await page.keyboard.press("ArrowRight");
    await expect.poll(() => counter(page)).toBe("7 / 7");
    await expect(tabs.nth(6)).toBeFocused();
    await expect(tabs.nth(6)).toHaveAttribute("aria-current", "true");
  });

  test("reduced motion: the 7-slide fixture starts paused with a full, static segment", async ({
    page,
  }, info) => {
    test.skip(info.project.name !== "reduced-motion", "reduced-motion project only");
    await page.clock.install();
    await open(page, PHONE);
    await expect(fixture(page).getByRole("button", { name: "Play slideshow" })).toBeVisible();
    await page.clock.runFor(20_000);
    expect(await counter(page)).toBe("1 / 7");
    const [fill, track] = await fixture(page)
      .locator("[data-slide-segment]")
      .first()
      .evaluate((el) => [
        el.firstElementChild!.getBoundingClientRect().width,
        el.getBoundingClientRect().width,
      ]);
    expect(fill).toBeCloseTo(track!, 0);
  });
});
