import { afterAll, describe, expect, it } from "vitest";
import { createPrismaClient } from "@/prisma/client-factory";
import { seed } from "@/prisma/seed";

const db = createPrismaClient(process.env.TEST_DATABASE_URL!);
afterAll(() => db.$disconnect());

describe("seed (PostgreSQL)", () => {
  it("is idempotent and creates no invented school facts", async () => {
    const before = await Promise.all([db.user.count(), db.mediaAsset.count(), db.parentReview.count()]);
    await seed(db);
    await seed(db);

    expect(await db.programme.count()).toBe(5);
    expect(await db.faq.count()).toBe(6);
    expect(await db.siteSettings.count()).toBe(1);
    // Seeding never creates users, media or reviews.
    expect(await Promise.all([db.user.count(), db.mediaAsset.count(), db.parentReview.count()])).toEqual(
      before,
    );

    const dayCare = await db.programme.findUniqueOrThrow({ where: { slug: "day-care" } });
    expect(dayCare.ageMinYears).toBeNull();
    expect(dayCare.ageMaxYears).toBeNull();
    expect(dayCare.timings).toBeNull();

    const settings = await db.siteSettings.findUniqueOrThrow({ where: { id: "singleton" } });
    const facts = [
      settings.phoneDisplay,
      settings.email,
      settings.whatsappDigits,
      settings.streetAddress,
      settings.hoursSchool,
    ];
    expect(facts.every((v) => v === null)).toBe(true);
  });

  it("never overwrites admin-entered settings on re-seed", async () => {
    await db.siteSettings.update({ where: { id: "singleton" }, data: { responseTimeText: "admin value" } });
    await seed(db);
    const settings = await db.siteSettings.findUniqueOrThrow({ where: { id: "singleton" } });
    expect(settings.responseTimeText).toBe("admin value");
    await db.siteSettings.update({ where: { id: "singleton" }, data: { responseTimeText: null } });
  });
});
