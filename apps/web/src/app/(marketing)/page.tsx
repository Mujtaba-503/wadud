"use client";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Video,
  MessageSquare,
  ShieldCheck,
  Globe,
  Clock,
  ArrowRight,
  Sparkles,
  Users,
  Star,
  Activity,
  Heart,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DoctorCard } from "@/components/cards/doctor-card";
import { MOCK_DOCTORS } from "@wadud/mocks";
import type { Specialization } from "@wadud/types";

const SPECIALIZATIONS: { value: Specialization; label: string; icon: string; desc: string }[] = [
  { value: "general_physician", label: "General Care", icon: "🩺", desc: "Common cold, flu, fever, prescriptions" },
  { value: "pediatrician", label: "Pediatrics", icon: "👶", desc: "Child growth, vaccination, infant care" },
  { value: "psychiatrist", label: "Mental Health", icon: "🧠", desc: "Anxiety, depression, counseling" },
  { value: "gynecologist", label: "Gynecology", icon: "🤰", desc: "Pregnancy, women's health, advice" },
  { value: "dermatologist", label: "Dermatology", icon: "🧴", desc: "Skin issues, acne, rashes, hair" },
  { value: "cardiologist", label: "Cardiology", icon: "❤️", desc: "Heart health, hypertension" },
];

const FAQS = [
  {
    q: "How does the video consultation work?",
    a: "After selecting a doctor and slot, you will receive a secure video consultation link. At the scheduled time, click the link to start. You can talk to your doctor, share reports, and get your prescription in real time.",
  },
  {
    q: "Are the doctors on Wadud certified?",
    a: "Absolutely. 100% of our doctors are verified by medical licensing bodies (PMDC in Pakistan, SCFHS in Saudi Arabia, DOH in UAE) and undergo background checks.",
  },
  {
    q: "Is my medical data secure?",
    a: "Yes. All conversations, chat histories, and video sessions are end-to-end encrypted. We comply with HIPAA and regional data privacy standards to keep your files secure.",
  },
  {
    q: "Can I get a digital prescription?",
    a: "Yes. After the consultation, the doctor will upload a digitally signed prescription to your health portal. You can download it or share it with pharmacies directly.",
  },
];

