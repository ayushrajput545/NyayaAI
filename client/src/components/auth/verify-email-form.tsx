"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, LoaderCircle, MailCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth-service";
import { AuthPageLayout } from "./auth-page-layout";

const verifyEmailSchema = z.object({
  email: z.email("Enter a valid email address."),
  otp: z.string().regex(/^\d{6}$/, "Enter the 6-digit code from your email."),
});

type VerifyEmailValues = z.infer<typeof verifyEmailSchema>;

interface VerifyEmailFormProps {
  initialEmail: string;
}

function VerifyEmailForm({ initialEmail }: VerifyEmailFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [verifiedMessage, setVerifiedMessage] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<VerifyEmailValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { email: initialEmail, otp: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    setVerifiedMessage(null);
    try {
      const response = await authService.verifyEmail(values);
      setVerifiedMessage(response.message);
    } catch (error) {
      setSubmitError(
        authService.getErrorMessage(error, "Unable to verify your email."),
      );
    }
  });

  const onResend = async () => {
    setResendError(null);
    setResendMessage(null);

    if (!(await trigger("email"))) {
      return;
    }

    setIsResending(true);
    try {
      const response = await authService.resendOtp({
        email: getValues("email"),
      });
      setResendMessage(response.message);
    } catch (error) {
      setResendError(
        authService.getErrorMessage(error, "Unable to resend the code."),
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthPageLayout
      description="Enter the 6-digit verification code sent to your email address."
      eyebrow="Email verification"
      footer={
        <>
          Already verified?{" "}
          <Link
            className="font-semibold text-blue-800 transition-colors hover:text-blue-950"
            href="/login"
          >
            Login
          </Link>
        </>
      }
      title="Verify your email"
    >
      {verifiedMessage ? (
        <div
          aria-live="polite"
          className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"
          role="status"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-emerald-700"
            />
            <div>
              <p className="text-sm font-medium text-emerald-900">
                {verifiedMessage}
              </p>
              <Link
                className="mt-3 inline-flex text-sm font-semibold text-emerald-900 underline underline-offset-4"
                href="/login"
              >
                Continue to login
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <>
          <form className="space-y-5" noValidate onSubmit={onSubmit}>
            {submitError ? (
              <p
                aria-live="assertive"
                className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm leading-5 text-red-800"
                role="alert"
              >
                {submitError}
              </p>
            ) : null}
            <div>
              <label
                className="mb-2 block text-sm font-medium text-slate-700"
                htmlFor="verify-email"
              >
                Email address
              </label>
              <Input
                autoComplete="email"
                id="verify-email"
                placeholder="you@example.com"
                type="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "verify-email-error" : undefined}
                {...register("email")}
              />
              {errors.email ? (
                <p
                  className="mt-1.5 text-xs text-red-700"
                  id="verify-email-error"
                >
                  {errors.email.message}
                </p>
              ) : null}
            </div>
            <div>
              <label
                className="mb-2 block text-sm font-medium text-slate-700"
                htmlFor="verify-otp"
              >
                Verification code
              </label>
              <Input
                autoComplete="one-time-code"
                className="text-center text-lg tracking-[0.4em]"
                id="verify-otp"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                aria-invalid={Boolean(errors.otp)}
                aria-describedby={errors.otp ? "verify-otp-error" : undefined}
                {...register("otp")}
              />
              {errors.otp ? (
                <p className="mt-1.5 text-xs text-red-700" id="verify-otp-error">
                  {errors.otp.message}
                </p>
              ) : null}
            </div>
            <Button
              aria-busy={isSubmitting}
              className="w-full"
              disabled={isSubmitting}
              size="lg"
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle
                    aria-hidden="true"
                    className="size-4 animate-spin"
                  />
                  Verifying...
                </>
              ) : (
                <>
                  <MailCheck aria-hidden="true" className="size-4" />
                  Verify email
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <p className="text-center text-sm text-slate-500">
              Didn&apos;t receive a code?
            </p>
            <div className="mt-3">
              {resendError ? (
                <p
                  aria-live="assertive"
                  className="mb-3 text-center text-sm text-red-700"
                  role="alert"
                >
                  {resendError}
                </p>
              ) : null}
              {resendMessage ? (
                <p
                  aria-live="polite"
                  className="mb-3 text-center text-sm text-emerald-700"
                  role="status"
                >
                  {resendMessage}
                </p>
              ) : null}
              <Button
                aria-busy={isResending}
                className="w-full"
                disabled={isResending}
                variant="outline"
                onClick={onResend}
                type="button"
              >
                {isResending ? (
                  <>
                    <LoaderCircle
                      aria-hidden="true"
                      className="size-4 animate-spin"
                    />
                    Sending...
                  </>
                ) : (
                  "Resend code"
                )}
              </Button>
            </div>
          </div>
        </>
      )}
    </AuthPageLayout>
  );
}

export { VerifyEmailForm };
