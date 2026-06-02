import Link from "next/link";
import { Stethoscope, ShieldCheck, Clock, Wallet } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between bg-gradient-to-br from-primary via-primary-700 to-primary-900 p-12 text-white overflow-hidden">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 -left-16 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <Link href="/dashboard" className="relative flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur">
            <Stethoscope className="h-5 w-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight">Wadud</span>
        </Link>

        <div className="relative space-y-8 max-w-md">
          <h1 className="text-4xl font-extrabold leading-tight">
            The provider portal for modern telemedicine.
          </h1>
          <ul className="space-y-5">
            {[
              { icon: Clock, title: "Manage availability", desc: "Set your slots and accept consultations on your schedule." },
              { icon: ShieldCheck, title: "Verified & secure", desc: "Document verification and encrypted patient data." },
              { icon: Wallet, title: "Track earnings", desc: "Transparent payouts and earnings analytics." },
            ].map(({ icon: Icon, title, desc }) => (
              <li key={title} className="flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold">{title}</p>
                  <p className="text-sm text-white/80 leading-normal">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/60">© {new Date().getFullYear()} Wadud Health. All rights reserved.</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
