import type { Consultation, Booking } from "@wadud/types";
import { MOCK_DOCTORS } from "./doctors";
import { MOCK_PATIENTS } from "./patients";

const now = new Date();
const tomorrow = new Date(now.getTime() + 86400000).toISOString();
const nextWeek = new Date(now.getTime() + 7 * 86400000).toISOString();
const yesterday = new Date(now.getTime() - 86400000).toISOString();
const lastWeek = new Date(now.getTime() - 7 * 86400000).toISOString();
const twoWeeksAgo = new Date(now.getTime() - 14 * 86400000).toISOString();

export const MOCK_CONSULTATIONS: Consultation[] = [
  {
    id: "c1a2b3c4-0001-4000-a000-000000000001",
    patientId: MOCK_PATIENTS[0].id,
    doctorId: MOCK_DOCTORS[0].id,
    doctor: MOCK_DOCTORS[0],
    patient: MOCK_PATIENTS[0],
    consultationType: "video",
    status: "confirmed",
    scheduledAt: tomorrow,
    duration: 30,
    symptoms: "Chest pain and shortness of breath during exercise",
    notes: "Follow-up for recent ECG results",
    consultationFee: 350,
    currency: "AED",
    paymentStatus: "completed",
    paymentId: "pay-0001",
    videoRoomId: "room-c1a2b3c4-0001",
    createdAt: new Date(now.getTime() - 2 * 86400000).toISOString(),
    updatedAt: new Date(now.getTime() - 86400000).toISOString(),
  },
  {
    id: "c1a2b3c4-0002-4000-a000-000000000002",
    patientId: MOCK_PATIENTS[0].id,
    doctorId: MOCK_DOCTORS[3].id,
    doctor: MOCK_DOCTORS[3],
    patient: MOCK_PATIENTS[0],
    consultationType: "chat",
    status: "confirmed",
    scheduledAt: nextWeek,
    duration: 20,
    symptoms: "Child has fever and cough for 3 days",
    consultationFee: 2000,
    currency: "PKR",
    paymentStatus: "completed",
    paymentId: "pay-0002",
    createdAt: new Date(now.getTime() - 86400000).toISOString(),
    updatedAt: new Date(now.getTime() - 86400000).toISOString(),
  },
  {
    id: "c1a2b3c4-0003-4000-a000-000000000003",
    patientId: MOCK_PATIENTS[0].id,
    doctorId: MOCK_DOCTORS[1].id,
    doctor: MOCK_DOCTORS[1],
    patient: MOCK_PATIENTS[0],
    consultationType: "video",
    status: "completed",
    scheduledAt: lastWeek,
    duration: 30,
    symptoms: "Irregular periods and abdominal pain",
    consultationFee: 2500,
    currency: "PKR",
    paymentStatus: "completed",
    startedAt: lastWeek,
    endedAt: new Date(new Date(lastWeek).getTime() + 28 * 60000).toISOString(),
    doctorNotes: "Patient has PCOS. Discussed lifestyle changes and started hormonal therapy.",
    diagnosis: "Polycystic Ovary Syndrome (PCOS)",
    prescription: {
      id: "rx-0001",
      consultationId: "c1a2b3c4-0003-4000-a000-000000000003",
      patientId: MOCK_PATIENTS[0].id,
      doctorId: MOCK_DOCTORS[1].id,
      medications: [
        { name: "Metformin", dosage: "500mg", frequency: "Twice daily", duration: "3 months", instructions: "Take with food" },
        { name: "Inositol", dosage: "4g", frequency: "Once daily", duration: "3 months", instructions: "Dissolve in water" },
      ],
      instructions: "Follow a low-carb diet and exercise 30 minutes daily. Follow up in 3 months.",
      followUpDate: new Date(now.getTime() + 90 * 86400000).toISOString().split("T")[0],
      issuedAt: lastWeek,
    },
    rating: {
      id: "rat-0001",
      consultationId: "c1a2b3c4-0003-4000-a000-000000000003",
      patientId: MOCK_PATIENTS[0].id,
      doctorId: MOCK_DOCTORS[1].id,
      rating: 5,
      review: "Excellent consultation. Dr. Fatima was very thorough and explained everything clearly.",
      createdAt: new Date(new Date(lastWeek).getTime() + 3600000).toISOString(),
    },
    createdAt: new Date(now.getTime() - 10 * 86400000).toISOString(),
    updatedAt: lastWeek,
  },
  {
    id: "c1a2b3c4-0004-4000-a000-000000000004",
    patientId: MOCK_PATIENTS[0].id,
    doctorId: MOCK_DOCTORS[10].id,
    doctor: MOCK_DOCTORS[10],
    patient: MOCK_PATIENTS[0],
    consultationType: "chat",
    status: "completed",
    scheduledAt: twoWeeksAgo,
    duration: 20,
    symptoms: "Recurring headaches and fatigue",
    consultationFee: 1500,
    currency: "PKR",
    paymentStatus: "completed",
    startedAt: twoWeeksAgo,
    endedAt: new Date(new Date(twoWeeksAgo).getTime() + 18 * 60000).toISOString(),
    doctorNotes: "Tension-type headaches likely due to screen time and poor posture. Advised physiotherapy.",
    diagnosis: "Tension-type headaches",
    rating: {
      id: "rat-0002",
      consultationId: "c1a2b3c4-0004-4000-a000-000000000004",
      patientId: MOCK_PATIENTS[0].id,
      doctorId: MOCK_DOCTORS[10].id,
      rating: 4,
      review: "Very helpful and responsive. Quick diagnosis.",
      createdAt: new Date(new Date(twoWeeksAgo).getTime() + 3600000).toISOString(),
    },
    createdAt: new Date(now.getTime() - 16 * 86400000).toISOString(),
    updatedAt: twoWeeksAgo,
  },
  {
    id: "c1a2b3c4-0005-4000-a000-000000000005",
    patientId: MOCK_PATIENTS[0].id,
    doctorId: MOCK_DOCTORS[2].id,
    doctor: MOCK_DOCTORS[2],
    patient: MOCK_PATIENTS[0],
    consultationType: "video",
    status: "cancelled",
    scheduledAt: yesterday,
    duration: 45,
    symptoms: "Anxiety and sleep issues",
    consultationFee: 500,
    currency: "SAR",
    paymentStatus: "refunded",
    notes: "Patient cancelled due to travel",
    createdAt: new Date(now.getTime() - 5 * 86400000).toISOString(),
    updatedAt: yesterday,
  },
];

export const MOCK_UPCOMING_CONSULTATIONS = MOCK_CONSULTATIONS.filter(
  (c) => c.status === "confirmed" || c.status === "pending"
);
export const MOCK_COMPLETED_CONSULTATIONS = MOCK_CONSULTATIONS.filter(
  (c) => c.status === "completed"
);
export const MOCK_CANCELLED_CONSULTATIONS = MOCK_CONSULTATIONS.filter(
  (c) => c.status === "cancelled"
);
