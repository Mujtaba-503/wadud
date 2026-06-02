"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Send, Megaphone, Users, Stethoscope, Globe, Bell } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn, formatRelativeTime } from "@/lib/utils";

type Audience = "all" | "patients" | "doctors";

interface SentBroadcast {
  id: string;
  title: string;
  body: string;
  audience: Audience;
  createdAt: string;
}

const now = Date.now();
const HISTORY: SentBroadcast[] = [
  { id: "b1", title: "Scheduled maintenance", body: "The platform will be briefly unavailable on Sunday 2–3 AM PKT.", audience: "all", createdAt: new Date(now - 2 * 86400000).toISOString() },
  { id: "b2", title: "New payout schedule", body: "Payouts are now processed every Friday.", audience: "doctors", createdAt: new Date(now - 6 * 86400000).toISOString() },
  { id: "b3", title: "Refer & earn", body: "Invite friends and get a free consultation credit.", audience: "patients", createdAt: new Date(now - 12 * 86400000).toISOString() },
];

const audienceMeta: Record<Audience, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  all: { label: "Everyone", icon: Globe },
  patients: { label: "Patients", icon: Users },
  doctors: { label: "Doctors", icon: Stethoscope },
};

export default function NotificationsManagementPage() {
  const [audience, setAudience] = useState<Audience>("all");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState<SentBroadcast[]>(HISTORY);

  const send = () => {
    if (!title.trim() || !body.trim()) {
      toast.error("Add a title and message");
      return;
    }
    setSending(true);
    setTimeout(() => {
      setHistory((prev) => [
        { id: `b${Date.now()}`, title, body, audience, createdAt: new Date().toISOString() },
        ...prev,
      ]);
      setTitle("");
      setBody("");
      setSending(false);
      toast.success("Broadcast sent", { description: `Delivered to ${audienceMeta[audience].label.toLowerCase()}.` });
    }, 900);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader title="Notifications Management" description="Send broadcasts and announcements." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Megaphone className="h-4 w-4 text-primary" /> New broadcast
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium text-foreground">Audience</p>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(audienceMeta) as Audience[]).map((a) => {
                  const Icon = audienceMeta[a].icon;
                  return (
                    <button
                      key={a}
                      onClick={() => setAudience(a)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-medium transition-colors",
                        audience === a ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-muted"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {audienceMeta[a].label}
                    </button>
                  );
                })}
              </div>
            </div>
            <Input label="Title" placeholder="Announcement title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Textarea label="Message" placeholder="Write your announcement…" value={body} onChange={(e) => setBody(e.target.value)} />
            <Button className="w-full" onClick={send} loading={sending}>
              <Send className="h-4 w-4" /> Send broadcast
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4 text-primary" /> Recent broadcasts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {history.map((b) => {
              const Icon = audienceMeta[b.audience].icon;
              return (
                <div key={b.id} className="rounded-xl border border-border p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">{b.title}</p>
                    <Badge variant="ghost" className="gap-1 shrink-0">
                      <Icon className="h-3 w-3" /> {audienceMeta[b.audience].label}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground leading-normal">{b.body}</p>
                  <p className="mt-1.5 text-xs text-muted-foreground">{formatRelativeTime(b.createdAt)}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
