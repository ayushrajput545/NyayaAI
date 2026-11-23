"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/contexts/auth-context";
import { authService } from "@/services/auth-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthPageLayout } from "./auth-page-layout";

const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

type LoginValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await login(values.email, values.password);
      router.replace("/workspace");
    } catch (error) {
      setSubmitError(
        authService.getErrorMessage(error, "Unable to sign in. Try again."),
      );
    }
  });

  return (
    <AuthPageLayout
      description="Sign in to continue your legal research."
      eyebrow="Welcome back"
      footer={
        <>
          New to NyayaAI?{" "}
          <Link
            className="font-semibold text-blue-800 transition-colors hover:text-blue-950"
            href="/register"
          >
            Create an account
          </Link>
        </>
      }
      title="Login to NyayaAI"
    >
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
            htmlFor="login-email"
          >
            Email address
          </label>
          <Input
            autoComplete="email"
            id="login-email"
            placeholder="you@example.com"
            type="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "login-email-error" : undefined}
            {...register("email")}
          />
          {errors.email ? (
            <p className="mt-1.5 text-xs text-red-700" id="login-email-error">
              {errors.email.message}
            </p>
          ) : null}
        </div>
        <div>
          <label
            className="mb-2 block text-sm font-medium text-slate-700"
            htmlFor="login-password"
          >
            Password
          </label>
          <div className="relative">
            <Input
              autoComplete="current-password"
              className="pr-11"
              id="login-password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password ? "login-password-error" : undefined
              }
              {...register("password")}
            />
            <button
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-slate-500 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-700"
              onClick={() => setShowPassword((visible) => !visible)}
              type="button"
            >
              {showPassword ? (
                <EyeOff aria-hidden="true" className="size-4" />
              ) : (
                <Eye aria-hidden="true" className="size-4" />
              )}
            </button>
          </div>
          {errors.password ? (
            <p
              className="mt-1.5 text-xs text-red-700"
              id="login-password-error"
            >
              {errors.password.message}
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
              <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </AuthPageLayout>
  );
}

export { LoginForm };
