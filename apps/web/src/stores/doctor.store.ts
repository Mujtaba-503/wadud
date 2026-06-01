import { create } from "zustand";
import type { Doctor, DoctorFilters, LoadingState } from "@wadud/types";
import { MOCK_DOCTORS, searchDoctors, getAvailableDoctors } from "@wadud/mocks";

/**
 * @api GET /api/v1/doctors
 * @params DoctorFilters (specialization, language, country, gender, rating, availability, page, limit)
 * @returns PaginatedResponse<Doctor>
 * Replace mock data with SWR or React Query fetcher
 */

interface DoctorState {
  doctors: Doctor[];
  filteredDoctors: Doctor[];
  selectedDoctor: Doctor | null;
  filters: DoctorFilters;
  loadingState: LoadingState;
  error: string | null;
  totalCount: number;
  // Actions
  fetchDoctors: (filters?: DoctorFilters) => Promise<void>;
  setFilters: (filters: Partial<DoctorFilters>) => void;
  clearFilters: () => void;
  selectDoctor: (doctor: Doctor | null) => void;
  fetchDoctorById: (id: string) => Promise<Doctor | null>;
}

const DEFAULT_FILTERS: DoctorFilters = {
  page: 1,
  limit: 12,
  sortBy: "rating",
};

export const useDoctorStore = create<DoctorState>()((set, get) => ({
  doctors: MOCK_DOCTORS,
  filteredDoctors: MOCK_DOCTORS,
  selectedDoctor: null,
  filters: DEFAULT_FILTERS,
  loadingState: "idle",
  error: null,
  totalCount: MOCK_DOCTORS.length,

  fetchDoctors: async (filters) => {
    set({ loadingState: "loading", error: null });
    await new Promise((r) => setTimeout(r, 800));
    // TODO: Replace with real API → GET /api/v1/doctors?{filters}
    const { filters: currentFilters } = get();
    const merged = { ...currentFilters, ...filters };
    let result = [...MOCK_DOCTORS];

    if (merged.specialization) result = result.filter((d) => d.specialization === merged.specialization);
    if (merged.language) result = result.filter((d) => d.languages.includes(merged.language!));
    if (merged.country) result = result.filter((d) => d.country === merged.country);
    if (merged.gender) result = result.filter((d) => d.gender === merged.gender);
    if (merged.minRating) result = result.filter((d) => d.rating >= merged.minRating!);
    if (merged.isAvailable) result = result.filter((d) => d.isAvailable);
    if (merged.search) result = searchDoctors(merged.search);
    if (merged.maxFee) result = result.filter((d) => d.consultationFee <= merged.maxFee!);

    if (merged.sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    else if (merged.sortBy === "experience") result.sort((a, b) => b.experience - a.experience);
    else if (merged.sortBy === "reviews") result.sort((a, b) => b.reviewCount - a.reviewCount);

    set({ filteredDoctors: result, totalCount: result.length, loadingState: "success" });
  },

  setFilters: (filters) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }));
    get().fetchDoctors();
  },

  clearFilters: () => {
    set({ filters: DEFAULT_FILTERS, filteredDoctors: MOCK_DOCTORS });
  },

  selectDoctor: (doctor) => set({ selectedDoctor: doctor }),

  fetchDoctorById: async (id) => {
    set({ loadingState: "loading" });
    await new Promise((r) => setTimeout(r, 600));
    const doctor = MOCK_DOCTORS.find((d) => d.id === id) ?? null;
    set({ selectedDoctor: doctor, loadingState: "success" });
    return doctor;
  },
}));
