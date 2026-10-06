import { describe, expect, it } from "vitest";
import { evaluateAdminAccess } from "@/lib/server/auth/admin-policy";

const admin = { id: "u1", role: "ADMIN", isActive: true, twoFactorEnabled: true };

describe("evaluateAdminAccess", () => {
  it("rejects anonymous callers", () => {
    expect(evaluateAdminAccess(null, { require2FA: true }).kind).toBe("unauthenticated");
    expect(evaluateAdminAccess(undefined, { require2FA: false }).kind).toBe("unauthenticated");
  });

  it("allows an active ADMIN with 2FA", () => {
    expect(evaluateAdminAccess(admin, { require2FA: true }).kind).toBe("allow");
  });

  it("forbids deactivated admins", () => {
    expect(evaluateAdminAccess({ ...admin, isActive: false }, { require2FA: false }).kind).toBe("forbidden");
  });

  it("fails closed when role or isActive is missing/unknown", () => {
    expect(evaluateAdminAccess({ id: "u", twoFactorEnabled: true }, { require2FA: false }).kind).toBe(
      "forbidden",
    );
    expect(evaluateAdminAccess({ ...admin, role: "USER" }, { require2FA: false }).kind).toBe("forbidden");
    expect(evaluateAdminAccess({ ...admin, isActive: null }, { require2FA: false }).kind).toBe("forbidden");
  });

  it("requires 2FA enrolment when configured, except on the enrolment screen", () => {
    const pending = { ...admin, twoFactorEnabled: false };
    expect(evaluateAdminAccess(pending, { require2FA: true }).kind).toBe("needs-2fa");
    expect(evaluateAdminAccess(pending, { require2FA: true, allowPending2FA: true }).kind).toBe("allow");
    expect(evaluateAdminAccess(pending, { require2FA: false }).kind).toBe("allow");
  });

  it("allowPending2FA never bypasses role/active checks", () => {
    expect(
      evaluateAdminAccess({ ...admin, isActive: false }, { require2FA: true, allowPending2FA: true }).kind,
    ).toBe("forbidden");
  });
});
