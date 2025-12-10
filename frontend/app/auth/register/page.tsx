"use client";

import { AuthProvider } from "@/lib/auth/auth-context";
import RegisterForm from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <AuthProvider>
      <RegisterForm />
    </AuthProvider>
  );
}
