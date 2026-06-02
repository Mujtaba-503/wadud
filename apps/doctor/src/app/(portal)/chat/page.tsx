"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Send, Paperclip, Phone, Video, MoreVertical, Circle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getInitials } from "@/lib/utils";
import { DOCTOR_PATIENTS } from "@/lib/doctor-data";

interface ChatMsg {
  id: string;
  fromMe: boolean;
  text: string;
  time: string;
}

const SEED: Record<string, ChatMsg[]> = {};
DOCTOR_PATIENTS.forEach((p, i) => {
  SEED[p.id] = [
    { id: `${p.id}-1`, fromMe: false, text: "Hello doctor, I've been having a persistent headache for 3 days.", time: "09:12" },
    { id: `${p.id}-2`, fromMe: true, text: "I'm sorry to hear that. Is it accompanied by fever or nausea?", time: "09:14" },
    { id: `${p.id}-3`, fromMe: false, text: i % 2 === 0 ? "A mild fever, yes." : "No fever, just the headache.", time: "09:15" },
  ];
});

export default function DoctorChatPage() {
  const [activeId, setActiveId] = useState(DOCTOR_PATIENTS[0].id);
  const [threads, setThreads] = useState<Record<string, ChatMsg[]>>(SEED);
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const active = DOCTOR_PATIENTS.find((p) => p.id === activeId)!;
  const messages = threads[activeId] ?? [];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, activeId]);

  const send = () => {
    if (!draft.trim()) return;
    const msg: ChatMsg = {
      id: `${activeId}-${Date.now()}`,
      fromMe: true,
      text: draft.trim(),
      time: new Date().toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" }),
    };
    setThreads((prev) => ({ ...prev, [activeId]: [...(prev[activeId] ?? []), msg] }));
    setDraft("");
  };

  const list = DOCTOR_PATIENTS.filter((p) =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Conversation list */}
      <aside className="hidden w-80 shrink-0 flex-col border-r border-border bg-card md:flex">
        <div className="border-b border-border p-4">
          <h2 className="mb-3 text-lg font-bold text-foreground">Messages</h2>
          <Input
            placeholder="Search conversations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {list.map((p, i) => {
            const last = (threads[p.id] ?? []).at(-1);
            return (
              <button
                key={p.id}
                onClick={() => setActiveId(p.id)}
                className={cn(
                  "flex w-full items-center gap-3 border-b border-border/60 px-4 py-3 text-left transition-colors hover:bg-muted",
                  activeId === p.id && "bg-primary/5"
                )}
              >
                <div className="relative">
                  <Avatar className="h-11 w-11">
                    <AvatarImage src={p.avatar} alt="" />
                    <AvatarFallback>{getInitials(p.firstName, p.lastName)}</AvatarFallback>
                  </Avatar>
                  {i % 2 === 0 && (
                    <Circle className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 fill-accent text-accent" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="truncate font-semibold text-foreground">
                      {p.firstName} {p.lastName}
                    </p>
                    <span className="text-[11px] text-muted-foreground">{last?.time}</span>
                  </div>
                  <p className="truncate text-sm text-muted-foreground">{last?.text}</p>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Chat window */}
      <section className="flex flex-1 flex-col bg-background">
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={active.avatar} alt="" />
              <AvatarFallback>{getInitials(active.firstName, active.lastName)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">
                {active.firstName} {active.lastName}
              </p>
              <p className="flex items-center gap-1 text-xs text-accent">
                <Circle className="h-2 w-2 fill-accent" /> Online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" aria-label="Voice call"><Phone className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon-sm" aria-label="Video call"><Video className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon-sm" aria-label="More options"><MoreVertical className="h-4 w-4" /></Button>
          </div>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((m) => (
            <div key={m.id} className={cn("flex", m.fromMe ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                  m.fromMe
                    ? "rounded-br-md bg-primary text-white"
                    : "rounded-bl-md bg-card border border-border text-foreground"
                )}
              >
                <p>{m.text}</p>
                <p className={cn("mt-1 text-[10px]", m.fromMe ? "text-white/70" : "text-muted-foreground")}>{m.time}</p>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <footer className="border-t border-border bg-card p-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-center gap-2"
          >
            <Button type="button" variant="ghost" size="icon" aria-label="Attach file">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type a message…"
              className="flex-1"
            />
            <Button type="submit" size="icon" aria-label="Send message" disabled={!draft.trim()}>
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </footer>
      </section>
    </div>
  );
}
