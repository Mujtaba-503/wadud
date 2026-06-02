"use client";

import Link from "next/link";
import {
  Users,
  Stethoscope,
  Activity,
  Banknote,
  ArrowRight,
  BadgeCheck,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
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
import {
  MOCK_DASHBOARD_ANALYTICS,
  MOCK_CHART_DATA,
  MOCK_VERIFICATION_APPLICATIONS,
} from "@wadud/mocks";
import { formatCurrency, getInitials, getSpecializationLabel, formatRelativeTime } from "@/lib/utils";

export default function AdminDashboardPage() {
  const a = MOCK_DASHBOARD_ANALYTICS;
  const consultData = MOCK_CHART_DATA.consultations.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en", { month: "short", day: "numeric" }),
    consultations: d.value,
  }));
  const revenueData = MOCK_CHART_DATA.revenue.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en", { month: "short", day: "numeric" }),
    revenue: d.value,
  }));
  const pending = MOCK_VERIFICATION_APPLICATIONS.filter(
    (v) => v.status === "pending" || v.status === "under_review"
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader title="Dashboard" description="Platform-wide analytics and key metrics." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Patients" value={a.totalPatients.toLocaleString()} icon={Users} trend={a.patientGrowth} accent="primary" />
        <StatCard label="Total Doctors" value={a.totalDoctors.toLocaleString()} icon={Stethoscope} trend={a.doctorGrowth} accent="secondary" />
        <StatCard label="Consultations" value={a.totalConsultations.toLocaleString()} icon={Activity} trend={a.consultationGrowth} accent="accent" />
        <StatCard label="Total Revenue" value={formatCurrency(a.totalRevenue, a.currency)} icon={Banknote} trend={a.revenueGrowth} accent="amber" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Consultations (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={consultData} margin={{ left: -16, right: 8, top: 8 }}>
                  <defs>
                    <linearGradient id="c" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#14B8A6" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#14B8A6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={11} stroke="hsl(var(--muted-foreground))" interval={5} />
                  <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                  <Area type="monotone" dataKey="consultations" stroke="#14B8A6" strokeWidth={2.5} fill="url(#c)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ left: -8, right: 8, top: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={11} stroke="hsl(var(--muted-foreground))" interval={5} />
                  <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip cursor={{ fill: "hsl(var(--muted))" }} formatter={(v: number) => [formatCurrency(v, a.currency), "Revenue"]} contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                  <Bar dataKey="revenue" fill="#0F766E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending verifications */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-primary" /> Pending verifications
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{pending.length} applications awaiting review</p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/verification">
              Review all <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {pending.map((v) => {
            const d = v.doctor!;
            return (
              <div key={v.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={d.avatar} alt="" />
                  <AvatarFallback>{getInitials(d.firstName, d.lastName)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    Dr. {d.firstName} {d.lastName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{getSpecializationLabel(d.specialization)}</p>
                </div>
                <span className="hidden text-xs text-muted-foreground sm:block">{formatRelativeTime(v.submittedAt)}</span>
                <Badge variant={v.status === "under_review" ? "secondary" : "pending"}>{v.status.replace("_", " ")}</Badge>
                <Button size="sm" variant="outline" asChild className="hidden md:inline-flex">
                  <Link href="/verification">Review</Link>
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
