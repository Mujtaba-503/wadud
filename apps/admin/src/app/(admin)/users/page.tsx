"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Search, Users, Ban, CheckCircle2, Mail } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { MOCK_PATIENTS } from "@wadud/mocks";
import { getInitials, formatDate } from "@/lib/utils";
import type { Patient } from "@wadud/types";

export default function UsersPage() {
  const [users, setUsers] = useState<Patient[]>(MOCK_PATIENTS);
  const [q, setQ] = useState("");

  const toggle = (id: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u)));
    toast.success("User status updated");
  };

  const filtered = users.filter((u) =>
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader title="Users" description={`${users.length} registered patients.`} />

      <div className="max-w-sm">
        <Input placeholder="Search users…" value={q} onChange={(e) => setQ(e.target.value)} leftIcon={<Search className="h-4 w-4" />} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="No users found" description="Try a different search term." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((u) => (
            <Card key={u.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={u.avatar} alt="" />
                    <AvatarFallback>{getInitials(u.firstName, u.lastName)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-foreground">{u.firstName} {u.lastName}</p>
                    <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                  </div>
                  {u.isActive ? <Badge variant="verified">Active</Badge> : <Badge variant="ghost">Suspended</Badge>}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">Joined {formatDate(u.createdAt)}</p>
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mail className="h-4 w-4" /> Contact
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggle(u.id)}
                    className={u.isActive ? "text-destructive" : "text-accent"}
                  >
                    {u.isActive ? <Ban className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
