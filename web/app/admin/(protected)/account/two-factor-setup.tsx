"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";

/**
 * Minimal, unstyled TOTP enrolment (Phase 1A).
 * 1. Re-enter password → server returns the otpauth:// URI + one-time backup codes.
 * 2. Add the key to an authenticator app, enter the 6-digit code → 2FA enabled.
 * A QR code and V3 styling arrive with the admin UI phase.
 */
export function TwoFactorSetup({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  const [enrolment, setEnrolment] = useState<{ totpURI: string; backupCodes: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (enabled || done) {
    return <p role="status">Two-factor authentication is enabled for this account.</p>;
  }

  async function start(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const password = String(new FormData(e.currentTarget).get("password") ?? "");
    const { data, error } = await authClient.twoFactor.enable({ password });
    if (error || !data || data.method !== "totp") {
      return setError("Could not start enrolment. Check your password and try again.");
    }
    setEnrolment({ totpURI: data.totpURI, backupCodes: data.backupCodes });
  }

  async function confirm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const code = String(new FormData(e.currentTarget).get("code") ?? "").trim();
    const { error } = await authClient.twoFactor.verifyTotp({ code });
    if (error) return setError("That code was not accepted. Wait for a new code and try again.");
    setDone(true);
    router.refresh();
  }

  const secret = enrolment ? new URL(enrolment.totpURI).searchParams.get("secret") : null;

  return (
    <>
      <div role="alert">{error}</div>
      {!enrolment ? (
        <form onSubmit={start}>
          <p>
            <label htmlFor="password">Confirm your password to begin</label>
            <br />
            <input id="password" name="password" type="password" autoComplete="current-password" required />
          </p>
          <button type="submit">Set up authenticator app</button>
        </form>
      ) : (
        <>
          <p>Add this key to your authenticator app (time-based):</p>
          <p>
            <code>{secret}</code>
          </p>
          <details>
            <summary>Full setup link</summary>
            <code style={{ wordBreak: "break-all" }}>{enrolment.totpURI}</code>
          </details>
          <p>
            <strong>Backup codes</strong> — store these somewhere safe. Each works once.
          </p>
          <ul>
            {enrolment.backupCodes.map((c) => (
              <li key={c}>
                <code>{c}</code>
              </li>
            ))}
          </ul>
          <form onSubmit={confirm}>
            <p>
              <label htmlFor="code">6-digit code from the app</label>
              <br />
              <input id="code" name="code" inputMode="numeric" autoComplete="one-time-code" required />
            </p>
            <button type="submit">Confirm and enable</button>
          </form>
        </>
      )}
    </>
  );
}
