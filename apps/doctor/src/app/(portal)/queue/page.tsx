"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Video, MessageSquare, Check, X, Clock, Stethoscope } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { QUEUE } from "@/lib/doctor-data";
import { getInitials, getConsultationTypeLabel } from "@/lib/utils";
import type { Consultation } from "@wadud/types";

type Filter = "all" | "pending" | "confirmed";

export default function QueuePage() {
  const [items, setItems] = useState<Consultation[]>(QUEUE);
  const [filter, setFilter] = useState<Filter>("all");

  const act = (id: string, action: "accept" | "decline") => {
    setItems((prev) =>
      action === "accept"
        ? prev.map((c) => (c.id === id ? { ...c, status: "confirmed" } : c))
        : prev.filter((c) => c.id !== id)
    );
    toast[action === "accept" ? "success" : "message"](
      action === "accept" ? "Consultation accepted" : "Consultation declined"
    );
  };

  const filtered = items.filter((c) => filter === "all" || c.status === filter);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader title="Consultation Queue" description="Review and accept incoming consultation requests." />

      <div className="flex gap-2">
        {(["all", "pending", "confirmed"] as Filter[]).map((f) => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className="capitalize">
            {f}
            <Badge variant={filter === f ? "ghost" : "ghost"} className="ml-1">
              {f === "all" ? items.length : items.filter((c) => c.status === f).length}
            </Badge>
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Stethoscope}
          title="Queue is clear"
          description="There are no consultations matching this filter right now."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => {
            const p = c.patient!;
            const time = new Date(c.scheduledAt).toLocaleTimeString("en", { hour: "numeric", minute: "2-digit" });
            return (
              <Card key={c.id}>
                <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={p.avatar} alt="" />
                    <AvatarFallback>{getInitials(p.firstName, p.lastName)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">
                        {p.firstName} {p.lastName}
                      </p>
                      <Badge variant={c.status === "confirmed" ? "confirmed" : "pending"}>{c.status}</Badge>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">{c.symptoms ?? "General consultation"}</p>
                    <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {time}
                      </span>
                      <span className="flex items-center gap-1">
                        {c.consultationType === "video" ? <Video className="h-3.5 w-3.5" /> : <MessageSquare className="h-3.5 w-3.5" />}
                        {getConsultationTypeLabel(c.consultationType)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/patients/${p.id}`}>View patient</Link>
                    </Button>
                    {c.status === "pending" ? (
                      <>
                        <Button variant="success" size="sm" onClick={() => act(c.id, "accept")}>
                          <Check className="h-4 w-4" /> Accept
                        </Button>
                        <Button variant="outline" size="icon-sm" onClick={() => act(c.id, "decline")} aria-label="Decline">
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" asChild>
                        <Link href={c.consultationType === "video" ? `/video/${c.id}` : "/chat"}>
                          {c.consultationType === "video" ? <Video className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                          Start
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
