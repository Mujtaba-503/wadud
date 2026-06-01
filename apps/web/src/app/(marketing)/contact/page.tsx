"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Phone, MapPin, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(6, "Phone number is invalid"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Message Sent!", {
      description: "Thank you for contacting Wadud. Our support team will get back to you shortly.",
    });
    reset();
  };

  return (
    <div className="relative pb-20">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 -z-10 w-[50%] h-[500px] bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-[100px] opacity-60 pointer-events-none" />

      {/* Header */}
      <section className="pt-16 pb-12 text-center space-y-4">
        <div className="page-container max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-foreground">
            Contact <span className="gradient-text">Wadud</span>
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed mt-2">
            Have questions about our telemedicine platform, corporate health partnerships, or technical integration? Reach out below.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-8">
        <div className="page-container grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Support Details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-card border border-border p-6 rounded-2xl space-y-4 shadow-sm">
              <h2 className="text-xl font-bold text-foreground">Support & Info</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our support team is available 24/7 to resolve booking issues, account inquiries, or technical glitches.
              </p>

              <div className="space-y-4 pt-4 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="font-bold text-foreground text-xs">General Support</p>
                    <p className="text-xs">support@wadud.app</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="font-bold text-foreground text-xs">Contact Hotline</p>
                    <p className="text-xs">+92 (300) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-muted-foreground">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-foreground text-xs">Main Office</p>
                    <p className="text-xs leading-tight">Gulberg III, Lahore, Pakistan</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle East Info */}
            <div className="bg-card border border-border p-6 rounded-2xl space-y-3 shadow-sm">
              <h3 className="font-bold text-foreground text-sm">Middle East Headquarters</h3>
              <div className="flex items-start gap-3 text-muted-foreground text-sm">
                <MapPin className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-foreground text-xs">Dubai Branch</p>
                  <p className="text-xs">Business Bay, Dubai, United Arab Emirates</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-card border border-border p-8 rounded-3xl shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Send a Message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  {...register("name")}
                  label="Full Name"
                  placeholder="John Doe"
                  error={errors.name?.message}
                />
                <Input
                  {...register("email")}
                  label="Email Address"
                  placeholder="john@example.com"
                  error={errors.email?.message}
                />
              </div>

              <Input
                {...register("phone")}
                label="Phone Number"
                placeholder="+92 300 1234567"
                error={errors.phone?.message}
              />

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-muted-foreground">Your Message</label>
                <textarea
                  {...register("message")}
                  rows={5}
                  className="w-full bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-3 text-sm resize-none focus:outline-none transition-all"
                  placeholder="Tell us what you need help with..."
                />
                {errors.message && (
                  <p className="text-2xs font-medium text-destructive mt-0.5">{errors.message.message}</p>
                )}
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full rounded-xl text-white shadow-glow h-11 font-semibold">
                {isSubmitting ? "Sending..." : "Submit Message"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
