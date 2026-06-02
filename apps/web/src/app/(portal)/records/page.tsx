"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Download, Calendar, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_CONSULTATIONS } from "@wadud/mocks/consultations";
import { MOCK_DOCTORS } from "@wadud/mocks";
import { toast } from "sonner";

type TabState = "prescriptions" | "labs" | "reports";

export default function HealthRecordsPage() {
  const [activeTab, setActiveTab] = useState<TabState>("prescriptions");
  const [searchQuery, setSearchQuery] = useState("");

  const prescribersConsultations = MOCK_CONSULTATIONS.filter((c) => {
    if (!c.prescription) return false;
    
    if (searchQuery) {
      const doc = MOCK_DOCTORS.find((d) => d.id === c.doctorId);
      if (!doc) return false;
      const q = searchQuery.toLowerCase();
      return doc.firstName.toLowerCase().includes(q) || doc.lastName.toLowerCase().includes(q);
    }
    return true;
  });

  const handleDownload = (filename: string) => {
    toast.success("Download Initiated", {
      description: `Downloading file: ${filename}_wadud_record.pdf`,
    });
  };

  return (
    <div className="page-container py-8 space-y-6">
      {/* Header */}
      <div className="space-y-1.5 text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Health Records
        </h1>
        <p className="text-sm text-muted-foreground">
          Access your digital prescriptions, clinical logs, and lab results securely.
        </p>
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-border pb-1">
        {/* Tab Buttons */}
        <div className="flex gap-1.5 bg-muted/60 p-1 rounded-xl w-full sm:w-auto">
          {(["prescriptions", "labs", "reports"] as TabState[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "labs" ? "Lab Results" : tab === "reports" ? "Clinical Reports" : tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by doctor name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl pl-10 pr-3 py-2 text-xs focus:outline-none transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Content List */}
      <div className="space-y-4">
        {activeTab === "prescriptions" && (
          <div className="space-y-4">
            {prescribersConsultations.length > 0 ? (
              prescribersConsultations.map((c) => {
                const doc = MOCK_DOCTORS.find((d) => d.id === c.doctorId);
                if (!doc || !c.prescription) return null;
                const slotTime = new Date(c.scheduledAt);

                return (
                  <div
                    key={c.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-card border border-border rounded-2xl gap-4 hover:border-primary/20 transition-colors text-left"
                  >
                    <div className="flex gap-3.5 items-start">
                      <div className="h-10 w-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-sm">
                          Prescription &mdash; Dr. {doc.firstName} {doc.lastName}
                        </h4>
                        <div className="flex items-center gap-1 text-2xs text-muted-foreground mt-0.5">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {slotTime.toLocaleString("en", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <p className="text-2xs text-primary font-semibold mt-1">
                          Medicines: {c.prescription.medications.map((m) => m.name).join(", ")}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto shrink-0 border-t sm:border-t-0 border-border pt-3 sm:pt-0">
                      <Button
                        onClick={() => handleDownload(`prescription_${c.id.slice(0, 5)}`)}
                        size="sm"
                        variant="outline"
                        className="rounded-lg text-xs h-9 flex items-center gap-1.5 flex-1 sm:flex-initial"
                      >
                        <Download className="h-3.5 w-3.5 text-primary" /> Download
                      </Button>
                      <Link href={`/consultations/${c.id}`} className="flex-1 sm:flex-initial">
                        <Button size="sm" className="rounded-lg text-xs h-9 bg-primary text-white w-full">
                          View details
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-card border border-border border-dashed rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-foreground text-sm">No Prescriptions Found</h3>
                  <p className="text-xs text-muted-foreground leading-normal">
                    You do not have any digital prescriptions on record yet.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Labs and reports (Mock placeholders that match design standards) */}
        {(activeTab === "labs" || activeTab === "reports") && (
          <div className="bg-card border border-border border-dashed rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto animate-pulse">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-foreground text-sm">
                No {activeTab === "labs" ? "Lab Results" : "Clinical Reports"} Logged
              </h3>
              <p className="text-xs text-muted-foreground leading-normal">
                Any future lab tests ordered by consultants or diagnostic reports uploaded by clinics will automatically sync to this secure panel.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
