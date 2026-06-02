"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Pill, Save } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PrescriptionMedication } from "@wadud/types";

const EMPTY: PrescriptionMedication = { name: "", dosage: "", frequency: "", duration: "", instructions: "" };

export function PrescriptionForm({ patientName }: { patientName?: string }) {
  const [meds, setMeds] = useState<PrescriptionMedication[]>([{ ...EMPTY }]);
  const [instructions, setInstructions] = useState("");
  const [saving, setSaving] = useState(false);

  const updateMed = (i: number, k: keyof PrescriptionMedication, v: string) =>
    setMeds((prev) => prev.map((m, idx) => (idx === i ? { ...m, [k]: v } : m)));

  const addMed = () => setMeds((prev) => [...prev, { ...EMPTY }]);
  const removeMed = (i: number) => setMeds((prev) => prev.filter((_, idx) => idx !== i));

  const valid = meds.every((m) => m.name.trim() && m.dosage.trim());

  const save = () => {
    if (!valid) {
      toast.error("Incomplete prescription", { description: "Each medication needs at least a name and dosage." });
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Prescription issued", {
        description: patientName ? `Sent to ${patientName}.` : "The prescription has been issued.",
      });
    }, 900);
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <Pill className="h-4 w-4 text-secondary" /> Medications
        </CardTitle>
        <Button variant="outline" size="sm" onClick={addMed}>
          <Plus className="h-4 w-4" /> Add medication
        </Button>
      </CardHeader>
      <CardContent className="space-y-5">
        {meds.map((m, i) => (
          <div key={i} className="rounded-xl border border-border p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Medication {i + 1}</span>
              {meds.length > 1 ? (
                <Button variant="ghost" size="icon-sm" onClick={() => removeMed(i)} aria-label="Remove medication">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              ) : null}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Drug name" placeholder="e.g. Amoxicillin" value={m.name} onChange={(e) => updateMed(i, "name", e.target.value)} />
              <Input label="Dosage" placeholder="e.g. 500 mg" value={m.dosage} onChange={(e) => updateMed(i, "dosage", e.target.value)} />
              <Input label="Frequency" placeholder="e.g. Twice daily" value={m.frequency} onChange={(e) => updateMed(i, "frequency", e.target.value)} />
              <Input label="Duration" placeholder="e.g. 7 days" value={m.duration} onChange={(e) => updateMed(i, "duration", e.target.value)} />
            </div>
            <div className="mt-3">
              <Input label="Instructions (optional)" placeholder="e.g. Take after meals" value={m.instructions ?? ""} onChange={(e) => updateMed(i, "instructions", e.target.value)} />
            </div>
          </div>
        ))}

        <Textarea
          label="General notes"
          placeholder="Additional guidance for the patient…"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />

        <div className="flex justify-end">
          <Button onClick={save} loading={saving}>
            <Save className="h-4 w-4" /> Issue prescription
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
