"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const forgotSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [emailSent, setEmailSent] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormValues) => {
    setEmailSent(data.email);
    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 1200));
    toast.success("Reset Link Shared", {
      description: `We've emailed a password reset link to ${data.email}.`,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="space-y-6 text-center lg:text-left">
        <div className="flex justify-center lg:justify-start">
          <div className="h-12 w-12 bg-green-500/10 text-green-600 rounded-2xl flex items-center justify-center">
            <CheckCircle className="h-6 w-6" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Check Your Email
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We have sent a secure password reset link to <span className="font-semibold text-foreground">{emailSent}</span>. Please click the link inside the email to configure a new password.
          </p>
        </div>

        <div className="pt-4 space-y-3">
          <Link href="/login">
            <Button className="w-full rounded-xl text-white shadow-glow h-11 font-semibold">
              Back to Sign In
            </Button>
          </Link>
          <button
            onClick={() => setSubmitted(false)}
            className="w-full text-center text-xs font-semibold text-muted-foreground hover:text-primary hover:underline py-1.5"
          >
            Resend Email Link
          </button>
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
          Reset Password
        </h1>
        <p className="text-sm text-muted-foreground font-medium">
          Enter your registered email and we&apos;ll send you a password recovery link.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register("email")}
          label="Email Address"
          placeholder="yourname@domain.com"
          leftIcon={<Mail className="h-4 w-4 text-muted-foreground" />}
          error={errors.email?.message}
          type="email"
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl text-white shadow-glow h-11 font-semibold"
        >
          {isSubmitting ? "Sending Link..." : "Send Reset Link"}
        </Button>
      </form>
    </div>
  );
}
