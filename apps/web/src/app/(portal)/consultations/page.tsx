"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Video, MessageSquare, Clock, ArrowRight, Activity, Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_CONSULTATIONS } from "@wadud/mocks/consultations";
import { MOCK_DOCTORS } from "@wadud/mocks";
import { getSpecializationLabel } from "@/lib/utils";

type TabStatus = "upcoming" | "completed" | "cancelled";

export default function ConsultationsListPage() {
  const [activeTab, setActiveTab] = useState<TabStatus>("upcoming");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConsultations = MOCK_CONSULTATIONS.filter((c) => {
    // 1. Tab Status Filter
    if (activeTab === "upcoming") {
      if (c.status !== "pending" && c.status !== "confirmed") return false;
    } else if (activeTab === "completed") {
      if (c.status !== "completed") return false;
    } else {
      if (c.status !== "cancelled") return false;
    }

    // 2. Doctor Search Filter
    if (searchQuery) {
      const doc = MOCK_DOCTORS.find((d) => d.id === c.doctorId);
      if (!doc) return false;
      const q = searchQuery.toLowerCase();
      const matchesDoc =
        doc.firstName.toLowerCase().includes(q) || doc.lastName.toLowerCase().includes(q);
      if (!matchesDoc) return false;
    }

    return true;
  });

  return (
    <div className="page-container py-8 space-y-6">
      {/* Header */}
      <div className="space-y-1.5 text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          My Consultations
        </h1>
        <p className="text-sm text-muted-foreground">
          View your upcoming slots, read medical summaries, and access past prescriptions.
        </p>
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-border pb-1">
        {/* Tab Buttons */}
        <div className="flex gap-1.5 bg-muted/60 p-1 rounded-xl w-full sm:w-auto">
          {(["upcoming", "completed", "cancelled"] as TabStatus[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
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

      {/* List Container */}
      <div className="space-y-4">
        {filteredConsultations.length > 0 ? (
          filteredConsultations.map((c) => {
            const doc = MOCK_DOCTORS.find((d) => d.id === c.doctorId);
            if (!doc) return null;
            const startTime = new Date(c.scheduledAt);
            const initials = `${doc.firstName[0]}${doc.lastName[0]}`;

            return (
              <div
                key={c.id}
                className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-card border border-border rounded-2xl gap-6 hover:border-primary/20 transition-all shadow-2xs text-left"
              >
                {/* Doctor info & Date details */}
                <div className="flex gap-4 items-start">
                  <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                    {initials}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-foreground text-sm">
                        Dr. {doc.firstName} {doc.lastName}
                      </h4>
                      <Badge variant="outline" className="text-2xs capitalize">
                        {c.consultationType === "video" ? "Video call" : "Chat Session"}
                      </Badge>
                    </div>
                    <p className="text-xs text-primary font-medium">
                      {getSpecializationLabel(doc.specialization)}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-0.5">
                      <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>
                        {startTime.toLocaleString("en", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-border pt-4 md:pt-0 shrink-0">
                  <div className="text-left md:text-right hidden sm:block">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Status</span>
                    <span className="text-xs font-bold capitalize text-foreground">{c.status}</span>
                  </div>

                  {activeTab === "upcoming" && (
                    <div className="flex gap-2 w-full sm:w-auto">
                      {c.consultationType === "video" ? (
                        <Link href={`/video/${c.id}`} className="w-full sm:w-auto">
                          <Button size="sm" className="w-full sm:w-auto rounded-xl text-xs h-9 bg-primary text-white flex items-center gap-1">
                            <Video className="h-4 w-4" /> Start consultation
                          </Button>
                        </Link>
                      ) : (
                        <Link href="/chat" className="w-full sm:w-auto">
                          <Button size="sm" className="w-full sm:w-auto rounded-xl text-xs h-9 bg-secondary text-white flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" /> Open Chat
                          </Button>
                        </Link>
                      )}
                    </div>
                  )}

                  {activeTab === "completed" && (
                    <Link href={`/consultations/${c.id}`} className="w-full sm:w-auto">
                      <Button size="sm" variant="ghost" className="w-full sm:w-auto rounded-xl text-xs h-9 border border-border hover:bg-muted text-foreground flex items-center gap-1">
                        View Records & Prescription <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  )}

                  {activeTab === "cancelled" && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1 italic">
                      <AlertCircle className="h-3.5 w-3.5 text-destructive" /> Canceled session
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-card border border-border border-dashed rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Calendar className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-foreground text-sm">No Consultations Found</h3>
              <p className="text-xs text-muted-foreground leading-normal">
                You do not have any consultations listed under the {activeTab} section.
              </p>
            </div>
            {activeTab === "upcoming" && (
              <Link href="/doctors">
                <Button size="sm" className="rounded-lg">
                  Book A Slot
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
