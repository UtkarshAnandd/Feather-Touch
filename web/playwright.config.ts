import { defineConfig, devices } from "@playwright/test";

/**
 * E2E runs against a PRODUCTION build (`next build && next start`) so headers,
 * prerendering and proxy behaviour match deployment. Viewports mirror the
 * mobile-first targets; a reduced-motion project guards the motion rules.
 */
const PORT = Number(process.env.E2E_PORT ?? 3100);
const baseURL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: { baseURL, trace: "retain-on-failure" },
  projects: [
    { name: "mobile-360", use: { ...devices["Desktop Chrome"], viewport: { width: 360, height: 780 } } },
    { name: "tablet-768", use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 } } },
    { name: "desktop-1280", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } } },
    {
      name: "reduced-motion",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" },
    },
  ],
  webServer: {
    command: `npm run start -- --port ${PORT} --hostname 127.0.0.1`,
    url: `${baseURL}/api/health`,
    // Auth must trust the origin the tests use, so origin checks pass and the
    // assertions exercise the real auth rules (e.g. disabled sign-up).
    env: { BETTER_AUTH_URL: baseURL },
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
