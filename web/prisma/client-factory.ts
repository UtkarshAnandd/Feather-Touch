import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

/**
 * Single place that knows how to construct a PrismaClient (Prisma 7 + pg driver adapter).
 *
 * Deliberately NOT marked `server-only` so CLI scripts (seed, create-admin) and
 * integration tests can use it. Application code must go through
 * `lib/server/db.ts` instead — enforced by ESLint (no-restricted-imports).
 */
export function createPrismaClient(connectionString: string): PrismaClient {
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}
