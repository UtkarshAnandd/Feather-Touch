import { afterEach, describe, expect, it, vi } from "vitest";
import {
  MailpitEmailProvider,
  MemoryEmailProvider,
  ProviderNotConnectedError,
  getEmailProvider,
} from "@/lib/server/notifications/email";
import {
  LogWhatsAppProvider,
  MemoryWhatsAppProvider,
  getWhatsAppProvider,
  redactPhone,
} from "@/lib/server/notifications/whatsapp";
import { resetEnvCache } from "@/lib/server/env";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  resetEnvCache();
});

const message = { to: ["school@example.test"], subject: "s", text: "t", idempotencyKey: "enq_1:email" };

describe("EmailProvider", () => {
  it("memory provider is idempotent per key", async () => {
    const p = new MemoryEmailProvider();
    const a = await p.send(message);
    const b = await p.send(message);
    expect(a).toEqual(b);
    expect(p.sent).toHaveLength(1);
  });

  it("mailpit provider posts to the local Mailpit API", async () => {
    const fetchImpl = vi.fn(async () => Response.json({ ID: "abc" }));
    const p = new MailpitEmailProvider("http://127.0.0.1:8025", "no-reply@local.test", fetchImpl);
    await expect(p.send(message)).resolves.toEqual({ providerMessageId: "abc" });
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [URL, RequestInit];
    expect(String(url)).toBe("http://127.0.0.1:8025/api/v1/send");
    expect(JSON.parse(String(init.body)).To).toEqual([{ Email: "school@example.test" }]);
  });

  it("mailpit provider surfaces HTTP failures (so the outbox can retry)", async () => {
    const p = new MailpitEmailProvider(
      "http://127.0.0.1:8025",
      "x@local.test",
      async () => new Response("", { status: 500 }),
    );
    await expect(p.send(message)).rejects.toThrow("HTTP 500");
  });

  it("production Resend provider is NOT connected in Phase 1A", () => {
    vi.stubEnv("EMAIL_PROVIDER", "resend");
    expect(() => getEmailProvider()).toThrow(ProviderNotConnectedError);
  });
});

describe("WhatsAppProvider", () => {
  const wa = {
    to: "919999999999",
    template: "new_enquiry_alert",
    languageCode: "en",
    bodyParams: ["A", "B"],
    idempotencyKey: "enq_1:wa",
  };

  it("memory provider is idempotent per key", async () => {
    const p = new MemoryWhatsAppProvider();
    await p.sendTemplate(wa);
    await p.sendTemplate(wa);
    expect(p.sent).toHaveLength(1);
  });

  it("log provider sends nothing and never logs PII parameters or full numbers", async () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    await new LogWhatsAppProvider().sendTemplate({ ...wa, bodyParams: ["Parent Name Secret"] });
    const logged = spy.mock.calls.flat().join(" ");
    expect(logged).not.toContain("Parent Name Secret");
    expect(logged).not.toContain("919999999999");
    expect(logged).toContain("9999");
  });

  it("official Meta Cloud API provider is NOT connected in Phase 1A", () => {
    vi.stubEnv("WHATSAPP_PROVIDER", "meta_cloud");
    expect(() => getWhatsAppProvider()).toThrow(ProviderNotConnectedError);
  });

  it("rejects unknown (e.g. unofficial) provider names", () => {
    vi.stubEnv("WHATSAPP_PROVIDER", "whatsapp-web");
    expect(() => getWhatsAppProvider()).toThrow();
  });

  it("redacts phone numbers", () => {
    expect(redactPhone("919876543210")).toBe("********3210");
  });
});
