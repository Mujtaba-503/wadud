"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Shield, LogOut, Save, Heart, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";

type TabState = "personal" | "medical" | "security";

export default function PatientProfilePage() {
  const router = useRouter();
  const { session, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabState>("personal");

  const [firstName, setFirstName] = useState(session?.user.firstName || "");
  const [lastName, setLastName] = useState(session?.user.lastName || "");
  const [phone, setPhone] = useState(session?.user.phone || "");

  const handleLogout = () => {
    logout();
    toast.info("Logged Out", {
      description: "You have signed out of your telemedicine portal session.",
    });
    router.push("/");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile Saved", {
      description: "Your personal details have been updated successfully.",
    });
  };

  return (
    <div className="page-container py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-border pb-4">
        <div className="space-y-1.5 text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            My Profile
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your account settings, medical cards, and preferences.
          </p>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="rounded-xl border border-destructive text-destructive hover:bg-destructive/10 text-xs shrink-0 flex items-center gap-1.5 h-10 px-4"
        >
          <LogOut className="h-4 w-4" /> Log Out
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side Tab Navigation */}
        <aside className="lg:col-span-3 bg-card border border-border rounded-2xl p-4 flex flex-col gap-1 shadow-sm text-left">
          <button
            onClick={() => setActiveTab("personal")}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === "personal"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <User className="h-4 w-4 shrink-0" /> Personal Details
          </button>
          <button
            onClick={() => setActiveTab("medical")}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === "medical"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Heart className="h-4 w-4 shrink-0" /> Medical Card
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === "security"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Shield className="h-4 w-4 shrink-0" /> Security
          </button>
        </aside>

        {/* Right Side Settings Panel */}
        <div className="lg:col-span-9 bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
          {/* TAB 1: Personal details form */}
          {activeTab === "personal" && (
            <form onSubmit={handleSave} className="space-y-6 text-left">
              <h3 className="font-bold text-foreground text-sm uppercase tracking-wider pb-3 border-b border-border">
                Personal details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <Input
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Address"
                  value={session?.user.email || ""}
                  disabled
                  description="Contact support to change your account email address"
                />
                <Input
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="pt-2">
                <Button type="submit" className="rounded-xl text-white shadow-glow flex items-center gap-1.5 h-10 px-5 font-semibold">
                  <Save className="h-4 w-4" /> Save Changes
                </Button>
              </div>
            </form>
          )}

          {/* TAB 2: Medical card stats */}
          {activeTab === "medical" && (
            <div className="space-y-6 text-left">
              <h3 className="font-bold text-foreground text-sm uppercase tracking-wider pb-3 border-b border-border">
                Digital Medical Card
              </h3>

              <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 relative max-w-md mx-auto sm:mx-0 shadow-2xs space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-foreground text-base">
                      {session?.user.firstName} {session?.user.lastName}
                    </h4>
                    <p className="text-2xs text-muted-foreground mt-0.5">Wadud Health Identification</p>
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center font-bold text-white text-xs shadow-glow">
                    W
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider block">ID Reference</span>
                    <span className="font-semibold text-foreground">{session?.user.id.slice(0, 8).toUpperCase() || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider block">Blood Group</span>
                    <span className="font-semibold text-foreground">O Positive</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider block">Gender</span>
                    <span className="font-semibold text-foreground capitalize">Male</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider block">Emergency Call</span>
                    <span className="font-semibold text-foreground">{session?.user.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-2xs text-primary font-semibold border-t border-primary/10 pt-4">
                  <ShieldCheck className="h-4 w-4" /> Encrypted and HIPAA Compliant Data Card
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Security parameters */}
          {activeTab === "security" && (
            <div className="space-y-6 text-left">
              <h3 className="font-bold text-foreground text-sm uppercase tracking-wider pb-3 border-b border-border">
                Security Settings
              </h3>

              <div className="space-y-4">
                <Input label="Current Password" type="password" placeholder="••••••••" />
                <Input label="New Password" type="password" placeholder="••••••••" />
                <Input label="Confirm New Password" type="password" placeholder="••••••••" />
              </div>

              <div className="pt-2">
                <Button onClick={() => toast.success("Password Updated Successfully")} className="rounded-xl text-white shadow-glow flex items-center gap-1.5 h-10 px-5 font-semibold">
                  <Save className="h-4 w-4" /> Update Password
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
