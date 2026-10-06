import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

/**
 * Two projects:
 *  - unit        : pure/node tests, no services required (runs everywhere, incl. CI pre-DB).
 *  - integration : needs TEST_DATABASE_URL (local Docker Postgres or the CI service).
 *
 * `server-only` throws outside the react-server condition, so it is aliased to
 * an empty module for tests (Next.js does the equivalent in server bundles).
 */
const shared = {
  resolve: {
    alias: {
      "@": r("./"),
      "server-only": r("./tests/support/empty-module.ts"),
    },
  },
};

export default defineConfig({
  test: {
    projects: [
      {
        ...shared,
        test: {
          name: "unit",
          environment: "node",
          include: ["tests/unit/**/*.test.ts"],
        },
      },
      {
        ...shared,
        test: {
          name: "integration",
          environment: "node",
          include: ["tests/integration/**/*.test.ts"],
          globalSetup: ["tests/integration/global-setup.ts"],
          setupFiles: ["tests/integration/setup-env.ts"],
          fileParallelism: false,
          testTimeout: 30_000,
          hookTimeout: 120_000,
        },
      },
    ],
  },
});
