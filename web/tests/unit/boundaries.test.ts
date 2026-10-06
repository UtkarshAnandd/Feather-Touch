import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const SKIP = new Set(["node_modules", ".next", "generated", "playwright-report", "test-results"]);

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(ts|tsx)$/.test(entry)) out.push(full);
  }
  return out;
}

const rel = (f: string) => relative(ROOT, f).split("\\").join("/");
const sourceFiles = ["app", "components", "lib", "content"].flatMap((d) => walk(join(ROOT, d)));
const read = (f: string) => readFileSync(f, "utf8");
const isClient = (src: string) => /^\s*["']use client["'];?/.test(src);

describe("server/client boundaries", () => {
  it("every module under lib/server is marked server-only", () => {
    const offenders = sourceFiles
      .filter((f) => rel(f).startsWith("lib/server/"))
      .filter((f) => !/^import\s+["']server-only["'];/m.test(read(f)))
      .map(rel);
    expect(offenders).toEqual([]);
  });

  it("client components never import server modules, Prisma or the DB factory", () => {
    const forbidden = [
      /@\/lib\/server\//,
      /lib\/generated\/prisma/,
      /prisma\/client-factory/,
      /@prisma\//,
      /@node-rs\/argon2/,
    ];
    const offenders = sourceFiles
      .filter((f) => isClient(read(f)))
      .filter((f) => forbidden.some((re) => re.test(read(f))))
      .map(rel);
    expect(offenders).toEqual([]);
  });

  it("client components never read non-public environment variables", () => {
    const offenders = sourceFiles
      .filter((f) => isClient(read(f)))
      .filter((f) => /process\.env\.(?!NEXT_PUBLIC_)/.test(read(f)))
      .map(rel);
    expect(offenders).toEqual([]);
  });
});

describe("admin authorization coverage", () => {
  it("every protected admin page calls requireAdmin()", () => {
    const pages = sourceFiles.filter((f) => /^app\/admin\/\(protected\)\/.*page\.tsx$/.test(rel(f)));
    expect(pages.length).toBeGreaterThan(10);
    const offenders = pages.filter((f) => !/await requireAdmin\(/.test(read(f))).map(rel);
    expect(offenders).toEqual([]);
  });

  it("every admin Server Action file and admin API route authorizes (future-proofing)", () => {
    const actionFiles = sourceFiles.filter(
      (f) => rel(f).startsWith("app/admin/") && /^\s*["']use server["']/m.test(read(f)),
    );
    const adminRoutes = sourceFiles.filter((f) => /^app\/api\/admin\/.*route\.ts$/.test(rel(f)));
    const offenders = [...actionFiles, ...adminRoutes]
      .filter((f) => !/(requireAdmin|assertAdmin)\(/.test(read(f)))
      .map(rel);
    expect(offenders).toEqual([]);
  });
});

describe("secrets & providers policy", () => {
  it("no NEXT_PUBLIC_ variable looks like a secret", () => {
    const example = read(join(ROOT, ".env.example"));
    const publicVars = [...example.matchAll(/^(NEXT_PUBLIC_[A-Z0-9_]+)=/gm)].map((m) => m[1]);
    expect(publicVars.filter((v) => /SECRET|TOKEN|PASSWORD|PRIVATE|API_KEY|ACCESS_KEY/.test(v!))).toEqual([]);
  });

  it("no unofficial WhatsApp automation packages are installed", () => {
    const pkg = JSON.parse(read(join(ROOT, "package.json"))) as Record<
      string,
      Record<string, string> | undefined
    >;
    const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
    const banned = /whatsapp-web|baileys|venom-bot|wppconnect|open-wa|whatsapp-bot/i;
    expect(deps.filter((d) => banned.test(d))).toEqual([]);
  });
});
