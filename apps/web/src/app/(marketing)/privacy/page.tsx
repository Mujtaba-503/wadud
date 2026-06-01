"use client";

import { motion } from "framer-motion";

export default function PrivacyPage() {
  return (
    <div className="page-container max-w-4xl py-12 md:py-20 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 border-b border-border pb-6"
      >
        <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">Privacy Policy</h1>
        <p className="text-xs text-muted-foreground">Last updated: June 1, 2026</p>
      </motion.div>

      <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground space-y-6 leading-relaxed text-sm">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">1. Introduction</h2>
          <p>
            Welcome to Wadud ("Platform", "we", "our", "us"). We are committed to protecting the privacy, confidentiality, and security of our users' ("Patient", "User", "you") personal and medical information. This Privacy Policy details how we collect, store, transmit, and protect data in compliance with standard HIPAA regulations and regional health privacy standards across Pakistan, Saudi Arabia, and the United Arab Emirates.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">2. Information We Collect</h2>
          <p>
            To provide comprehensive telemedicine consultations, we collect several types of data:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Personal Identity Info:</strong> Full name, date of birth, gender, location/region, email address, phone number, and ID credentials.</li>
            <li><strong>Protected Health Information (PHI):</strong> Symptoms, medical histories, lab results, prescriptions, clinical notes, and video/audio consultation metadata.</li>
            <li><strong>Technical/Usage Data:</strong> IP address, device type, operating system version, browser parameters, and platform interaction logs.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">3. How Your Information is Secured</h2>
          <p>
            We deploy multiple layers of enterprise-grade security to ensure your data is secure:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Encryption:</strong> All data in transit is encrypted using TLS 1.3, and all patient records at rest are encrypted using AES-256.</li>
            <li><strong>WebRTC Streaming:</strong> Peer-to-peer video sessions are encrypted dynamically and are not recorded without explicit prior consent from both patient and doctor.</li>
            <li><strong>Access Control:</strong> Only your assigned consulting healthcare professionals can access your medical records and history.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">4. Sharing of Information</h2>
          <p>
            We will never sell or rent your personal information to third parties. We share data only:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>With your consulting doctor to enable expert healthcare diagnoses.</li>
            <li>With authorized diagnostic labs or pharmacy dispatchers, solely if you request a test or prescription delivery.</li>
            <li>When legally required by state authorities under judicial order or medical emergency regulations.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">5. Your Rights</h2>
          <p>
            You have the right to request a full copy of your medical records, update any personal identity information, or request account closure and data deletion where legally permissible.
          </p>
        </section>
      </div>
    </div>
  );
}
