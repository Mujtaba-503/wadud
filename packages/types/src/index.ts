// ============================================================
// Wadud — Shared TypeScript Domain Types
// @package @wadud/types
//
// API Integration Notes:
// These types mirror the expected JSON shapes from Go microservices.
// When connecting to real APIs, replace mock data sources with
// SWR/React Query fetchers using these exact shapes.
// ============================================================

// ─── Primitives ──────────────────────────────────────────────

export type UUID = string;
export type ISO8601 = string; // "2024-01-15T10:30:00Z"
export type DateOnly = string; // "2024-01-15"
export type TimeOnly = string; // "10:30"
export type CurrencyCode = "PKR" | "AED" | "SAR" | "QAR" | "USD";
export type LanguageCode = "en" | "ur" | "ar";
export type CountryCode = "PK" | "AE" | "SA" | "QA" | "US";
export type Gender = "male" | "female" | "other" | "prefer_not_to_say";
export type UserRole = "patient" | "doctor" | "admin";

// ─── API Response Wrappers ────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: ISO8601;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  message: string;
  success: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
  timestamp: ISO8601;
}

// ─── Auth ─────────────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: ISO8601;
}

export interface AuthSession {
  user: User;
  tokens: AuthTokens;
  role: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  country: CountryCode;
  language: LanguageCode;
}

export interface OTPVerification {
  phone: string;
  code: string;
  type: "registration" | "login" | "password_reset";
}

// ─── User ─────────────────────────────────────────────────────

export interface User {
  id: UUID;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  country: CountryCode;
  language: LanguageCode;
  createdAt: ISO8601;
  updatedAt: ISO8601;
}

// ─── Patient ──────────────────────────────────────────────────

export interface Patient extends User {
  dateOfBirth?: DateOnly;
  gender?: Gender;
  bloodType?: BloodType;
  height?: number; // cm
  weight?: number; // kg
  allergies?: string[];
  chronicConditions?: string[];
  currentMedications?: string[];
  emergencyContact?: EmergencyContact;
  insuranceInfo?: InsuranceInfo;
  medicalRecords?: MedicalRecord[];
}

export type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  expiryDate: DateOnly;
}

// ─── Doctor ───────────────────────────────────────────────────

export interface Doctor {
  id: UUID;
  userId: UUID;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  gender: Gender;
  country: CountryCode;
  languages: LanguageCode[];
  specialization: Specialization;
  subSpecializations?: string[];
  qualifications: Qualification[];
  experience: number; // years
  bio: string;
  about: string;
  consultationFee: number;
  currency: CurrencyCode;
  rating: number; // 0-5
  reviewCount: number;
  totalConsultations: number;
  isAvailable: boolean;
  isVerified: boolean;
  verificationStatus: DoctorVerificationStatus;
  availability: DoctorAvailability[];
  nextAvailableSlot?: ISO8601;
  hospital?: string;
  licenseNumber: string;
  pmcNumber?: string; // Pakistan Medical Commission
  createdAt: ISO8601;
  updatedAt: ISO8601;
}

export type Specialization =
  | "general_physician"
  | "cardiologist"
  | "dermatologist"
  | "neurologist"
  | "psychiatrist"
  | "pediatrician"
  | "gynecologist"
  | "orthopedist"
  | "ophthalmologist"
  | "ent_specialist"
  | "gastroenterologist"
  | "pulmonologist"
  | "endocrinologist"
  | "nephrologist"
  | "urologist"
  | "oncologist"
  | "rheumatologist"
  | "radiologist"
  | "pathologist"
  | "dentist";

export const SPECIALIZATION_LABELS: Record<Specialization, string> = {
  general_physician: "General Physician",
  cardiologist: "Cardiologist",
  dermatologist: "Dermatologist",
  neurologist: "Neurologist",
  psychiatrist: "Psychiatrist",
  pediatrician: "Pediatrician",
  gynecologist: "Gynecologist / Obstetrician",
  orthopedist: "Orthopedic Surgeon",
  ophthalmologist: "Ophthalmologist",
  ent_specialist: "ENT Specialist",
  gastroenterologist: "Gastroenterologist",
  pulmonologist: "Pulmonologist",
  endocrinologist: "Endocrinologist",
  nephrologist: "Nephrologist",
  urologist: "Urologist",
  oncologist: "Oncologist",
  rheumatologist: "Rheumatologist",
  radiologist: "Radiologist",
  pathologist: "Pathologist",
  dentist: "Dentist",
};

