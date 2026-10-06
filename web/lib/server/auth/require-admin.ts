import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_ACCOUNT_PATH, ADMIN_LOGIN_PATH } from "@/lib/auth-constants";
import { getAuthEnv } from "@/lib/server/env";
import { evaluateAdminAccess } from "./admin-policy";
import { getAuth } from "./auth";

/**
 * THE authorization boundary for every protected admin operation.
 *
 * Call `requireAdmin()` as the FIRST statement of every admin page, every
 * admin Server Action and every admin route handler. Layouts and proxy.ts are
 * UX conveniences only — Server Actions are reachable by direct POST and do
 * not inherit a page's checks.
 *
 * The session is looked up in the database on every call (no cookie cache),
 * so deactivating an admin takes effect immediately.
 */
export type AdminPrincipal = {
  userId: string;
  email: string;
  name: string;
  twoFactorEnabled: boolean;
  sessionId: string;
};

export class AdminAuthError extends Error {
  constructor(readonly status: 401 | 403) {
    super(status === 401 ? "Unauthenticated" : "Forbidden");
    this.name = "AdminAuthError";
  }
}

type Options = { allowPending2FA?: boolean };

async function resolve(options: Options) {
  // Read request headers FIRST: this is the dynamic-rendering boundary. Touching
  // auth config/env before it would run during prerender (and at build time).
  const requestHeaders = await headers();
  const session = await getAuth().api.getSession({ headers: requestHeaders });
  const decision = evaluateAdminAccess(session?.user, {
    require2FA: getAuthEnv().ADMIN_REQUIRE_2FA,
    allowPending2FA: options.allowPending2FA ?? false,
  });
  return { session, decision };
}

function toPrincipal(session: NonNullable<Awaited<ReturnType<typeof resolve>>["session"]>): AdminPrincipal {
  return {
    userId: session.user.id,
    email: session.user.email,
    name: session.user.name,
    twoFactorEnabled: session.user.twoFactorEnabled === true,
    sessionId: session.session.id,
  };
}

/** For pages and Server Actions: redirects when access is not allowed. */
export async function requireAdmin(options: Options = {}): Promise<AdminPrincipal> {
  const { session, decision } = await resolve(options);
  switch (decision.kind) {
    case "allow":
      return toPrincipal(session!);
    case "needs-2fa":
      redirect(`${ADMIN_ACCOUNT_PATH}?setup=2fa`);
    case "forbidden":
    case "unauthenticated":
      redirect(ADMIN_LOGIN_PATH);
  }
}

/** For route handlers: throws AdminAuthError (map to 401/403) instead of redirecting. */
export async function assertAdmin(options: Options = {}): Promise<AdminPrincipal> {
  const { session, decision } = await resolve(options);
  if (decision.kind === "allow") return toPrincipal(session!);
  throw new AdminAuthError(decision.kind === "unauthenticated" ? 401 : 403);
}
