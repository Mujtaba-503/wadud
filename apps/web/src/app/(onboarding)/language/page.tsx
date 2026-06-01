"use client";

import { useState } from "react";
import Link from "next/link";
import { Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const LANGUAGES = [
  { code: "en", label: "English", subText: "Default language" },
  { code: "ur", label: "Urdu (اردو)", subText: "بنیادی زبان کے طور پر" },
  { code: "ar", label: "Arabic (العربية)", subText: "كاللغة الأساسية" },
];

export default function LanguageOnboardingPage() {
  const [selectedLang, setSelectedLang] = useState("en");

  const handleNext = () => {
    toast.success("Language Preferences Updated", {
      description: `Wadud portal language set to ${
        LANGUAGES.find((l) => l.code === selectedLang)?.label
      }.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <div className="flex justify-center mb-2">
          <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
            <Globe className="h-6 w-6" />
          </div>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          Preferred Language
        </h1>
        <p className="text-sm text-muted-foreground">
          Select your primary language. You can change this at any time in the settings.
        </p>
      </div>

      <div className="space-y-3 pt-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setSelectedLang(lang.code)}
            className={`w-full flex items-center justify-between p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
              selectedLang === lang.code
                ? "bg-primary/5 border-primary shadow-sm"
                : "bg-background border-border hover:border-primary/20"
            }`}
          >
            <div>
              <p className="font-bold text-foreground text-sm">{lang.label}</p>
              <p className="text-xs text-muted-foreground">{lang.subText}</p>
            </div>
            <div
              className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                selectedLang === lang.code ? "border-primary" : "border-muted-foreground/30"
              }`}
            >
              {selectedLang === lang.code && <div className="h-2 w-2 rounded-full bg-primary" />}
            </div>
          </button>
        ))}
      </div>

      <div className="pt-4 flex gap-3">
        <Link href="/welcome" className="flex-1">
          <Button variant="ghost" className="w-full rounded-xl border border-border">
            Back
          </Button>
        </Link>
        <Link href="/region" className="flex-1" onClick={handleNext}>
          <Button className="w-full rounded-xl text-white shadow-glow flex items-center justify-center gap-1.5">
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
