import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";
import { requireAdmin } from "@/lib/server/auth/require-admin";

export const metadata: Metadata = { title: "Hero slideshow" };

export default async function Page() {
  await requireAdmin();
  return (
    <AdminPlaceholder
      title="Hero slideshow"
      phase="Phase 7"
      purpose="Upload, order and activate the 6–7 hero slideshow images (consent and alt text required)."
    />
  );
}
