import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "הרשמה" };

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="container-page py-16" />}>
      <AuthForm mode="signup" />
    </Suspense>
  );
}