export default function LandingPage() {
  const [selectedSpec, setSelectedSpec] = useState<Specialization>("general_physician");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredDoctors = MOCK_DOCTORS.filter((d) => d.specialization === selectedSpec).slice(0, 3);

  return (
    <div className="relative overflow-x-hidden min-h-screen">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 -z-10 w-[60%] h-[700px] bg-gradient-to-b from-primary/10 via-secondary/5 to-transparent rounded-full blur-[120px] opacity-70 pointer-events-none" />
      <div className="absolute top-[800px] left-0 -z-10 w-[50%] h-[600px] bg-gradient-to-tr from-accent/5 via-primary/5 to-transparent rounded-full blur-[100px] opacity-50 pointer-events-none" />

      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="page-container grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-xs font-semibold"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Next-Gen Compassionate Telemedicine</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-foreground"
            >
              Expert Healthcare. <br />
              <span className="gradient-text">Loving, Dedicated Care</span> <br />
              From Anywhere.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-xl leading-relaxed"
            >
              Connect with top certified doctors online for high-quality video and chat consultations. Skip the waiting room, manage your medical records, and get prescriptions securely in minutes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link href="/doctors">
                <Button size="lg" className="rounded-xl w-full sm:w-auto h-12 px-8 flex items-center gap-2 font-semibold text-white shadow-glow hover:scale-[1.02] transition-transform">
                  Find a Doctor <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="lg" variant="outline" className="rounded-xl w-full sm:w-auto h-12 px-8 font-semibold border-border hover:bg-muted hover:scale-[1.02] transition-transform">
                  Create Account
                </Button>
              </Link>
            </motion.div>

            {/* Quick trust banner */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-3 gap-4 pt-8 border-t border-border mt-8"
            >
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">100%</p>
                <p className="text-xs text-muted-foreground">Certified Doctors</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">50k+</p>
                <p className="text-xs text-muted-foreground">Consultations Done</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">4.9★</p>
                <p className="text-xs text-muted-foreground">Average Patient Rating</p>
              </div>
            </motion.div>
          </div>

          {/* Hero right - Visual block */}
          <div className="lg:col-span-5 relative flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="w-full max-w-[450px] aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl relative border border-border bg-card p-4"
            >
              {/* Doctor background image */}
              <div className="w-full h-[65%] rounded-2xl overflow-hidden relative bg-muted">
                {/* Visual placeholder using simple styling / svg since no image yet */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-teal-500/20 flex items-center justify-center">
                  <Activity className="h-24 w-24 text-primary/40 animate-pulse" />
                </div>
                <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur border border-border px-3 py-1.5 rounded-full shadow text-xs font-semibold flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-ping" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500 absolute" />
                  <span>35 Doctors Available Now</span>
                </div>
              </div>

              {/* Patient portal dashboard preview card */}
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Your Next Consultation</span>
                  <Badge variant="outline" className="text-2xs font-semibold text-secondary-hover border-secondary/30">Upcoming</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">FM</div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Dr. Fatima Malik</h4>
                    <p className="text-xs text-muted-foreground">Gynecologist &bull; Online Call</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="w-full rounded-lg text-xs h-9 bg-primary text-white">Join Call</Button>
                  <Button size="sm" variant="ghost" className="w-full rounded-lg text-xs h-9 text-muted-foreground border border-border hover:bg-muted">Reschedule</Button>
                </div>
              </div>

              {/* Float badges */}
              <div className="absolute -top-4 -left-4 bg-background border border-border px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 max-w-[200px]">
                <ShieldCheck className="h-5 w-5 text-green-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground">HIPAA Compliant</p>
                  <p className="text-[10px] text-muted-foreground truncate">100% Encrypted</p>
                </div>
              </div>

              <div className="absolute top-[40%] -right-6 bg-background border border-border px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">PK</div>
                <div>
                  <p className="text-xs font-bold text-foreground">Urdu & Arabic</p>
                  <p className="text-[10px] text-muted-foreground">Bilingual Support</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. FEATURES SECTION */}
      <section className="py-20 bg-muted/30 border-y border-border/80">
        <div className="page-container">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Complete Digital Care Environment
            </h2>
            <p className="text-sm text-muted-foreground">
              We design everything around the patient-doctor relationship, ensuring high reliability, ease of access, and deep security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border p-6 rounded-2xl space-y-4 hover:border-primary/20 hover:shadow-card-hover transition-all duration-300">
              <div className="h-10 w-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <Video className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">HD Video Consultations</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Clear, high-quality audio and video connection directly inside the web browser. No external downloads or software setups required.
              </p>
            </div>

            <div className="bg-card border border-border p-6 rounded-2xl space-y-4 hover:border-primary/20 hover:shadow-card-hover transition-all duration-300">
              <div className="h-10 w-10 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Real-Time Secure Messaging</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Chat with your doctors before and after video sessions. Share documents, photo attachments, and report updates securely.
              </p>
            </div>

            <div className="bg-card border border-border p-6 rounded-2xl space-y-4 hover:border-primary/20 hover:shadow-card-hover transition-all duration-300">
              <div className="h-10 w-10 bg-green-500/10 text-green-600 rounded-xl flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">HIPAA Compliant Privacy</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every record, prescription, and communication is secure. Patient records are encrypted and access-controlled according to international standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE SPECIALIZATIONS & DISCOVERY */}
      <section className="py-20">
        <div className="page-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Browse Doctors by Specialization
              </h2>
              <p className="text-sm text-muted-foreground">
                Find certified and experienced consultants across medical specialities.
              </p>
            </div>
            <Link href="/doctors">
              <Button variant="ghost" className="text-primary hover:text-primary-hover flex items-center gap-1.5">
                View All 20+ Doctors <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Grid of Spec buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {SPECIALIZATIONS.map((spec) => (
              <button
                key={spec.value}
                onClick={() => setSelectedSpec(spec.value)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all duration-200 hover:scale-[1.02] cursor-pointer ${
                  selectedSpec === spec.value
                    ? "bg-primary/10 border-primary text-primary shadow-sm"
                    : "bg-card border-border hover:border-primary/20"
                }`}
              >
                <span className="text-3xl mb-2">{spec.icon}</span>
                <span className="text-sm font-semibold text-foreground">{spec.label}</span>
                <span className="text-[10px] text-muted-foreground mt-1 line-clamp-1">{spec.desc}</span>
              </button>
            ))}
          </div>

          {/* Interactive filter display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doc, idx) => (
                <DoctorCard key={doc.id} doctor={doc} index={idx} />
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-muted-foreground">
                No doctors currently listed under this specialization. Try another category or browse all.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="py-20 bg-muted/50 border-t border-border">
        <div className="page-container">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              How Wadud Works
            </h2>
            <p className="text-sm text-muted-foreground">
              Getting expert treatment online has never been easier. We simplify the entire healthcare experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-0.5 bg-border -z-10" />

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-primary text-white font-bold flex items-center justify-center shadow-glow text-lg">
                1
              </div>
              <h3 className="text-lg font-bold text-foreground">Find a Consultant</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                Search by symptoms, specialization, language, or region. Review verified ratings and available slots.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-secondary text-white font-bold flex items-center justify-center shadow-glow text-lg">
                2
              </div>
              <h3 className="text-lg font-bold text-foreground">Schedule & Consult</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                Book a slot and connect instantly over our encrypted in-app video chat. Upload reports for the doctor to review.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-accent text-white font-bold flex items-center justify-center shadow-glow text-lg">
                3
              </div>
              <h3 className="text-lg font-bold text-foreground">Get Prescription & Care</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                Download your digitally signed prescription, order pharmacy delivery, and book follow-ups when needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRICING SECTION */}
      <section className="py-20">
        <div className="page-container">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Transparent, Flexible Pricing
            </h2>
            <p className="text-sm text-muted-foreground">
              Choose the access mode that fits you best. Pay per consultation or select an ongoing family health plan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Pay per consult */}
            <div className="bg-card border border-border p-8 rounded-2xl flex flex-col justify-between hover:border-primary/30 transition-all duration-300">
              <div>
                <h3 className="text-lg font-bold text-foreground">Pay-Per-Consult</h3>
                <p className="text-xs text-muted-foreground mt-1">Best for one-off consultations</p>
                <div className="my-6">
                  <span className="text-3xl font-extrabold text-foreground">Standard Fee</span>
                  <p className="text-xs text-muted-foreground mt-1">Varies by Doctor (from $10 / PKR 2,000)</p>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground pt-4 border-t border-border">
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary shrink-0" />
                    Consultation duration up to 30 mins
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary shrink-0" />
                    Secure post-consult chat for 48h
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary shrink-0" />
                    Digital Prescriptions & Records
                  </li>
                </ul>
              </div>
              <Link href="/doctors" className="mt-8">
                <Button variant="outline" className="w-full rounded-xl">Browse Doctors</Button>
              </Link>
            </div>

            {/* Standard Package */}
            <div className="bg-card border-2 border-primary p-8 rounded-2xl flex flex-col justify-between relative shadow-lg hover:shadow-card-hover transition-all duration-300">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-white text-2xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Individual Premium</h3>
                <p className="text-xs text-muted-foreground mt-1">All-inclusive primary care subscription</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-foreground">$15</span>
                  <span className="text-muted-foreground"> / month</span>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground pt-4 border-t border-border">
                  <li className="flex items-center gap-2 font-medium text-foreground">
                    <Heart className="h-4 w-4 text-primary shrink-0 fill-primary" />
                    3 Free GP consultations / month
                  </li>
                  <li className="flex items-center gap-2 font-medium text-foreground">
                    <Heart className="h-4 w-4 text-primary shrink-0 fill-primary" />
                    20% off all specialist bookings
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary shrink-0" />
                    24/7 Priority Emergency GP Chat
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary shrink-0" />
                    Free prescription delivery support
                  </li>
                </ul>
              </div>
              <Link href="/signup" className="mt-8">
                <Button className="w-full rounded-xl text-white shadow-glow">Get Started</Button>
              </Link>
            </div>

            {/* Family Plan */}
            <div className="bg-card border border-border p-8 rounded-2xl flex flex-col justify-between hover:border-primary/30 transition-all duration-300">
              <div>
                <h3 className="text-lg font-bold text-foreground">Family Health</h3>
                <p className="text-xs text-muted-foreground mt-1">Care coverage for up to 4 members</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-foreground">$29</span>
                  <span className="text-muted-foreground"> / month</span>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground pt-4 border-t border-border">
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary shrink-0" />
                    8 Free GP consultations / month
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary shrink-0" />
                    20% off Specialist consultations
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary shrink-0" />
                    Shared health records portal
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary shrink-0" />
                    Personal family care coordinator
                  </li>
                </ul>
              </div>
              <Link href="/signup" className="mt-8">
                <Button variant="outline" className="w-full rounded-xl">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="py-20 bg-muted/30 border-y border-border">
        <div className="page-container max-w-4xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-muted-foreground">
              Have questions? We have answers. Find everything you need to know about Wadud.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-card border border-border rounded-xl overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-[300px] border-t border-border opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                    }`}
                  >
                    <p className="p-5 text-sm text-muted-foreground leading-relaxed bg-muted/10">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. CTA BANNER SECTION */}
      <section className="py-20 relative">
        <div className="page-container">
          <div className="relative rounded-[32px] overflow-hidden bg-primary px-8 py-12 md:py-20 text-center text-white shadow-2xl">
            {/* Pattern/Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-800/80 to-primary/40 -z-10" />
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                Ready to Meet Your Doctor?
              </h2>
              <p className="text-base text-teal-100 leading-relaxed max-w-lg mx-auto">
                Sign up today to create your secure health profile, book consultations, and consult from the comfort of your home.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <Link href="/signup">
                  <Button size="lg" className="bg-white text-primary hover:bg-teal-50 font-semibold px-8 h-12 rounded-xl w-full sm:w-auto shadow-lg">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/doctors">
                  <Button size="lg" variant="ghost" className="text-white border border-teal-400/50 hover:bg-white/10 font-semibold px-8 h-12 rounded-xl w-full sm:w-auto">
                    View Doctor Listing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
