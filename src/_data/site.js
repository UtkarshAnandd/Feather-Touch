/**
 * Site data loader.
 * Loads site.json, or the path in SITE_DATA_FILE (tests only).
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default function () {
  const dataPath = process.env.SITE_DATA_FILE
    ? resolve(process.env.SITE_DATA_FILE)
    : resolve(__dirname, "site.json");

  const raw = readFileSync(dataPath, "utf-8");
  return JSON.parse(raw);
}
