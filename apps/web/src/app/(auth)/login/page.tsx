"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password);
      toast.success("Successfully Signed In", {
        description: "Welcome back to Wadud telemedicine portal.",
      });
      router.push("/dashboard");
    } catch (err: any) {
      toast.error("Sign In Failed", {
        description: err.message || "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Welcome Back
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in to access your consultations and health files.
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
          autoComplete="email"
        />

        <div className="space-y-1">
          <Input
            {...register("password")}
            label="Password"
            placeholder="••••••••"
            leftIcon={<Lock className="h-4 w-4 text-muted-foreground" />}
            error={errors.password?.message}
            type="password"
            autoComplete="current-password"
          />
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl text-white shadow-glow h-11 font-semibold flex items-center justify-center gap-1.5"
        >
          {isLoading ? "Signing In..." : "Sign In"} <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground pt-2">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-primary hover:underline">
          Create one now
        </Link>
      </div>
    </div>
  );
}
