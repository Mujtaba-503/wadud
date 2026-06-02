"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Calendar, Check, Lock, Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { buildDaySlots } from "@/lib/doctor-data";
import type { TimeSlot } from "@wadud/types";

function nextDays(n: number) {
  const days: Date[] = [];
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  for (let i = 0; i < n; i++) {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function AvailabilityPage() {
  const days = nextDays(14);
  const [selected, setSelected] = useState(days[0]);
  const iso = selected.toISOString().split("T")[0];
  const [slots, setSlots] = useState<TimeSlot[]>(() => buildDaySlots(iso));

  const selectDay = (d: Date) => {
    setSelected(d);
    setSlots(buildDaySlots(d.toISOString().split("T")[0]));
  };

  const toggle = (id: string) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === id && !s.isBooked ? { ...s, isBlocked: !s.isBlocked } : s))
    );
  };

  const available = slots.filter((s) => !s.isBooked && !s.isBlocked).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Availability"
        description="Manage your consultation slots and working hours."
        action={
          <Button onClick={() => toast.success("Availability published", { description: "Patients can now book the open slots." })}>
            <Check className="h-4 w-4" /> Publish changes
          </Button>
        }
      />

      {/* Day selector */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-4 w-4 text-primary" /> Select a day
          </CardTitle>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4" /> Add recurring hours
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {days.map((d) => {
              const active = d.toDateString() === selected.toDateString();
              return (
                <button
                  key={d.toISOString()}
                  onClick={() => selectDay(d)}
                  className={cn(
                    "flex min-w-[68px] flex-col items-center rounded-xl border px-3 py-2.5 transition-colors",
                    active ? "border-primary bg-primary text-white" : "border-border hover:border-primary/40 hover:bg-muted"
                  )}
                >
                  <span className={cn("text-[11px] font-medium uppercase", active ? "text-white/80" : "text-muted-foreground")}>
                    {d.toLocaleDateString("en", { weekday: "short" })}
                  </span>
                  <span className="text-lg font-bold">{d.getDate()}</span>
                  <span className={cn("text-[10px]", active ? "text-white/80" : "text-muted-foreground")}>
                    {d.toLocaleDateString("en", { month: "short" })}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Slots */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">
              Slots for {selected.toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" })}
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{available} slots available · tap to block/unblock</p>
          </div>
          <div className="hidden gap-3 sm:flex">
            <Legend className="bg-card border-border" label="Open" />
            <Legend className="bg-primary border-primary" label="Booked" />
            <Legend className="bg-muted border-border" label="Blocked" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {slots.map((s) => (
              <button
                key={s.id}
                onClick={() => toggle(s.id)}
                disabled={s.isBooked}
                className={cn(
                  "flex items-center justify-between rounded-xl border px-3.5 py-3 text-sm font-semibold transition-all",
                  s.isBooked
                    ? "cursor-not-allowed border-primary bg-primary text-white"
                    : s.isBlocked
                      ? "border-border bg-muted text-muted-foreground line-through"
                      : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-primary/5"
                )}
              >
                {s.startTime}
                {s.isBooked ? (
                  <Badge variant="ghost" className="bg-white/20 text-white">Booked</Badge>
                ) : s.isBlocked ? (
                  <Lock className="h-3.5 w-3.5" />
                ) : null}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Legend({ label, className }: { label: string; className?: string }) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className={cn("h-3 w-3 rounded border", className)} /> {label}
    </span>
  );
}
