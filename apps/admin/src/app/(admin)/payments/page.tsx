"use client";

import { useState } from "react";
import { Banknote, TrendingUp, Wallet, Search } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { MOCK_PAYMENTS } from "@wadud/mocks";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { PaymentStatus } from "@wadud/types";

const statusVariant: Record<PaymentStatus, "success" | "pending" | "destructive" | "secondary" | "ghost"> = {
  completed: "success",
  pending: "pending",
  processing: "secondary",
  failed: "destructive",
  refunded: "ghost",
};

const FILTERS: (PaymentStatus | "all")[] = ["all", "completed", "pending", "refunded", "failed"];

export default function PaymentsPage() {
  const [filter, setFilter] = useState<PaymentStatus | "all">("all");
  const [q, setQ] = useState("");

  const completed = MOCK_PAYMENTS.filter((p) => p.status === "completed");
  const gross = completed.reduce((s, p) => s + p.amount, 0);
  const platform = completed.reduce((s, p) => s + p.platformFee, 0);
  const payouts = completed.reduce((s, p) => s + p.doctorAmount, 0);
  const currency = MOCK_PAYMENTS[0]?.currency ?? "PKR";

  const filtered = MOCK_PAYMENTS.filter((p) => filter === "all" || p.status === filter).filter((p) =>
    `${p.id} ${p.gatewayTransactionId ?? ""}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader title="Payment Oversight" description="Monitor transactions, fees and refunds." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Gross Volume" value={formatCurrency(gross, currency)} icon={Banknote} accent="primary" />
        <StatCard label="Platform Revenue" value={formatCurrency(platform, currency)} icon={TrendingUp} accent="accent" />
        <StatCard label="Doctor Payouts" value={formatCurrency(payouts, currency)} icon={Wallet} accent="secondary" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className="capitalize">
              {f}
            </Button>
          ))}
        </div>
        <div className="sm:max-w-xs sm:flex-1">
          <Input placeholder="Search transaction…" value={q} onChange={(e) => setQ(e.target.value)} leftIcon={<Search className="h-4 w-4" />} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Banknote} title="No transactions" description="No payments match the current filters." />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3 font-semibold">Transaction</th>
                    <th className="px-4 py-3 font-semibold">Amount</th>
                    <th className="px-4 py-3 font-semibold">Platform fee</th>
                    <th className="px-4 py-3 font-semibold">Method</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-b border-border/60 last:border-0 hover:bg-muted/40">
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{p.id}</p>
                        <p className="text-xs text-muted-foreground">{p.gatewayTransactionId}</p>
                      </td>
                      <td className="px-4 py-3 font-semibold text-foreground">{formatCurrency(p.amount, p.currency)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{formatCurrency(p.platformFee, p.currency)}</td>
                      <td className="px-4 py-3 capitalize text-muted-foreground">{p.method.replace("_", " ")}</td>
                      <td className="px-4 py-3 text-muted-foreground">{formatDate(p.createdAt)}</td>
                      <td className="px-4 py-3">
                        <Badge variant={statusVariant[p.status]} className="capitalize">{p.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
