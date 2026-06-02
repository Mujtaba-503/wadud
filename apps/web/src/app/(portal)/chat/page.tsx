"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Send, Paperclip, Shield, Image, FileText, CheckCheck, Video, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from "@wadud/mocks/messages";
import { MOCK_DOCTORS } from "@wadud/mocks";
import type { Message, Conversation } from "@wadud/types";
import { toast } from "sonner";

export default function PatientChatPage() {
  const [activeConvId, setActiveConvId] = useState<string | null>("conv-0001");
  const [inputVal, setInputVal] = useState("");
  
  // Local state for mutable messages to support simulated chat messaging
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(MOCK_MESSAGES);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to chat bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConvId, messagesMap]);

  const activeConv = conversations.find((c) => c.id === activeConvId);
  // Doctor participant
  const doctorParticipant = activeConv?.participants.find((p) => p.role === "doctor");
  const activeMessages = activeConvId ? messagesMap[activeConvId] || [] : [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || !activeConvId) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId: activeConvId,
      senderId: "patient-id", // mock patient
      senderRole: "patient",
      type: "text",
      content: inputVal,
      status: "sent",
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update local messages map
    setMessagesMap((prev) => ({
      ...prev,
      [activeConvId]: [...(prev[activeConvId] || []), newMsg],
    }));

    setInputVal("");

    // Simulate doctor reply typing indicator
    setTimeout(() => {
      if (!doctorParticipant) return;
      const replyMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        conversationId: activeConvId,
        senderId: doctorParticipant.userId,
        senderRole: "doctor",
        type: "text",
        content: `Thank you for details. This is an automated response simulation. We will coordinate your records properly.`,
        status: "delivered",
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setMessagesMap((prev) => ({
        ...prev,
        [activeConvId]: [...(prev[activeConvId] || []), replyMsg],
      }));
    }, 2000);
  };

  const handleAttach = () => {
    toast.info("Attachment Selected", {
      description: "Mock report attachment uploaded successfully to chat state.",
    });
  };

  return (
    <div className="page-container py-8">
      {/* Container */}
      <div className="bg-card border border-border rounded-3xl h-[650px] overflow-hidden grid grid-cols-1 md:grid-cols-12 shadow-sm">
        {/* LEFT COLUMN: Conversation thread list */}
        <aside className="md:col-span-4 border-r border-border flex flex-col h-full bg-muted/10">
          <div className="p-4 border-b border-border text-left">
            <h2 className="font-bold text-foreground text-sm uppercase tracking-wider">
              Active Conversations
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {conversations.map((conv) => {
              const doc = conv.participants.find((p) => p.role === "doctor");
              if (!doc) return null;
              const isSelected = conv.id === activeConvId;
              const threadMsgs = messagesMap[conv.id] || [];
              const lastMsg = threadMsgs[threadMsgs.length - 1];

              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`w-full p-4 flex gap-3 text-left cursor-pointer transition-colors ${
                    isSelected ? "bg-primary/5" : "bg-transparent hover:bg-muted/50"
                  }`}
                >
                  <div className="relative shrink-0">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={doc.avatar} />
                      <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                        DR
                      </AvatarFallback>
                    </Avatar>
                    {doc.isOnline && (
                      <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-card" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-bold text-foreground text-xs truncate">{doc.name}</h4>
                      {lastMsg && (
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {new Date(lastMsg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                      {lastMsg?.type === "system" ? lastMsg.content : lastMsg?.content || "Start conversation"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* RIGHT COLUMN: Active Chat details thread */}
        <div className="md:col-span-8 flex flex-col h-full justify-between bg-card">
          {activeConv && doctorParticipant ? (
            <>
              {/* Chat header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3 text-left">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={doctorParticipant.avatar} />
                    <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                      DR
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-foreground text-xs leading-none">
                      {doctorParticipant.name}
                    </h3>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                      <Circle className={`h-2.5 w-2.5 fill-current ${
                        doctorParticipant.isOnline ? "text-green-500" : "text-muted-foreground/30"
                      }`} />
                      {doctorParticipant.isOnline ? "Active now" : "Offline"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/video/mock-booking`}>
                    <Button size="sm" variant="ghost" className="rounded-lg h-9 w-9 p-0 hover:bg-muted text-primary" aria-label="Start video consultation">
                      <Video className="h-4.5 w-4.5" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Chat body scroll thread */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-muted/5 flex flex-col">
                {activeMessages.map((msg) => {
                  const isDoctor = msg.senderRole === "doctor";
                  const isSystem = msg.type === "system";

                  if (isSystem) {
                    return (
                      <div key={msg.id} className="self-center bg-muted border border-border px-3 py-1 rounded-full text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {msg.content}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[70%] space-y-1 ${
                        isDoctor ? "self-start items-start" : "self-end items-end"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-2xl text-xs text-left leading-relaxed shadow-2xs ${
                          isDoctor
                            ? "bg-card border border-border text-foreground rounded-tl-xs"
                            : "bg-primary text-white rounded-tr-xs"
                        }`}
                      >
                        {msg.type === "document" && msg.attachment ? (
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            <div className="text-left">
                              <p className="font-bold">{msg.attachment.name}</p>
                              <span className="text-[10px] opacity-80">
                                {(msg.attachment.size / 1000).toFixed(0)} KB &bull; PDF
                              </span>
                            </div>
                          </div>
                        ) : (
                          msg.content
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground px-1">
                        <span>
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {!isDoctor && <CheckCheck className="h-3 w-3 text-primary shrink-0" />}
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Message input bar */}
              <form onSubmit={handleSend} className="p-4 border-t border-border flex items-center gap-3">
                <Button
                  type="button"
                  onClick={handleAttach}
                  variant="ghost"
                  className="rounded-xl h-10 w-10 p-0 text-muted-foreground hover:bg-muted"
                >
                  <Paperclip className="h-4.5 w-4.5" />
                </Button>
                <input
                  type="text"
                  placeholder="Type your message here..."
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  className="flex-1 bg-muted/40 border border-input focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-2.5 text-xs focus:outline-none transition-all"
                />
                <Button type="submit" className="rounded-xl text-white shadow-glow h-10 px-4 flex items-center gap-1">
                  <Send className="h-4 w-4" /> Send
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Shield className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-foreground text-sm">Open Encrypted Consultation Chat</h3>
                <p className="text-xs text-muted-foreground max-w-sm">
                  Select a doctor thread from the sidebar panel to consult. All chats are end-to-end encrypted under strict HIPAA data privacy regulations.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
