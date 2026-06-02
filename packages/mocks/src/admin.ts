import type {
  DashboardAnalytics,
  ChartData,
  TimeSeriesDataPoint,
  DoctorVerificationApplication,
  Payment,
  Payout,
  SystemLog,
  ContentModerationItem,
} from "@wadud/types";
import { MOCK_DOCTORS } from "./doctors";
import { MOCK_PATIENTS } from "./patients";

// ─────────────────────────────────────────────────────────────
// Admin & cross-portal mock data.
// @api These arrays stand in for real aggregation endpoints served
//      by the Go analytics-service / admin-service. Replace each
//      MOCK_* export with the corresponding API call.
// ─────────────────────────────────────────────────────────────

const DAY = 86_400_000;
const now = Date.now();

// Deterministic pseudo-random so SSR and CSR render identically.
function seeded(i: number, base: number, amplitude: number): number {
  return Math.round(base + Math.sin(i / 3) * amplitude * 0.5 + ((i * 9301 + 49297) % 233) / 233 * amplitude);
}

function series(days: number, base: number, amplitude: number): TimeSeriesDataPoint[] {
  return Array.from({ length: days }).map((_, i) => {
    const date = new Date(now - (days - 1 - i) * DAY).toISOString().split("T")[0];
    return { date, value: seeded(i, base, amplitude) };
  });
}

// @api GET /api/v1/admin/analytics/overview
export const MOCK_DASHBOARD_ANALYTICS: DashboardAnalytics = {
  totalPatients: 12_480,
  totalDoctors: 342,
  totalConsultations: 38_921,
  totalRevenue: 4_812_500,
  currency: "PKR",
  activeConsultations: 27,
  pendingVerifications: 8,
  consultationGrowth: 12.4,
  revenueGrowth: 18.9,
  patientGrowth: 9.1,
  doctorGrowth: 5.3,
};

// @api GET /api/v1/admin/analytics/timeseries?range=30d
export const MOCK_CHART_DATA: ChartData = {
  consultations: series(30, 120, 80),
  revenue: series(30, 14_000, 9_000),
  newPatients: series(30, 40, 35),
  newDoctors: series(30, 2, 4),
};

// ─── Doctor Verification Applications ─────────────────────────
// @api GET /api/v1/admin/verifications?status=pending
export const MOCK_VERIFICATION_APPLICATIONS: DoctorVerificationApplication[] = [
  {
    id: "ver-0001",
    doctorId: MOCK_DOCTORS[6].id,
    doctor: MOCK_DOCTORS[6],
    status: "pending",
    submittedAt: new Date(now - 2 * DAY).toISOString(),
    documents: [
      { id: "doc-1", type: "medical_license", url: "#", name: "PMC_License.pdf", uploadedAt: new Date(now - 2 * DAY).toISOString() },
      { id: "doc-2", type: "degree", url: "#", name: "MBBS_Degree.pdf", uploadedAt: new Date(now - 2 * DAY).toISOString() },
      { id: "doc-3", type: "cnic", url: "#", name: "CNIC_Front.jpg", uploadedAt: new Date(now - 2 * DAY).toISOString() },
    ],
  },
  {
    id: "ver-0002",
    doctorId: MOCK_DOCTORS[7].id,
    doctor: MOCK_DOCTORS[7],
    status: "under_review",
    submittedAt: new Date(now - 4 * DAY).toISOString(),
    reviewNotes: "License verified, awaiting degree confirmation from institution.",
    documents: [
      { id: "doc-4", type: "medical_license", url: "#", name: "License.pdf", uploadedAt: new Date(now - 4 * DAY).toISOString() },
      { id: "doc-5", type: "pmc_certificate", url: "#", name: "PMC_Cert.pdf", uploadedAt: new Date(now - 4 * DAY).toISOString() },
    ],
  },
  {
    id: "ver-0003",
    doctorId: MOCK_DOCTORS[8].id,
    doctor: MOCK_DOCTORS[8],
    status: "pending",
    submittedAt: new Date(now - 1 * DAY).toISOString(),
    documents: [
      { id: "doc-6", type: "medical_license", url: "#", name: "DOH_License.pdf", uploadedAt: new Date(now - 1 * DAY).toISOString() },
      { id: "doc-7", type: "passport", url: "#", name: "Passport.jpg", uploadedAt: new Date(now - 1 * DAY).toISOString() },
    ],
  },
  {
    id: "ver-0004",
    doctorId: MOCK_DOCTORS[9].id,
    doctor: MOCK_DOCTORS[9],
    status: "rejected",
    submittedAt: new Date(now - 9 * DAY).toISOString(),
    reviewedAt: new Date(now - 7 * DAY).toISOString(),
    reviewNotes: "Submitted license could not be verified with the regulatory authority.",
    documents: [
      { id: "doc-8", type: "medical_license", url: "#", name: "License.pdf", uploadedAt: new Date(now - 9 * DAY).toISOString() },
    ],
  },
];

