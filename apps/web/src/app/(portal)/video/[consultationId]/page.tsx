"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Video, VideoOff, Mic, MicOff, PhoneOff, AlertTriangle, MonitorUp, MessageSquare, Star, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import { MOCK_CONSULTATIONS } from "@wadud/mocks/consultations";
import { MOCK_DOCTORS } from "@wadud/mocks";
import { toast } from "sonner";

export default function VideoCallPage({ params }: { params: Promise<{ consultationId: string }> }) {
  const router = useRouter();
  const { consultationId } = React.use(params);

  // States
  const [inCall, setInCall] = useState(false);
  const [micActive, setMicActive] = useState(true);
  const [camActive, setCamActive] = useState(true);
  const [screenShared, setScreenShared] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);

  // Review states
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const consultation = MOCK_CONSULTATIONS.find((c) => c.id === consultationId) || MOCK_CONSULTATIONS[0];
  const doctor = MOCK_DOCTORS.find((d) => d.id === consultation.doctorId) || MOCK_DOCTORS[1];
  const doctorName = `Dr. ${doctor.firstName} ${doctor.lastName}`;

  const toggleMic = () => {
    setMicActive(!micActive);
    toast.info(micActive ? "Microphone Muted" : "Microphone Active");
  };

  const toggleCam = () => {
    setCamActive(!camActive);
    toast.info(camActive ? "Camera Off" : "Camera On");
  };

  const handleShare = () => {
    setScreenShared(!screenShared);
    toast.success(screenShared ? "Screenshare Stopped" : "Screenshare Started");
  };

  const handleEndCall = () => {
    setInCall(false);
    setReviewMode(true);
  };

  const submitReview = () => {
    toast.success("Feedback Submitted", {
      description: "Thank you for rating your consultation with Wadud.",
    });
    router.push("/dashboard");
  };

  // 1. REVIEW SCENARIO (Post Call feedback)
  if (reviewMode) {
    return (
      <div className="page-container py-12 flex items-center justify-center">
        <div className="bg-card border border-border rounded-3xl p-8 max-w-md w-full shadow-sm text-center space-y-6">
          <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
            <Smile className="h-8 w-8 text-primary" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-foreground tracking-tight">How was your session?</h2>
            <p className="text-xs text-muted-foreground">
              Your feedback helps us maintain the highest telemedicine standard for Dr. {doctor.lastName}.
            </p>
          </div>

          {/* Rating controller */}
          <div className="flex justify-center py-2">
            <StarRating rating={rating} size="lg" interactive onChange={(r) => setRating(r)} />
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-muted-foreground">Your Review & Comments</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={4}
              className="w-full bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-3 text-sm resize-none focus:outline-none transition-all"
              placeholder="What went well? Describe your experience..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={() => router.push("/dashboard")}
              variant="ghost"
              className="flex-1 rounded-xl border border-border"
            >
              Skip
            </Button>
            <Button onClick={submitReview} className="flex-1 rounded-xl text-white shadow-glow">
              Submit Review
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 2. PRE-CALL LOBBY SCENARIO
  if (!inCall) {
    return (
      <div className="page-container py-12 flex items-center justify-center">
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
              Consultation Lobby
            </span>
            <h2 className="text-2xl font-extrabold text-foreground tracking-tight pt-1">
              Ready to Join call?
            </h2>
            <p className="text-xs text-muted-foreground">
              You are scheduled to consult with <span className="font-semibold text-foreground">{doctorName}</span>.
            </p>
          </div>

          {/* Camera preview block */}
          <div className="relative aspect-video rounded-2xl bg-muted border border-border overflow-hidden flex items-center justify-center shadow-inner">
            {camActive ? (
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-teal-500/10 flex items-center justify-center">
                {/* Audio waves mock */}
                <div className="flex gap-1 items-end h-8">
                  <div className="w-1.5 bg-primary rounded-full animate-bounce h-6" />
                  <div className="w-1.5 bg-primary rounded-full animate-bounce h-8" />
                  <div className="w-1.5 bg-primary rounded-full animate-bounce h-4" />
                </div>
              </div>
            ) : (
              <div className="text-center text-xs text-muted-foreground space-y-2">
                <VideoOff className="h-10 w-10 mx-auto text-muted-foreground/40" />
                <p>Your camera stream is disabled</p>
              </div>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
              <Button
                onClick={toggleMic}
                variant={micActive ? "outline" : "destructive"}
                className="h-10 w-10 p-0 rounded-full bg-background border border-border hover:bg-muted"
                aria-label="Toggle microphone"
              >
                {micActive ? <Mic className="h-4.5 w-4.5 text-foreground" /> : <MicOff className="h-4.5 w-4.5" />}
              </Button>
              <Button
                onClick={toggleCam}
                variant={camActive ? "outline" : "destructive"}
                className="h-10 w-10 p-0 rounded-full bg-background border border-border hover:bg-muted"
                aria-label="Toggle camera"
              >
                {camActive ? <Video className="h-4.5 w-4.5 text-foreground" /> : <VideoOff className="h-4.5 w-4.5" />}
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => setInCall(true)}
              className="w-full rounded-xl text-white shadow-glow h-11 font-semibold flex items-center justify-center gap-1.5"
            >
              Enter Consultation Room
            </Button>
            <Link href="/dashboard" className="text-center text-xs font-semibold text-muted-foreground hover:text-primary py-1">
              Cancel & Return
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. ACTIVE CONSULTATION SCREEN
  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col justify-between p-4 sm:p-6 overflow-hidden">
      {/* Top Banner details */}
      <header className="flex justify-between items-center bg-black/40 backdrop-blur rounded-2xl p-4 border border-white/5">
        <div className="text-left">
          <p className="text-[10px] text-teal-300 font-bold uppercase tracking-wider">Active Video Consultation</p>
          <h3 className="text-xs font-bold">{doctorName}</h3>
        </div>
        <div className="flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full text-[10px] font-bold">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-ping" />
          <span>CONNECTED &bull; SECURE</span>
        </div>
      </header>

      {/* Main double stream viewport */}
      <main className="flex-1 my-6 relative rounded-3xl overflow-hidden bg-neutral-950 flex items-center justify-center border border-white/5 shadow-2xl">
        {/* Large container: Doctor stream */}
        <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center">
          <div className="text-center space-y-4">
            {/* Animated camera indicator */}
            <div className="h-20 w-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto ring-4 ring-primary/10">
              <Video className="h-10 w-10 text-primary animate-pulse" />
            </div>
            <p className="text-sm font-semibold text-neutral-300">{doctorName}</p>
          </div>
        </div>

        {/* Small floating container: Patient stream */}
        <div className="absolute bottom-6 right-6 w-36 sm:w-48 aspect-video rounded-xl bg-black border border-white/10 overflow-hidden shadow-2xl">
          {camActive ? (
            <div className="w-full h-full bg-neutral-800/80 flex items-center justify-center">
              <div className="flex gap-0.5 items-end h-4">
                <div className="w-1 bg-teal-400 rounded-full animate-bounce h-3" />
                <div className="w-1 bg-teal-400 rounded-full animate-bounce h-4" />
                <div className="w-1 bg-teal-400 rounded-full animate-bounce h-2" />
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-neutral-900 text-[10px] text-neutral-500">
              Camera Disabled
            </div>
          )}
        </div>
      </main>

      {/* Call controls toolbar */}
      <footer className="flex justify-center items-center bg-black/40 backdrop-blur rounded-2xl p-4 border border-white/5 gap-4">
        {/* Toggle Audio */}
        <Button
          onClick={toggleMic}
          variant={micActive ? "ghost" : "destructive"}
          className={`h-11 w-11 p-0 rounded-full border border-white/10 ${
            micActive ? "bg-white/5 hover:bg-white/15 text-white" : ""
          }`}
          aria-label="Toggle microphone"
        >
          {micActive ? <Mic className="h-4.5 w-4.5" /> : <MicOff className="h-4.5 w-4.5" />}
        </Button>

        {/* Toggle Video */}
        <Button
          onClick={toggleCam}
          variant={camActive ? "ghost" : "destructive"}
          className={`h-11 w-11 p-0 rounded-full border border-white/10 ${
            camActive ? "bg-white/5 hover:bg-white/15 text-white" : ""
          }`}
          aria-label="Toggle camera"
        >
          {camActive ? <Video className="h-4.5 w-4.5" /> : <VideoOff className="h-4.5 w-4.5" />}
        </Button>

        {/* Screenshare */}
        <Button
          onClick={handleShare}
          variant={screenShared ? "ghost" : "ghost"}
          className={`h-11 w-11 p-0 rounded-full border border-white/10 ${
            screenShared ? "bg-primary text-white hover:bg-primary/95" : "bg-white/5 hover:bg-white/15 text-white"
          }`}
          aria-label="Toggle screenshare"
        >
          <MonitorUp className="h-4.5 w-4.5" />
        </Button>

        {/* End Call */}
        <Button
          onClick={handleEndCall}
          variant="destructive"
          className="h-11 px-6 rounded-full font-bold flex items-center gap-1.5 shadow-lg bg-red-600 hover:bg-red-700 hover:scale-[1.02] transition-transform"
        >
          <PhoneOff className="h-4.5 w-4.5" /> End consultation
        </Button>
      </footer>
    </div>
  );
}
