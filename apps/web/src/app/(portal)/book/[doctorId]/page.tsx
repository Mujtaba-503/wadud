"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, Calendar, Video, MessageSquare, ShieldCheck, CreditCard, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { getDoctorById } from "@wadud/mocks/doctors";
import { formatCurrency, getSpecializationLabel } from "@/lib/utils";
import { toast } from "sonner";

const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
];

const STEPS = [
  { label: "Slot Selection" },
  { label: "Channel" },
  { label: "Symptoms" },
  { label: "Payment" },
  { label: "Confirmed" },
];

export default function BookingWizardPage({ params }: { params: Promise<{ doctorId: string }> }) {
  const router = useRouter();
  const { doctorId } = React.use(params);
  const doctor = getDoctorById(doctorId);

  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("2026-06-03");
  const [selectedTime, setSelectedTime] = useState("");
  const [channel, setChannel] = useState<"video" | "chat">("video");
  const [symptoms, setSymptoms] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  if (!doctor) {
    return (
      <div className="page-container py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-foreground">Doctor profile not found</h2>
        <p className="text-sm text-muted-foreground">The consultant profile you are trying to book does not exist.</p>
        <Link href="/doctors">
          <Button size="sm">Back to Discovery</Button>
        </Link>
      </div>
    );
  }

  const initials = `${doctor.firstName[0]}${doctor.lastName[0]}`;

  const nextStep = () => {
    if (step === 1 && !selectedTime) {
      toast.error("Please pick a time slot to continue.");
      return;
    }
    if (step === 3 && symptoms.length < 5) {
      toast.error("Please write a brief summary of symptoms (min 5 characters).");
      return;
    }
    if (step === 4) {
      // Simulate booking confirmation
      toast.success("Consultation Booked Successfully!", {
        description: "Your session has been recorded in the schedule.",
      });
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="page-container py-8 max-w-4xl space-y-8">
      {/* Back button */}
      {step < 5 && (
        <button
          onClick={() => (step === 1 ? router.push(`/doctors/${doctor.id}`) : prevStep())}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> {step === 1 ? "Back to Doctor Profile" : "Back to Previous Step"}
        </button>
      )}

      {/* Booking Header & Stepper Progress */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-foreground">Book Appointment</h1>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Step {step} of 5
          </span>
        </div>

        {/* Horizontal Progress */}
        <div className="flex items-center gap-2">
          {STEPS.map((s, idx) => {
            const active = idx + 1 <= step;
            return (
              <React.Fragment key={idx}>
                <div
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    active ? "bg-primary" : "bg-border"
                  }`}
                />
                {idx < STEPS.length - 1 && <div className="h-0.5 w-2 bg-border" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Wizard Form Card */}
        <div className="lg:col-span-8 bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          {/* STEP 1: Date & Time Picker */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2 text-left">
                <h3 className="font-bold text-foreground text-sm uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="h-4.5 w-4.5 text-primary" /> 1. Select Date
                </h3>
                <input
                  type="date"
                  value={selectedDate}
                  min="2026-06-02"
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-3 text-sm h-11 focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-3 text-left">
                <h3 className="font-bold text-foreground text-sm uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="h-4.5 w-4.5 text-primary" /> 2. Pick Available Slot
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`py-2 px-3 rounded-lg border text-center font-semibold text-xs transition-all duration-150 cursor-pointer hover:border-primary/40 ${
                        selectedTime === slot
                          ? "bg-primary text-white border-primary shadow-glow"
                          : "bg-background border-border text-muted-foreground"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Channel Preference */}
          {step === 2 && (
            <div className="space-y-4 text-left">
              <h3 className="font-bold text-foreground text-sm uppercase tracking-wider">
                Choose Consultation Channel
              </h3>
              <p className="text-xs text-muted-foreground leading-normal mb-4">
                Select how you want to conduct this consultation session.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setChannel("video")}
                  className={`flex flex-col items-center p-6 border rounded-xl cursor-pointer text-center space-y-3 transition-all duration-200 ${
                    channel === "video"
                      ? "bg-primary/5 border-primary shadow-sm"
                      : "bg-background border-border hover:border-primary/20"
                  }`}
                >
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                    channel === "video" ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                  }`}>
                    <Video className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">Video Session</h4>
                    <p className="text-2xs text-muted-foreground mt-1">Conduct interactive audio/video consulting</p>
                  </div>
                </button>

                <button
                  onClick={() => setChannel("chat")}
                  className={`flex flex-col items-center p-6 border rounded-xl cursor-pointer text-center space-y-3 transition-all duration-200 ${
                    channel === "chat"
                      ? "bg-primary/5 border-primary shadow-sm"
                      : "bg-background border-border hover:border-primary/20"
                  }`}
                >
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                    channel === "chat" ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                  }`}>
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">Text Chat Session</h4>
                    <p className="text-2xs text-muted-foreground mt-1">Communicate via secure text and attachments</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Symptoms Description */}
          {step === 3 && (
            <div className="space-y-4 text-left">
              <h3 className="font-bold text-foreground text-sm uppercase tracking-wider">
                Describe Symptoms
              </h3>
              <p className="text-xs text-muted-foreground leading-normal">
                Briefly describe what you are experiencing to help your consultant prepare.
              </p>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={5}
                className="w-full bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-3 text-sm resize-none focus:outline-none transition-all"
                placeholder="E.g., Mild fever since last night, congestion, fatigue..."
              />
              <p className="text-2xs text-muted-foreground text-right">
                {symptoms.length} chars (minimum 5)
              </p>
            </div>
          )}

          {/* STEP 4: Payment Panel */}
          {step === 4 && (
            <div className="space-y-6 text-left">
              <div className="flex items-center gap-2 bg-green-500/10 border border-green-200 text-green-700 p-4 rounded-xl">
                <ShieldCheck className="h-5 w-5 shrink-0" />
                <span className="text-xs font-semibold">
                  Secure checkout processed using mock sandbox gateway. Your details are safe.
                </span>
              </div>

              <div className="space-y-4">
                <Input
                  label="Name on Credit Card"
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  leftIcon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
                />
                <Input
                  label="Credit Card Number"
                  placeholder="4000 1234 5678 9010"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  leftIcon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
                  maxLength={19}
                />
              </div>
            </div>
          )}

          {/* STEP 5: Success confirmed */}
          {step === 5 && (
            <div className="text-center space-y-6 py-6">
              <div className="flex justify-center">
                <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center animate-bounce">
                  <Sparkles className="h-8 w-8" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
                  Consultation Confirmed!
                </h2>
                <p className="text-sm text-muted-foreground leading-normal max-w-sm mx-auto">
                  Thank you for booking. Your appointment with <span className="font-bold text-foreground">Dr. {doctor.firstName} {doctor.lastName}</span> is locked.
                </p>
              </div>

              {/* Confirm details card */}
              <div className="bg-muted/40 border border-border p-5 rounded-xl max-w-md mx-auto text-left text-xs space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Consultant:</span>
                  <span className="font-bold text-foreground">Dr. {doctor.firstName} {doctor.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-bold text-foreground">{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time Slot:</span>
                  <span className="font-bold text-foreground">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Consultation Mode:</span>
                  <span className="font-bold text-foreground capitalize">{channel} call</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/dashboard">
                  <Button className="w-full sm:w-auto rounded-xl text-white shadow-glow px-6">
                    Back to Dashboard
                  </Button>
                </Link>
                <Link href="/consultations">
                  <Button variant="outline" className="w-full sm:w-auto rounded-xl border border-border px-6">
                    View My Consultations
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Stepper Navigation CTAs */}
          {step < 5 && (
            <div className="pt-6 border-t border-border flex justify-end">
              <Button
                onClick={nextStep}
                className="rounded-xl text-white shadow-glow h-11 font-semibold px-6"
              >
                {step === 4 ? "Complete Payment" : "Continue"}
              </Button>
            </div>
          )}
        </div>

        {/* Right: Summary Sidebar (Visible during booking wizard steps 1-4) */}
        {step < 5 && (
          <aside className="lg:col-span-4 bg-card border border-border rounded-2xl p-5 space-y-4 shadow-sm text-left">
            <h3 className="font-bold text-foreground text-xs uppercase tracking-wider pb-2 border-b border-border">
              Booking Summary
            </h3>

            {/* Doctor info */}
            <div className="flex items-center gap-3 py-2">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={doctor.avatar} />
                <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h4 className="font-bold text-foreground text-xs truncate">
                  Dr. {doctor.firstName} {doctor.lastName}
                </h4>
                <p className="text-[10px] text-primary font-medium truncate">
                  {getSpecializationLabel(doctor.specialization)}
                </p>
              </div>
            </div>

            {/* Checkout parameters list */}
            <div className="space-y-2.5 text-2xs border-t border-border pt-4 text-muted-foreground">
              <div className="flex justify-between">
                <span>Selected Date:</span>
                <span className="font-bold text-foreground">{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Time Slot:</span>
                <span className="font-bold text-foreground">{selectedTime || "Not Selected"}</span>
              </div>
              <div className="flex justify-between">
                <span>Consultation Mode:</span>
                <span className="font-bold text-foreground capitalize">{channel} call</span>
              </div>
              <div className="flex justify-between border-t border-border pt-4 text-xs font-bold text-foreground">
                <span>Total Fee:</span>
                <span>{formatCurrency(doctor.consultationFee, doctor.currency)}</span>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
