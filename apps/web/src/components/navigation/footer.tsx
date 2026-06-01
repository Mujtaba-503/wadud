"use client";

import Link from "next/link";
import { Heart, Globe, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t border-border mt-auto">
      <div className="page-container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="text-xl font-bold gradient-text">Wadud</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Al Wadud - Providing compassionate, quality, and accessible telemedicine services to patients across Pakistan and the Middle East.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Heart className="h-3 w-3 text-red-500 fill-red-500 animate-pulse" />
              <span>Made with care for healthy communities.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/doctors" className="text-muted-foreground hover:text-primary transition-colors">
                  Find Doctors
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-primary transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Policy */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <span className="text-muted-foreground flex items-center gap-1.5 cursor-not-allowed">
                  HIPAA Compliance
                  <span className="inline-flex items-center rounded-md bg-green-500/10 px-1.5 py-0.5 text-2xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    Active
                  </span>
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 text-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">Contact</h3>
            <div className="flex items-start gap-2.5 text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>Gulberg III, Lahore, Pakistan / Business Bay, Dubai, UAE</span>
            </div>
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Phone className="h-4 w-4 text-primary shrink-0" />
              <span>+92 (300) 123-4567</span>
            </div>
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <span>support@wadud.app</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} Wadud Telemedicine. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <Globe className="h-3.5 w-3.5" />
              <span>English / اردو / العربية</span>
            </button>
            <span className="text-muted-foreground text-xs">|</span>
            <Link
              href="/login"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Patient Sign In
            </Link>
            <span className="text-muted-foreground text-xs">|</span>
            <Link
              href="http://localhost:3001"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-primary hover:underline transition-colors"
            >
              Doctor & Admin Panel &rarr;
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
