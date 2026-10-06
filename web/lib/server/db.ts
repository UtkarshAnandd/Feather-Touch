import "server-only";
import type { PrismaClient } from "@/lib/generated/prisma/client";
import { createPrismaClient } from "@/prisma/client-factory";
import { getDatabaseEnv } from "./env";

/**
 * Lazily-created Prisma client for the Next.js server runtime.
 *
 * Never instantiated at import time, so builds and the static public shell do
 * not need DATABASE_URL. Re-used across hot reloads in development.
 */
const globalForPrisma = globalThis as unknown as { __featherPrisma?: PrismaClient };

export function getDb(): PrismaClient {
  if (!globalForPrisma.__featherPrisma) {
    const { DATABASE_URL } = getDatabaseEnv();
    globalForPrisma.__featherPrisma = createPrismaClient(DATABASE_URL);
  }
  return globalForPrisma.__featherPrisma;
}
