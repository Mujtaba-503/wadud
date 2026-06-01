"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { KeyRound, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const otpSchema = z.object({
  code: z
    .string()
    .min(6, "OTP must be exactly 6 digits")
    .max(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain numbers only"),
});

type OtpFormValues = z.infer<typeof otpSchema>;

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams?.get("phone") || "+92 (300) 123-4567";

  const [timer, setTimer] = useState(59);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
  });

  const onSubmit = async (data: OtpFormValues) => {
    // Simulate verification
    await new Promise((resolve) => setTimeout(resolve, 1200));
    toast.success("Phone Verified!", {
      description: "Your mobile number has been authenticated successfully.",
    });
    router.push("/welcome");
  };

  const handleResend = () => {
    if (!canResend) return;
    setTimer(59);
    setCanResend(false);
    toast.info("OTP Resent", {
      description: `A new verification code was sent to ${phone}.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Back to signup */}
      <Link
        href="/signup"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign Up
      </Link>

      {/* Header */}
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Enter Verification Code
        </h1>
        <p className="text-sm text-muted-foreground leading-normal">
          We sent a 6-digit confirmation code to your phone number: <br />
          <span className="font-bold text-foreground">{phone}</span>
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register("code")}
          label="Verification Code (OTP)"
          placeholder="123456"
          leftIcon={<KeyRound className="h-4 w-4 text-muted-foreground" />}
          error={errors.code?.message}
          type="text"
          maxLength={6}
          className="text-center font-bold tracking-widest text-lg"
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl text-white shadow-glow h-11 font-semibold"
        >
          {isSubmitting ? "Verifying..." : "Verify Code"}
        </Button>
      </form>

      {/* Resend and timer */}
      <div className="text-center text-sm pt-2">
        {canResend ? (
          <button
            onClick={handleResend}
            className="font-semibold text-primary hover:underline hover:text-primary-hover transition-colors"
          >
            Resend Verification Code
          </button>
        ) : (
          <span className="text-muted-foreground">
            Resend code in <span className="font-bold text-foreground">0:{timer < 10 ? `0${timer}` : timer}</span>
          </span>
        )}
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="text-center py-6">Loading OTP panel...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
