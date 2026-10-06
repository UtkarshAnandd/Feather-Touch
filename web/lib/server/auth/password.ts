import "server-only";
import { hash, verify } from "@node-rs/argon2";

/**
 * Admin password hashing — argon2id (the @node-rs/argon2 default algorithm)
 * with OWASP-recommended minimum parameters (m=19 MiB, t=2, p=1).
 *
 * Used by better-auth (emailAndPassword.password.hash/verify) AND by the
 * `admin:create` CLI, so both always produce/verify the same format.
 */
const ARGON2_OPTIONS = { memoryCost: 19_456, timeCost: 2, parallelism: 1 } as const;

export const PASSWORD_MIN_LENGTH = 12;
export const PASSWORD_MAX_LENGTH = 128;

export type PasswordPolicyResult = { ok: true } | { ok: false; reason: string };

export function checkPasswordPolicy(
  password: string,
  context: { email?: string } = {},
): PasswordPolicyResult {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return { ok: false, reason: `Password must be at least ${PASSWORD_MIN_LENGTH} characters.` };
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return { ok: false, reason: `Password must be at most ${PASSWORD_MAX_LENGTH} characters.` };
  }
  if (/^(.)\1+$/.test(password)) {
    return { ok: false, reason: "Password must not be a single repeated character." };
  }
  const local = context.email?.split("@")[0]?.toLowerCase();
  if (local && local.length >= 4 && password.toLowerCase().includes(local)) {
    return { ok: false, reason: "Password must not contain the email name." };
  }
  return { ok: true };
}

export function hashPassword(password: string): Promise<string> {
  return hash(password, ARGON2_OPTIONS);
}

export async function verifyPassword(hashed: string, password: string): Promise<boolean> {
  try {
    return await verify(hashed, password);
  } catch {
    // Malformed/legacy hash → treat as a failed verification, never throw to the caller.
    return false;
  }
}
