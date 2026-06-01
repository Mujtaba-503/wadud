"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WelcomeOnboardingPage() {
  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
          <Sparkles className="h-8 w-8 animate-pulse" />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Welcome to Wadud!
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We are thrilled to help you manage your health. Let&apos;s customize your workspace in 3 easy steps. We&apos;ll configure language, verify your region, and create your medical profile card.
        </p>
      </div>

      <div className="pt-4">
        <Link href="/language">
          <Button className="w-full rounded-xl text-white shadow-glow h-11 font-semibold flex items-center justify-center gap-1.5 hover:scale-[1.01] transition-transform">
            Start Setup <ArrowRight className="h-4.5 w-4.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
