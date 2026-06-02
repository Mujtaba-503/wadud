"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Bell, Moon, Globe, Lock, CreditCard, Trash2, Sun, Monitor } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onClick}
      className={cn("relative h-6 w-11 rounded-full transition-colors", on ? "bg-primary" : "bg-muted-foreground/30")}
    >
      <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform", on ? "translate-x-5" : "translate-x-0.5")} />
    </button>
  );
}

function Row({ icon: Icon, title, desc, children }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notif, setNotif] = useState({ email: true, sms: false, push: true });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-3xl">
      <PageHeader title="Settings" description="Manage preferences for your provider account." />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="h-4 w-4 text-primary" /> Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          <Row icon={Bell} title="Email notifications" desc="Booking confirmations and reminders">
            <Toggle on={notif.email} onClick={() => setNotif((n) => ({ ...n, email: !n.email }))} label="Email notifications" />
          </Row>
          <Row icon={Bell} title="SMS notifications" desc="Time-sensitive alerts via text">
            <Toggle on={notif.sms} onClick={() => setNotif((n) => ({ ...n, sms: !n.sms }))} label="SMS notifications" />
          </Row>
          <Row icon={Bell} title="Push notifications" desc="In-app and browser push">
            <Toggle on={notif.push} onClick={() => setNotif((n) => ({ ...n, push: !n.push }))} label="Push notifications" />
          </Row>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Moon className="h-4 w-4 text-primary" /> Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: "light", label: "Light", icon: Sun },
              { key: "dark", label: "Dark", icon: Moon },
              { key: "system", label: "System", icon: Monitor },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTheme(key)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors",
                  theme === key ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-muted"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lock className="h-4 w-4 text-primary" /> Account
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          <Row icon={Globe} title="Language" desc="English (United States)">
            <Button variant="outline" size="sm">Change</Button>
          </Row>
          <Row icon={Lock} title="Password" desc="Last changed 3 months ago">
            <Button variant="outline" size="sm" onClick={() => toast.message("Password reset link sent")}>Update</Button>
          </Row>
          <Row icon={CreditCard} title="Payout method" desc="HBL •••• 4821">
            <Button variant="outline" size="sm">Manage</Button>
          </Row>
          <Row icon={Trash2} title="Delete account" desc="Permanently remove your account and data">
            <Button variant="destructive" size="sm" onClick={() => toast.error("This action requires admin approval")}>Delete</Button>
          </Row>
        </CardContent>
      </Card>
    </div>
  );
}
