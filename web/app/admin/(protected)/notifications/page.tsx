import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";
import { requireAdmin } from "@/lib/server/auth/require-admin";

export const metadata: Metadata = { title: "Notifications" };

export default async function Page() {
  await requireAdmin();
  return (
    <AdminPlaceholder
      title="Notifications"
      phase="Phase 8"
      purpose="Email and WhatsApp delivery status, failures and retries."
    />
  );
}
