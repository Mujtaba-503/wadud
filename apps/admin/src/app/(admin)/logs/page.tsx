"use client";

import { useState } from "react";
import { ScrollText, Info, AlertTriangle, XCircle, ShieldAlert, Search } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { MOCK_SYSTEM_LOGS } from "@wadud/mocks";
import { formatRelativeTime, cn } from "@/lib/utils";
import type { SystemLogLevel } from "@wadud/types";

const levelMeta: Record<SystemLogLevel, { icon: React.ComponentType<{ className?: string }>; color: string; variant: "info" | "warning" | "destructive" }> = {
  info: { icon: Info, color: "text-blue-600 bg-blue-500/10", variant: "info" },
  warning: { icon: AlertTriangle, color: "text-amber-600 bg-amber-500/10", variant: "warning" },
  error: { icon: XCircle, color: "text-red-600 bg-red-500/10", variant: "destructive" },
  critical: { icon: ShieldAlert, color: "text-red-700 bg-red-500/15", variant: "destructive" },
};

const LEVELS: (SystemLogLevel | "all")[] = ["all", "info", "warning", "error", "critical"];

export default function LogsPage() {
  const [level, setLevel] = useState<SystemLogLevel | "all">("all");
  const [q, setQ] = useState("");

  const filtered = MOCK_SYSTEM_LOGS.filter((l) => level === "all" || l.level === level).filter((l) =>
    `${l.message} ${l.actor ?? ""} ${l.category}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader title="System Logs" description="Audit trail of platform events." />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {LEVELS.map((l) => (
            <Button key={l} variant={level === l ? "default" : "outline"} size="sm" onClick={() => setLevel(l)} className="capitalize">
              {l}
            </Button>
          ))}
        </div>
        <div className="sm:max-w-xs sm:flex-1">
          <Input placeholder="Search logs…" value={q} onChange={(e) => setQ(e.target.value)} leftIcon={<Search className="h-4 w-4" />} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={ScrollText} title="No logs" description="No log entries match the current filters." />
      ) : (
        <Card>
          <CardContent className="divide-y divide-border p-0">
            {filtered.map((log) => {
              const meta = levelMeta[log.level];
              const Icon = meta.icon;
              return (
                <div key={log.id} className="flex items-start gap-3 p-4">
                  <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0", meta.color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={meta.variant} className="uppercase text-[10px]">{log.level}</Badge>
                      <Badge variant="ghost" className="capitalize">{log.category}</Badge>
                      <span className="text-xs text-muted-foreground">{formatRelativeTime(log.createdAt)}</span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-foreground">{log.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {log.actor ? <>actor: <span className="font-mono">{log.actor}</span></> : null}
                      {log.ip ? <> · ip: <span className="font-mono">{log.ip}</span></> : null}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
