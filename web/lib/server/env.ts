import "server-only";
import { z } from "zod";

/**
 * Server environment — validated lazily, PER FEATURE.
 *
 * Nothing in this module runs at import time. Each `get*Env()` getter
 * validates only the variables its feature needs, the first time that feature
 * is used, then memoises the result. This keeps `next build` and the public
 * site independent of production credentials (DB, auth, R2, Resend, Meta).
 *
 * Error messages name the missing/invalid variables but NEVER echo values.
 */

export class EnvConfigError extends Error {
  constructor(
    readonly feature: string,
    readonly variables: string[],
  ) {
    super(
      `[env] ${feature} is not configured. Missing or invalid: ${variables.join(", ")}. ` +
        `See web/.env.example.`,
    );
    this.name = "EnvConfigError";
  }
}

type EnvSource = Record<string, string | undefined>;

const emptyToUndefined = (v: unknown) => (typeof v === "string" && v.trim() === "" ? undefined : v);
const requiredString = (min = 1) => z.preprocess(emptyToUndefined, z.string().min(min));
const requiredUrl = z.preprocess(emptyToUndefined, z.url());
const boolFlag = (fallback: boolean) =>
  z.preprocess(emptyToUndefined, z.stringbool().optional()).transform((v) => v ?? fallback);
const csv = z.preprocess(emptyToUndefined, z.string().optional()).transform((v) =>
  v
    ? v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [],
);

export function parseFeatureEnv<T extends z.ZodType>(
  feature: string,
  schema: T,
  source: EnvSource,
): z.output<T> {
  const result = schema.safeParse(source);
  if (!result.success) {
    const vars = [...new Set(result.error.issues.map((i) => String(i.path[0] ?? "?")))];
    throw new EnvConfigError(feature, vars);
  }
  return result.data;
}

const cache = new Map<string, unknown>();

function lazyFeature<T extends z.ZodType>(feature: string, schema: T): () => z.output<T> {
  return () => {
    if (!cache.has(feature)) {
      cache.set(feature, parseFeatureEnv(feature, schema, process.env));
    }
    return cache.get(feature) as z.output<T>;
  };
}

/** Test helper: forget memoised values after mutating process.env. */
export function resetEnvCache(): void {
  cache.clear();
}

// ── Site mode (never throws; defaults to the safe "preview") ────────────────
export type SiteMode = "preview" | "production";
export function getSiteMode(): SiteMode {
  return process.env.SITE_MODE === "production" ? "production" : "preview";
}

// ── Feature schemas ─────────────────────────────────────────────────────────
export const databaseEnvSchema = z.object({
  DATABASE_URL: requiredUrl,
});

export const authEnvSchema = z.object({
  BETTER_AUTH_SECRET: requiredString(32),
  BETTER_AUTH_URL: requiredUrl,
  BETTER_AUTH_TRUSTED_ORIGINS: csv,
  ADMIN_REQUIRE_2FA: boolFlag(true),
});

export const securityEnvSchema = z.object({
  IP_HASH_SALT: requiredString(32),
  FORM_TOKEN_SECRET: requiredString(32),
});

export const cronEnvSchema = z.object({
  CRON_SECRET: requiredString(32),
});

export const storageEnvSchema = z.object({
  STORAGE_ENDPOINT: requiredUrl,
  STORAGE_REGION: requiredString(),
  STORAGE_BUCKET: requiredString(),
  STORAGE_ACCESS_KEY_ID: requiredString(),
  STORAGE_SECRET_ACCESS_KEY: requiredString(),
});

export const emailProviderSchema = z.object({
  EMAIL_PROVIDER: z.preprocess(emptyToUndefined, z.enum(["memory", "mailpit", "resend"]).default("memory")),
  NOTIFICATIONS_EMAIL_ENABLED: boolFlag(false),
});
export const mailpitEnvSchema = z.object({
  MAILPIT_API_URL: requiredUrl,
  EMAIL_FROM: z.preprocess(emptyToUndefined, z.email().default("no-reply@feather-touch.local")),
});
export const resendEnvSchema = z.object({
  RESEND_API_KEY: requiredString(),
  EMAIL_FROM: z.preprocess(emptyToUndefined, z.email()),
});
export const enquiryRecipientsEnvSchema = z.object({
  ENQUIRY_NOTIFY_EMAILS: csv.pipe(z.array(z.email()).min(1)),
});

export const whatsappProviderSchema = z.object({
  WHATSAPP_PROVIDER: z.preprocess(
    emptyToUndefined,
    z.enum(["memory", "log", "meta_cloud"]).default("memory"),
  ),
  NOTIFICATIONS_WHATSAPP_ENABLED: boolFlag(false),
});
export const metaCloudEnvSchema = z.object({
  WHATSAPP_ACCESS_TOKEN: requiredString(),
  WHATSAPP_PHONE_NUMBER_ID: requiredString(),
  WHATSAPP_BUSINESS_ACCOUNT_ID: requiredString(),
  WHATSAPP_APP_SECRET: requiredString(),
  WHATSAPP_WEBHOOK_VERIFY_TOKEN: requiredString(16),
  WHATSAPP_GRAPH_API_VERSION: requiredString(),
  WHATSAPP_TEMPLATE_ENQUIRY: requiredString(),
  WHATSAPP_TEMPLATE_LANG: requiredString(),
  WHATSAPP_NOTIFY_TO: z.preprocess(emptyToUndefined, z.string().regex(/^\d{8,15}$/)),
});

// ── Lazy getters ────────────────────────────────────────────────────────────
export const getDatabaseEnv = lazyFeature("database", databaseEnvSchema);
export const getAuthEnv = lazyFeature("admin authentication", authEnvSchema);
export const getSecurityEnv = lazyFeature("security helpers", securityEnvSchema);
export const getCronEnv = lazyFeature("cron", cronEnvSchema);
export const getStorageEnv = lazyFeature("media storage", storageEnvSchema);
export const getEmailProviderEnv = lazyFeature("email provider selection", emailProviderSchema);
export const getMailpitEnv = lazyFeature("email (mailpit)", mailpitEnvSchema);
export const getResendEnv = lazyFeature("email (resend)", resendEnvSchema);
export const getEnquiryRecipientsEnv = lazyFeature(
  "enquiry notification recipients",
  enquiryRecipientsEnvSchema,
);
export const getWhatsAppProviderEnv = lazyFeature("whatsapp provider selection", whatsappProviderSchema);
export const getMetaCloudEnv = lazyFeature("whatsapp (meta cloud api)", metaCloudEnvSchema);
