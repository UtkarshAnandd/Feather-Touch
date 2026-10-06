import { describe, expect, it } from "vitest";
import { checkPasswordPolicy, hashPassword, verifyPassword } from "@/lib/server/auth/password";

describe("admin password hashing", () => {
  it("produces argon2id hashes that verify", async () => {
    const hash = await hashPassword("correct horse battery staple");
    expect(hash.startsWith("$argon2id$")).toBe(true);
    await expect(verifyPassword(hash, "correct horse battery staple")).resolves.toBe(true);
    await expect(verifyPassword(hash, "wrong password entirely")).resolves.toBe(false);
  });

  it("never throws on a malformed stored hash", async () => {
    await expect(verifyPassword("not-a-hash", "whatever-password")).resolves.toBe(false);
  });
});

describe("password policy", () => {
  it("enforces length bounds", () => {
    expect(checkPasswordPolicy("short").ok).toBe(false);
    expect(checkPasswordPolicy("a".repeat(129)).ok).toBe(false);
    expect(checkPasswordPolicy("twelve chars!").ok).toBe(true);
  });

  it("rejects trivial and email-derived passwords", () => {
    expect(checkPasswordPolicy("aaaaaaaaaaaaaa").ok).toBe(false);
    expect(checkPasswordPolicy("principal-2026-x", { email: "principal@school.test" }).ok).toBe(false);
  });
});
