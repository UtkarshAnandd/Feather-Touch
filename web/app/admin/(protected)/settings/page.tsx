import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";
import { requireAdmin } from "@/lib/server/auth/require-admin";

export const metadata: Metadata = { title: "School settings" };

export default async function Page() {
  await requireAdmin();
  return (
    <AdminPlaceholder
      title="School settings"
      phase="Phase 6"
      purpose="School contact details, hours, admissions session, WhatsApp click-to-chat number and launch checklist. All empty until the school supplies them."
    />
  );
}
