import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { HOME_SECTIONS, LEGACY_ANCHORS } from "../../content/sections";

/**
 * Phase 2A — the V3 homepage. Runs against a preview production build
 * (SITE_MODE unset), so content-required states are visible.
 */
const WCAG = ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"];
const PHONE = { width: 390, height: 844 };
const once = (name: string) => name !== "desktop-1280";

const carousel = (page: Page) => page.getByRole("region", { name: "Photos from Feather Touch" });
const activeSlide = (page: Page) => carousel(page).locator('figure[data-active="true"]');
const ready = (page: Page) => expect(carousel(page)).toHaveAttribute("data-hydrated", "true");
const counter = async (page: Page) =>
  (await carousel(page).locator("p[aria-hidden=true]").first().textContent())?.trim();

test.describe("homepage structure", () => {
  test("sections render in the approved narrative order with their anchors", async ({ page }) => {
    await page.goto("/");
    const ids = await page.locator("main > section").evaluateAll((els) => els.map((e) => e.id));
    // Gallery and Reviews are not V3 sections: they render only with real content (none yet).
    expect(ids).toEqual(HOME_SECTIONS.filter((s) => !s.conditional).map((s) => s.id));
    for (const id of [...LEGACY_ANCHORS, ...HOME_SECTIONS.flatMap((s) => s.aliases)]) {
      await expect(page.locator(`[id="${id}"]`), id).toHaveCount(1);
    }
  });

  test("one h1 (the V3 statement) and no skipped heading levels", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "We believe children learn best when they are happy.",
    );
    const levels = await page
      .locator("main h1, main h2, main h3, main h4")
      .evaluateAll((els) => els.map((e) => Number(e.tagName[1])));
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i]! - levels[i - 1]!, `heading ${i}`).toBeLessThanOrEqual(1);
    }
    // Every section is labelled by its own heading.
    const unlabelled = await page
      .locator("main > section")
      .evaluateAll((els) =>
        els.filter((s) => !document.getElementById(s.getAttribute("aria-labelledby") ?? "")).map((s) => s.id),
      );
    expect(unlabelled).toEqual([]);
  });

  test("programmes show the confirmed ages; Day Care age stays content-required", async ({ page }) => {
    await page.goto("/");
    const programmes = page.locator("#programmes");
    for (const age of ["2–3 years", "3–4 years", "4–5 years", "5–6 years"]) {
      await expect(programmes.getByText(age).first()).toBeAttached();
    }
    const ageRow = page
      .locator("#day-care dt", { hasText: "Age range" })
      .locator("xpath=following-sibling::dd[1]");
    await expect(ageRow).toContainText(/content required/i);
  });

  test("empty Gallery and Reviews are omitted; their legacy anchors remain", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("section#gallery, section#testimonials")).toHaveCount(0);
    await expect(page.locator("video, #testimonials blockquote")).toHaveCount(0);
    for (const id of ["gallery", "videos", "testimonials"]) {
      await expect(page.locator(`[id="${id}"]`), id).toHaveCount(1);
    }
    await expect(
      page.getByText(/Moments at Feather Touch|What parents say|videos required|reviews required/i),
    ).toHaveCount(0);
  });

  test("FAQ: native details, first open, toggles by keyboard", async ({ page }) => {
    await page.goto("/");
    const items = page.locator("#faq details");
    await expect(items).toHaveCount(6);
    await expect(items.first()).toHaveAttribute("open", "");
    const second = items.nth(1);
    await expect(second).not.toHaveAttribute("open", "");
    await second.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(second).toHaveAttribute("open", "");
  });

  test("has no axe violations", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page }).withTags(WCAG).analyze();
    expect(results.violations).toEqual([]);
  });
});

