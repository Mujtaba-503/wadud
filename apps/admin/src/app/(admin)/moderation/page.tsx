"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ShieldAlert, Check, Trash2, ArrowUpRight, MessageSquare, Star, FileText, User } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { MOCK_MODERATION_ITEMS } from "@wadud/mocks";
import { formatRelativeTime } from "@/lib/utils";
import type { ContentModerationItem, ModerationStatus } from "@wadud/types";

const typeIcon = { review: Star, chat_message: MessageSquare, doctor_bio: FileText, profile: User } as const;
const statusVariant: Record<ModerationStatus, "pending" | "success" | "destructive" | "warning"> = {
  pending: "pending",
  approved: "success",
  removed: "destructive",
  escalated: "warning",
};

export default function ModerationPage() {
  const [items, setItems] = useState<ContentModerationItem[]>(MOCK_MODERATION_ITEMS);

  const act = (id: string, status: ModerationStatus) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    toast[status === "removed" ? "error" : "success"](
      status === "approved" ? "Content approved" : status === "removed" ? "Content removed" : "Escalated to senior review"
    );
  };

  const pending = items.filter((i) => i.status === "pending" || i.status === "escalated");

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader title="Content Moderation" description={`${pending.length} items need attention.`} />

      {items.length === 0 ? (
        <EmptyState icon={ShieldAlert} title="Queue is clear" description="No reported content to review." />
      ) : (
        <div className="grid gap-3">
          {items.map((item) => {
            const Icon = typeIcon[item.type];
            const resolved = item.status === "approved" || item.status === "removed";
            return (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="ghost" className="capitalize">{item.type.replace("_", " ")}</Badge>
                        <Badge variant={statusVariant[item.status]} className="capitalize">{item.status}</Badge>
                        <span className="text-xs text-muted-foreground">{formatRelativeTime(item.createdAt)}</span>
                      </div>
                      <p className="mt-2 rounded-lg bg-muted/60 p-3 text-sm text-foreground">“{item.reportedContent}”</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">Reason:</span> {item.reason} · by {item.authorName}
                        {item.reportedBy ? <> · reported by {item.reportedBy}</> : null}
                      </p>
                    </div>
                  </div>
                  {!resolved && (
                    <div className="mt-3 flex flex-wrap justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => act(item.id, "escalated")}>
                        <ArrowUpRight className="h-4 w-4" /> Escalate
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => act(item.id, "removed")}>
                        <Trash2 className="h-4 w-4" /> Remove
                      </Button>
                      <Button variant="success" size="sm" onClick={() => act(item.id, "approved")}>
                        <Check className="h-4 w-4" /> Approve
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
