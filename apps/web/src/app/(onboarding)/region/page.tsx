"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const REGIONS = [
  { code: "PK", name: "Pakistan", flag: "🇵🇰", currency: "PKR" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", currency: "SAR" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪", currency: "AED" },
  { code: "OTHER", name: "Middle East / Other", flag: "🌐", currency: "USD" },
];

export default function RegionOnboardingPage() {
  const [selectedRegion, setSelectedRegion] = useState("PK");

  const handleNext = () => {
    toast.success("Region Established", {
      description: `Wadud regional settings mapped to ${
        REGIONS.find((r) => r.code === selectedRegion)?.name
      }.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <div className="flex justify-center mb-2">
          <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
            <MapPin className="h-6 w-6" />
          </div>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          Select Your Region
        </h1>
        <p className="text-sm text-muted-foreground">
          This helps us match you with doctors licensed in your country and show appropriate pricing.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2">
        {REGIONS.map((region) => (
          <button
            key={region.code}
            onClick={() => setSelectedRegion(region.code)}
            className={`flex flex-col items-center justify-center p-5 rounded-2xl border text-center cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
              selectedRegion === region.code
                ? "bg-primary/5 border-primary shadow-sm"
                : "bg-background border-border hover:border-primary/20"
            }`}
          >
            <span className="text-3xl mb-2">{region.flag}</span>
            <span className="text-sm font-bold text-foreground">{region.name}</span>
            <span className="text-xs text-muted-foreground mt-1">({region.currency})</span>
          </button>
        ))}
      </div>

      <div className="pt-4 flex gap-3">
        <Link href="/language" className="flex-1">
          <Button variant="ghost" className="w-full rounded-xl border border-border">
            Back
          </Button>
        </Link>
        <Link href="/profile-setup" className="flex-1" onClick={handleNext}>
          <Button className="w-full rounded-xl text-white shadow-glow flex items-center justify-center gap-1.5">
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
