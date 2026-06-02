"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  BadgeCheck,
  FileText,
  X,
  Check,
  Ban,
  Eye,
  Download,
  Mail,
  Phone,
  GraduationCap,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { MOCK_VERIFICATION_APPLICATIONS } from "@wadud/mocks";
import { getInitials, getSpecializationLabel, formatRelativeTime, formatDate } from "@/lib/utils";
import type { DoctorVerificationApplication, DoctorVerificationStatus } from "@wadud/types";

type Filter = "all" | "pending" | "under_review" | "rejected";

const statusBadge: Record<DoctorVerificationStatus, "pending" | "secondary" | "verified" | "destructive" | "ghost"> = {
  pending: "pending",
  under_review: "secondary",
  verified: "verified",
  rejected: "destructive",
  suspended: "ghost",
};

export default function VerificationPage() {
  const [apps, setApps] = useState<DoctorVerificationApplication[]>(MOCK_VERIFICATION_APPLICATIONS);
  const [filter, setFilter] = useState<Filter>("all");
  const [active, setActive] = useState<DoctorVerificationApplication | null>(null);
  const [notes, setNotes] = useState("");

  const decide = (id: string, status: DoctorVerificationStatus) => {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status, reviewNotes: notes || a.reviewNotes } : a)));
    setActive(null);
    setNotes("");
    toast[status === "verified" ? "success" : "message"](
      status === "verified" ? "Doctor approved" : status === "rejected" ? "Application rejected" : "Marked under review"
    );
  };

  const filtered = apps.filter((a) => filter === "all" || a.status === filter);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader title="Doctor Verification" description="Review and approve doctor applications." />

      <div className="flex flex-wrap gap-2">
        {(["all", "pending", "under_review", "rejected"] as Filter[]).map((f) => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className="capitalize">
            {f.replace("_", " ")}
            <Badge variant="ghost" className="ml-1">
              {f === "all" ? apps.length : apps.filter((a) => a.status === f).length}
            </Badge>
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={BadgeCheck} title="Nothing to review" description="There are no applications matching this filter." />
      ) : (
        <div className="grid gap-3">
          {filtered.map((app) => {
            const d = app.doctor!;
            return (
              <Card key={app.id}>
                <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={d.avatar} alt="" />
                    <AvatarFallback>{getInitials(d.firstName, d.lastName)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">
                        Dr. {d.firstName} {d.lastName}
                      </p>
                      <Badge variant={statusBadge[app.status]} className="capitalize">{app.status.replace("_", " ")}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{getSpecializationLabel(d.specialization)}</p>
                    <p className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5" /> {app.documents.length} documents
                      </span>
                      <span>Submitted {formatRelativeTime(app.submittedAt)}</span>
                    </p>
                  </div>
                  <Button onClick={() => setActive(app)}>
                    <Eye className="h-4 w-4" /> Review
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Review modal */}
      {active && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={() => setActive(null)} aria-hidden />
          <div className="relative z-10 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-card p-6 shadow-2xl sm:rounded-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={active.doctor!.avatar} alt="" />
                  <AvatarFallback>{getInitials(active.doctor!.firstName, active.doctor!.lastName)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Dr. {active.doctor!.firstName} {active.doctor!.lastName}
                  </h2>
                  <p className="text-sm text-muted-foreground">{getSpecializationLabel(active.doctor!.specialization)}</p>
                </div>
              </div>
              <button onClick={() => setActive(null)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Info icon={Mail} label="Email" value={active.doctor!.email} />
              <Info icon={Phone} label="Phone" value={active.doctor!.phone} />
              <Info icon={GraduationCap} label="Experience" value={`${active.doctor!.experience} years`} />
              <Info icon={FileText} label="License" value={active.doctor!.licenseNumber} />
            </div>

            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold text-foreground">Submitted documents</p>
              <div className="space-y-2">
                {active.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between rounded-xl border border-border p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{doc.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{doc.type.replace("_", " ")} · {formatDate(doc.uploadedAt)}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon-sm" aria-label="Download document">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <Textarea
                label="Review notes"
                placeholder="Add notes about this verification decision…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                defaultValue={active.reviewNotes}
              />
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => decide(active.id, "under_review")}>
                Mark under review
              </Button>
              <Button variant="destructive" onClick={() => decide(active.id, "rejected")}>
                <Ban className="h-4 w-4" /> Reject
              </Button>
              <Button variant="success" onClick={() => decide(active.id, "verified")}>
                <Check className="h-4 w-4" /> Approve
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border p-3">
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </p>
      <p className="mt-0.5 truncate text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
