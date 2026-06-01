import { create } from "zustand";
import type { Booking, ConsultationType, Doctor, TimeSlot, LoadingState } from "@wadud/types";

/**
 * @api POST /api/v1/bookings — Create booking
 * @api GET  /api/v1/doctors/:id/slots?date=YYYY-MM-DD — Get available slots
 * @api POST /api/v1/payments/intent — Create payment intent
 * @api POST /api/v1/payments/confirm — Confirm payment
 */

export type BookingStep = "slot" | "type" | "review" | "payment" | "success";

interface BookingState {
  currentStep: BookingStep;
  selectedDoctor: Doctor | null;
  selectedSlot: TimeSlot | null;
  selectedType: ConsultationType;
  symptoms: string;
  notes: string;
  createdBooking: Booking | null;
  availableSlots: TimeSlot[];
  loadingState: LoadingState;
  error: string | null;
  // Actions
  startBooking: (doctor: Doctor) => void;
  setStep: (step: BookingStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  selectSlot: (slot: TimeSlot) => void;
  setConsultationType: (type: ConsultationType) => void;
  setSymptoms: (symptoms: string) => void;
  setNotes: (notes: string) => void;
  fetchSlots: (doctorId: string, date: string) => Promise<void>;
  confirmBooking: () => Promise<void>;
  resetBooking: () => void;
}

const STEPS: BookingStep[] = ["slot", "type", "review", "payment", "success"];

// Generate mock time slots for a doctor
function generateMockSlots(doctorId: string, date: string): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const times = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00"];
  const bookedIdx = [1, 4, 7]; // Some slots pre-booked
  times.forEach((t, i) => {
    const [h, m] = t.split(":").map(Number);
    const endH = m === 30 ? h + 1 : h;
    const endM = m === 30 ? "00" : "30";
    slots.push({
      id: `slot-${doctorId}-${date}-${i}`,
      doctorId,
      date,
      startTime: t,
      endTime: `${String(endH).padStart(2, "0")}:${endM}`,
      isBooked: bookedIdx.includes(i),
      isBlocked: false,
    });
  });
  return slots;
}

export const useBookingStore = create<BookingState>()((set, get) => ({
  currentStep: "slot",
  selectedDoctor: null,
  selectedSlot: null,
  selectedType: "video",
  symptoms: "",
  notes: "",
  createdBooking: null,
  availableSlots: [],
  loadingState: "idle",
  error: null,

  startBooking: (doctor) => set({ selectedDoctor: doctor, currentStep: "slot" }),

  setStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const { currentStep } = get();
    const idx = STEPS.indexOf(currentStep);
    if (idx < STEPS.length - 1) set({ currentStep: STEPS[idx + 1] });
  },

  prevStep: () => {
    const { currentStep } = get();
    const idx = STEPS.indexOf(currentStep);
    if (idx > 0) set({ currentStep: STEPS[idx - 1] });
  },

  selectSlot: (slot) => set({ selectedSlot: slot }),

  setConsultationType: (type) => set({ selectedType: type }),

  setSymptoms: (symptoms) => set({ symptoms }),

  setNotes: (notes) => set({ notes }),

  fetchSlots: async (doctorId, date) => {
    set({ loadingState: "loading" });
    await new Promise((r) => setTimeout(r, 700));
    // TODO: GET /api/v1/doctors/:id/slots?date=date
    const slots = generateMockSlots(doctorId, date);
    set({ availableSlots: slots, loadingState: "success" });
  },

  confirmBooking: async () => {
    const { selectedDoctor, selectedSlot, selectedType, symptoms, notes } = get();
    if (!selectedDoctor || !selectedSlot) return;
    set({ loadingState: "loading" });
    await new Promise((r) => setTimeout(r, 1500));
    // TODO: POST /api/v1/bookings
    const mockBooking: Booking = {
      id: `booking-${Date.now()}`,
      patientId: "p1a2b3c4-0001-4000-a000-000000000001",
      doctorId: selectedDoctor.id,
      doctor: selectedDoctor,
      consultationType: selectedType,
      status: "confirmed",
      scheduledAt: `${selectedSlot.date}T${selectedSlot.startTime}:00Z`,
      duration: 30,
      symptoms,
      notes,
      consultationFee: selectedDoctor.consultationFee,
      currency: selectedDoctor.currency,
      paymentStatus: "completed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set({ createdBooking: mockBooking, currentStep: "success", loadingState: "success" });
  },

  resetBooking: () =>
    set({
      currentStep: "slot",
      selectedDoctor: null,
      selectedSlot: null,
      selectedType: "video",
      symptoms: "",
      notes: "",
      createdBooking: null,
      availableSlots: [],
      loadingState: "idle",
      error: null,
    }),
}));
