"use client";

import { createAuthClient } from "better-auth/react";
import { twoFactorClient } from "better-auth/client/plugins";

/**
 * Browser auth client for the ADMIN area only. Talks to /api/auth on the same
 * origin. Contains no secrets; all authorization is enforced server-side.
 */
export const authClient = createAuthClient({
  plugins: [twoFactorClient()],
});
