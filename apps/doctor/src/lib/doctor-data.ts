import type {
  Consultation,
  Patient,
  DoctorEarningsSummary,
  TimeSlot,
} from "@wadud/types";
import {
  MOCK_CONSULTATIONS,
  MOCK_PATIENTS,
  MOCK_PAYOUTS,
} from "@wadud/mocks";
import { CURRENT_DOCTOR } from "@/stores/auth.store";

/**
 * Derives the logged-in doctor's working data from the shared mocks.
 * @api In production these come from:
 *   GET /api/v1/doctor/appointments?date=today
 *   GET /api/v1/doctor/queue
 *   GET /api/v1/doctor/earnings/summary
 * Replace the derivations below with the corresponding API calls.
 */

const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);

function atToday(hour: number, minute = 0): string {
  const d = new Date(startOfToday);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

// Re-home the shared consultations onto the current doctor so the portal
// always has realistic content to render.
const base = MOCK_CONSULTATIONS.map((c, i) => ({
  ...c,
  doctorId: CURRENT_DOCTOR.id,
  doctor: CURRENT_DOCTOR,
  patient: MOCK_PATIENTS[i % MOCK_PATIENTS.length],
  patientId: MOCK_PATIENTS[i % MOCK_PATIENTS.length].id,
}));

export const TODAYS_APPOINTMENTS: Consultation[] = [
  { ...base[0], status: "confirmed", consultationType: "video", scheduledAt: atToday(9, 0), patient: MOCK_PATIENTS[0], patientId: MOCK_PATIENTS[0].id },
  { ...base[1], status: "confirmed", consultationType: "chat", scheduledAt: atToday(10, 30), patient: MOCK_PATIENTS[1], patientId: MOCK_PATIENTS[1].id },
  { ...base[2], status: "pending", consultationType: "video", scheduledAt: atToday(12, 0), patient: MOCK_PATIENTS[2], patientId: MOCK_PATIENTS[2].id },
  { ...base[3], status: "confirmed", consultationType: "video", scheduledAt: atToday(14, 15), patient: MOCK_PATIENTS[3], patientId: MOCK_PATIENTS[3].id },
  { ...base[4], status: "pending", consultationType: "chat", scheduledAt: atToday(16, 0), patient: MOCK_PATIENTS[0], patientId: MOCK_PATIENTS[0].id },
];

export const QUEUE: Consultation[] = TODAYS_APPOINTMENTS.filter(
  (c) => c.status === "pending" || c.status === "confirmed"
);

export const PAST_CONSULTATIONS: Consultation[] = base
  .filter((c) => c.status === "completed")
  .map((c) => ({ ...c }));

export const ALL_CONSULTATIONS: Consultation[] = [...TODAYS_APPOINTMENTS, ...PAST_CONSULTATIONS];

export const DOCTOR_PATIENTS: Patient[] = MOCK_PATIENTS;

export function getPatientById(id: string): Patient | undefined {
  return MOCK_PATIENTS.find((p) => p.id === id);
}

export function getConsultationById(id: string): Consultation | undefined {
  return ALL_CONSULTATIONS.find((c) => c.id === id);
}

// ─── Earnings ─────────────────────────────────────────────────

export const EARNINGS_SUMMARY: DoctorEarningsSummary = {
  totalEarnings: 1_284_500,
  pendingPayout: 86_000,
  thisMonth: 214_500,
  lastMonth: 198_300,
  currency: CURRENT_DOCTOR.currency,
  consultationsThisMonth: 96,
  averagePerConsultation: Math.round(214_500 / 96),
};

export const PAYOUTS = MOCK_PAYOUTS;

// Weekly earnings series (last 7 days) for the dashboard chart.
export const WEEKLY_EARNINGS = Array.from({ length: 7 }).map((_, i) => {
  const d = new Date(startOfToday);
  d.setDate(d.getDate() - (6 - i));
  const label = d.toLocaleDateString("en", { weekday: "short" });
  return { day: label, earnings: 18_000 + ((i * 6131) % 26_000) };
});

// ─── Availability slots (mock) ────────────────────────────────

const TIMES = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

export function buildDaySlots(dateISO: string): TimeSlot[] {
  return TIMES.map((t, i) => ({
    id: `${dateISO}-${t}`,
    doctorId: CURRENT_DOCTOR.id,
    date: dateISO,
    startTime: t,
    endTime: TIMES[i + 1] ?? "17:00",
    isBooked: i % 4 === 0,
    isBlocked: i === 6,
  }));
}
