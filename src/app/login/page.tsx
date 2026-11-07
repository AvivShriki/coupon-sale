import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "התחברות" };

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container-page py-16" />}>
      <AuthForm mode="login" />
    </Suspense>
  );
}
