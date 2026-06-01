import type { Review } from "@wadud/types";
import { MOCK_DOCTORS } from "./doctors";
import { MOCK_PATIENTS } from "./patients";

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600000).toISOString();

export const MOCK_REVIEWS: Review[] = [
  {
    id: "rev-0001",
    doctorId: MOCK_DOCTORS[0].id,
    patientId: MOCK_PATIENTS[0].id,
    patient: { firstName: "Muhammad", lastName: "A.", avatar: MOCK_PATIENTS[0].avatar },
    consultationId: "c1a2b3c4-0001-4000-a000-000000000001",
    rating: 5,
    comment: "Dr. Ahmad is exceptional. He explained my heart condition in simple terms and made me feel at ease. Highly recommend!",
    isVerified: true,
    createdAt: hoursAgo(48),
  },
  {
    id: "rev-0002",
    doctorId: MOCK_DOCTORS[0].id,
    patientId: MOCK_PATIENTS[2].id,
    patient: { firstName: "Khalid", lastName: "M.", avatar: MOCK_PATIENTS[2].avatar },
    consultationId: "c-ext-0001",
    rating: 5,
    comment: "Very professional. My ECG results were explained thoroughly and the follow-up plan is clear. The best cardiologist I've consulted.",
    isVerified: true,
    createdAt: hoursAgo(120),
  },
  {
    id: "rev-0003",
    doctorId: MOCK_DOCTORS[0].id,
    patientId: MOCK_PATIENTS[1].id,
    patient: { firstName: "Sara", lastName: "A.", avatar: MOCK_PATIENTS[1].avatar },
    consultationId: "c-ext-0002",
    rating: 5,
    comment: "جزاك الله خيراً يا دكتور أحمد. شرح ممتاز وتعامل راقي جداً.",
    isVerified: true,
    createdAt: hoursAgo(200),
  },
  {
    id: "rev-0004",
    doctorId: MOCK_DOCTORS[0].id,
    patientId: MOCK_PATIENTS[3].id,
    patient: { firstName: "Amna", lastName: "B." },
    consultationId: "c-ext-0003",
    rating: 4,
    comment: "Great doctor, very knowledgeable. Took a bit long to start but consultation was thorough.",
    isVerified: true,
    createdAt: hoursAgo(320),
  },
  {
    id: "rev-0005",
    doctorId: MOCK_DOCTORS[1].id,
    patientId: MOCK_PATIENTS[0].id,
    patient: { firstName: "Muhammad", lastName: "A.", avatar: MOCK_PATIENTS[0].avatar },
    consultationId: "c1a2b3c4-0003-4000-a000-000000000003",
    rating: 5,
    comment: "Excellent consultation. Dr. Fatima was very thorough and explained everything clearly. She made me feel comfortable discussing sensitive topics.",
    isVerified: true,
    createdAt: hoursAgo(168),
  },
  {
    id: "rev-0006",
    doctorId: MOCK_DOCTORS[1].id,
    patientId: MOCK_PATIENTS[3].id,
    patient: { firstName: "Amna", lastName: "B." },
    consultationId: "c-ext-0004",
    rating: 5,
    comment: "Dr. Fatima is amazing! She listened carefully and provided a comprehensive treatment plan. Very compassionate doctor.",
    isVerified: true,
    createdAt: hoursAgo(240),
  },
  {
    id: "rev-0007",
    doctorId: MOCK_DOCTORS[10].id,
    patientId: MOCK_PATIENTS[0].id,
    patient: { firstName: "Muhammad", lastName: "A.", avatar: MOCK_PATIENTS[0].avatar },
    consultationId: "c1a2b3c4-0004-4000-a000-000000000004",
    rating: 4,
    comment: "Very helpful and responsive. Quick and accurate diagnosis. Dr. Bilal is a reliable GP.",
    isVerified: true,
    createdAt: hoursAgo(336),
  },
];

export function getReviewsByDoctor(doctorId: string): Review[] {
  return MOCK_REVIEWS.filter((r) => r.doctorId === doctorId);
}
