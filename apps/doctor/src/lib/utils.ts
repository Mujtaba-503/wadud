import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Specialization, BookingStatus, ConsultationType } from "@wadud/types";
import { SPECIALIZATION_LABELS } from "@wadud/types";
import { format, formatDistanceToNow, isToday, isTomorrow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string): string {
  const formatters: Record<string, Intl.NumberFormat> = {
    PKR: new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }),
    AED: new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED" }),
    SAR: new Intl.NumberFormat("ar-SA", { style: "currency", currency: "SAR" }),
    QAR: new Intl.NumberFormat("en-QA", { style: "currency", currency: "QAR" }),
    USD: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
  };
  return formatters[currency]?.format(amount) ?? `${currency} ${amount}`;
}

export function formatDate(date: string | Date, pattern = "MMM d, yyyy"): string {
  const d = new Date(date);
  if (isToday(d)) return `Today, ${format(d, "h:mm a")}`;
  if (isTomorrow(d)) return `Tomorrow, ${format(d, "h:mm a")}`;
  return format(d, pattern);
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function getSpecializationLabel(spec: Specialization): string {
  return SPECIALIZATION_LABELS[spec] ?? spec;
}

export function getStatusColor(status: BookingStatus): string {
  const map: Record<BookingStatus, string> = {
    pending:     "bg-amber-100 text-amber-800 border-amber-200",
    confirmed:   "bg-green-100 text-green-800 border-green-200",
    completed:   "bg-blue-100 text-blue-800 border-blue-200",
    cancelled:   "bg-red-100 text-red-800 border-red-200",
    no_show:     "bg-slate-100 text-slate-600 border-slate-200",
    rescheduled: "bg-purple-100 text-purple-800 border-purple-200",
  };
  return map[status] ?? "bg-slate-100 text-slate-600";
}

export function getConsultationTypeLabel(type: ConsultationType): string {
  const map: Record<ConsultationType, string> = {
    video: "Video Call",
    chat:  "Chat",
    in_person: "In-Person",
  };
  return map[type];
}

export function getConsultationTypeIcon(type: ConsultationType): string {
  const map: Record<ConsultationType, string> = {
    video: "video",
    chat:  "message-circle",
    in_person: "building-2",
  };
  return map[type];
}

export function truncate(str: string, maxLen = 100): string {
  if (str.length <= maxLen) return str;
  return `${str.slice(0, maxLen)}…`;
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function generateAvatar(seed: string, bg = "b6e3f4"): string {
  return `https://api.dicebear.com/9.x/personas/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${bg}`;
}
