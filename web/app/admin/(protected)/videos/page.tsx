import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";
import { requireAdmin } from "@/lib/server/auth/require-admin";

export const metadata: Metadata = { title: "Videos" };

export default async function Page() {
  await requireAdmin();
  return (
    <AdminPlaceholder
      title="Videos"
      phase="Phase 7"
      purpose="Manage the 2–3 school videos and their poster images."
    />
  );
}
