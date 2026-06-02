"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Save, Pill, Stethoscope } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getConsultationById } from "@/lib/doctor-data";
import { getInitials, formatDate, getConsultationTypeLabel } from "@/lib/utils";

export default function NoteEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const consultation = getConsultationById(id);
  if (!consultation) notFound();
  const p = consultation.patient!;

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    chiefComplaint: consultation.symptoms ?? "",
    subjective: "",
    objective: "",
    assessment: consultation.diagnosis ?? "",
    plan: consultation.doctorNotes ?? "",
    followUp: "",
  });

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Notes saved", { description: "Consultation notes have been recorded." });
    }, 900);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2 w-fit">
        <Link href="/notes">
          <ArrowLeft className="h-4 w-4" /> Back to notes
        </Link>
      </Button>

      <PageHeader
        title="Consultation Notes"
        description="Document the clinical encounter using the SOAP format."
        action={
          <>
            <Button variant="outline" asChild>
              <Link href={`/prescriptions/${id}`}>
                <Pill className="h-4 w-4" /> Add prescription
              </Link>
            </Button>
            <Button onClick={save} loading={saving}>
              <Save className="h-4 w-4" /> Save notes
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 h-fit">
          <CardContent className="p-6 text-center">
            <Avatar className="mx-auto h-16 w-16">
              <AvatarImage src={p.avatar} alt="" />
              <AvatarFallback>{getInitials(p.firstName, p.lastName)}</AvatarFallback>
            </Avatar>
            <p className="mt-3 font-bold text-foreground">
              {p.firstName} {p.lastName}
            </p>
            <p className="text-xs text-muted-foreground">{formatDate(consultation.scheduledAt)}</p>
            <div className="mt-3 flex justify-center gap-2">
              <Badge variant="ghost">{getConsultationTypeLabel(consultation.consultationType)}</Badge>
              <Badge variant={consultation.status === "completed" ? "completed" : "confirmed"}>{consultation.status}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Stethoscope className="h-4 w-4 text-primary" /> Clinical documentation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <Input label="Chief complaint" value={form.chiefComplaint} onChange={update("chiefComplaint")} placeholder="e.g. Persistent headache for 3 days" />
            <Textarea label="Subjective (S)" value={form.subjective} onChange={update("subjective")} placeholder="Patient-reported symptoms and history…" />
            <Textarea label="Objective (O)" value={form.objective} onChange={update("objective")} placeholder="Examination findings, vitals, observations…" />
            <Textarea label="Assessment (A) / Diagnosis" value={form.assessment} onChange={update("assessment")} placeholder="Clinical impression and diagnosis…" />
            <Textarea label="Plan (P)" value={form.plan} onChange={update("plan")} placeholder="Treatment plan, medications, recommendations…" />
            <Input label="Follow-up date" type="date" value={form.followUp} onChange={update("followUp")} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
