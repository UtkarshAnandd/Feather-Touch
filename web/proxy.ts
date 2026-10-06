import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_LOGIN_PATH, AUTH_COOKIE_PREFIX } from "@/lib/auth-constants";

/**
 * OPTIMISTIC admin redirect only — NOT an authorization boundary.
 *
 * It merely checks for the presence of a session cookie so unauthenticated
 * visitors are bounced to the login page without rendering admin UI. Real
 * authorization happens in requireAdmin()/assertAdmin() inside every admin
 * page, Server Action and route handler (cookie presence proves nothing).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === ADMIN_LOGIN_PATH) return NextResponse.next();

  const hasSessionCookie = getSessionCookie(request, { cookiePrefix: AUTH_COOKIE_PREFIX }) !== null;
  if (!hasSessionCookie) {
    return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
