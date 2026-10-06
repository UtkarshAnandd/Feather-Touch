import { afterEach, describe, expect, it, vi } from "vitest";
import {
  EnvConfigError,
  authEnvSchema,
  getAuthEnv,
  getEmailProviderEnv,
  getSiteMode,
  getStorageEnv,
  parseFeatureEnv,
  resetEnvCache,
} from "@/lib/server/env";

afterEach(() => {
  vi.unstubAllEnvs();
  resetEnvCache();
});

describe("lazy per-feature env validation", () => {
  it("importing the module never throws, even with no env configured", async () => {
    vi.stubEnv("BETTER_AUTH_SECRET", "");
    vi.stubEnv("DATABASE_URL", "");
    await expect(import("@/lib/server/env")).resolves.toBeDefined();
  });

  it("names missing variables without echoing any values", () => {
    const secret = "x".repeat(10); // too short
    try {
      parseFeatureEnv("admin authentication", authEnvSchema, {
        BETTER_AUTH_SECRET: secret,
        BETTER_AUTH_URL: "",
      });
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(EnvConfigError);
      const message = (err as Error).message;
      expect(message).toContain("BETTER_AUTH_SECRET");
      expect(message).toContain("BETTER_AUTH_URL");
      expect(message).not.toContain(secret);
    }
  });

  it("validates only the requested feature", () => {
    vi.stubEnv("STORAGE_ENDPOINT", "");
    vi.stubEnv("BETTER_AUTH_SECRET", "s".repeat(40));
    vi.stubEnv("BETTER_AUTH_URL", "http://localhost:3000");
    expect(() => getAuthEnv()).not.toThrow();
    expect(() => getStorageEnv()).toThrow(EnvConfigError);
  });

  it("ADMIN_REQUIRE_2FA defaults to true and parses 'false'", () => {
    vi.stubEnv("BETTER_AUTH_SECRET", "s".repeat(40));
    vi.stubEnv("BETTER_AUTH_URL", "http://localhost:3000");
    vi.stubEnv("ADMIN_REQUIRE_2FA", "");
    expect(getAuthEnv().ADMIN_REQUIRE_2FA).toBe(true);
    resetEnvCache();
    vi.stubEnv("ADMIN_REQUIRE_2FA", "false");
    expect(getAuthEnv().ADMIN_REQUIRE_2FA).toBe(false);
  });

  it("parses comma-separated trusted origins", () => {
    vi.stubEnv("BETTER_AUTH_SECRET", "s".repeat(40));
    vi.stubEnv("BETTER_AUTH_URL", "http://localhost:3000");
    vi.stubEnv("BETTER_AUTH_TRUSTED_ORIGINS", "https://a.example, https://b.example");
    expect(getAuthEnv().BETTER_AUTH_TRUSTED_ORIGINS).toEqual(["https://a.example", "https://b.example"]);
  });

  it("notification providers default to safe local values and are disabled by default", () => {
    vi.stubEnv("EMAIL_PROVIDER", "");
    vi.stubEnv("NOTIFICATIONS_EMAIL_ENABLED", "");
    expect(getEmailProviderEnv()).toEqual({ EMAIL_PROVIDER: "memory", NOTIFICATIONS_EMAIL_ENABLED: false });
  });

  it("site mode is 'preview' unless explicitly production", () => {
    vi.stubEnv("SITE_MODE", "");
    expect(getSiteMode()).toBe("preview");
    vi.stubEnv("SITE_MODE", "Production");
    expect(getSiteMode()).toBe("preview");
    vi.stubEnv("SITE_MODE", "production");
    expect(getSiteMode()).toBe("production");
  });
});
