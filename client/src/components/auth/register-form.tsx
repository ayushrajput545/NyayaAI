"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth-service";
import { AuthPageLayout } from "./auth-page-layout";

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters.")
      .max(150, "Name must be 150 characters or fewer."),
    email: z.email("Enter a valid email address."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(128, "Password must be 128 characters or fewer."),
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type RegisterValues = z.infer<typeof registerSchema>;

function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await authService.register({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
    } catch (error) {
      setSubmitError(
        authService.getErrorMessage(error, "Unable to create your account."),
      );
    }
  });

  return (
    <AuthPageLayout
      description="Create an account to begin researching with NyayaAI."
      eyebrow="Get started"
      footer={
        <>
          Already have an account?{" "}
          <Link
            className="font-semibold text-blue-800 transition-colors hover:text-blue-950"
            href="/login"
          >
            Login
          </Link>
        </>
      }
      title="Create your account"
    >
      <form className="space-y-4" noValidate onSubmit={onSubmit}>
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
            htmlFor="register-name"
          >
            Full name
          </label>
          <Input
            autoComplete="name"
            id="register-name"
            placeholder="Your full name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "register-name-error" : undefined}
            {...register("name")}
          />
          {errors.name ? (
            <p className="mt-1.5 text-xs text-red-700" id="register-name-error">
              {errors.name.message}
            </p>
          ) : null}
        </div>
        <div>
          <label
            className="mb-2 block text-sm font-medium text-slate-700"
            htmlFor="register-email"
          >
            Email address
          </label>
          <Input
            autoComplete="email"
            id="register-email"
            placeholder="you@example.com"
            type="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "register-email-error" : undefined}
            {...register("email")}
          />
          {errors.email ? (
            <p
              className="mt-1.5 text-xs text-red-700"
              id="register-email-error"
            >
              {errors.email.message}
            </p>
          ) : null}
        </div>
        <PasswordInput
          error={errors.password?.message}
          id="register-password"
          label="Password"
          onToggle={() => setShowPassword((visible) => !visible)}
          showPassword={showPassword}
          {...register("password")}
        />
        <PasswordInput
          error={errors.confirmPassword?.message}
          id="register-confirm-password"
          label="Confirm password"
          onToggle={() => setShowConfirmPassword((visible) => !visible)}
          showPassword={showConfirmPassword}
          {...register("confirmPassword")}
        />
        <Button
          aria-busy={isSubmitting}
          className="mt-2 w-full"
          disabled={isSubmitting}
          size="lg"
          type="submit"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Register"
          )}
        </Button>
      </form>
    </AuthPageLayout>
  );
}

interface PasswordInputProps extends React.ComponentProps<typeof Input> {
  error?: string;
  id: string;
  label: string;
  onToggle: () => void;
  showPassword: boolean;
}

function PasswordInput({
  error,
  id,
  label,
  onToggle,
  showPassword,
  ...inputProps
}: PasswordInputProps) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label
        className="mb-2 block text-sm font-medium text-slate-700"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="relative">
        <Input
          autoComplete="new-password"
          className="pr-11"
          id={id}
          placeholder={label}
          type={showPassword ? "text" : "password"}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          {...inputProps}
        />
        <button
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-slate-500 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-700"
          onClick={onToggle}
          type="button"
        >
          {showPassword ? (
            <EyeOff aria-hidden="true" className="size-4" />
          ) : (
            <Eye aria-hidden="true" className="size-4" />
          )}
        </button>
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-red-700" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export { RegisterForm };