export interface Qualification {
  degree: string;
  institution: string;
  year: number;
  country: string;
}

export type DoctorVerificationStatus =
  | "pending"
  | "under_review"
  | "verified"
  | "rejected"
  | "suspended";

export interface DoctorAvailability {
  id: UUID;
  doctorId: UUID;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Sunday
  startTime: TimeOnly;
  endTime: TimeOnly;
  slotDuration: number; // minutes
  isActive: boolean;
}

export interface TimeSlot {
  id: UUID;
  doctorId: UUID;
  date: DateOnly;
  startTime: TimeOnly;
  endTime: TimeOnly;
  isBooked: boolean;
  isBlocked: boolean;
}

// ─── Booking ──────────────────────────────────────────────────

export type ConsultationType = "video" | "chat" | "in_person";
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show"
  | "rescheduled";

export interface Booking {
  id: UUID;
  patientId: UUID;
  doctorId: UUID;
  doctor?: Doctor;
  patient?: Patient;
  consultationType: ConsultationType;
  status: BookingStatus;
  scheduledAt: ISO8601;
  duration: number; // minutes
  symptoms?: string;
  notes?: string;
  consultationFee: number;
  currency: CurrencyCode;
  paymentStatus: PaymentStatus;
  paymentId?: UUID;
  videoRoomId?: string;
  createdAt: ISO8601;
  updatedAt: ISO8601;
}

// ─── Consultation ─────────────────────────────────────────────

export interface Consultation extends Booking {
  startedAt?: ISO8601;
  endedAt?: ISO8601;
  doctorNotes?: string;
  diagnosis?: string;
  prescription?: Prescription;
  followUpDate?: DateOnly;
  rating?: ConsultationRating;
}

export interface ConsultationRating {
  id: UUID;
  consultationId: UUID;
  patientId: UUID;
  doctorId: UUID;
  rating: number; // 1-5
  review?: string;
  createdAt: ISO8601;
}

// ─── Payment ──────────────────────────────────────────────────

export type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "refunded";
export type PaymentMethod =
  | "jazzcash"
  | "easypaisa"
  | "bank_transfer"
  | "card"
  | "stripe"
  | "wallet";
export type PaymentGateway = "jazzcash" | "easypaisa" | "stripe" | "checkout";

export interface Payment {
  id: UUID;
  bookingId: UUID;
  patientId: UUID;
  doctorId: UUID;
  amount: number;
  platformFee: number;
  doctorAmount: number;
  currency: CurrencyCode;
  method: PaymentMethod;
  gateway: PaymentGateway;
  status: PaymentStatus;
  gatewayTransactionId?: string;
  gatewayResponse?: Record<string, unknown>;
  createdAt: ISO8601;
  updatedAt: ISO8601;
}

export interface Payout {
  id: UUID;
  doctorId: UUID;
  amount: number;
  currency: CurrencyCode;
  status: "pending" | "processing" | "completed" | "failed";
  bankAccount?: string;
  processedAt?: ISO8601;
  createdAt: ISO8601;
}

// ─── Chat / Messaging ─────────────────────────────────────────

export type MessageType = "text" | "image" | "document" | "audio" | "system";
export type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";

export interface Message {
  id: UUID;
  conversationId: UUID;
  senderId: UUID;
  senderRole: UserRole;
  type: MessageType;
  content: string;
  attachment?: MessageAttachment;
  status: MessageStatus;
  isDeleted: boolean;
  replyTo?: UUID;
  createdAt: ISO8601;
  updatedAt: ISO8601;
}

export interface MessageAttachment {
  url: string;
  name: string;
  size: number; // bytes
  mimeType: string;
  thumbnailUrl?: string;
}

export interface Conversation {
  id: UUID;
  bookingId?: UUID;
  participants: ConversationParticipant[];
  lastMessage?: Message;
  unreadCount: number;
  isActive: boolean;
  createdAt: ISO8601;
  updatedAt: ISO8601;
}

export interface ConversationParticipant {
  userId: UUID;
  role: UserRole;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastSeenAt?: ISO8601;
}

// ─── Notifications ────────────────────────────────────────────

