/**
 * Idempotent seed: `npx prisma db seed` (or `npm run db:seed`).
 *
 * - Upserts programmes and FAQs by stable keys (safe to re-run).
 * - Ensures the SiteSettings singleton exists with every school fact NULL.
 *   Existing SiteSettings values are never overwritten.
 * - Creates NO users, media, reviews or enquiries. Admins are created with
 *   `npm run admin:create`.
 */
import "dotenv/config";
import type { PrismaClient } from "@/lib/generated/prisma/client";
import { createPrismaClient } from "./client-factory";
import { FAQS, PROGRAMMES } from "./seed-data";

export async function seed(db: PrismaClient): Promise<void> {
  for (const p of PROGRAMMES) {
    await db.programme.upsert({
      where: { slug: p.slug },
      create: { ...p, focusAreas: [...p.focusAreas] },
      // Re-seeding refreshes the verbatim copy + approved ages, but never touches
      // admin-managed fields (overview, timings, image, isActive).
      update: {
        name: p.name,
        tagline: p.tagline,
        focusAreas: [...p.focusAreas],
        ageMinYears: p.ageMinYears,
        ageMaxYears: p.ageMaxYears,
        sortOrder: p.sortOrder,
      },
    });
  }

  for (const f of FAQS) {
    await db.faq.upsert({
      where: { key: f.key },
      create: f,
      update: {},
    });
  }

  await db.siteSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton" },
    update: {},
  });
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("[seed] DATABASE_URL is not set (see web/.env.example).");
  const db = createPrismaClient(url);
  try {
    await seed(db);
    const [programmes, faqs] = await Promise.all([db.programme.count(), db.faq.count()]);
    console.log(`[seed] ok — programmes: ${programmes}, faqs: ${faqs}, site settings: singleton`);
  } finally {
    await db.$disconnect();
  }
}

// Only run when executed directly (not when imported by integration tests).
if (process.argv[1] && /prisma[\\/]seed\.ts$/.test(process.argv[1])) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
