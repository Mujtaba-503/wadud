"use client";

import { useState } from "react";
import { Activity, Video, MessageSquare, Building2, Search } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { MOCK_CONSULTATIONS } from "@wadud/mocks";
import { getInitials, formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import type { BookingStatus } from "@wadud/types";

const typeIcon = { video: Video, chat: MessageSquare, in_person: Building2 } as const;

const STATUSES: (BookingStatus | "all")[] = ["all", "pending", "confirmed", "completed", "cancelled"];

export default function ConsultationsPage() {
  const [status, setStatus] = useState<BookingStatus | "all">("all");
  const [q, setQ] = useState("");

  const active = MOCK_CONSULTATIONS.filter((c) => c.status === "confirmed").length;
  const today = MOCK_CONSULTATIONS.filter((c) => c.status === "pending").length;
  const completed = MOCK_CONSULTATIONS.filter((c) => c.status === "completed").length;

  const filtered = MOCK_CONSULTATIONS.filter((c) => status === "all" || c.status === status).filter((c) => {
    const name = `${c.doctor?.firstName ?? ""} ${c.doctor?.lastName ?? ""} ${c.patient?.firstName ?? ""} ${c.patient?.lastName ?? ""}`;
    return name.toLowerCase().includes(q.toLowerCase());
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader title="Consultation Monitoring" description="Track live and historical consultations." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Confirmed" value={String(active)} icon={Activity} accent="accent" />
        <StatCard label="Pending" value={String(today)} icon={Video} accent="primary" />
        <StatCard label="Completed" value={String(completed)} icon={MessageSquare} accent="secondary" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <Button key={s} variant={status === s ? "default" : "outline"} size="sm" onClick={() => setStatus(s)} className="capitalize">
              {s.replace("_", " ")}
            </Button>
          ))}
        </div>
        <div className="sm:max-w-xs sm:flex-1">
          <Input placeholder="Search by name…" value={q} onChange={(e) => setQ(e.target.value)} leftIcon={<Search className="h-4 w-4" />} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Activity} title="No consultations" description="No consultations match the current filters." />
      ) : (
        <div className="grid gap-3">
          {filtered.map((c) => {
            const Icon = typeIcon[c.consultationType];
            return (
              <Card key={c.id}>
                <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex flex-1 flex-wrap items-center gap-x-6 gap-y-2">
                    <Pair label="Doctor" doctor={c.doctor} />
                    <Pair label="Patient" patient={c.patient} />
                    <div>
                      <p className="text-xs text-muted-foreground">Scheduled</p>
                      <p className="text-sm font-medium text-foreground">{formatDate(c.scheduledAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Fee</p>
                      <p className="text-sm font-medium text-foreground">{formatCurrency(c.consultationFee, c.currency)}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(c.status)} variant="ghost">
                    <span className="capitalize">{c.status.replace("_", " ")}</span>
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Pair({
  label,
  doctor,
  patient,
}: {
  label: string;
  doctor?: { firstName: string; lastName: string; avatar?: string };
  patient?: { firstName: string; lastName: string; avatar?: string };
}) {
  const person = doctor ?? patient;
  if (!person) return null;
  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={person.avatar} alt="" />
        <AvatarFallback className="text-xs">{getInitials(person.firstName, person.lastName)}</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">
          {doctor ? "Dr. " : ""}{person.firstName} {person.lastName}
        </p>
      </div>
    </div>
  );
}
