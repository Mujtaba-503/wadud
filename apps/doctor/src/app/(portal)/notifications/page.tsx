"use client";

import { useState } from "react";
import {
  Bell,
  CalendarCheck,
  MessageSquare,
  Wallet,
  CheckCheck,
  Star,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { cn, formatRelativeTime } from "@/lib/utils";

interface Notif {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

const ICONS = { booking: CalendarCheck, message: MessageSquare, payment: Wallet, review: Star } as const;

const now = Date.now();
const INITIAL: Notif[] = [
  { id: "n1", icon: ICONS.booking, title: "New consultation request", body: "Ayesha Khan requested a video consultation for today at 12:00 PM.", createdAt: new Date(now - 12 * 60000).toISOString(), read: false },
  { id: "n2", icon: ICONS.message, title: "New message", body: "Bilal Ahmed sent you a message about their prescription.", createdAt: new Date(now - 55 * 60000).toISOString(), read: false },
  { id: "n3", icon: ICONS.payment, title: "Payout processed", body: "Your payout of PKR 28,000 has been transferred to HBL •••• 4821.", createdAt: new Date(now - 5 * 3600000).toISOString(), read: false },
  { id: "n4", icon: ICONS.review, title: "New patient review", body: "You received a 5-star review from a recent consultation.", createdAt: new Date(now - 26 * 3600000).toISOString(), read: true },
  { id: "n5", icon: ICONS.booking, title: "Appointment reminder", body: "Upcoming consultation with Sara Ali at 2:15 PM.", createdAt: new Date(now - 30 * 3600000).toISOString(), read: true },
];

export default function NotificationsPage() {
  const [items, setItems] = useState<Notif[]>(INITIAL);
  const unread = items.filter((n) => !n.read).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-3xl">
      <PageHeader
        title="Notifications"
        description={unread ? `${unread} unread notification${unread > 1 ? "s" : ""}` : "You're all caught up."}
        action={
          unread ? (
            <Button variant="outline" onClick={() => setItems((prev) => prev.map((n) => ({ ...n, read: true })))}>
              <CheckCheck className="h-4 w-4" /> Mark all read
            </Button>
          ) : undefined
        }
      />

      {items.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="New activity will show up here." />
      ) : (
        <div className="space-y-2.5">
          {items.map((n) => {
            const Icon = n.icon;
            return (
              <Card
                key={n.id}
                className={cn("cursor-pointer transition-colors hover:bg-muted/40", !n.read && "border-primary/30 bg-primary/5")}
                onClick={() => setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)))}
              >
                <CardContent className="flex items-start gap-3 p-4">
                  <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", !n.read ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">{n.title}</p>
                    <p className="text-sm text-muted-foreground leading-normal">{n.body}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{formatRelativeTime(n.createdAt)}</p>
                  </div>
                  {!n.read ? <span className="mt-1.5 h-2 w-2 rounded-full bg-accent shrink-0" /> : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
