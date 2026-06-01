"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lock, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const resetSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password must match"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetFormValues) => {
    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 1200));
    toast.success("Password Updated", {
      description: "Your password has been successfully configured. You may now sign in.",
    });
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="space-y-6 text-center lg:text-left">
        <div className="flex justify-center lg:justify-start">
          <div className="h-12 w-12 bg-green-500/10 text-green-600 rounded-2xl flex items-center justify-center">
            <CheckCircle className="h-6 w-6" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Password Set Successfully
          </h1>
          <p className="text-sm text-muted-foreground">
            Your login password has been changed. Use the new password to log in.
          </p>
        </div>

        <div className="pt-4">
          <Link href="/login">
            <Button className="w-full rounded-xl text-white shadow-glow h-11 font-semibold">
              Sign In Now
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back to Login */}
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
      </Link>

      {/* Header */}
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Define New Password
        </h1>
        <p className="text-sm text-muted-foreground font-medium">
          Choose a secure, strong password for your account.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register("password")}
          label="New Password"
          placeholder="••••••••"
          leftIcon={<Lock className="h-4 w-4 text-muted-foreground" />}
          error={errors.password?.message}
          type="password"
          autoComplete="new-password"
        />

        <Input
          {...register("confirmPassword")}
          label="Confirm Password"
          placeholder="••••••••"
          leftIcon={<Lock className="h-4 w-4 text-muted-foreground" />}
          error={errors.confirmPassword?.message}
          type="password"
          autoComplete="new-password"
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl text-white shadow-glow h-11 font-semibold"
        >
          {isSubmitting ? "Updating Password..." : "Update Password"}
        </Button>
      </form>
    </div>
  );
}
