"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const STEPS = [
  { path: "/welcome", label: "Welcome" },
  { path: "/language", label: "Language" },
  { path: "/region", label: "Region" },
  { path: "/profile-setup", label: "Profile" },
];

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentStepIdx = STEPS.findIndex((step) => pathname?.endsWith(step.path)) ?? 0;
  const progressPercent = ((currentStepIdx + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
      {/* Top Header & Steps */}
      <div className="w-full max-w-lg mx-auto space-y-8">
        {/* Brand */}
        <div className="flex flex-col items-center gap-2">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="text-xl font-bold gradient-text">Wadud</span>
          </Link>
          <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
            Patient Registration Wizard
          </span>
        </div>

        {/* Stepper bar */}
        <div className="space-y-2">
          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.35 }}
              className="h-full bg-primary"
            />
          </div>
          <div className="flex justify-between text-[10px] sm:text-xs font-semibold text-muted-foreground px-1">
            {STEPS.map((step, idx) => {
              const active = idx <= currentStepIdx;
              return (
                <span
                  key={step.path}
                  className={active ? "text-primary font-bold" : "text-muted-foreground/60"}
                >
                  {step.label}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main card */}
      <main className="w-full max-w-lg mx-auto bg-card border border-border p-6 sm:p-10 rounded-3xl shadow-sm my-8">
        {children}
      </main>

      {/* Bottom text */}
      <div className="w-full max-w-lg mx-auto text-center text-xs text-muted-foreground">
        Need assistance? Email support at <span className="font-semibold text-primary">support@wadud.app</span>
      </div>
    </div>
  );
}
