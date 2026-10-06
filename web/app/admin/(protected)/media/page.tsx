import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";
import { requireAdmin } from "@/lib/server/auth/require-admin";

export const metadata: Metadata = { title: "Media library" };

export default async function Page() {
  await requireAdmin();
  return (
    <AdminPlaceholder
      title="Media library"
      phase="Phase 7"
      purpose="Upload from this device, replace, delete, edit alt text and confirm consent for all media."
    />
  );
}
