import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAdmin } from "@/scripts/create-admin";
import { evaluateAdminAccess } from "@/lib/server/auth/admin-policy";
import { getAuth } from "@/lib/server/auth/auth";
import { getDb } from "@/lib/server/db";
import { totpFromUri } from "@/tests/support/totp";

/**
 * Exercises the real better-auth HTTP handler against PostgreSQL:
 * sign-up disabled, argon2 login, session creation guard, TOTP 2FA, rate limit.
 */
const ORIGIN = "http://localhost:3000";
const PASSWORD = "correct-horse-battery-42";
let ipCounter = 10;

function call(path: string, body: unknown, opts: { cookie?: string; ip?: string } = {}) {
  return getAuth().handler(
    new Request(`${ORIGIN}/api/auth${path}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: ORIGIN,
        "x-forwarded-for": opts.ip ?? `10.0.0.${ipCounter++}`,
        ...(opts.cookie ? { cookie: opts.cookie } : {}),
      },
      body: JSON.stringify(body),
    }),
  );
}

function sessionCookie(res: Response): string | undefined {
  return (
    res.headers
      .getSetCookie()
      .map((c) => c.split(";")[0]!)
      // An empty value is better-auth CLEARING the cookie, not issuing a session.
      .find((c) => c.startsWith("ft-admin.session_token=") && c !== "ft-admin.session_token=")
  );
}

const db = getDb();

beforeAll(async () => {
  await db.session.deleteMany();
  await db.twoFactor.deleteMany();
  await db.account.deleteMany();
  await db.user.deleteMany();
  await db.rateLimit.deleteMany();
  await createAdmin(db, { email: "admin@school.test", name: "Test Admin", password: PASSWORD });
  await createAdmin(db, { email: "former@school.test", name: "Former Admin", password: PASSWORD });
  await db.user.update({ where: { email: "former@school.test" }, data: { isActive: false } });
});

afterAll(() => db.$disconnect());

describe("admin authentication (better-auth + Prisma)", () => {
  it("public sign-up is disabled", async () => {
    const res = await call("/sign-up/email", {
      email: "parent@example.test",
      password: "some-password-123",
      name: "P",
    });
    expect(res.ok).toBe(false);
    expect(await db.user.count({ where: { email: "parent@example.test" } })).toBe(0);
  });

  it("rejects a wrong password without issuing a session", async () => {
    const res = await call("/sign-in/email", { email: "admin@school.test", password: "wrong-password-xyz" });
    expect(res.status).toBe(401);
    expect(sessionCookie(res)).toBeUndefined();
  });

  it("refuses to create a session for a deactivated admin", async () => {
    const res = await call("/sign-in/email", { email: "former@school.test", password: PASSWORD });
    expect(res.ok).toBe(false);
    expect(sessionCookie(res)).toBeUndefined();
    expect(await db.session.count({ where: { user: { email: "former@school.test" } } })).toBe(0);
  });

  it("full flow: login → 2FA required → enrol TOTP → later logins demand the second factor", async () => {
    // 1. Password login (no 2FA yet) issues a session…
    const login = await call("/sign-in/email", { email: "admin@school.test", password: PASSWORD });
    expect(login.status).toBe(200);
    const cookie = sessionCookie(login);
    expect(cookie).toBeDefined();

    // …but the access policy still blocks admin screens until 2FA is enrolled.
    const session = await getAuth().api.getSession({ headers: new Headers({ cookie: cookie! }) });
    expect(session?.user.role).toBe("ADMIN");
    expect(session?.user.isActive).toBe(true);
    expect(evaluateAdminAccess(session?.user, { require2FA: true }).kind).toBe("needs-2fa");

    // 2. Enrol TOTP.
    const enable = await call("/two-factor/enable", { password: PASSWORD }, { cookie });
    expect(enable.status).toBe(200);
    const { totpURI, backupCodes } = (await enable.json()) as { totpURI: string; backupCodes: string[] };
    expect(totpURI).toMatch(/^otpauth:\/\/totp\//);
    expect(backupCodes.length).toBeGreaterThan(0);

    const verify = await call("/two-factor/verify-totp", { code: totpFromUri(totpURI) }, { cookie });
    expect(verify.status).toBe(200);
    const enrolled = await db.user.findUniqueOrThrow({ where: { email: "admin@school.test" } });
    expect(enrolled.twoFactorEnabled).toBe(true);

    // 3. A fresh password login now stops at the second factor (no session yet).
    const sessionsBefore = await db.session.count();
    const relogin = await call("/sign-in/email", { email: "admin@school.test", password: PASSWORD });
    expect(relogin.status).toBe(200);
    expect(await relogin.json()).toMatchObject({ twoFactorRedirect: true });
    expect(sessionCookie(relogin)).toBeUndefined();
    expect(await db.session.count()).toBe(sessionsBefore);
  });

  it("rate-limits repeated sign-in attempts from one IP", async () => {
    const ip = "10.9.9.9";
    const statuses: number[] = [];
    for (let i = 0; i < 7; i++) {
      const res = await call(
        "/sign-in/email",
        { email: "admin@school.test", password: "wrong-password-xyz" },
        { ip },
      );
      statuses.push(res.status);
    }
    expect(statuses).toContain(429);
  });

  it("stores argon2id hashes, never plaintext", async () => {
    const account = await db.account.findFirstOrThrow({
      where: { providerId: "credential", user: { email: "admin@school.test" } },
    });
    expect(account.password?.startsWith("$argon2id$")).toBe(true);
    expect(account.password).not.toContain(PASSWORD);
  });
});
