"use client";

import { useState } from "react";
import { Bell, Calendar, FileText, CheckCircle, Volume2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_NOTIFICATIONS } from "@wadud/mocks/notifications";
import { toast } from "sonner";

type FilterType = "all" | "booking" | "record" | "system";

export default function NotificationsCenterPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read.");
  };

  const handleMarkOneRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.info("Notification dismissed.");
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === "all") return true;
    return n.type === activeFilter;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "booking":
        return <Calendar className="h-5 w-5 text-primary" />;
      case "record":
        return <FileText className="h-5 w-5 text-secondary" />;
      case "system":
        return <ShieldAlert className="h-5 w-5 text-accent-hover" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="page-container py-8 max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-border pb-4">
        <div className="space-y-1.5 text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Notifications Center
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            Manage your reminders, consultations schedules, and updates.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            onClick={handleMarkAllRead}
            variant="ghost"
            className="rounded-xl border border-border text-xs shrink-0 h-10 px-4 font-semibold text-primary"
          >
            Mark all read
          </Button>
        )}
      </div>

      {/* Filters thread row */}
      <div className="flex flex-wrap gap-1.5 justify-start">
        {(["all", "booking", "record", "system"] as FilterType[]).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
              activeFilter === filter
                ? "bg-primary/10 text-primary border border-primary/20"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {filter === "all" ? "All Updates" : filter === "booking" ? "Appointments" : filter === "record" ? "Prescriptions" : "Alerts"}
          </button>
        ))}
      </div>

      {/* Notifications listing */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleMarkOneRead(n.id)}
              className={`p-5 bg-card border rounded-2xl flex gap-4 transition-all duration-200 text-left relative group ${
                !n.isRead ? "border-primary/30 bg-primary/2xs" : "border-border hover:border-primary/20"
              }`}
            >
              {/* Type Icon */}
              <div className="h-10 w-10 bg-muted rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                {getIcon(n.type)}
              </div>

              {/* Title & info details */}
              <div className="flex-1 space-y-1 pr-6">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-foreground text-sm leading-none">{n.title}</h4>
                  {!n.isRead && (
                    <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-normal">{n.content}</p>
                <span className="text-[10px] text-muted-foreground/60 block pt-0.5">
                  {new Date(n.createdAt).toLocaleDateString("en", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* Dismiss CTA */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(n.id);
                }}
                className="absolute top-4 right-4 text-[10px] font-bold text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Dismiss
              </button>
            </div>
          ))
        ) : (
          <div className="bg-card border border-border border-dashed rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Bell className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-foreground text-sm">No Notifications</h3>
              <p className="text-xs text-muted-foreground leading-normal">
                You are all caught up! No notifications listed under the {activeFilter} category.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
