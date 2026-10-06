/**
 * Create (or re-activate with a new password) an ADMIN user.
 *
 *   npm run admin:create -- --email admin@example.org --name "Admin Name"
 *
 * The password is NEVER accepted as a CLI argument (shell history). It is read
 * from a hidden TTY prompt, or from stdin when piped (CI/integration tests).
 *
 * Public sign-up is disabled in better-auth; this script is the only way to
 * create admins in Phase 1A. The new admin must enrol TOTP 2FA on first login.
 */
import "dotenv/config";
import { randomUUID } from "node:crypto";
import { parseArgs } from "node:util";
import { z } from "zod";
import type { PrismaClient } from "@/lib/generated/prisma/client";
import { checkPasswordPolicy, hashPassword } from "@/lib/server/auth/password";
import { createPrismaClient } from "@/prisma/client-factory";

const argsSchema = z.object({
  email: z.email().transform((e) => e.trim().toLowerCase()),
  name: z.string().trim().min(1).max(120),
});

export type CreateAdminResult = { userId: string; created: boolean };

export async function createAdmin(
  db: PrismaClient,
  input: { email: string; name: string; password: string },
): Promise<CreateAdminResult> {
  const { email, name } = argsSchema.parse(input);
  const policy = checkPasswordPolicy(input.password, { email });
  if (!policy.ok) throw new Error(policy.reason);
  const passwordHash = await hashPassword(input.password);

  return db.$transaction(async (tx) => {
    const existing = await tx.user.findUnique({ where: { email } });
    if (existing) {
      await tx.user.update({ where: { id: existing.id }, data: { name, role: "ADMIN", isActive: true } });
      await tx.account.upsert({
        where: { providerId_accountId: { providerId: "credential", accountId: existing.id } },
        create: {
          id: randomUUID(),
          providerId: "credential",
          accountId: existing.id,
          userId: existing.id,
          password: passwordHash,
        },
        update: { password: passwordHash },
      });
      // Password changed → revoke every existing session.
      await tx.session.deleteMany({ where: { userId: existing.id } });
      return { userId: existing.id, created: false };
    }
    const userId = randomUUID();
    await tx.user.create({
      data: { id: userId, email, name, emailVerified: true, role: "ADMIN", isActive: true },
    });
    await tx.account.create({
      data: { id: randomUUID(), providerId: "credential", accountId: userId, userId, password: passwordHash },
    });
    return { userId, created: true };
  });
}

async function readPassword(prompt: string): Promise<string> {
  const stdin = process.stdin;
  if (!stdin.isTTY) {
    const chunks: Buffer[] = [];
    for await (const chunk of stdin) chunks.push(Buffer.from(chunk));
    return Buffer.concat(chunks).toString("utf8").split(/\r?\n/)[0] ?? "";
  }
  process.stdout.write(prompt);
  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding("utf8");
  return new Promise((resolve, reject) => {
    let value = "";
    const onData = (ch: string) => {
      if (ch === "\r" || ch === "\n" || ch === "\u0004") {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.off("data", onData);
        process.stdout.write("\n");
        resolve(value);
      } else if (ch === "\u0003") {
        stdin.setRawMode(false);
        reject(new Error("Cancelled"));
      } else if (ch === "\u007f") {
        value = value.slice(0, -1);
      } else {
        value += ch;
      }
    };
    stdin.on("data", onData);
  });
}

async function main() {
  const { values } = parseArgs({
    options: { email: { type: "string" }, name: { type: "string" } },
    strict: true,
  });
  const args = argsSchema.safeParse(values);
  if (!args.success) {
    console.error('Usage: npm run admin:create -- --email <email> --name "<full name>"');
    process.exit(2);
  }
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set (see web/.env.example).");

  const password = await readPassword("New admin password (min 12 chars): ");
  if (process.stdin.isTTY) {
    const confirm = await readPassword("Confirm password: ");
    if (confirm !== password) {
      console.error("Passwords do not match.");
      process.exit(1);
    }
  }

  const db = createPrismaClient(url);
  try {
    const result = await createAdmin(db, { ...args.data, password });
    console.log(
      result.created
        ? `Admin created (${args.data.email}). They must enrol 2FA at /admin/account on first login.`
        : `Existing admin ${args.data.email} re-activated with a new password; all their sessions were revoked.`,
    );
  } finally {
    await db.$disconnect();
  }
}

if (process.argv[1] && /scripts[\\/]create-admin\.ts$/.test(process.argv[1])) {
  main().catch((err: unknown) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  });
}
