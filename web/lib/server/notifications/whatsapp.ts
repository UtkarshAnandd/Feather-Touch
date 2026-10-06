import "server-only";
import { getWhatsAppProviderEnv } from "@/lib/server/env";
import { ProviderNotConnectedError } from "./email";

/**
 * WhatsAppProvider abstraction — OFFICIAL Meta WhatsApp Business Cloud API only.
 *
 * Business-initiated WhatsApp messages must use Meta-approved templates, so the
 * interface is template-based by design. Unofficial automation (whatsapp-web.js,
 * Baileys, browser automation, etc.) is prohibited and must never be added.
 *
 * Phase 1A ships ONLY local/test implementations:
 *   - MemoryWhatsAppProvider : captures messages in-process (tests)
 *   - LogWhatsAppProvider    : logs a redacted summary, sends nothing (local dev)
 * WHATSAPP_PROVIDER=meta_cloud throws ProviderNotConnectedError until Phase 8.
 */
export type WhatsAppTemplateMessage = {
  /** Recipient in E.164 digits without "+" (school staff number in V1). */
  to: string;
  template: string;
  languageCode: string;
  /** Ordered body parameters for the approved template. */
  bodyParams: string[];
  idempotencyKey: string;
};

export type WhatsAppSendResult = { providerMessageId: string };

export interface WhatsAppProvider {
  readonly name: "memory" | "log" | "meta_cloud";
  sendTemplate(message: WhatsAppTemplateMessage): Promise<WhatsAppSendResult>;
}

export class MemoryWhatsAppProvider implements WhatsAppProvider {
  readonly name = "memory" as const;
  readonly sent: WhatsAppTemplateMessage[] = [];
  private seen = new Map<string, WhatsAppSendResult>();

  async sendTemplate(message: WhatsAppTemplateMessage): Promise<WhatsAppSendResult> {
    const prior = this.seen.get(message.idempotencyKey);
    if (prior) return prior;
    this.sent.push(message);
    const result = { providerMessageId: `memory-wa-${this.sent.length}` };
    this.seen.set(message.idempotencyKey, result);
    return result;
  }
}

export function redactPhone(digits: string): string {
  return digits.length <= 4 ? "****" : `${"*".repeat(digits.length - 4)}${digits.slice(-4)}`;
}

export class LogWhatsAppProvider implements WhatsAppProvider {
  readonly name = "log" as const;
  async sendTemplate(message: WhatsAppTemplateMessage): Promise<WhatsAppSendResult> {
    // Never log template parameters (they contain enquiry PII).
    console.info(
      `[whatsapp:log] would send template "${message.template}" (${message.languageCode}) ` +
        `to ${redactPhone(message.to)} with ${message.bodyParams.length} param(s); nothing sent.`,
    );
    return { providerMessageId: `log-${message.idempotencyKey}` };
  }
}

let memorySingleton: MemoryWhatsAppProvider | undefined;

export function getWhatsAppProvider(): WhatsAppProvider {
  const { WHATSAPP_PROVIDER } = getWhatsAppProviderEnv();
  switch (WHATSAPP_PROVIDER) {
    case "memory":
      return (memorySingleton ??= new MemoryWhatsAppProvider());
    case "log":
      return new LogWhatsAppProvider();
    case "meta_cloud":
      throw new ProviderNotConnectedError("Meta WhatsApp Cloud API");
  }
}
