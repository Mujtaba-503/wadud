"use client";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Globe, Star, CheckCircle, Video, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn, formatCurrency, getSpecializationLabel } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import type { Doctor } from "@wadud/types";

interface DoctorCardProps {
  doctor: Doctor;
  index?: number;
  compact?: boolean;
  className?: string;
}

const COUNTRY_LABELS: Record<string, string> = {
  PK: "Pakistan", AE: "UAE", SA: "Saudi Arabia", QA: "Qatar", US: "USA",
};
const LANG_LABELS: Record<string, string> = { en: "English", ur: "Urdu", ar: "Arabic" };

export function DoctorCard({ doctor, index = 0, compact = false, className }: DoctorCardProps) {
  const initials = `${doctor.firstName[0]}${doctor.lastName[0]}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className={cn("group", className)}
    >
      <div className="relative rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover hover:border-primary/30 cursor-pointer">
        {/* Verified badge */}
        {doctor.isVerified && (
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 rounded-full px-2 py-0.5 text-xs font-medium">
              <CheckCircle className="h-3 w-3" />
              Verified
            </div>
          </div>
        )}

        {/* Doctor Info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative shrink-0">
            <Avatar className="h-16 w-16 ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all">
              <AvatarImage src={doctor.avatar} alt={`Dr. ${doctor.firstName} ${doctor.lastName}`} />
              <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            {/* Online indicator */}
            {doctor.isAvailable && (
              <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white" />
            )}
          </div>

          <div className="flex-1 min-w-0 pr-16">
            <h3 className="font-semibold text-foreground truncate">
              Dr. {doctor.firstName} {doctor.lastName}
            </h3>
            <p className="text-sm text-primary font-medium mt-0.5">
              {getSpecializationLabel(doctor.specialization)}
            </p>
            <div className="flex items-center gap-1 mt-1 text-muted-foreground text-xs">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{doctor.hospital ?? COUNTRY_LABELS[doctor.country]}</span>
            </div>
          </div>
        </div>

        {/* Rating & experience */}
        <div className="flex items-center justify-between mb-3">
          <StarRating
            rating={doctor.rating}
            size="sm"
            showValue
            reviewCount={doctor.reviewCount}
          />
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {doctor.experience}y exp
          </span>
        </div>

        {/* Languages */}
        <div className="flex items-center gap-1.5 mb-4 flex-wrap">
          <Globe className="h-3 w-3 text-muted-foreground shrink-0" />
          {doctor.languages.map((lang) => (
            <Badge key={lang} variant="ghost" className="text-xs h-5 px-2">
              {LANG_LABELS[lang] ?? lang}
            </Badge>
          ))}
        </div>

        {/* Consultation types */}
        {!compact && (
          <div className="flex gap-2 mb-4">
            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/60 rounded-lg px-2.5 py-1.5">
              <Video className="h-3 w-3 text-primary" />
              Video
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/60 rounded-lg px-2.5 py-1.5">
              <MessageCircle className="h-3 w-3 text-secondary" />
              Chat
            </div>
          </div>
        )}

        {/* Footer: fee + CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Consultation fee</p>
            <p className="font-bold text-foreground">
              {formatCurrency(doctor.consultationFee, doctor.currency)}
            </p>
          </div>
          <Link href={`/doctors/${doctor.id}`}>
            <Button size="sm" className="rounded-xl shrink-0">
              Book Now
            </Button>
          </Link>
        </div>

        {/* Next available */}
        {doctor.nextAvailableSlot && (
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <Clock className="h-3 w-3 text-green-500" />
            Next: {new Date(doctor.nextAvailableSlot).toLocaleString("en", {
              weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </motion.div>
  );
}
