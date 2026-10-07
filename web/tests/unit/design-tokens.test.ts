import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * Guards the V3 visual foundation (Phase 1B): the approved tokens exist with
 * exact values, Tailwind defaults stay disabled, and no component styles with
 * colours outside the token set.
 */
const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const read = (p: string) => readFileSync(join(ROOT, p), "utf8");
const tokens = read("app/styles/tokens.css");

// V3-DESIGN-SOURCE.md §3 (prototype.css). Name → exact hex.
const V3_COLOURS: Record<string, string> = {
  paper: "#fff6e6",
  "paper-raised": "#fffbf3",
  "paper-deep": "#f6e7ca",
  kraft: "#f1ddb8",
  line: "#e2cfa8",
  ink: "#1e3a2b",
  "ink-soft": "#4a5a4e",
  marigold: "#e88640",
  "marigold-hover": "#f1964f",
  "marigold-ledge": "#b5601f",
  "marigold-display": "#c1570f",
  "marigold-tint": "#ffe5c2",
  "marigold-soft": "#ffd29b",
  leaf: "#a9cf48",
  "leaf-2": "#c8e283",
  "leaf-3": "#ddedb0",
  "leaf-tint": "#eef6d6",
  "leaf-deep": "#3e6a12",
  navy: "#22305a",
  flag: "#6b551f",
  "flag-line": "#b9a06a",
};

describe("V3 design tokens", () => {
  it("defines every V3 colour with its exact value", () => {
    for (const [name, hex] of Object.entries(V3_COLOURS)) {
      expect(tokens, name).toMatch(new RegExp(`--color-${name}:\\s*${hex};`, "i"));
    }
  });

  it("keeps Tailwind's default scales disabled", () => {
    for (const ns of [
      "color",
      "font",
      "text",
      "font-weight",
      "leading",
      "tracking",
      "radius",
      "shadow",
      "breakpoint",
      "container",
    ]) {
      expect(tokens, ns).toContain(`--${ns}-*: initial;`);
    }
    expect(tokens).toMatch(/--spacing:\s*1px;/);
  });

  it("defines the V3 radii and breakpoints", () => {
    expect(tokens).toMatch(/--radius-paper:\s*5px;/);
    expect(tokens).toMatch(/--radius-control:\s*14px;/);
    expect(tokens).toMatch(/--radius-shelf:\s*18px;/);
    expect(tokens).toMatch(/--radius-photo:\s*22px;/);
    expect(tokens).toMatch(/--breakpoint-sm:\s*37\.5625rem;/); // 601px
    expect(tokens).toMatch(/--breakpoint-nav:\s*75rem;/); // 1200px
  });

  it("maps type roles to the three V3 families", () => {
    expect(tokens).toMatch(/--font-display:\s*var\(--ff-bricolage\)/);
    expect(tokens).toMatch(/--font-body:\s*var\(--ff-atkinson\)/);
    expect(tokens).toMatch(/--font-accent:\s*var\(--ff-fredoka\)/);
  });
});

describe("V3 fonts", () => {
  const files = [
    "BricolageGrotesque-Variable.woff2",
    "AtkinsonHyperlegibleNext-Variable.woff2",
    "AtkinsonHyperlegibleNext-Variable-Italic.woff2",
    "Fredoka-Variable.woff2",
  ];

  it("ships the approved variable woff2 files with their OFL licences", () => {
    for (const f of files) expect(existsSync(join(ROOT, "app/fonts", f)), f).toBe(true);
    for (const f of [
      "OFL-bricolage-grotesque.txt",
      "OFL-atkinson-hyperlegible-next.txt",
      "OFL-fredoka.txt",
    ]) {
      expect(read(`app/fonts/${f}`)).toContain("SIL Open Font License, Version 1.1");
    }
  });

  it("loads every file through next/font with swap", () => {
    const src = read("app/fonts.ts");
    for (const f of files) expect(src).toContain(`./fonts/${f}`);
    expect(src.match(/display: "swap"/g)).toHaveLength(4);
  });
});

describe("no styling outside the V3 tokens", () => {
  const SKIP = new Set(["node_modules", ".next", "generated"]);
  function walk(dir: string, out: string[] = []): string[] {
    for (const entry of readdirSync(dir)) {
      if (SKIP.has(entry)) continue;
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walk(full, out);
      else if (entry.endsWith(".tsx")) out.push(full);
    }
    return out;
  }
  const rel = (f: string) => relative(ROOT, f).split("\\").join("/");
  const files = ["app", "components"].flatMap((d) => walk(join(ROOT, d)));

  it("components use no Tailwind default palette colours", () => {
    const palette =
      /\b(?:bg|text|border|ring|outline|fill|stroke|from|via|to|decoration|accent|caret|divide|placeholder)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white)(?:-\d{2,3})?\b/;
    const offenders = files.filter((f) => palette.test(readFileSync(f, "utf8"))).map(rel);
    expect(offenders).toEqual([]);
  });

  it("components contain no raw hex colours (except documented exceptions)", () => {
    // layout.tsx: <meta name="theme-color"> needs a literal; the design-system
    // preview prints each token's hex as a label.
    const allowed = new Set(["app/layout.tsx", "app/(public)/dev/design-system/page.tsx"]);
    const offenders = files
      .filter((f) => !allowed.has(rel(f)))
      .filter((f) => /#[0-9a-fA-F]{3,8}\b/.test(readFileSync(f, "utf8")))
      .map(rel);
    expect(offenders).toEqual([]);
  });
});
