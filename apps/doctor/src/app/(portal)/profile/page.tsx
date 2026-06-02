"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  ShieldCheck,
  FileCheck2,
  Upload,
  Star,
  Award,
  Save,
  BadgeCheck,
  Clock,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarRating } from "@/components/ui/star-rating";
import { CURRENT_DOCTOR } from "@/stores/auth.store";
import { getInitials, getSpecializationLabel, formatCurrency } from "@/lib/utils";

const DOCUMENTS = [
  { name: "Medical License (PMC)", status: "verified" },
  { name: "MBBS Degree Certificate", status: "verified" },
  { name: "CNIC / National ID", status: "verified" },
  { name: "Specialization Certificate", status: "pending" },
];

export default function ProfilePage() {
  const d = CURRENT_DOCTOR;
  const [saving, setSaving] = useState(false);

  const save = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Profile updated");
    }, 800);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Profile & Verification"
        description="Manage your public profile and verification documents."
        action={
          <Button onClick={save} loading={saving}>
            <Save className="h-4 w-4" /> Save changes
          </Button>
        }
      />

      {/* Verification banner */}
      <Card className="border-accent/30 bg-accent/5">
        <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-foreground flex items-center gap-1.5">
                Verified Provider <BadgeCheck className="h-4 w-4 text-accent" />
              </p>
              <p className="text-sm text-muted-foreground">Your account is verified and visible to patients.</p>
            </div>
          </div>
          <Badge variant="verified" className="w-fit">Verification complete</Badge>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <Card className="h-fit">
          <CardContent className="p-6 text-center">
            <Avatar className="mx-auto h-24 w-24">
              <AvatarImage src={d.avatar} alt="" />
              <AvatarFallback className="text-2xl">{getInitials(d.firstName, d.lastName)}</AvatarFallback>
            </Avatar>
            <h2 className="mt-3 text-lg font-bold text-foreground">
              Dr. {d.firstName} {d.lastName}
            </h2>
            <p className="text-sm text-primary font-medium">{getSpecializationLabel(d.specialization)}</p>
            <div className="mt-2 flex items-center justify-center gap-2">
              <StarRating rating={d.rating} size="sm" showValue />
              <span className="text-xs text-muted-foreground">({d.reviewCount})</span>
            </div>
            <Button variant="outline" size="sm" className="mt-4">
              <Upload className="h-4 w-4" /> Change photo
            </Button>
            <div className="mt-4 grid grid-cols-2 gap-3 text-left">
              <Stat label="Experience" value={`${d.experience} yrs`} icon={Award} />
              <Stat label="Consults" value={String(d.totalConsultations)} icon={Star} />
            </div>
          </CardContent>
        </Card>

        {/* Editable details */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Professional details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="First name" defaultValue={d.firstName} />
                <Input label="Last name" defaultValue={d.lastName} />
                <Input label="Email" type="email" defaultValue={d.email} />
                <Input label="Phone" defaultValue={d.phone} />
                <Input label="Consultation fee" defaultValue={formatCurrency(d.consultationFee, d.currency)} description="Shown to patients at booking." />
                <Input label="License number" defaultValue={d.licenseNumber} />
              </div>
              <Textarea label="Professional bio" defaultValue={d.bio} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileCheck2 className="h-4 w-4 text-primary" /> Verification documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {DOCUMENTS.map((doc) => (
                <div key={doc.name} className="flex items-center justify-between rounded-xl border border-border p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                      <FileCheck2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{doc.name}</span>
                  </div>
                  {doc.status === "verified" ? (
                    <Badge variant="verified"><BadgeCheck className="h-3 w-3" /> Verified</Badge>
                  ) : (
                    <Badge variant="pending"><Clock className="h-3 w-3" /> Under review</Badge>
                  )}
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <Upload className="h-4 w-4" /> Upload new document
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="rounded-xl border border-border p-3">
      <Icon className="h-4 w-4 text-primary" />
      <p className="mt-1.5 text-xs text-muted-foreground">{label}</p>
      <p className="font-bold text-foreground">{value}</p>
    </div>
  );
}
