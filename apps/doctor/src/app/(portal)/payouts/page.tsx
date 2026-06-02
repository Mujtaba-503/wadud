"use client";

import { toast } from "sonner";
import { Banknote, Building2, Wallet } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PAYOUTS, EARNINGS_SUMMARY } from "@/lib/doctor-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Payout } from "@wadud/types";

const statusVariant: Record<Payout["status"], "completed" | "pending" | "secondary" | "destructive"> = {
  completed: "completed",
  pending: "pending",
  processing: "secondary",
  failed: "destructive",
};

export default function PayoutsPage() {
  const s = EARNINGS_SUMMARY;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Payout History"
        description="Your withdrawals and bank transfers."
        action={
          <Button onClick={() => toast.success("Payout requested", { description: "Your payout is being processed." })}>
            <Wallet className="h-4 w-4" /> Request payout
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Available to withdraw</p>
          <p className="mt-1 text-2xl font-extrabold text-foreground">{formatCurrency(s.pendingPayout, s.currency)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Paid out (lifetime)</p>
          <p className="mt-1 text-2xl font-extrabold text-foreground">{formatCurrency(s.totalEarnings - s.pendingPayout, s.currency)}</p>
        </Card>
        <Card className="flex items-center gap-3 p-5">
          <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Linked account</p>
            <p className="font-bold text-foreground">HBL •••• 4821</p>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {PAYOUTS.length === 0 ? (
            <EmptyState icon={Banknote} title="No payouts yet" description="Your payout history will appear here." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-3 py-2.5 font-semibold">Reference</th>
                    <th className="px-3 py-2.5 font-semibold">Amount</th>
                    <th className="px-3 py-2.5 font-semibold">Account</th>
                    <th className="px-3 py-2.5 font-semibold">Date</th>
                    <th className="px-3 py-2.5 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {PAYOUTS.map((po) => (
                    <tr key={po.id} className="border-b border-border/60 last:border-0">
                      <td className="px-3 py-3 font-mono text-xs text-muted-foreground">{po.id}</td>
                      <td className="px-3 py-3 font-bold text-foreground">{formatCurrency(po.amount, po.currency)}</td>
                      <td className="px-3 py-3 text-muted-foreground">{po.bankAccount}</td>
                      <td className="px-3 py-3 text-muted-foreground">{formatDate(po.createdAt)}</td>
                      <td className="px-3 py-3">
                        <Badge variant={statusVariant[po.status]} className="capitalize">{po.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
