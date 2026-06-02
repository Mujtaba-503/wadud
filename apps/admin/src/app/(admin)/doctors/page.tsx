"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Search, Stethoscope, MoreHorizontal, Ban, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarRating } from "@/components/ui/star-rating";
import { EmptyState } from "@/components/ui/empty-state";
import { MOCK_DOCTORS } from "@wadud/mocks";
import { getInitials, getSpecializationLabel, formatCurrency } from "@/lib/utils";
import type { Doctor } from "@wadud/types";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>(MOCK_DOCTORS);
  const [q, setQ] = useState("");

  const toggle = (id: string) => {
    setDoctors((prev) => prev.map((d) => (d.id === id ? { ...d, isAvailable: !d.isAvailable } : d)));
    toast.success("Doctor status updated");
  };

  const filtered = doctors.filter((d) =>
    `${d.firstName} ${d.lastName} ${getSpecializationLabel(d.specialization)}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader title="Doctors" description={`${doctors.length} doctors on the platform.`} />

      <div className="max-w-sm">
        <Input placeholder="Search doctors…" value={q} onChange={(e) => setQ(e.target.value)} leftIcon={<Search className="h-4 w-4" />} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Stethoscope} title="No doctors found" description="Try a different search term." />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3 font-semibold">Doctor</th>
                    <th className="px-4 py-3 font-semibold">Specialization</th>
                    <th className="px-4 py-3 font-semibold">Rating</th>
                    <th className="px-4 py-3 font-semibold">Fee</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d) => (
                    <tr key={d.id} className="border-b border-border/60 last:border-0 hover:bg-muted/40">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={d.avatar} alt="" />
                            <AvatarFallback>{getInitials(d.firstName, d.lastName)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-foreground">Dr. {d.firstName} {d.lastName}</p>
                            <p className="text-xs text-muted-foreground">{d.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{getSpecializationLabel(d.specialization)}</td>
                      <td className="px-4 py-3"><StarRating rating={d.rating} size="sm" showValue /></td>
                      <td className="px-4 py-3 font-medium text-foreground">{formatCurrency(d.consultationFee, d.currency)}</td>
                      <td className="px-4 py-3">
                        {d.isAvailable ? <Badge variant="verified">Active</Badge> : <Badge variant="ghost">Suspended</Badge>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggle(d.id)}
                            className={d.isAvailable ? "text-destructive" : "text-accent"}
                          >
                            {d.isAvailable ? <><Ban className="h-4 w-4" /> Suspend</> : <><CheckCircle2 className="h-4 w-4" /> Activate</>}
                          </Button>
                          <Button variant="ghost" size="icon-sm" aria-label="More options">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
