import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Specialization, BookingStatus, ConsultationType } from "@wadud/types";
import { SPECIALIZATION_LABELS } from "@wadud/types";

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

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}
