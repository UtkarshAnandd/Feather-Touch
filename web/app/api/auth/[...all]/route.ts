import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "@/lib/server/auth/auth";

// Lazy: better-auth (and its env/DB requirements) is only initialised when an
// auth request actually arrives, never at build time.
export const { GET, POST } = toNextJsHandler((request: Request) => getAuth().handler(request));
