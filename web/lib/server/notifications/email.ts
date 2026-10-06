import "server-only";
import { getEmailProviderEnv, getMailpitEnv } from "@/lib/server/env";

/**
 * EmailProvider abstraction.
 *
 * Phase 1A ships ONLY local/test implementations:
 *   - MemoryEmailProvider  : captures messages in-process (tests)
 *   - MailpitEmailProvider : posts to the local Mailpit HTTP API (nothing is delivered)
 * The production Resend provider is intentionally NOT connected yet; selecting
 * EMAIL_PROVIDER=resend throws ProviderNotConnectedError.
 */
export type EmailMessage = {
  to: string[];
  subject: string;
  text: string;
  html?: string;
  /** Stable key so a retried outbox job never sends twice (used by real providers). */
  idempotencyKey: string;
};

export type EmailSendResult = { providerMessageId: string };

export interface EmailProvider {
  readonly name: "memory" | "mailpit" | "resend";
  send(message: EmailMessage): Promise<EmailSendResult>;
}

export class ProviderNotConnectedError extends Error {
  constructor(provider: string) {
    super(`${provider} is not connected in this phase. Use a local provider (see web/.env.example).`);
    this.name = "ProviderNotConnectedError";
  }
}

export class MemoryEmailProvider implements EmailProvider {
  readonly name = "memory" as const;
  readonly sent: EmailMessage[] = [];
  private seen = new Map<string, EmailSendResult>();

  async send(message: EmailMessage): Promise<EmailSendResult> {
    const prior = this.seen.get(message.idempotencyKey);
    if (prior) return prior;
    this.sent.push(message);
    const result = { providerMessageId: `memory-${this.sent.length}` };
    this.seen.set(message.idempotencyKey, result);
    return result;
  }
}

export class MailpitEmailProvider implements EmailProvider {
  readonly name = "mailpit" as const;
  constructor(
    private readonly apiUrl: string,
    private readonly from: string,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  async send(message: EmailMessage): Promise<EmailSendResult> {
    const res = await this.fetchImpl(new URL("/api/v1/send", this.apiUrl), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        From: { Email: this.from, Name: "Feather Touch (local)" },
        To: message.to.map((Email) => ({ Email })),
        Subject: message.subject,
        Text: message.text,
        HTML: message.html,
        Headers: { "X-Idempotency-Key": message.idempotencyKey },
      }),
    });
    if (!res.ok) throw new Error(`Mailpit send failed with HTTP ${res.status}`);
    const body = (await res.json()) as { ID?: string };
    return { providerMessageId: body.ID ?? "mailpit-unknown" };
  }
}

let memorySingleton: MemoryEmailProvider | undefined;

export function getEmailProvider(): EmailProvider {
  const { EMAIL_PROVIDER } = getEmailProviderEnv();
  switch (EMAIL_PROVIDER) {
    case "memory":
      return (memorySingleton ??= new MemoryEmailProvider());
    case "mailpit": {
      const env = getMailpitEnv();
      return new MailpitEmailProvider(env.MAILPIT_API_URL, env.EMAIL_FROM);
    }
    case "resend":
      throw new ProviderNotConnectedError("Resend email");
  }
}
