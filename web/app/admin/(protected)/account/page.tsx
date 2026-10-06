import type { Metadata } from "next";
import { requireAdmin } from "@/lib/server/auth/require-admin";
import { TwoFactorSetup } from "./two-factor-setup";

export const metadata: Metadata = { title: "My account & 2FA" };

/**
 * The ONLY admin screen reachable before TOTP enrolment (allowPending2FA), so a
 * newly created admin can enable 2FA. Everything else requires 2FA when
 * ADMIN_REQUIRE_2FA=true.
 */
export default async function AccountPage({ searchParams }: PageProps<"/admin/account">) {
  const admin = await requireAdmin({ allowPending2FA: true });
  const { setup } = await searchParams;

  return (
    <>
      <h1>My account</h1>
      <p>
        Signed in as {admin.name} ({admin.email})
      </p>
      {setup === "2fa" && !admin.twoFactorEnabled && (
        <p role="status">Two-factor authentication must be enabled before you can use the admin area.</p>
      )}
      <h2>Two-factor authentication</h2>
      <TwoFactorSetup enabled={admin.twoFactorEnabled} />
    </>
  );
}
