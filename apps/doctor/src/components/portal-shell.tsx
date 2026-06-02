"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  CalendarClock,
  ListChecks,
  Users,
  MessageSquare,
  FileText,
  Pill,
  Wallet,
  Banknote,
  UserCog,
  Settings,
  Stethoscope,
  Menu,
  X,
  Moon,
  Sun,
  LogOut,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore, CURRENT_DOCTOR } from "@/stores/auth.store";
import { QUEUE } from "@/lib/doctor-data";

interface NavLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const NAV: NavLink[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Availability", href: "/availability", icon: CalendarClock },
  { label: "Consultation Queue", href: "/queue", icon: ListChecks, badge: QUEUE.length },
  { label: "Patients", href: "/patients", icon: Users },
  { label: "Messages", href: "/chat", icon: MessageSquare },
  { label: "Consultation Notes", href: "/notes", icon: FileText },
  { label: "Prescriptions", href: "/prescriptions", icon: Pill },
  { label: "Earnings", href: "/earnings", icon: Wallet },
  { label: "Payouts", href: "/payouts", icon: Banknote },
  { label: "Profile & Verification", href: "/profile", icon: UserCog },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { logout } = useAuthStore();

  const initials = `${CURRENT_DOCTOR.firstName[0]}${CURRENT_DOCTOR.lastName[0]}`;

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-border shrink-0">
        <div className="h-9 w-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-glow">
          <Stethoscope className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <p className="font-extrabold text-foreground text-sm">Wadud</p>
          <p className="text-[10px] uppercase tracking-wider text-primary font-semibold">Provider Portal</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Primary">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge ? (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                    active ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                  )}
                >
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <Avatar className="h-9 w-9">
            <AvatarImage src={CURRENT_DOCTOR.avatar} alt="" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              Dr. {CURRENT_DOCTOR.firstName} {CURRENT_DOCTOR.lastName}
            </p>
            <p className="truncate text-xs text-muted-foreground">{CURRENT_DOCTOR.email}</p>
          </div>
          <Link
            href="/login"
            onClick={() => logout()}
            aria-label="Log out"
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-border bg-card z-30">
        {SidebarContent}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setOpen(false)} aria-hidden />
          <aside className="relative w-64 bg-card border-r border-border animate-slide-in-right">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            {SidebarContent}
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-card/80 backdrop-blur px-4 sm:px-6">
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden rounded-lg p-2 text-muted-foreground hover:bg-muted"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-1.5">
            <Link
              href="/notifications"
              className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
            </Link>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Toggle theme"
            >
              <Sun className="h-5 w-5 hidden dark:block" />
              <Moon className="h-5 w-5 dark:hidden" />
            </button>
          </div>
        </header>

        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  );
}
