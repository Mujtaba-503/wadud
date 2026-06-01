"use client";

import { motion } from "framer-motion";
import { Heart, ShieldCheck, Users, Award, Star, Activity } from "lucide-react";

const STATS = [
  { value: "50k+", label: "Consultations Completed", icon: Activity },
  { value: "20+", label: "Verified Consultants", icon: Users },
  { value: "98%", label: "Patient Satisfaction", icon: Star },
  { value: "100%", label: "Encrypted & Secure", icon: ShieldCheck },
];

export default function AboutPage() {
  return (
    <div className="relative pb-20">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 -z-10 w-[50%] h-[500px] bg-gradient-to-b from-primary/10 to-transparent rounded-full blur-[100px] opacity-60 pointer-events-none" />

      {/* Header */}
      <section className="pt-16 pb-12 text-center space-y-4">
        <div className="page-container max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold tracking-tight sm:text-5xl text-foreground"
          >
            About <span className="gradient-text">Wadud</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground leading-relaxed mt-4"
          >
            Our name comes from <span className="font-semibold text-primary">Al Wadud</span>, meaning "The Loving". 
            We build healthcare solutions with compassion, quality, and accessibility at the center of every screen.
          </motion.p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-12">
        <div className="page-container grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Our Compassionate Mission</h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              We started Wadud because we believe that receiving healthcare should not be a chore of waiting, travel, or complex administration. Every patient in Pakistan, the UAE, Saudi Arabia, and the wider Middle East deserves immediate, high-quality, compassionate care.
            </p>
            <p className="text-muted-foreground leading-relaxed text-sm">
              By leveraging advanced streaming technologies and WebRTC interfaces, we connect remote areas with the highest quality practitioners in urban hospitals. Whether you need general guidance or specialized cardiology counsel, we bring the hospital directly to you.
            </p>
          </div>
          <div className="bg-card border border-border p-8 rounded-[32px] space-y-6 shadow-sm">
            <h3 className="text-xl font-bold text-foreground">Our Core Values</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm">Love & Compassion</h4>
                  <p className="text-xs text-muted-foreground mt-1">Approaching healthcare with empathy and kindness first.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm">Trust & Security</h4>
                  <p className="text-xs text-muted-foreground mt-1">Rigorous validation of medical staff and strict HIPAA data practices.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm">Clinical Excellence</h4>
                  <p className="text-xs text-muted-foreground mt-1">Partnering only with licensed, highly-ranked consultants and doctors.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats grid */}
      <section className="py-16 bg-muted/30 border-y border-border">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center space-y-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-3xl font-extrabold text-foreground">{stat.value}</span>
                  <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Info / Credentials */}
      <section className="py-16">
        <div className="page-container max-w-4xl text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Regulated & Safe Telehealth</h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Wadud is developed in coordination with healthcare standards across Middle East and South Asia markets. We partner with the Pakistan Medical Commission (PMC), Dubai Health Authority (DHA), and Saudi Commission for Health Specialties (SCFHS) to ensure compliance.
          </p>
        </div>
      </section>
    </div>
  );
}
