"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  Wallet,
  Clock,
  Users,
  Video,
  MessageSquare,
  ArrowRight,
  CalendarClock,
  Pill,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TODAYS_APPOINTMENTS,
  QUEUE,
  WEEKLY_EARNINGS,
  EARNINGS_SUMMARY,
  DOCTOR_PATIENTS,
} from "@/lib/doctor-data";
import { CURRENT_DOCTOR } from "@/stores/auth.store";
import {
  formatCurrency,
  getInitials,
  getConsultationTypeLabel,
} from "@/lib/utils";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <Skeleton className="h-9 w-72" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-80 rounded-xl lg:col-span-2" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title={`${greeting}, Dr. ${CURRENT_DOCTOR.lastName}`}
        description="Here's what your day looks like."
        action={
          <Button asChild>
            <Link href="/availability">
              <CalendarClock className="h-4 w-4" /> Manage availability
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Today's Appointments" value={String(TODAYS_APPOINTMENTS.length)} icon={CalendarCheck} trend={8} />
        <StatCard label="Weekly Earnings" value={formatCurrency(WEEKLY_EARNINGS.reduce((s, d) => s + d.earnings, 0), CURRENT_DOCTOR.currency)} icon={Wallet} trend={12} accent="accent" />
        <StatCard label="Pending Consultations" value={String(QUEUE.filter((c) => c.status === "pending").length)} icon={Clock} trend={-3} accent="amber" />
        <StatCard label="Total Patients" value={String(DOCTOR_PATIENTS.length * 32)} icon={Users} trend={5} accent="secondary" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Earnings chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Weekly earnings</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {formatCurrency(EARNINGS_SUMMARY.thisMonth, CURRENT_DOCTOR.currency)} this month
              </p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/earnings">
                Details <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={WEEKLY_EARNINGS} margin={{ left: -16, right: 8, top: 8 }}>
                  <defs>
                    <linearGradient id="earn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0F766E" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#0F766E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip
                    formatter={(v: number) => [formatCurrency(v, CURRENT_DOCTOR.currency), "Earnings"]}
                    contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
                  />
                  <Area type="monotone" dataKey="earnings" stroke="#0F766E" strokeWidth={2.5} fill="url(#earn)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {[
              { label: "Consultation queue", href: "/queue", icon: Clock, badge: QUEUE.length },
              { label: "Start a video call", href: `/video/${TODAYS_APPOINTMENTS[0]?.id ?? ""}`, icon: Video },
              { label: "Open messages", href: "/chat", icon: MessageSquare },
              { label: "Write a prescription", href: "/prescriptions", icon: Pill },
            ].map(({ label, href, icon: Icon, badge }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center gap-3 rounded-xl border border-border p-3 hover:border-primary/40 hover:bg-muted/50 transition-colors"
              >
                <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="flex-1 text-sm font-medium text-foreground">{label}</span>
                {badge ? <Badge variant="pending">{badge}</Badge> : <ArrowRight className="h-4 w-4 text-muted-foreground" />}
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Today's appointments */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Today&apos;s schedule</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/queue">
              View queue <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {TODAYS_APPOINTMENTS.map((c) => {
            const p = c.patient!;
            const time = new Date(c.scheduledAt).toLocaleTimeString("en", { hour: "numeric", minute: "2-digit" });
            return (
              <div key={c.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                <div className="w-16 shrink-0 text-sm font-bold text-foreground">{time}</div>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={p.avatar} alt="" />
                  <AvatarFallback>{getInitials(p.firstName, p.lastName)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {p.firstName} {p.lastName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{c.symptoms ?? "General consultation"}</p>
                </div>
                <Badge variant={c.consultationType === "video" ? "info" : "secondary"} className="hidden sm:flex">
                  {c.consultationType === "video" ? <Video className="h-3 w-3" /> : <MessageSquare className="h-3 w-3" />}
                  {getConsultationTypeLabel(c.consultationType)}
                </Badge>
                <Badge variant={c.status === "confirmed" ? "confirmed" : "pending"}>{c.status}</Badge>
                <Button size="sm" variant="outline" asChild className="hidden md:inline-flex">
                  <Link href={`/patients/${p.id}`}>View</Link>
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
