import { describe, expect, it } from "vitest";
import { buildWhatsAppLink } from "@/lib/whatsapp-link";

describe("buildWhatsAppLink (public click-to-chat)", () => {
  it("returns null when the school number is not configured — the CTA is hidden", () => {
    expect(buildWhatsAppLink(null)).toBeNull();
    expect(buildWhatsAppLink(undefined, "Hello")).toBeNull();
    expect(buildWhatsAppLink("")).toBeNull();
  });

  it("returns null for invalid numbers rather than rendering a broken link", () => {
    expect(buildWhatsAppLink("[WhatsApp Number]")).toBeNull();
    expect(buildWhatsAppLink("0123")).toBeNull();
    expect(buildWhatsAppLink("09876543210")).toBeNull();
  });

  it("normalises formatting and URL-encodes the prefilled message", () => {
    expect(buildWhatsAppLink("+91 98765-43210", "Hi, I'd like to know about Nursery & Day Care")).toBe(
      "https://wa.me/919876543210?text=Hi%2C+I%27d+like+to+know+about+Nursery+%26+Day+Care",
    );
  });

  it("omits the text parameter when no message is configured", () => {
    expect(buildWhatsAppLink("919876543210", "  ")).toBe("https://wa.me/919876543210");
  });
});