test.describe("responsive", () => {
  test("no horizontal overflow from 320px to 1440px", async ({ page }, info) => {
    test.skip(once(info.project.name), "explicit viewports");
    for (const width of [320, 390, 430, 768, 1024, 1200, 1280, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `@${width}`).toBe(0);
    }
  });

  test("hero slideshow: centred when stacked (601–1199px), V3 split at ≥1200px, full width at 390px", async ({
    page,
  }, info) => {
    test.skip(once(info.project.name), "explicit viewports");
    for (const width of [768, 1024]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const box = (await carousel(page).boundingBox())!;
      const right = width - (box.x + box.width);
      expect(Math.abs(box.x - right), `centred @${width}`).toBeLessThanOrEqual(1);
      expect(box.width).toBe(472);
    }
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    const desk = (await carousel(page).boundingBox())!;
    expect(desk.width).toBe(472);
    expect(Math.round(desk.x + desk.width)).toBe(1280 - 40); // right column of the V3 split
    await page.setViewportSize(PHONE);
    await page.goto("/");
    const phone = (await carousel(page).boundingBox())!;
    expect([Math.round(phone.x), Math.round(phone.width)]).toEqual([16, 358]);
  });

  test("anchor navigation keeps native focus behaviour (next Tab lands in the target)", async ({
    page,
  }, info) => {
    test.skip(once(info.project.name), "explicit viewports");
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    await page.locator("#home").getByRole("link", { name: "Book a school visit" }).click();
    await expect(page).toHaveURL(/#visit$/);
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => !!document.activeElement?.closest("#visit"))).toBe(true);

    await page.goto("/");
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Contact" }).click();
    await expect(page).toHaveURL(/#contact$/);
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => !!document.activeElement?.closest("#visit"))).toBe(true);
  });

  test("programmes: staircase ≥1200px, closed <details> below (tap + keyboard)", async ({ page }, info) => {
    test.skip(once(info.project.name), "explicit viewports");
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    await expect(page.locator("#programmes details").first()).toBeHidden();
    await expect(page.locator("#programmes").getByText("Focus areas", { exact: true }).first()).toBeVisible();

    await page.setViewportSize(PHONE);
    await page.goto("/");
    const details = page.locator("#programmes details");
    await expect(details).toHaveCount(4);
    await expect(details.first()).not.toHaveAttribute("open", "");
    await expect(details.first().locator("summary")).toHaveText("7 focus areas, age and timings");
    const box = await details.first().locator("summary").boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(48);
    await details.first().locator("summary").click();
    await expect(details.first()).toHaveAttribute("open", "");
    await details.nth(1).locator("summary").focus();
    await page.keyboard.press("Space");
    await expect(details.nth(1)).toHaveAttribute("open", "");
  });

  test("school posters: pinned wall ≥1200px, keyboard-scrollable strip below", async ({ page }, info) => {
    test.skip(once(info.project.name), "explicit viewports");
    await page.setViewportSize(PHONE);
    await page.goto("/");
    const strip = page.getByRole("region", { name: "School posters" });
    const scrollable = await strip.evaluate((el) => el.scrollWidth > el.clientWidth);
    expect(scrollable).toBe(true);
    await strip.focus();
    await page.keyboard.press("ArrowRight");
    await expect.poll(() => strip.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    expect(await strip.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
  });
});

const TAB_LABELS = ["Welcome", "Play", "Create", "Learn", "Celebrate", "Grow", "Together"];
const tabsOf = (page: Page) => carousel(page).locator("[data-slide-tab]");

