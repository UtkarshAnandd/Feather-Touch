import { execSync } from "node:child_process";
import "dotenv/config";

/**
 * Applies all migrations to the dedicated TEST database before the integration
 * suite (non-destructive `migrate deploy`). Tests clean up the rows they create.
 *
 * To wipe the local test database completely, a developer can run:
 *   DATABASE_URL=$TEST_DATABASE_URL DIRECT_URL=$TEST_DATABASE_URL npx prisma migrate reset
 * (CI always starts from a fresh Postgres service container.)
 */
export default function setup() {
  const url = process.env.TEST_DATABASE_URL;
  if (!url) {
    throw new Error(
      "TEST_DATABASE_URL is required for integration tests (start Docker: `npm run services:up`).",
    );
  }
  if (!/test/i.test(new URL(url).pathname)) {
    throw new Error(
      "Refusing to run integration tests against a database whose name does not contain 'test'.",
    );
  }
  execSync("npx prisma migrate deploy", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: url, DIRECT_URL: url },
  });
}
