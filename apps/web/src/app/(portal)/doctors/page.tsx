"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Globe, Calendar, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DoctorCard } from "@/components/cards/doctor-card";
import { MOCK_DOCTORS } from "@wadud/mocks";
import type { Specialization } from "@wadud/types";
import { SPECIALIZATION_LABELS } from "@wadud/types";

const SPECIALIZATIONS = Object.entries(SPECIALIZATION_LABELS).map(([value, label]) => ({
  value: value as Specialization,
  label,
}));

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "ur", label: "Urdu (اردو)" },
  { value: "ar", label: "Arabic (العربية)" },
];

const COUNTRIES = [
  { value: "PK", label: "Pakistan" },
  { value: "AE", label: "United Arab Emirates" },
  { value: "SA", label: "Saudi Arabia" },
  { value: "QA", label: "Qatar" },
];

export default function DoctorDiscoveryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpec, setSelectedSpec] = useState<string>("all");
  const [selectedLang, setSelectedLang] = useState<string>("all");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Computed matching doctors
  const filteredDoctors = useMemo(() => {
    return MOCK_DOCTORS.filter((doctor) => {
      // 1. Search Query Match
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName =
          doctor.firstName.toLowerCase().includes(q) ||
          doctor.lastName.toLowerCase().includes(q);
        const matchesHospital = doctor.hospital?.toLowerCase().includes(q);
        if (!matchesName && !matchesHospital) return false;
      }

      // 2. Specialization Match
      if (selectedSpec !== "all" && doctor.specialization !== selectedSpec) {
        return false;
      }

      // 3. Language Match
      if (selectedLang !== "all" && !doctor.languages.includes(selectedLang)) {
        return false;
      }

      // 4. Country Match
      if (selectedCountry !== "all" && doctor.country !== selectedCountry) {
        return false;
      }

      // 5. Availability Match
      if (onlyAvailable && !doctor.isAvailable) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedSpec, selectedLang, selectedCountry, onlyAvailable]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedSpec("all");
    setSelectedLang("all");
    setSelectedCountry("all");
    setOnlyAvailable(false);
  };

  return (
    <div className="page-container py-8 space-y-6">
      {/* Header */}
      <div className="space-y-1.5 text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Find a Consultant
        </h1>
        <p className="text-sm text-muted-foreground">
          Search and book consultations with certified consultants across the region.
        </p>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Filters Sidebar (Desktop) / Dropdown (Mobile) */}
        <aside className="lg:col-span-3 bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <span className="font-bold text-foreground text-sm flex items-center gap-1.5">
              <SlidersHorizontal className="h-4 w-4 text-primary" /> Filter Options
            </span>
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Clear All
            </button>
          </div>

          {/* Specialization Select */}
          <div className="space-y-2 text-left">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Specialization
            </label>
            <select
              value={selectedSpec}
              onChange={(e) => setSelectedSpec(e.target.value)}
              className="w-full bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-3 text-sm h-11 focus:outline-none transition-all"
            >
              <option value="all">All Specialties</option>
              {SPECIALIZATIONS.map((spec) => (
                <option key={spec.value} value={spec.value}>
                  {spec.label}
                </option>
              ))}
            </select>
          </div>

          {/* Country Select */}
          <div className="space-y-2 text-left">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Location / Country
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-3 text-sm h-11 focus:outline-none transition-all"
            >
              <option value="all">All Countries</option>
              {COUNTRIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Language Select */}
          <div className="space-y-2 text-left">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Language
            </label>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="w-full bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-3 text-sm h-11 focus:outline-none transition-all"
            >
              <option value="all">Any Language</option>
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Toggle Availability */}
          <div className="pt-2 border-t border-border">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="h-4 w-4 rounded border-input text-primary focus:ring-primary transition-colors"
              />
              <span className="text-xs font-semibold text-foreground">
                Available Now (Online)
              </span>
            </label>
          </div>
        </aside>

        {/* Doctor Results (Right Column) */}
        <div className="lg:col-span-9 space-y-6">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by doctor name or hospital..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none transition-all shadow-sm"
            />
          </div>

          {/* Results Metadata */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Showing <span className="font-bold text-foreground">{filteredDoctors.length}</span> doctors
            </span>
            {filteredDoctors.length > 0 && (
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" /> All doctors licensed and verified
              </span>
            )}
          </div>

          {/* Doctor Grid */}
          {filteredDoctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDoctors.map((doc, idx) => (
                <DoctorCard key={doc.id} doctor={doc} index={idx} />
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border border-dashed rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <Search className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-foreground text-sm">No Doctors Found</h3>
                <p className="text-xs text-muted-foreground leading-normal">
                  We couldn&apos;t find any doctors matching your search query or active filter settings. Try clearing some filters.
                </p>
              </div>
              <Button size="sm" onClick={resetFilters} className="rounded-lg">
                Reset All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
