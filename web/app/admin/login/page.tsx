import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main id="main-content">
      <h1>Admin sign in</h1>
      <p>For Feather Touch school administrators only. There are no parent or visitor accounts.</p>
      <LoginForm />
    </main>
  );
}
