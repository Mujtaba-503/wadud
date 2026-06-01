"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  MessageSquare,
  FileText,
  Clock,
  ArrowRight,
  User,
  Plus,
  Video,
  Activity,
  Heart,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DoctorCard } from "@/components/cards/doctor-card";
import { useAuthStore } from "@/stores/auth.store";
import { MOCK_DOCTORS } from "@wadud/mocks";
import { MOCK_CONSULTATIONS } from "@wadud/mocks/consultations";
import { formatCurrency, getSpecializationLabel } from "@/lib/utils";

export default function PatientDashboardPage() {
  const { session } = useAuthStore();
  const userName = session ? `${session.user.firstName} ${session.user.lastName}` : "Patient";

  // Get upcoming consultations
  const upcomingConsultations = MOCK_CONSULTATIONS.filter(
    (c) => c.status === "scheduled" || c.status === "confirmed"
  ).slice(0, 2);

  // Recommended doctors (verified and available)
  const recommendedDoctors = MOCK_DOCTORS.filter((d) => d.isAvailable && d.isVerified).slice(0, 3);

  return (
    <div className="page-container py-8 space-y-8">
      {/* 1. WELCOME HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary/10 to-secondary/5 border border-primary/15 rounded-3xl p-6 md:p-8">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Good day, <span className="gradient-text">{userName}</span>
          </h1>
          <p className="text-sm text-muted-foreground leading-normal">
            Welcome back to Wadud. Here is a summary of your schedule and medical reports today.
          </p>
        </div>
        <Link href="/doctors" className="shrink-0">
          <Button className="rounded-xl text-white shadow-glow flex items-center gap-1.5 hover:scale-[1.02] transition-transform">
            <Plus className="h-4 w-4" /> Book Consultation
          </Button>
        </Link>
      </div>

      {/* 2. STATS & QUICK ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Quick Actions */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-card border border-border p-6 rounded-2xl space-y-4 hover:border-primary/20 transition-all flex flex-col justify-between">
            <div className="h-10 w-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-sm">Find & Book</h3>
              <p className="text-xs text-muted-foreground mt-1">Book certified specialists online</p>
            </div>
            <Link href="/doctors">
              <Button size="sm" variant="ghost" className="text-primary p-0 flex items-center gap-1">
                Find Doctors <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl space-y-4 hover:border-primary/20 transition-all flex flex-col justify-between">
            <div className="h-10 w-10 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-sm">Medical Reports</h3>
              <p className="text-xs text-muted-foreground mt-1">View prescriptions & lab tests</p>
            </div>
            <Link href="/records">
              <Button size="sm" variant="ghost" className="text-secondary p-0 flex items-center gap-1">
                View Records <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl space-y-4 hover:border-primary/20 transition-all flex flex-col justify-between">
            <div className="h-10 w-10 bg-accent/10 text-accent-hover rounded-xl flex items-center justify-center">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-sm">Active Chats</h3>
              <p className="text-xs text-muted-foreground mt-1">Chat with consulting doctors</p>
            </div>
            <Link href="/chat">
              <Button size="sm" variant="ghost" className="text-accent-hover p-0 flex items-center gap-1">
                Open Messenger <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Health Index Card */}
        <div className="bg-card border border-border p-6 rounded-2xl flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Health Index</span>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="space-y-1 my-3">
            <p className="text-3xl font-extrabold text-foreground">94/100</p>
            <p className="text-[10px] text-green-600 font-semibold flex items-center gap-1">
              <Heart className="h-3 w-3 fill-green-500 text-green-500" /> Optimal Health State
            </p>
          </div>
          <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full w-[94%]" />
          </div>
          <p className="text-2xs text-muted-foreground mt-2 leading-tight">
            Based on completed consultations, active logs, and prescription compliance.
          </p>
        </div>
      </div>

      {/* 3. MAIN GRID: UPCOMING BOOKINGS + DISCOVERY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Upcoming Consultations */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Upcoming Consultations</h2>
            <Link href="/consultations" className="text-xs font-semibold text-primary hover:underline">
              See All
            </Link>
          </div>

          <div className="space-y-4">
            {upcomingConsultations.length > 0 ? (
              upcomingConsultations.map((c) => {
                const doc = MOCK_DOCTORS.find((d) => d.id === c.doctorId);
                if (!doc) return null;
                const slotTime = new Date(c.startTime);
                return (
                  <div
                    key={c.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-card border border-border rounded-2xl gap-4 hover:border-primary/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm shrink-0">
                        {doc.firstName[0]}
                        {doc.lastName[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-sm">
                          Dr. {doc.firstName} {doc.lastName}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {getSpecializationLabel(doc.specialization)} &bull; {c.type === "video" ? "Video Consultation" : "Secure Chat"}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-primary font-medium mt-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            {slotTime.toLocaleString("en", {
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

                    <div className="flex gap-2 w-full sm:w-auto shrink-0">
                      {c.type === "video" ? (
                        <Link href={`/video/${c.id}`} className="w-full sm:w-auto">
                          <Button size="sm" className="w-full sm:w-auto rounded-lg text-xs h-9 bg-primary text-white flex items-center gap-1">
                            <Video className="h-3.5 w-3.5" /> Start call
                          </Button>
                        </Link>
                      ) : (
                        <Link href="/chat" className="w-full sm:w-auto">
                          <Button size="sm" className="w-full sm:w-auto rounded-lg text-xs h-9 bg-secondary text-white flex items-center gap-1">
                            <MessageSquare className="h-3.5 w-3.5" /> Open Chat
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-card border border-border border-dashed rounded-2xl text-muted-foreground text-sm">
                No consultations scheduled. Book a slot with a consultant to get started.
              </div>
            )}
          </div>
        </div>

        {/* Right: Recommended Doctor Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Available Consultants</h2>
            <Link href="/doctors" className="text-xs font-semibold text-primary hover:underline">
              Search All
            </Link>
          </div>

          <div className="space-y-4">
            {recommendedDoctors.map((doc, idx) => (
              <DoctorCard key={doc.id} doctor={doc} index={idx} compact className="w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
