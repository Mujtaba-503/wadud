"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { PrescriptionForm } from "@/components/prescription-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ALL_CONSULTATIONS } from "@/lib/doctor-data";
import { getInitials, formatDate } from "@/lib/utils";

export default function PrescriptionsPage() {
  const recent = ALL_CONSULTATIONS.slice(0, 5);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader title="Prescriptions" description="Create and review prescriptions for your patients." />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PrescriptionForm />
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Recent consultations</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            {recent.map((c) => {
              const p = c.patient!;
              return (
                <Link
                  key={c.id}
                  href={`/prescriptions/${c.id}`}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 hover:opacity-80"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={p.avatar} alt="" />
                    <AvatarFallback>{getInitials(p.firstName, p.lastName)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {p.firstName} {p.lastName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{formatDate(c.scheduledAt)}</p>
                  </div>
                  {c.prescription ? <Badge variant="completed">Issued</Badge> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
