"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Clock, Globe, Star, CheckCircle, Video, MessageSquare, Award, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { getDoctorById } from "@wadud/mocks";
import { formatCurrency, getSpecializationLabel } from "@/lib/utils";

const COUNTRY_LABELS: Record<string, string> = {
  PK: "Pakistan", AE: "UAE", SA: "Saudi Arabia", QA: "Qatar", US: "USA",
};
const LANG_LABELS: Record<string, string> = { en: "English", ur: "Urdu", ar: "Arabic" };

export default function DoctorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const doctor = getDoctorById(id);

  if (!doctor) {
    return (
      <div className="page-container py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-foreground">Doctor profile not found</h2>
        <p className="text-sm text-muted-foreground">The consultant profile you are trying to view does not exist.</p>
        <Link href="/doctors">
          <Button size="sm">Back to Discovery</Button>
        </Link>
      </div>
    );
  }

  const initials = `${doctor.firstName[0]}${doctor.lastName[0]}`;

  return (
    <div className="page-container py-8 space-y-6">
      {/* Back button */}
      <Link
        href="/doctors"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Discovery
      </Link>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Details & Bio */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Info Card */}
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6 relative">
            {doctor.isVerified && (
              <div className="absolute top-6 right-6">
                <div className="flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 rounded-full px-2.5 py-0.5 text-xs font-medium">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Verified Specialist
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <Avatar className="h-24 w-24 ring-4 ring-primary/10 shrink-0">
                <AvatarImage src={doctor.avatar} alt={`Dr. ${doctor.firstName} ${doctor.lastName}`} />
                <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-2 text-left">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight">
                  Dr. {doctor.firstName} {doctor.lastName}
                </h1>
                <p className="text-base text-primary font-semibold">
                  {getSpecializationLabel(doctor.specialization)}
                </p>

                {doctor.subSpecializations && doctor.subSpecializations.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {doctor.subSpecializations.map((sub) => (
                      <Badge key={sub} variant="secondary" className="text-2xs font-semibold h-5">
                        {sub}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex flex-col gap-1.5 text-muted-foreground text-xs pt-1">
                  <div className="flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{doctor.hospital ?? "Consulting Clinic"} &bull; {COUNTRY_LABELS[doctor.country]}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{doctor.experience} Years of Clinical Experience</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="flex items-center gap-1">
                      Languages:
                      {doctor.languages.map((lang) => (
                        <span key={lang} className="font-semibold text-foreground">
                          {LANG_LABELS[lang] ?? lang}
                        </span>
                      ))}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ratings Summary Row */}
            <div className="grid grid-cols-3 gap-4 py-4 border-y border-border text-center">
              <div>
                <p className="text-xs text-muted-foreground">Rating</p>
                <div className="flex items-center justify-center gap-1 mt-0.5">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-foreground">{doctor.rating}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Reviews</p>
                <p className="font-bold text-foreground mt-0.5">{doctor.reviewCount}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Consultations</p>
                <p className="font-bold text-foreground mt-0.5">{doctor.totalConsultations}+</p>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2 text-left">
              <h3 className="font-bold text-foreground text-sm uppercase tracking-wider">Biography</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{doctor.about ?? doctor.bio}</p>
            </div>
          </div>

          {/* Education & Qualifications */}
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-4">
            <h3 className="font-bold text-foreground text-sm uppercase tracking-wider flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" /> Qualifications & Education
            </h3>
            <div className="space-y-4">
              {doctor.qualifications.map((q, idx) => (
                <div key={idx} className="flex gap-4 items-start text-left border-l-2 border-primary/20 pl-4 py-1">
                  <div>
                    <h4 className="font-bold text-foreground text-sm">{q.degree}</h4>
                    <p className="text-xs text-muted-foreground">{q.institution} &bull; {q.year}</p>
                    <p className="text-2xs text-muted-foreground font-semibold mt-0.5">{q.country}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Availability & Booking Action */}
        <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Consultation Fee</span>
            <p className="text-3xl font-extrabold text-foreground">
              {formatCurrency(doctor.consultationFee, doctor.currency)}
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Channel:</span>
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <Video className="h-3.5 w-3.5 text-primary" /> Video call / Chat
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">State:</span>
              <span className="font-bold text-foreground flex items-center gap-1.5">
                {doctor.isAvailable ? (
                  <>
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    Available Online
                  </>
                ) : (
                  <>
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                    Offline (By Slot)
                  </>
                )}
              </span>
            </div>

            {doctor.nextAvailableSlot && (
              <div className="bg-primary/5 rounded-xl p-3 border border-primary/10 text-left space-y-1">
                <p className="text-2xs font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Earliest Available Slot
                </p>
                <p className="text-xs font-bold text-foreground leading-normal">
                  {new Date(doctor.nextAvailableSlot).toLocaleString("en", {
                    weekday: "long", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>
            )}

            <Link href={`/book/${doctor.id}`}>
              <Button className="w-full rounded-xl text-white shadow-glow h-11 font-semibold hover:scale-[1.02] transition-transform">
                Proceed to Booking
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