test.describe("hero slideshow", () => {
  test.beforeEach(({}, info) => {
    test.skip(info.project.name === "reduced-motion", "covered by the reduced-motion test");
  });

  test("structure: seven slides (3 approved photos + 4 marked placeholders), first image prioritised", async ({
    page,
  }) => {
    await page.goto("/");
    const slides = carousel(page).locator("figure");
    await expect(slides).toHaveCount(7);
    expect(await counter(page)).toBe("1 / 7");
    await expect(slides.first()).toHaveAttribute("aria-roledescription", "slide");
    await expect(slides.nth(1)).toHaveAttribute("aria-hidden", "true");
    const imgs = slides.locator("img");
    await expect(imgs.first()).toHaveAttribute("fetchpriority", "high");
    await expect(imgs.first()).toHaveAttribute("loading", "eager");
    for (let i = 1; i < 7; i++) await expect(imgs.nth(i)).toHaveAttribute("loading", "lazy");
    for (let i = 0; i < 3; i++) {
      await expect(slides.nth(i)).not.toHaveAttribute("data-placeholder");
      expect(await imgs.nth(i).getAttribute("srcset")).toContain("/_next/image");
    }
    for (let i = 3; i < 7; i++) {
      await expect(slides.nth(i)).toHaveAttribute("data-placeholder", "true");
      await expect(imgs.nth(i)).toHaveAttribute("alt", /^Placeholder/);
      await expect(slides.nth(i).locator("figcaption")).toHaveText(/^Placeholder/);
    }
  });

  test("tab labels come from data, in order", async ({ page }) => {
    await page.goto("/");
    await expect(tabsOf(page)).toHaveCount(7);
    for (let i = 0; i < 7; i++) {
      await expect(tabsOf(page).nth(i)).toHaveAttribute(
        "aria-label",
        `Show photo ${i + 1} of 7: ${TAB_LABELS[i]}`,
      );
    }
  });

  test("serves AVIF when the browser accepts it", async ({ page, request }) => {
    await page.goto("/");
    const src = await carousel(page).locator("figure img").first().getAttribute("src");
    const res = await request.get(src!, { headers: { accept: "image/avif,image/webp,*/*" } });
    expect(res.headers()["content-type"]).toBe("image/avif");
  });

  test("autoplays every 5 seconds through all seven; manual navigation restarts the timer", async ({
    page,
  }) => {
    await page.clock.install();
    await page.goto("/");
    await ready(page);
    await expect(page.getByRole("button", { name: "Pause slideshow" })).toBeVisible();
    expect(await counter(page)).toBe("1 / 7");

    // The progress bar runs for exactly the autoplay interval.
    const fill = carousel(page).locator(".progress-run").first();
    expect(await fill.evaluate((el) => getComputedStyle(el).animationDuration)).toBe("5s");

    // install() lets real time flow; freeze it so the interval is measured exactly.
    // Pause first (no timer armed), freeze, then Play re-arms the 5s timer at a known time.
    await page.getByRole("button", { name: "Pause slideshow" }).click();
    await page.clock.pauseAt((await page.evaluate(() => Date.now())) + 1000);
    const start = Number((await counter(page))!.split(" / ")[0]);
    const at = (k: number) => `${((start - 1 + k) % 7) + 1} / 7`;
    await page.getByRole("button", { name: "Play slideshow" }).click();

    await page.clock.runFor(4999);
    expect(await counter(page)).toBe(at(0)); // not before 5s
    await page.clock.runFor(1);
    await expect.poll(() => counter(page)).toBe(at(1)); // exactly at 5s
    for (let k = 2; k <= 7; k++) {
      await page.clock.runFor(5000);
      await expect.poll(() => counter(page)).toBe(at(k)); // all seven, then wraps
    }

    // Manual "next" 3s into a cycle restarts the timer: 4.999s later it has not moved.
    await page.clock.runFor(3000);
    await page.getByRole("button", { name: "Next photo" }).click();
    await expect.poll(() => counter(page)).toBe(at(8));
    await page.clock.runFor(4999);
    expect(await counter(page)).toBe(at(8));
    await page.clock.runFor(1);
    await expect.poll(() => counter(page)).toBe(at(9));
  });

  test("previous/next reach all seven slides and wrap", async ({ page }) => {
    await page.clock.install(); // freeze autoplay so only manual navigation moves slides
    await page.goto("/");
    await ready(page);
    for (let n = 2; n <= 7; n++) {
      await page.getByRole("button", { name: "Next photo" }).click();
      await expect.poll(() => counter(page)).toBe(`${n} / 7`);
    }
    await page.getByRole("button", { name: "Next photo" }).click();
    await expect.poll(() => counter(page)).toBe("1 / 7");
    await page.getByRole("button", { name: "Previous photo" }).click();
    await expect.poll(() => counter(page)).toBe("7 / 7");
    await page.getByRole("button", { name: "Next photo" }).focus();
    await page.keyboard.press("Space");
    await expect.poll(() => counter(page)).toBe("1 / 7");
  });

  test("≥601px: seven compact tabs (≥44px), click and arrow keys", async ({ page }, info) => {
    test.skip(info.project.name === "mobile-360", "tabs are replaced by segments below 601px");
    await page.clock.install();
    await page.goto("/");
    await ready(page);
    const tabs = tabsOf(page);
    for (let i = 0; i < 7; i++) {
      await expect(tabs.nth(i)).toBeVisible();
      const box = (await tabs.nth(i).boundingBox())!;
      expect(Math.min(box.width, box.height), `tab ${i + 1}`).toBeGreaterThanOrEqual(44);
    }
    await expect(carousel(page).locator("[data-slide-segments]")).toBeHidden();

    await tabs.nth(5).click();
    await expect.poll(() => counter(page)).toBe("6 / 7");
    await expect(tabs.nth(5)).toHaveAttribute("aria-current", "true");
    await expect(tabs.nth(0)).toHaveAttribute("aria-current", "false");
    await expect(activeSlide(page)).toHaveAttribute("aria-label", "6 of 7");

    await page.keyboard.press("ArrowRight");
    await expect.poll(() => counter(page)).toBe("7 / 7");
    await expect(tabs.nth(6)).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect.poll(() => counter(page)).toBe("1 / 7");
    await expect(tabs.nth(0)).toBeFocused();
    await page.keyboard.press("ArrowLeft");
    await expect.poll(() => counter(page)).toBe("7 / 7");

    await tabs.nth(3).focus();
    await page.keyboard.press("Enter");
    await expect.poll(() => counter(page)).toBe("4 / 7");
  });

  test("<601px: seven progress segments replace the tabs; controls stay ≥44px", async ({ page }, info) => {
    test.skip(once(info.project.name) && info.project.name !== "mobile-360", "phone viewports");
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto("/");
      await ready(page);
      await expect(carousel(page).locator("[data-slide-tab]:visible")).toHaveCount(0);
      await expect(carousel(page).locator("[data-slide-segment]")).toHaveCount(7);
      await expect(carousel(page).locator("[data-slide-segments]")).toBeVisible();
      for (const name of ["Previous photo", "Next photo", "Pause slideshow"]) {
        const box = (await carousel(page).getByRole("button", { name }).boundingBox())!;
        expect(Math.min(box.width, box.height), `${name} @${width}`).toBeGreaterThanOrEqual(44);
      }
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `@${width}`).toBe(0);
    }
  });

  test("pause holds; play resumes; live region is polite only while paused", async ({ page }) => {
    await page.clock.install();
    await page.goto("/");
    await ready(page);
    const live = carousel(page).locator("[aria-live]");
    await expect(live).toHaveAttribute("aria-live", "off");
    await page.getByRole("button", { name: "Pause slideshow" }).click();
    await expect(live).toHaveAttribute("aria-live", "polite");
    await page.clock.runFor(20_000);
    expect(await counter(page)).toBe("1 / 7");
    await page.getByRole("button", { name: "Play slideshow" }).click();
    await expect(live).toHaveAttribute("aria-live", "off");
    await page.clock.runFor(5100);
    await expect.poll(() => counter(page)).toBe("2 / 7");
  });

  test("swipe left/right changes slides; a small drag is ignored", async ({ page }, info) => {
    test.skip(
      once(info.project.name) && info.project.name !== "mobile-360",
      "pointer test runs in two projects",
    );
    await page.clock.install();
    await page.setViewportSize(PHONE);
    await page.goto("/");
    await expect(carousel(page)).toHaveAttribute("data-hydrated", "true");
    const frame = carousel(page).locator("figure").first().locator("xpath=..");
    await frame.scrollIntoViewIfNeeded();
    const box = (await frame.boundingBox())!;
    const y = box.y + box.height / 3;
    const drag = async (from: number, to: number) => {
      await page.mouse.move(box.x + from, y);
      await page.mouse.down();
      await page.mouse.move(box.x + to, y, { steps: 5 });
      await page.mouse.up();
    };
    await drag(250, 120); // left swipe → next
    await expect.poll(() => counter(page)).toBe("2 / 7");
    await drag(120, 250); // right swipe → previous
    await expect.poll(() => counter(page)).toBe("1 / 7");
    await drag(120, 250); // right swipe from the first → wraps to the last
    await expect.poll(() => counter(page)).toBe("7 / 7");
    await drag(200, 175); // 25px: ignored
    expect(await counter(page)).toBe("7 / 7");
    expect(await frame.evaluate((el) => getComputedStyle(el).touchAction)).toBe("pan-y");
  });
});

