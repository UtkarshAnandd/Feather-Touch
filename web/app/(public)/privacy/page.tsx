import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy" };

/**
 * Required before launch (launch gate: privacyPolicyApproved). The text must
 * be supplied/approved by the school — do not draft policy wording here.
 */
export default function PrivacyPage() {
  return (
    <>
      <h1>Privacy</h1>
      <p>The school&rsquo;s approved privacy notice will be published here before launch.</p>
    </>
  );
}
