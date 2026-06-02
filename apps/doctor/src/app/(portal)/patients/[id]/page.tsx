"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  Droplet,
  Ruler,
  Weight,
  AlertTriangle,
  Activity,
  Pill,
  FileText,
  Video,
  MessageSquare,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getPatientById, ALL_CONSULTATIONS } from "@/lib/doctor-data";
import { getInitials, formatDate, getConsultationTypeLabel } from "@/lib/utils";

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const patient = getPatientById(id);
  if (!patient) notFound();

  const history = ALL_CONSULTATIONS.filter((c) => c.patientId === id);
  const age = patient.dateOfBirth
    ? Math.floor((Date.now() - new Date(patient.dateOfBirth).getTime()) / 31557600000)
    : null;

  const vitals = [
    { label: "Blood Type", value: patient.bloodType ?? "—", icon: Droplet },
    { label: "Height", value: patient.height ? `${patient.height} cm` : "—", icon: Ruler },
    { label: "Weight", value: patient.weight ? `${patient.weight} kg` : "—", icon: Weight },
    { label: "Age", value: age ? `${age} yrs` : "—", icon: Activity },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2 w-fit">
        <Link href="/patients">
          <ArrowLeft className="h-4 w-4" /> Back to patients
        </Link>
      </Button>

      <PageHeader
        title={`${patient.firstName} ${patient.lastName}`}
        description="Patient medical profile and consultation history."
        action={
          <>
            <Button variant="outline" asChild>
              <Link href="/chat">
                <MessageSquare className="h-4 w-4" /> Message
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/video/${history[0]?.id ?? ""}`}>
                <Video className="h-4 w-4" /> Start call
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: profile */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Avatar className="mx-auto h-20 w-20">
                <AvatarImage src={patient.avatar} alt="" />
                <AvatarFallback className="text-xl">{getInitials(patient.firstName, patient.lastName)}</AvatarFallback>
              </Avatar>
              <h2 className="mt-3 text-lg font-bold text-foreground">
                {patient.firstName} {patient.lastName}
              </h2>
              <p className="text-sm text-muted-foreground capitalize">{patient.gender ?? "—"}</p>
              <div className="mt-4 space-y-2 text-left text-sm">
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" /> {patient.email}
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" /> {patient.phone}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Vitals</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {vitals.map((v) => (
                <div key={v.label} className="rounded-xl border border-border p-3">
                  <v.icon className="h-4 w-4 text-primary" />
                  <p className="mt-1.5 text-xs text-muted-foreground">{v.label}</p>
                  <p className="font-bold text-foreground">{v.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right: medical info + history */}
        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle className="h-4 w-4 text-amber-500" /> Allergies
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-1.5">
                {(patient.allergies ?? []).length ? (
                  patient.allergies!.map((a) => <Badge key={a} variant="destructive">{a}</Badge>)
                ) : (
                  <p className="text-sm text-muted-foreground">No known allergies.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Activity className="h-4 w-4 text-primary" /> Chronic conditions
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-1.5">
                {(patient.chronicConditions ?? []).length ? (
                  patient.chronicConditions!.map((c) => <Badge key={c} variant="warning">{c}</Badge>)
                ) : (
                  <p className="text-sm text-muted-foreground">None recorded.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Pill className="h-4 w-4 text-secondary" /> Current medications
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-1.5">
              {(patient.currentMedications ?? []).length ? (
                patient.currentMedications!.map((m) => <Badge key={m} variant="secondary">{m}</Badge>)
              ) : (
                <p className="text-sm text-muted-foreground">No active medications.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-primary" /> Consultation history
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              {history.length ? (
                history.map((c) => (
                  <div key={c.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{c.diagnosis ?? "Consultation"}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(c.scheduledAt)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="ghost">{getConsultationTypeLabel(c.consultationType)}</Badge>
                      <Badge variant={c.status === "completed" ? "completed" : "confirmed"}>{c.status}</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-2 text-sm text-muted-foreground">No previous consultations.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
