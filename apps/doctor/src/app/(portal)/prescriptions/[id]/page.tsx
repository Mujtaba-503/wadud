"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { PrescriptionForm } from "@/components/prescription-form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getConsultationById } from "@/lib/doctor-data";
import { getInitials, formatDate, getConsultationTypeLabel } from "@/lib/utils";

export default function PrescriptionForConsultationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const consultation = getConsultationById(id);
  if (!consultation) notFound();
  const p = consultation.patient!;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2 w-fit">
        <Link href="/prescriptions">
          <ArrowLeft className="h-4 w-4" /> Back to prescriptions
        </Link>
      </Button>

      <PageHeader title="New Prescription" description={`For ${p.firstName} ${p.lastName}`} />

      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={p.avatar} alt="" />
            <AvatarFallback>{getInitials(p.firstName, p.lastName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-foreground">
              {p.firstName} {p.lastName}
            </p>
            <p className="text-xs text-muted-foreground">{formatDate(consultation.scheduledAt)}</p>
          </div>
          <Badge variant="ghost">{getConsultationTypeLabel(consultation.consultationType)}</Badge>
        </CardContent>
      </Card>

      <PrescriptionForm patientName={`${p.firstName} ${p.lastName}`} />
    </div>
  );
}
