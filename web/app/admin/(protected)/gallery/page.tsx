import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";
import { requireAdmin } from "@/lib/server/auth/require-admin";

export const metadata: Metadata = { title: "Gallery" };

export default async function Page() {
  await requireAdmin();
  return (
    <AdminPlaceholder title="Gallery" phase="Phase 7" purpose="Manage gallery photographs and categories." />
  );
}