test.describe("reduced motion", () => {
  test("slideshow starts paused, never advances, bar is static and full", async ({ page }, info) => {
    test.skip(info.project.name !== "reduced-motion", "reduced-motion project only");
    await page.clock.install();
    await page.goto("/");
    await ready(page);
    await expect(page.getByRole("button", { name: "Play slideshow" })).toBeVisible();
    await expect(carousel(page).locator("[aria-live]")).toHaveAttribute("aria-live", "polite");
    await page.clock.runFor(20_000);
    expect(await counter(page)).toBe("1 / 7");
    const motion = await page.evaluate(() => {
      const slide = document.querySelector<HTMLElement>('figure[aria-roledescription="slide"]')!;
      const fill = document.querySelector<HTMLElement>('[aria-current="true"] .progress-run')!;
      return {
        slideTransition: parseFloat(getComputedStyle(slide).transitionDuration),
        fillWidth: fill.getBoundingClientRect().width,
        trackWidth: fill.parentElement!.getBoundingClientRect().width,
      };
    });
    expect(motion.slideTransition).toBeLessThan(0.001);
    expect(motion.fillWidth).toBeCloseTo(motion.trackWidth, 0);
  });

  test("homepage has no axe violations with reduced motion", async ({ page }, info) => {
    test.skip(info.project.name !== "reduced-motion", "reduced-motion project only");
    await page.goto("/");
    const results = await new AxeBuilder({ page }).withTags(WCAG).analyze();
    expect(results.violations).toEqual([]);
  });
});

