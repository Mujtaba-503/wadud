"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Clock, MessageSquare, Plus, FileText, Download, ShoppingBag, Heart, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MOCK_CONSULTATIONS } from "@wadud/mocks/consultations";
import { MOCK_DOCTORS } from "@wadud/mocks";
import { getSpecializationLabel } from "@/lib/utils";
import { toast } from "sonner";

export default function ConsultationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const consultation = MOCK_CONSULTATIONS.find((c) => c.id === id);

  if (!consultation) {
    return (
      <div className="page-container py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-foreground">Consultation not found</h2>
        <p className="text-sm text-muted-foreground">The summary for this session does not exist.</p>
        <Link href="/consultations">
          <Button size="sm">Back to List</Button>
        </Link>
      </div>
    );
  }

  const doctor = MOCK_DOCTORS.find((d) => d.id === consultation.doctorId);
  if (!doctor) return null;

  const initials = `${doctor.firstName[0]}${doctor.lastName[0]}`;
  const startTime = new Date(consultation.startTime);

  const handleDownload = () => {
    toast.success("Download Started", {
      description: "Downloading medical summary PDF file...",
    });
  };

  const handleOrder = () => {
    toast.success("Pharmacy Order Initiated", {
      description: "Our dispatcher will contact you shortly to confirm pharmacy delivery.",
    });
  };

  return (
    <div className="page-container py-8 space-y-6">
      {/* Back button */}
      <Link
        href="/consultations"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Consultations
      </Link>

      {/* Details Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Summary */}
        <div className="lg:col-span-8 space-y-6 text-left">
          {/* Card Info */}
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-border">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 shrink-0">
                  <AvatarImage src={doctor.avatar} />
                  <AvatarFallback className="text-sm font-bold bg-primary/10 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-extrabold text-foreground text-base">
                    Dr. {doctor.firstName} {doctor.lastName}
                  </h2>
                  <p className="text-xs text-primary font-medium">
                    {getSpecializationLabel(doctor.specialization)}
                  </p>
                </div>
              </div>

              <div className="space-y-1 text-left sm:text-right">
                <Badge variant="outline" className="text-2xs font-semibold uppercase tracking-wider">
                  Session Completed
                </Badge>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                  <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>
                    {startTime.toLocaleString("en", {
                      weekday: "short", month: "short", day: "numeric", year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Diagnosis notes */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Clinical Diagnosis Notes
              </h3>
              <div className="bg-muted/30 border border-border p-5 rounded-xl text-sm leading-relaxed text-muted-foreground">
                {consultation.notes?.diagnosis || "No specific diagnosis logged for this session."}
              </div>
            </div>

            {/* Prescriptions */}
            {consultation.prescription && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="h-4.5 w-4.5 text-primary" /> Active Prescription
                </h3>
                <div className="border border-border rounded-xl divide-y divide-border overflow-hidden bg-muted/10">
                  {consultation.prescription.medicines.map((med, idx) => (
                    <div key={idx} className="p-4 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-foreground">{med.name}</p>
                        <p className="text-muted-foreground mt-0.5">{med.dosage} &bull; {med.frequency}</p>
                      </div>
                      <span className="font-semibold text-muted-foreground">
                        Qty: {med.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Action Box */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm text-left">
            <h3 className="font-bold text-foreground text-xs uppercase tracking-wider pb-2 border-b border-border">
              Available Actions
            </h3>

            <div className="space-y-3">
              <Button
                onClick={handleDownload}
                className="w-full rounded-xl text-white shadow-glow h-10 font-semibold flex items-center justify-center gap-1.5"
              >
                <Download className="h-4 w-4" /> Download PDF Summary
              </Button>

              {consultation.prescription && (
                <Button
                  onClick={handleOrder}
                  variant="outline"
                  className="w-full rounded-xl border border-border h-10 font-semibold flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="h-4 w-4 text-primary" /> Order Medicines Online
                </Button>
              )}

              <Link href="/chat" className="block">
                <Button
                  variant="ghost"
                  className="w-full rounded-xl border border-border h-10 font-semibold flex items-center justify-center gap-1.5 text-muted-foreground"
                >
                  <MessageSquare className="h-4 w-4 text-secondary" /> Message Consultant
                </Button>
              </Link>

              <Link href={`/book/${doctor.id}`} className="block">
                <Button
                  variant="ghost"
                  className="w-full rounded-xl border border-border h-10 font-semibold flex items-center justify-center gap-1.5 text-muted-foreground"
                >
                  <Plus className="h-4 w-4 text-primary" /> Book Follow-up Slot
                </Button>
              </Link>
            </div>
          </div>

          {/* Secure disclaimer */}
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex gap-3 text-left">
            <ShieldAlert className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-[10px] text-muted-foreground leading-normal">
              This summary is a confidential medical record. Access is authorized only for you and your assigned consultant doctor under HIPAA privacy directives.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
