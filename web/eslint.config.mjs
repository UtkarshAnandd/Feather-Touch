import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const DB_IMPORT_RESTRICTIONS = {
  patterns: [
    {
      group: ["@/prisma/client-factory", "**/prisma/client-factory"],
      message: "Application code must use getDb() from @/lib/server/db (server-only).",
    },
    {
      group: ["@/lib/generated/prisma/client", "**/lib/generated/prisma/client"],
      importNamePattern: "^PrismaClient$",
      message: "Do not construct PrismaClient directly; use getDb() from @/lib/server/db.",
    },
    {
      group: ["@prisma/client", "@prisma/client/*"],
      message: "Import generated types from @/lib/generated/prisma/* and the client via @/lib/server/db.",
    },
  ],
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    "**/.next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "lib/generated/**",
    "playwright-report/**",
    "test-results/**",
  ]),

  // ── Server/DB boundary ──────────────────────────────────────────────────
  {
    files: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}", "content/**/*.ts"],
    ignores: ["lib/server/db.ts"],
    rules: { "no-restricted-imports": ["error", DB_IMPORT_RESTRICTIONS] },
  },

  // ── Environment boundary: secrets are read ONLY via lib/server/env.ts ───
  {
    files: [
      "components/**/*.{ts,tsx}",
      "lib/**/*.{ts,tsx}",
      "content/**/*.ts",
      "app/admin/**/*.{ts,tsx}",
      "app/api/**/*.ts",
    ],
    ignores: ["lib/server/env.ts", "prisma/client-factory.ts"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "MemberExpression[object.name='process'][property.name='env']",
          message: "Read configuration through lib/server/env.ts (lazy, validated, server-only).",
        },
      ],
    },
  },
]);

export default eslintConfig;
