import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";
import { requireAdmin } from "@/lib/server/auth/require-admin";

export const metadata: Metadata = { title: "Audit log" };

export default async function Page() {
  await requireAdmin();
  return <AdminPlaceholder title="Audit log" phase="Phase 6" purpose="Record of every admin change." />;
}
