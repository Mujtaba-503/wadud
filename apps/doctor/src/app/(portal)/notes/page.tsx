"use client";

import Link from "next/link";
import { FileText, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { ALL_CONSULTATIONS } from "@/lib/doctor-data";
import { getInitials, formatDate } from "@/lib/utils";

export default function NotesPage() {
  const items = ALL_CONSULTATIONS;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader title="Consultation Notes" description="Document and review clinical notes for each consultation." />

      {items.length === 0 ? (
        <EmptyState icon={FileText} title="No consultations yet" description="Notes will appear here after your consultations." />
      ) : (
        <div className="space-y-3">
          {items.map((c) => {
            const p = c.patient!;
            const hasNotes = Boolean(c.doctorNotes || c.diagnosis);
            return (
              <Link key={c.id} href={`/notes/${c.id}`}>
                <Card className="transition-colors hover:border-primary/40">
                  <CardContent className="flex items-center gap-4 p-4">
                    <Avatar className="h-11 w-11">
                      <AvatarImage src={p.avatar} alt="" />
                      <AvatarFallback>{getInitials(p.firstName, p.lastName)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-foreground">
                        {p.firstName} {p.lastName}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {formatDate(c.scheduledAt)} · {c.diagnosis ?? "No diagnosis recorded"}
                      </p>
                    </div>
                    <Badge variant={hasNotes ? "completed" : "pending"}>{hasNotes ? "Documented" : "Pending notes"}</Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
