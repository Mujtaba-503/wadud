"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth.store";

const profileSchema = z.object({
  dob: z.string().min(10, "Please enter a valid date of birth (YYYY-MM-DD)"),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Please select your gender" }),
  }),
  bloodGroup: z.string().optional(),
  emergencyName: z.string().min(2, "Emergency contact name must be at least 2 characters"),
  emergencyPhone: z.string().min(8, "Emergency contact phone must be valid"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileSetupOnboardingPage() {
  const router = useRouter();
  const { session, setSession } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      gender: "male",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Update store state with onboarding flags if needed
    if (session) {
      setSession({
        ...session,
        user: {
          ...session.user,
          isVerified: true, // Complete onboarding flag
        },
      });
    }

    toast.success("Profile Setup Complete!", {
      description: "Welcome to your Wadud patient portal.",
    });
    router.push("/dashboard");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <div className="flex justify-center mb-2">
          <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
            <Heart className="h-6 w-6" />
          </div>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          Medical Card Profile
        </h1>
        <p className="text-sm text-muted-foreground font-medium">
          Provide basic health demographics to display on your secure digital health card.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* DOB */}
        <Input
          {...register("dob")}
          label="Date of Birth"
          type="date"
          error={errors.dob?.message}
        />

        {/* Gender & Blood Group in a row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-muted-foreground">Gender</label>
            <select
              {...register("gender")}
              className="w-full bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-3 text-sm h-11 focus:outline-none transition-all"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-2xs font-medium text-destructive mt-0.5">{errors.gender.message}</p>
            )}
          </div>

          <Input
            {...register("bloodGroup")}
            label="Blood Group (Optional)"
            placeholder="O-positive"
            error={errors.bloodGroup?.message}
          />
        </div>

        {/* Emergency Contact section */}
        <div className="border-t border-border pt-4 mt-2 space-y-4">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Emergency Contact Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              {...register("emergencyName")}
              label="Contact Name"
              placeholder="Name of relative"
              leftIcon={<User className="h-4 w-4 text-muted-foreground" />}
              error={errors.emergencyName?.message}
            />
            <Input
              {...register("emergencyPhone")}
              label="Contact Phone"
              placeholder="+92 300 1234567"
              error={errors.emergencyPhone?.message}
              type="tel"
            />
          </div>
        </div>

        <div className="pt-4 flex gap-3">
          <Link href="/region" className="flex-1">
            <Button variant="ghost" type="button" className="w-full rounded-xl border border-border">
              Back
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 rounded-xl text-white shadow-glow flex items-center justify-center gap-1.5"
          >
            {isSubmitting ? "Saving..." : "Finish"} <Sparkles className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
