import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";
import { requireAdmin } from "@/lib/server/auth/require-admin";

export const metadata: Metadata = { title: "Enquiries" };

export default async function Page() {
  await requireAdmin();
  return (
    <AdminPlaceholder
      title="Enquiries"
      phase="Phases 4 & 6"
      purpose="List, filter and update admission enquiries (NEW → CONTACTED → VISIT_SCHEDULED → CONVERTED → CLOSED) and add notes."
    />
  );
}
