"use client";

import Link from "next/link";
import { Wallet, TrendingUp, Clock, Activity, ArrowRight, Download } from "lucide-react";
import {
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
import { EARNINGS_SUMMARY, WEEKLY_EARNINGS, ALL_CONSULTATIONS } from "@/lib/doctor-data";
import { CURRENT_DOCTOR } from "@/stores/auth.store";
import { formatCurrency, getInitials, formatDate } from "@/lib/utils";

export default function EarningsPage() {
  const s = EARNINGS_SUMMARY;
  const transactions = ALL_CONSULTATIONS.slice(0, 8);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Earnings"
        description="Track your consultation revenue and payouts."
        action={
          <>
            <Button variant="outline">
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button asChild>
              <Link href="/payouts">
                Payouts <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total earnings" value={formatCurrency(s.totalEarnings, s.currency)} icon={Wallet} accent="primary" />
        <StatCard label="This month" value={formatCurrency(s.thisMonth, s.currency)} icon={TrendingUp} trend={Math.round(((s.thisMonth - s.lastMonth) / s.lastMonth) * 100)} accent="accent" />
        <StatCard label="Pending payout" value={formatCurrency(s.pendingPayout, s.currency)} icon={Clock} accent="amber" />
        <StatCard label="Avg / consultation" value={formatCurrency(s.averagePerConsultation, s.currency)} icon={Activity} accent="secondary" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue this week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_EARNINGS} margin={{ left: -16, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} stroke="hsl(var(--muted-foreground))" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted))" }}
                  formatter={(v: number) => [formatCurrency(v, s.currency), "Earnings"]}
                  contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
                />
                <Bar dataKey="earnings" fill="#0F766E" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent transactions</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {transactions.map((c) => {
            const p = c.patient!;
            const fee = c.consultationFee;
            const net = Math.round(fee * 0.85);
            return (
              <div key={c.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={p.avatar} alt="" />
                  <AvatarFallback>{getInitials(p.firstName, p.lastName)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {p.firstName} {p.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDate(c.scheduledAt)}</p>
                </div>
                <Badge variant="ghost" className="hidden sm:flex">−15% fee</Badge>
                <div className="text-right">
                  <p className="text-sm font-bold text-accent">+{formatCurrency(net, CURRENT_DOCTOR.currency)}</p>
                  <p className="text-[11px] text-muted-foreground">of {formatCurrency(fee, CURRENT_DOCTOR.currency)}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
