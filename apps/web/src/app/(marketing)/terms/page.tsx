"use client";

import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <div className="page-container max-w-4xl py-12 md:py-20 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 border-b border-border pb-6"
      >
        <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">Terms of Service</h1>
        <p className="text-xs text-muted-foreground">Last updated: June 1, 2026</p>
      </motion.div>

      <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground space-y-6 leading-relaxed text-sm">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Wadud Platform, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">2. Telehealth Services Disclaimer</h2>
          <p className="text-amber-600 dark:text-amber-400 font-medium">
            IMPORTANT: Wadud is a telemedicine platform, not an emergency healthcare provider. IN CASE OF A LIFE-THREATENING MEDICAL EMERGENCY, PLEASE CONTACT YOUR LOCAL EMERGENCY SERVICES IMMEDIATELY (E.G. 1122 IN PAKISTAN, 999 IN THE UAE, 997 IN SAUDI ARABIA).
          </p>
          <p>
            Telehealth has inherent limitations, including the inability to perform physical examinations or laboratory assays on site. Diagnosis is based on subjective reports, user-supplied records, and visual assessment.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">3. User Responsibilities</h2>
          <p>
            As a user of Wadud, you agree to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Provide accurate, current, and complete personal and medical history information.</li>
            <li>Maintain the confidentiality of your account credentials and password.</li>
            <li>Use the platform in compliance with local laws and regulations, avoiding any abusive or illegal activity.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">4. Payment & Booking Cancellations</h2>
          <p>
            Payments are made via the mock/integrated gateways at the time of booking. Cancellations made more than 24 hours prior to the scheduled slot are eligible for a full refund or credit. Reschedules are subject to doctor availability.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">5. Platform License & Proprietary Rights</h2>
          <p>
            The Platform design, algorithms, logos, styling assets, and branding are the exclusive property of Wadud. Users are granted a limited, personal, non-transferable, revocable license to access the interface for healthcare consulting.
          </p>
        </section>
      </div>
    </div>
  );
}
