import { Suspense } from "react";
import { AuthPageLayout } from "@/components/auth/auth-page-layout";
import { VerifyEmailPageContent } from "@/components/auth/verify-email-page-content";

function VerifyEmailFallback() {
  return (
    <AuthPageLayout
      description="Enter the 6-digit verification code sent to your email address."
      eyebrow="Email verification"
      footer={null}
      title="Verify your email"
    >
      <div
        aria-label="Loading verification form"
        className="h-52 animate-pulse rounded-lg bg-slate-100"
        role="status"
      />
    </AuthPageLayout>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailFallback />}>
      <VerifyEmailPageContent />
    </Suspense>
  );
}
