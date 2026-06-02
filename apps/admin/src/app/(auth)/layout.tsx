import { ShieldCheck, BarChart3, Users, Lock } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-12 text-white overflow-hidden">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight">Wadud Admin</span>
        </div>

        <div className="relative space-y-8 max-w-md">
          <h1 className="text-4xl font-extrabold leading-tight">Operate the platform with confidence.</h1>
          <ul className="space-y-5">
            {[
              { icon: BarChart3, title: "Real-time analytics", desc: "Monitor consultations, revenue and growth." },
              { icon: Users, title: "Manage the network", desc: "Verify doctors and oversee user accounts." },
              { icon: Lock, title: "Secure by design", desc: "Audit logs and content moderation built-in." },
            ].map(({ icon: Icon, title, desc }) => (
              <li key={title} className="flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold">{title}</p>
                  <p className="text-sm text-white/70 leading-normal">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/50">© {new Date().getFullYear()} Wadud Health. Internal use only.</p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
