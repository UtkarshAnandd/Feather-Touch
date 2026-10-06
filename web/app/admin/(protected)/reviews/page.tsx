import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";
import { requireAdmin } from "@/lib/server/auth/require-admin";

export const metadata: Metadata = { title: "Parent reviews" };

export default async function Page() {
  await requireAdmin();
  return (
    <AdminPlaceholder
      title="Parent reviews"
      phase="Phase 6"
      purpose="Add real parent reviews; only approved reviews with recorded consent are published."
    />
  );
}
