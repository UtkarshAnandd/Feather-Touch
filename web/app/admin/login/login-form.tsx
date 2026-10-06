"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";

type Step = "credentials" | "totp" | "backup";

/** Generic messages only — never reveal whether an email exists. */
function messageFor(status: number | undefined): string {
  if (status === 429) return "Too many attempts. Please wait a few minutes and try again.";
  return "Sign in failed. Check your details and try again.";
}

export function LoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("credentials");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onCredentials(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(e.currentTarget);
    const { data, error } = await authClient.signIn.email({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    });
    setPending(false);
    if (error) return setError(messageFor(error.status));
    if (data && "twoFactorRedirect" in data && data.twoFactorRedirect) return setStep("totp");
    router.replace("/admin");
    router.refresh();
  }

  async function onSecondFactor(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const code = String(new FormData(e.currentTarget).get("code") ?? "").trim();
    const { error } =
      step === "backup"
        ? await authClient.twoFactor.verifyBackupCode({ code })
        : await authClient.twoFactor.verifyTotp({ code });
    setPending(false);
    if (error) return setError(messageFor(error.status));
    router.replace("/admin");
    router.refresh();
  }

  return (
    <>
      <div role="alert" aria-live="assertive">
        {error}
      </div>

      {step === "credentials" ? (
        <form onSubmit={onCredentials}>
          <p>
            <label htmlFor="email">Email</label>
            <br />
            <input id="email" name="email" type="email" autoComplete="username" required />
          </p>
          <p>
            <label htmlFor="password">Password</label>
            <br />
            <input id="password" name="password" type="password" autoComplete="current-password" required />
          </p>
          <button type="submit" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      ) : (
        <form onSubmit={onSecondFactor}>
          <p>
            <label htmlFor="code">
              {step === "backup" ? "Backup code" : "6-digit code from your authenticator app"}
            </label>
            <br />
            <input
              id="code"
              name="code"
              type="text"
              inputMode={step === "backup" ? "text" : "numeric"}
              autoComplete="one-time-code"
              required
            />
          </p>
          <button type="submit" disabled={pending}>
            {pending ? "Verifying…" : "Verify"}
          </button>{" "}
          <button type="button" onClick={() => setStep(step === "backup" ? "totp" : "backup")}>
            {step === "backup" ? "Use authenticator code" : "Use a backup code"}
          </button>
        </form>
      )}
    </>
  );
}
