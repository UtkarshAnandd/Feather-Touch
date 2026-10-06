/**
 * Public "Chat on WhatsApp" link builder (click-to-chat; no API, no secrets).
 *
 * The number and prefilled message are school facts stored in SiteSettings.
 * Returns null when the number is missing/invalid so the CTA is HIDDEN rather
 * than rendered with a placeholder.
 */
const DIGITS_RE = /^[1-9]\d{7,14}$/; // E.164 without "+": 8–15 digits, no leading 0

export function buildWhatsAppLink(
  digits: string | null | undefined,
  prefillMessage?: string | null,
): string | null {
  if (!digits) return null;
  const normalised = digits.replace(/[\s()+-]/g, "");
  if (!DIGITS_RE.test(normalised)) return null;
  const url = new URL(`https://wa.me/${normalised}`);
  const text = prefillMessage?.trim();
  if (text) url.searchParams.set("text", text);
  return url.toString();
}
