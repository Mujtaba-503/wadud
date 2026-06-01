"use client";

import Link from "next/link";
import { Activity, ShieldCheck, Heart } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 overflow-x-hidden">
      {/* Left panel - Visual (Desktop only) */}
      <div className="hidden lg:flex lg:col-span-5 relative bg-primary flex-col justify-between p-12 text-white overflow-hidden">
        {/* Background decorative patterns */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-800 to-primary -z-10" />
        <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-teal-600/20 rounded-full blur-[80px]" />
        <div className="absolute top-12 -right-12 w-64 h-64 bg-teal-500/10 rounded-full blur-[60px]" />

        {/* Top brand */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 self-start">
          <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center shadow-md">
            <span className="text-primary font-bold text-sm">W</span>
          </div>
          <span className="text-xl font-bold tracking-wide">Wadud</span>
        </Link>

        {/* Center message */}
        <div className="space-y-6 max-w-sm">
          <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold leading-tight">
            Your Health, <br />
            Our Loving Concern.
          </h2>
          <p className="text-sm text-teal-100/90 leading-relaxed">
            Join thousands of patients who get digital consultations, secure prescription access, and ongoing wellness monitoring with our specialized consultants.
          </p>
        </div>

        {/* Bottom trust details */}
        <div className="flex items-center gap-6 text-xs text-teal-100/70 border-t border-white/10 pt-8">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-teal-300" />
            <span>HIPAA Ready</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Heart className="h-4 w-4 text-teal-300" />
            <span>End-to-End Encrypted</span>
          </div>
        </div>
      </div>

      {/* Right panel - Form contents */}
      <div className="col-span-1 lg:col-span-7 flex items-center justify-center p-6 sm:p-12 md:p-16 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Logo showing only on mobile */}
          <div className="lg:hidden flex justify-center mb-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="text-xl font-bold gradient-text">Wadud</span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
