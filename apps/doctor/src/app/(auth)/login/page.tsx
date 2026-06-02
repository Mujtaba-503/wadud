"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function DoctorLoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "ahmad.rashidi@wadud.app", password: "password" },
  });

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      await login(data.email, data.password);
      toast.success("Welcome back, Doctor", { description: "Redirecting to your dashboard." });
      router.push("/dashboard");
    } catch {
      toast.error("Login failed", { description: "Please check your credentials and try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="lg:hidden flex items-center gap-2.5">
        <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center">
          <Stethoscope className="h-5 w-5" />
        </div>
        <span className="text-xl font-extrabold">Wadud</span>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Doctor sign in</h2>
        <p className="text-sm text-muted-foreground">
          Access your consultation queue, patients and earnings.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          leftIcon={<Lock className="h-4 w-4" />}
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-muted-foreground">
            <input type="checkbox" className="rounded border-input" defaultChecked /> Remember me
          </label>
          <button type="button" className="font-semibold text-primary hover:underline">
            Forgot password?
          </button>
        </div>

        <Button type="submit" className="w-full" size="lg" loading={submitting}>
          Sign in
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        Demo build — any valid email/password signs you in. Backend auth wires to{" "}
        <code className="text-primary">POST /api/v1/auth/login</code>.
      </p>
    </div>
  );
}