// ─── Payments ─────────────────────────────────────────────────
// @api GET /api/v1/admin/payments
export const MOCK_PAYMENTS: Payment[] = Array.from({ length: 14 }).map((_, i) => {
  const doctor = MOCK_DOCTORS[i % MOCK_DOCTORS.length];
  const patient = MOCK_PATIENTS[i % MOCK_PATIENTS.length];
  const amount = doctor.consultationFee;
  const platformFee = Math.round(amount * 0.15);
  const statuses = ["completed", "completed", "completed", "pending", "refunded", "failed"] as const;
  const methods = ["jazzcash", "easypaisa", "card", "stripe", "bank_transfer"] as const;
  const gateways = ["jazzcash", "easypaisa", "stripe", "checkout"] as const;
  return {
    id: `pay-${String(i + 1).padStart(4, "0")}`,
    bookingId: `book-${i + 1}`,
    patientId: patient.id,
    doctorId: doctor.id,
    amount,
    platformFee,
    doctorAmount: amount - platformFee,
    currency: doctor.currency,
    method: methods[i % methods.length],
    gateway: gateways[i % gateways.length],
    status: statuses[i % statuses.length],
    gatewayTransactionId: `txn_${(1000 + i).toString(36)}`,
    createdAt: new Date(now - i * DAY).toISOString(),
    updatedAt: new Date(now - i * DAY).toISOString(),
  };
});

// ─── Payouts (doctor) ─────────────────────────────────────────
// @api GET /api/v1/doctor/payouts
export const MOCK_PAYOUTS: Payout[] = Array.from({ length: 8 }).map((_, i) => {
  const statuses = ["completed", "completed", "completed", "processing", "pending"] as const;
  return {
    id: `payout-${String(i + 1).padStart(4, "0")}`,
    doctorId: MOCK_DOCTORS[0].id,
    amount: 28_000 + ((i * 7919) % 22_000),
    currency: "PKR",
    status: statuses[i % statuses.length],
    bankAccount: "HBL •••• 4821",
    processedAt: i > 1 ? new Date(now - i * 14 * DAY).toISOString() : undefined,
    createdAt: new Date(now - i * 14 * DAY).toISOString(),
  };
});

// ─── System Logs ──────────────────────────────────────────────
// @api GET /api/v1/admin/logs
export const MOCK_SYSTEM_LOGS: SystemLog[] = [
  { id: "log-1", level: "info", category: "auth", message: "Doctor login successful", actor: "ahmad.rashidi@wadud.app", ip: "203.99.12.4", createdAt: new Date(now - 5 * 60_000).toISOString() },
  { id: "log-2", level: "warning", category: "payment", message: "Payment retry after gateway timeout", actor: "jazzcash-gateway", ip: "10.0.4.2", createdAt: new Date(now - 22 * 60_000).toISOString() },
  { id: "log-3", level: "error", category: "api", message: "consultation-service returned 503 for /consultations", actor: "api-gateway", ip: "10.0.1.9", createdAt: new Date(now - 48 * 60_000).toISOString() },
  { id: "log-4", level: "critical", category: "security", message: "Multiple failed admin login attempts detected", actor: "unknown", ip: "185.220.101.5", createdAt: new Date(now - 90 * 60_000).toISOString() },
  { id: "log-5", level: "info", category: "consultation", message: "Video consultation room created", actor: "video-service", createdAt: new Date(now - 130 * 60_000).toISOString() },
  { id: "log-6", level: "info", category: "system", message: "Nightly database backup completed", actor: "scheduler", createdAt: new Date(now - 6 * 3_600_000).toISOString() },
  { id: "log-7", level: "warning", category: "auth", message: "OTP delivery delayed for +9230011•••••", actor: "sms-provider", createdAt: new Date(now - 8 * 3_600_000).toISOString() },
  { id: "log-8", level: "info", category: "payment", message: "Payout batch #1042 processed (12 doctors)", actor: "payout-worker", createdAt: new Date(now - 26 * 3_600_000).toISOString() },
];

// ─── Content Moderation ───────────────────────────────────────
// @api GET /api/v1/admin/moderation?status=pending
export const MOCK_MODERATION_ITEMS: ContentModerationItem[] = [
  { id: "mod-1", type: "review", reportedContent: "This doctor was unprofessional and rude during the call.", reason: "Abusive language", reportedBy: "Dr. Fatima Malik", authorName: "Anonymous Patient", status: "pending", createdAt: new Date(now - 3 * 3_600_000).toISOString() },
  { id: "mod-2", type: "chat_message", reportedContent: "Shared an external link asking for off-platform payment.", reason: "Policy violation / off-platform payment", reportedBy: "System filter", authorName: "Patient #20413", status: "escalated", createdAt: new Date(now - 9 * 3_600_000).toISOString() },
  { id: "mod-3", type: "doctor_bio", reportedContent: "Bio contains unverified miracle-cure claims.", reason: "Misleading medical claims", reportedBy: "Compliance bot", authorName: "Dr. Imran Sheikh", status: "pending", createdAt: new Date(now - 20 * 3_600_000).toISOString() },
  { id: "mod-4", type: "review", reportedContent: "Spam: promotional content unrelated to consultation.", reason: "Spam", reportedBy: "Auto-moderation", authorName: "Anonymous Patient", status: "approved", createdAt: new Date(now - 30 * 3_600_000).toISOString() },
];
