import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/admin-placeholder";
import { requireAdmin } from "@/lib/server/auth/require-admin";

export const metadata: Metadata = { title: "Programmes" };

export default async function Page() {
  await requireAdmin();
  return (
    <AdminPlaceholder
      title="Programmes"
      phase="Phase 6"
      purpose="Edit programme details. Ages: Play Group 2–3, Nursery 3–4, KG 1 4–5, KG 2 5–6, Day Care to be confirmed."
    />
  );
}