export type NotificationType =
  | "booking_confirmed"
  | "booking_cancelled"
  | "booking_reminder"
  | "consultation_started"
  | "consultation_completed"
  | "message_received"
  | "doctor_verified"
  | "payment_completed"
  | "payment_failed"
  | "prescription_ready"
  | "review_requested"
  | "system";

export interface Notification {
  id: UUID;
  userId: UUID;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, string>;
  isRead: boolean;
  actionUrl?: string;
  createdAt: ISO8601;
}

// ─── Medical Records ──────────────────────────────────────────

export interface MedicalRecord {
  id: UUID;
  patientId: UUID;
  consultationId?: UUID;
  type: "report" | "prescription" | "lab_result" | "imaging" | "other";
  title: string;
  description?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  issuedBy?: string;
  issuedAt: DateOnly;
  uploadedAt: ISO8601;
}

export interface Prescription {
  id: UUID;
  consultationId: UUID;
  patientId: UUID;
  doctorId: UUID;
  medications: PrescriptionMedication[];
  instructions?: string;
  followUpDate?: DateOnly;
  issuedAt: ISO8601;
}

export interface PrescriptionMedication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

// ─── Reviews ──────────────────────────────────────────────────

export interface Review {
  id: UUID;
  doctorId: UUID;
  patientId: UUID;
  patient?: Pick<Patient, "firstName" | "lastName" | "avatar">;
  consultationId: UUID;
  rating: number; // 1-5
  comment?: string;
  isVerified: boolean;
  createdAt: ISO8601;
}

// ─── Doctor Verification (Admin) ─────────────────────────────

export interface DoctorVerificationApplication {
  id: UUID;
  doctorId: UUID;
  doctor?: Doctor;
  documents: VerificationDocument[];
  status: DoctorVerificationStatus;
  reviewedBy?: UUID;
  reviewNotes?: string;
  submittedAt: ISO8601;
  reviewedAt?: ISO8601;
}

export interface VerificationDocument {
  id: UUID;
  type: "medical_license" | "degree" | "cnic" | "passport" | "pmc_certificate" | "other";
  url: string;
  name: string;
  uploadedAt: ISO8601;
}

// ─── Analytics (Admin) ────────────────────────────────────────

export interface DashboardAnalytics {
  totalPatients: number;
  totalDoctors: number;
  totalConsultations: number;
  totalRevenue: number;
  currency: CurrencyCode;
  activeConsultations: number;
  pendingVerifications: number;
  consultationGrowth: number; // percentage
  revenueGrowth: number; // percentage
  patientGrowth: number; // percentage
  doctorGrowth: number; // percentage
}

export interface TimeSeriesDataPoint {
  date: DateOnly;
  value: number;
  label?: string;
}

export interface ChartData {
  consultations: TimeSeriesDataPoint[];
  revenue: TimeSeriesDataPoint[];
  newPatients: TimeSeriesDataPoint[];
  newDoctors: TimeSeriesDataPoint[];
}

// ─── Filters ─────────────────────────────────────────────────

export interface DoctorFilters {
  specialization?: Specialization;
  language?: LanguageCode;
  country?: CountryCode;
  gender?: Gender;
  minRating?: number;
  maxFee?: number;
  isAvailable?: boolean;
  consultationType?: ConsultationType;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "rating" | "fee_asc" | "fee_desc" | "experience" | "reviews";
}

export interface ConsultationFilters {
  status?: BookingStatus;
  consultationType?: ConsultationType;
  dateFrom?: DateOnly;
  dateTo?: DateOnly;
  page?: number;
  limit?: number;
}

// ─── UI / Component Types ─────────────────────────────────────

export type LoadingState = "idle" | "loading" | "success" | "error";

export interface SelectOption<T = string> {
  label: string;
  value: T;
  icon?: string;
  disabled?: boolean;
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: number;
  children?: NavItem[];
}

// ─── Video Consultation ───────────────────────────────────────

export interface VideoRoom {
  id: string;
  consultationId: UUID;
  token: string; // WebRTC signaling token
  expiresAt: ISO8601;
}

export type VideoCallStatus =
  | "initializing"
  | "waiting"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "ended"
  | "failed";

export interface VideoCallState {
  status: VideoCallStatus;
  isAudioMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  isChatOpen: boolean;
  duration: number; // seconds
  localStream?: MediaStream;
  remoteStream?: MediaStream;
}

export interface DeviceInfo {
  deviceId: string;
  label: string;
  kind: "audioinput" | "audiooutput" | "videoinput";
}
