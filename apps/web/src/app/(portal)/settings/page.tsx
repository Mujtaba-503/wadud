"use client";

import { useState } from "react";
import { Settings, Shield, Bell, Key, Globe, Heart, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PatientSettingsPage() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);
  const [whatsappReminders, setWhatsappReminders] = useState(false);
  const [consultationReminders, setConsultationReminders] = useState(true);

  const handleSave = () => {
    toast.success("Settings Saved", {
      description: "Your notification and account preferences have been saved successfully.",
    });
  };

  return (
    <div className="page-container py-8 max-w-4xl space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-4 text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" /> Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure your portal configuration parameters, alerts settings, and account permissions.
        </p>
      </div>

      {/* Grid */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-8 text-left shadow-xs">
        {/* SECTION 1: Notifications toggles */}
        <div className="space-y-6">
          <h3 className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center gap-2 border-b border-border pb-3">
            <Bell className="h-4.5 w-4.5 text-primary shrink-0" /> Notification Preferences
          </h3>

          <div className="space-y-4 max-w-xl text-xs">
            {/* Email */}
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-foreground">Email Notifications</p>
                <p className="text-muted-foreground mt-0.5">Receive summary reports, invoices, and diagnostic links</p>
              </div>
              <input
                type="checkbox"
                checked={emailNotif}
                onChange={(e) => setEmailNotif(e.target.checked)}
                className="h-4.5 w-9 rounded-full bg-border border-2 border-transparent focus:outline-none transition-colors cursor-pointer text-primary"
              />
            </div>

            {/* SMS */}
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-foreground">SMS Alerts</p>
                <p className="text-muted-foreground mt-0.5">Get OTP access tokens and queue schedule updates via mobile text</p>
              </div>
              <input
                type="checkbox"
                checked={smsNotif}
                onChange={(e) => setSmsNotif(e.target.checked)}
                className="h-4.5 w-9 rounded-full bg-border border-2 border-transparent focus:outline-none transition-colors cursor-pointer text-primary"
              />
            </div>

            {/* WhatsApp */}
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-foreground">WhatsApp Reminders</p>
                <p className="text-muted-foreground mt-0.5">Receive direct session link reminders and doctor chat logs via WhatsApp</p>
              </div>
              <input
                type="checkbox"
                checked={whatsappReminders}
                onChange={(e) => setWhatsappReminders(e.target.checked)}
                className="h-4.5 w-9 rounded-full bg-border border-2 border-transparent focus:outline-none transition-colors cursor-pointer text-primary"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: HIPAA Authorization parameters */}
        <div className="space-y-6">
          <h3 className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center gap-2 border-b border-border pb-3">
            <Shield className="h-4.5 w-4.5 text-primary shrink-0" /> Data Privacy & HIPAA Access
          </h3>

          <div className="space-y-4 max-w-xl text-xs">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-foreground font-semibold">Shared Clinical Records</p>
                <p className="text-muted-foreground mt-0.5">Allow authorized specialists to view your medical history folders before meetings</p>
              </div>
              <input
                type="checkbox"
                checked={consultationReminders}
                onChange={(e) => setConsultationReminders(e.target.checked)}
                className="h-4.5 w-9 rounded-full bg-border border-2 border-transparent focus:outline-none transition-colors cursor-pointer text-primary"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4 border-t border-border flex justify-end">
          <Button onClick={handleSave} className="rounded-xl text-white shadow-glow h-10 px-5 font-semibold flex items-center gap-1.5">
            <Save className="h-4 w-4" /> Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
