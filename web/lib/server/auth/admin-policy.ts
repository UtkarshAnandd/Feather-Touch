import "server-only";

/**
 * Pure admin-access policy (no I/O) so it can be exhaustively unit tested.
 * V1 has exactly one role: ADMIN. There are no public/parent accounts.
 */
export const ADMIN_ROLE = "ADMIN" as const;

export type SessionUserLike = {
  id: string;
  role?: string | null;
  isActive?: boolean | null;
  twoFactorEnabled?: boolean | null;
};

export type AdminAccessDecision =
  { kind: "allow" } | { kind: "unauthenticated" } | { kind: "forbidden" } | { kind: "needs-2fa" };

export function evaluateAdminAccess(
  user: SessionUserLike | null | undefined,
  options: { require2FA: boolean; allowPending2FA?: boolean },
): AdminAccessDecision {
  if (!user) return { kind: "unauthenticated" };
  // Fail closed: a missing role/isActive is treated as NOT an active admin.
  if (user.role !== ADMIN_ROLE || user.isActive !== true) return { kind: "forbidden" };
  if (options.require2FA && user.twoFactorEnabled !== true && !options.allowPending2FA) {
    return { kind: "needs-2fa" };
  }
  return { kind: "allow" };
}
