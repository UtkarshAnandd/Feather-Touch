import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * Prisma CLI configuration.
 *
 * The datasource URL is intentionally optional here so that `prisma generate`,
 * `prisma validate`, `prisma format` and `next build` work without database
 * credentials. Commands that need a database (migrate, seed, studio) will fail
 * with a clear Prisma error if neither variable is set.
 *
 * On Neon, migrations should use the direct (non-pooled) connection string.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx --conditions=react-server prisma/seed.ts",
  },
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
  },
});
