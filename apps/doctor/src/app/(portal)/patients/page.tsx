"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Users } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { DOCTOR_PATIENTS } from "@/lib/doctor-data";
import { getInitials } from "@/lib/utils";

export default function PatientsPage() {
  const [q, setQ] = useState("");
  const filtered = DOCTOR_PATIENTS.filter((p) =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader title="Patients" description="Patients you have consulted with." />

      <div className="max-w-sm">
        <Input
          placeholder="Search patients…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="No patients found" description="Try a different search term." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={p.avatar} alt="" />
                    <AvatarFallback>{getInitials(p.firstName, p.lastName)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-foreground">
                      {p.firstName} {p.lastName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{p.email}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.bloodType ? <Badge variant="outline">{p.bloodType}</Badge> : null}
                  {p.gender ? <Badge variant="ghost" className="capitalize">{p.gender}</Badge> : null}
                  {(p.chronicConditions ?? []).slice(0, 1).map((c) => (
                    <Badge key={c} variant="warning">{c}</Badge>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
                  <Link href={`/patients/${p.id}`}>View profile</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
