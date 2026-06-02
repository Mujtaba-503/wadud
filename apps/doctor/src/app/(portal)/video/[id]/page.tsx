"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  PhoneOff,
  MessageSquare,
  ScreenShare,
  Settings,
  Maximize2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getInitials } from "@/lib/utils";
import { getConsultationById } from "@/lib/doctor-data";
import { CURRENT_DOCTOR } from "@/stores/auth.store";

export default function VideoConsultationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const consultation = getConsultationById(id);
  const patient = consultation?.patient;

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const mmss = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-slate-950">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm font-semibold">Live · {mmss}</span>
        </div>
        <p className="text-sm text-white/70">
          {patient ? `${patient.firstName} ${patient.lastName}` : "Consultation"}
        </p>
        <Button variant="ghost" size="icon-sm" className="text-white hover:bg-white/10" aria-label="Fullscreen">
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Stage */}
      <div className="relative flex-1 overflow-hidden">
        {/* Remote (patient) */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
          {patient ? (
            <div className="text-center">
              <Avatar className="mx-auto h-28 w-28 ring-4 ring-white/10">
                <AvatarImage src={patient.avatar} alt="" />
                <AvatarFallback className="text-3xl">{getInitials(patient.firstName, patient.lastName)}</AvatarFallback>
              </Avatar>
              <p className="mt-4 text-lg font-semibold text-white">
                {patient.firstName} {patient.lastName}
              </p>
              <p className="text-sm text-white/60">Camera is off</p>
            </div>
          ) : (
            <p className="text-white/60">Waiting for participant…</p>
          )}
        </div>

        {/* Local (doctor) PiP */}
        <div className="absolute bottom-4 right-4 h-40 w-32 overflow-hidden rounded-2xl border border-white/15 bg-slate-800 shadow-xl sm:h-48 sm:w-40">
          <div className="flex h-full items-center justify-center">
            {camOn ? (
              <div className="text-center">
                <Avatar className="mx-auto h-14 w-14">
                  <AvatarImage src={CURRENT_DOCTOR.avatar} alt="" />
                  <AvatarFallback>{getInitials(CURRENT_DOCTOR.firstName, CURRENT_DOCTOR.lastName)}</AvatarFallback>
                </Avatar>
                <p className="mt-1.5 text-[11px] text-white/70">You</p>
              </div>
            ) : (
              <VideoOff className="h-7 w-7 text-white/50" />
            )}
          </div>
        </div>

        {/* Side chat */}
        {showChat && (
          <div className="absolute right-0 top-0 bottom-0 w-80 border-l border-white/10 bg-slate-900/95 p-4 backdrop-blur">
            <p className="mb-3 font-semibold text-white">In-call messages</p>
            <p className="text-sm text-white/50">Messages shared during the call appear here.</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 bg-slate-950 px-4 py-5 sm:gap-3">
        <ControlButton active={micOn} onClick={() => setMicOn((v) => !v)} label={micOn ? "Mute" : "Unmute"}>
          {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </ControlButton>
        <ControlButton active={camOn} onClick={() => setCamOn((v) => !v)} label={camOn ? "Stop video" : "Start video"}>
          {camOn ? <VideoIcon className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </ControlButton>
        <ControlButton active onClick={() => {}} label="Share screen">
          <ScreenShare className="h-5 w-5" />
        </ControlButton>
        <ControlButton active={showChat} onClick={() => setShowChat((v) => !v)} label="Chat">
          <MessageSquare className="h-5 w-5" />
        </ControlButton>
        <ControlButton active onClick={() => router.push(`/notes/${id}`)} label="Notes">
          <FileText className="h-5 w-5" />
        </ControlButton>
        <ControlButton active onClick={() => {}} label="Settings">
          <Settings className="h-5 w-5" />
        </ControlButton>
        <button
          onClick={() => router.push("/queue")}
          className="ml-2 flex h-12 items-center gap-2 rounded-full bg-red-600 px-6 font-semibold text-white hover:bg-red-700 transition-colors"
        >
          <PhoneOff className="h-5 w-5" /> End
        </button>
      </div>
    </div>
  );
}

function ControlButton({
  children,
  active,
  onClick,
  label,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
        active ? "bg-white/10 text-white hover:bg-white/20" : "bg-white text-slate-900 hover:bg-white/90"
      )}
    >
      {children}
    </button>
  );
}
