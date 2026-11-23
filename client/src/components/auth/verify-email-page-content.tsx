"use client";

import { useSearchParams } from "next/navigation";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";

function VerifyEmailPageContent() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") ?? "";

  return <VerifyEmailForm initialEmail={initialEmail} />;
}

export { VerifyEmailPageContent };
