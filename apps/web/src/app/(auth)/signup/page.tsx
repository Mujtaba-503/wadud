"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Lock, Mail, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";

const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone number must be valid"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms of Service and Privacy Policy",
  }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      terms: false,
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      await signup({
        user: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          role: "patient",
        },
      });
      toast.success("Account Initialized", {
        description: "Please verify your mobile number to complete activation.",
      });
      // Redirect to OTP verification
      router.push(`/verify-otp?phone=${encodeURIComponent(data.phone)}`);
    } catch (err: any) {
      toast.error("Registration Failed", {
        description: err.message || "An error occurred during signup.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Create Account
        </h1>
        <p className="text-sm text-muted-foreground">
          Get access to top certified specialists online.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            {...register("firstName")}
            label="First Name"
            placeholder="Ahmad"
            leftIcon={<User className="h-4 w-4 text-muted-foreground" />}
            error={errors.firstName?.message}
          />
          <Input
            {...register("lastName")}
            label="Last Name"
            placeholder="Ali"
            leftIcon={<User className="h-4 w-4 text-muted-foreground" />}
            error={errors.lastName?.message}
          />
        </div>

        <Input
          {...register("email")}
          label="Email Address"
          placeholder="yourname@domain.com"
          leftIcon={<Mail className="h-4 w-4 text-muted-foreground" />}
          error={errors.email?.message}
          type="email"
          autoComplete="email"
        />

        <Input
          {...register("phone")}
          label="Mobile Phone"
          placeholder="+92 300 1234567"
          leftIcon={<Phone className="h-4 w-4 text-muted-foreground" />}
          error={errors.phone?.message}
          type="tel"
        />

        <Input
          {...register("password")}
          label="Password"
          placeholder="••••••••"
          leftIcon={<Lock className="h-4 w-4 text-muted-foreground" />}
          error={errors.password?.message}
          type="password"
          autoComplete="new-password"
        />

        {/* Terms agreement */}
        <div className="space-y-1">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              {...register("terms")}
              className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary focus:outline-none transition-colors"
            />
            <span className="text-xs text-muted-foreground leading-normal">
              I agree to the{" "}
              <Link href="/terms" className="font-semibold text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="font-semibold text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          {errors.terms && (
            <p className="text-2xs font-medium text-destructive mt-0.5">{errors.terms.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl text-white shadow-glow h-11 font-semibold flex items-center justify-center gap-1.5"
        >
          {isLoading ? "Registering..." : "Create Account"} <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground pt-2">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
