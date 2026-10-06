import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";
import { requireAdmin } from "@/lib/server/auth/require-admin";

export const metadata: Metadata = { title: "Dashboard" };

export default async function Page() {
  await requireAdmin();
  return (
    <AdminPlaceholder
      title="Dashboard"
      phase="Phase 6"
      purpose="Overview of new enquiries, failed notifications and launch-checklist status."
    />
  );
}