test.describe("visit form (no delivery yet)", () => {
  test("keeps the legacy contract and marks required vs optional", async ({ page }) => {
    await page.goto("/");
    const form = page.locator("form#enquiry-form");
    await expect(page.locator("#enquire")).toHaveCount(1);
    await expect(form.locator('input[name="extra_notes"]')).toHaveCount(1);
    await expect(page.locator("#form-feedback")).toHaveAttribute("role", "status");
    await expect(form).toHaveAttribute("method", "post");
    await expect(form.getByText("All fields are required unless marked optional.")).toBeVisible();
    await expect(form.getByText("Preferred day or time (optional)")).toBeVisible();
    await expect(form.getByLabel("Parent’s name")).toHaveAttribute("required", "");
    await expect(form.getByLabel("Phone number")).toHaveAttribute("type", "tel");
    await expect(form.getByLabel("Phone number")).toHaveAttribute("inputmode", "tel");
    await expect(form.getByRole("button", { name: "Request a visit" })).toBeEnabled();
  });

  test("inline errors with aria-invalid/aria-describedby; first invalid field focused", async ({ page }) => {
    await page.goto("/");
    const form = page.locator("form#enquiry-form");
    const name = form.getByLabel("Parent’s name");
    const phone = form.getByLabel("Phone number");
    const submit = form.getByRole("button", { name: "Request a visit" });
    await expect(submit).toBeEnabled();

    await submit.click();
    await expect(form.getByText("Enter the parent's name.")).toBeVisible();
    await expect(form.getByText("Enter a phone number with at least 10 digits.")).toBeVisible();
    await expect(form.getByText("Choose a programme.")).toBeVisible();
    await expect(name).toBeFocused();
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(name).toHaveAttribute("aria-describedby", "visit-parent-name-error");
    await expect(phone).toHaveAttribute("aria-describedby", "visit-phone-error");
    await expect(form.locator("fieldset")).toHaveAttribute("aria-describedby", "visit-programme-error");
    await expect(page.locator("#form-feedback")).toHaveText("");

    // Fixing a field clears its error; the next invalid field gets focus.
    await name.fill("Test Parent");
    await expect(name).not.toHaveAttribute("aria-invalid", "true");
    await phone.fill("12345");
    await submit.click();
    await expect(phone).toBeFocused();
    await expect(form.getByText("Enter a phone number with at least 10 digits.")).toBeVisible();

    await phone.fill("+91 98765 43210");
    await submit.click();
    await expect(form.getByRole("radio", { name: "Play Group" })).toBeFocused();
    await form.getByRole("radio", { name: "Nursery" }).check();
    await expect(form.getByText("Choose a programme.")).toHaveCount(0);
    await submit.click();
    await expect(page.locator("#form-feedback")).toContainText("has not been sent");
    await expect(page).toHaveURL(/\/(#.*)?$/); // nothing in the query string
  });

  test("without JavaScript the form cannot leak details into the URL", async ({ browser, baseURL }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
    const page = await context.newPage();
    await page.goto("/");
    const form = page.locator("form#enquiry-form");
    await expect(form.getByRole("button", { name: "Request a visit" })).toBeDisabled();
    await form.getByLabel("Parent’s name").fill("Test Parent");
    await form.getByLabel("Phone number").fill("9876543210");
    await form.getByLabel("Phone number").press("Enter"); // implicit submission is blocked
    await page.waitForTimeout(300);
    expect(new URL(page.url()).search).toBe("");
    await context.close();
  });
});
