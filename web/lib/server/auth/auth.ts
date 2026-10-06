import "server-only";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { twoFactor } from "better-auth/plugins/two-factor";
import { AUTH_COOKIE_PREFIX } from "@/lib/auth-constants";
import { getDb } from "@/lib/server/db";
import { getAuthEnv } from "@/lib/server/env";
import { ADMIN_ROLE } from "./admin-policy";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, hashPassword, verifyPassword } from "./password";

/**
 * better-auth configuration — ADMIN-ONLY authentication.
 *
 * - Email + password, sign-up DISABLED (admins are created via `npm run admin:create`).
 * - argon2id password hashing (see ./password.ts).
 * - TOTP two-factor (twoFactor plugin) with backup codes; 2FA enrolment is
 *   enforced for admin screens by requireAdmin() when ADMIN_REQUIRE_2FA=true.
 * - Database-backed sessions (revocable) and database-backed rate limiting
 *   (works across serverless instances).
 * - `role` / `isActive` are server-controlled (input: false) and re-checked at
 *   session creation AND on every requireAdmin() call.
 *
 * Constructed lazily so importing this module never requires secrets.
 */
function createAuth() {
  const env = getAuthEnv();
  const db = getDb();
  const baseOrigin = new URL(env.BETTER_AUTH_URL).origin;

  return betterAuth({
    appName: "Feather Touch Admin",
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    basePath: "/api/auth",
    trustedOrigins: [baseOrigin, ...env.BETTER_AUTH_TRUSTED_ORIGINS],
    database: prismaAdapter(db, { provider: "postgresql" }),
    telemetry: { enabled: false },

    emailAndPassword: {
      enabled: true,
      disableSignUp: true,
      autoSignIn: false,
      requireEmailVerification: false,
      minPasswordLength: PASSWORD_MIN_LENGTH,
      maxPasswordLength: PASSWORD_MAX_LENGTH,
      revokeSessionsOnPasswordReset: true,
      password: {
        hash: hashPassword,
        verify: ({ hash, password }) => verifyPassword(hash, password),
      },
    },

    user: {
      additionalFields: {
        role: { type: "string", required: false, defaultValue: ADMIN_ROLE, input: false },
        isActive: { type: "boolean", required: false, defaultValue: true, input: false },
      },
    },

    session: {
      // Sliding 8-hour idle window: refreshed at most hourly while in use.
      expiresIn: 60 * 60 * 8,
      updateAge: 60 * 60,
      // Sensitive actions (e.g. 2FA changes) need a session < 10 minutes old.
      freshAge: 60 * 10,
    },

    rateLimit: {
      enabled: true,
      storage: "database",
      window: 60,
      max: 60,
      customRules: {
        "/sign-in/email": { window: 15 * 60, max: 5 },
        "/two-factor/verify-totp": { window: 5 * 60, max: 5 },
        "/two-factor/verify-backup-code": { window: 5 * 60, max: 5 },
        "/two-factor/enable": { window: 5 * 60, max: 5 },
      },
    },

    advanced: {
      cookiePrefix: AUTH_COOKIE_PREFIX,
      useSecureCookies: baseOrigin.startsWith("https://"),
      defaultCookieAttributes: { sameSite: "lax", httpOnly: true },
    },

    databaseHooks: {
      session: {
        create: {
          // Defence in depth: never mint a session for a non-admin or deactivated user.
          before: async (session) => {
            const user = await db.user.findUnique({
              where: { id: session.userId },
              select: { role: true, isActive: true },
            });
            if (!user || user.role !== ADMIN_ROLE || !user.isActive) return false;
            return undefined;
          },
        },
      },
    },

    plugins: [
      twoFactor({
        issuer: "Feather Touch Admin",
        allowPasswordless: false,
        accountLockout: { enabled: true, maxFailedAttempts: 10, durationSeconds: 15 * 60 },
      }),
      // Must stay LAST: lets server actions set auth cookies via next/headers.
      nextCookies(),
    ],
  });
}

export type Auth = ReturnType<typeof createAuth>;

const globalForAuth = globalThis as unknown as { __featherAuth?: Auth };

export function getAuth(): Auth {
  globalForAuth.__featherAuth ??= createAuth();
  return globalForAuth.__featherAuth;
}
