"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  illustration?: "doctors" | "consultations" | "chat" | "records" | "notifications" | "search";
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void; variant?: "default" | "outline" };
  secondaryAction?: { label: string; onClick: () => void };
  className?: string;
}

const ILLUSTRATIONS: Record<string, React.FC<{ className?: string }>> = {
  doctors: ({ className }) => (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="56" fill="#F0FDFA" stroke="#CCFBF1" strokeWidth="2"/>
      <circle cx="60" cy="42" r="18" fill="#14B8A6" opacity=".2"/>
      <circle cx="60" cy="42" r="12" fill="#0F766E" opacity=".6"/>
      <rect x="32" y="72" width="56" height="30" rx="8" fill="#14B8A6" opacity=".3"/>
      <rect x="40" y="66" width="40" height="16" rx="8" fill="#0F766E" opacity=".5"/>
      <path d="M55 85 h10 M60 80 v10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
  consultations: ({ className }) => (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="56" fill="#F0FDFA" stroke="#CCFBF1" strokeWidth="2"/>
      <rect x="28" y="35" width="64" height="50" rx="10" fill="#14B8A6" opacity=".2" stroke="#14B8A6" strokeWidth="1.5"/>
      <rect x="35" y="48" width="50" height="6" rx="3" fill="#0F766E" opacity=".4"/>
      <rect x="35" y="59" width="38" height="6" rx="3" fill="#0F766E" opacity=".3"/>
      <rect x="35" y="70" width="28" height="6" rx="3" fill="#0F766E" opacity=".2"/>
      <circle cx="88" cy="82" r="14" fill="#22C55E" opacity=".8"/>
      <path d="M83 82 l3 3 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  chat: ({ className }) => (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="56" fill="#F0FDFA" stroke="#CCFBF1" strokeWidth="2"/>
      <rect x="22" y="32" width="55" height="36" rx="10" fill="#0F766E" opacity=".2" stroke="#0F766E" strokeWidth="1.5"/>
      <path d="M22 62 L30 72 L22 72 Z" fill="#0F766E" opacity=".2"/>
      <rect x="44" y="52" width="55" height="36" rx="10" fill="#14B8A6" opacity=".3" stroke="#14B8A6" strokeWidth="1.5"/>
      <path d="M99 82 L91 92 L99 92 Z" fill="#14B8A6" opacity=".3"/>
      <circle cx="37" cy="50" r="4" fill="#0F766E" opacity=".5"/>
      <circle cx="49" cy="50" r="4" fill="#0F766E" opacity=".5"/>
      <circle cx="61" cy="50" r="4" fill="#0F766E" opacity=".5"/>
    </svg>
  ),
  search: ({ className }) => (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="56" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2"/>
      <circle cx="53" cy="52" r="22" stroke="#CBD5E1" strokeWidth="3" fill="none"/>
      <path d="M70 69 L88 87" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="53" cy="52" r="12" fill="#F1F5F9"/>
    </svg>
  ),
  notifications: ({ className }) => (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="56" fill="#F0FDFA" stroke="#CCFBF1" strokeWidth="2"/>
      <path d="M60 25 C60 25 38 38 38 60 L38 78 L82 78 L82 60 C82 38 60 25 60 25Z" fill="#14B8A6" opacity=".25"/>
      <rect x="50" y="78" width="20" height="8" rx="4" fill="#0F766E" opacity=".4"/>
      <circle cx="60" cy="25" r="5" fill="#0F766E" opacity=".5"/>
    </svg>
  ),
  records: ({ className }) => (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="56" fill="#F0FDFA" stroke="#CCFBF1" strokeWidth="2"/>
      <rect x="32" y="28" width="56" height="70" rx="8" fill="#F8FAFC" stroke="#14B8A6" strokeWidth="1.5"/>
      <rect x="42" y="42" width="36" height="4" rx="2" fill="#14B8A6" opacity=".5"/>
      <rect x="42" y="52" width="28" height="4" rx="2" fill="#14B8A6" opacity=".35"/>
      <rect x="42" y="62" width="32" height="4" rx="2" fill="#14B8A6" opacity=".25"/>
      <rect x="42" y="72" width="20" height="4" rx="2" fill="#14B8A6" opacity=".2"/>
      <path d="M55 85 h10 M60 80 v10" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
};

export function EmptyState({
  icon: Icon,
  illustration,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  const Illustration = illustration ? ILLUSTRATIONS[illustration] : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn("flex flex-col items-center justify-center text-center py-16 px-8", className)}
    >
      {Illustration ? (
        <Illustration className="w-32 h-32 mb-6 animate-float" />
      ) : Icon ? (
        <div className="mb-6 p-5 rounded-full bg-muted">
          <Icon className="h-10 w-10 text-muted-foreground" />
        </div>
      ) : null}

      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-6">{description}</p>
      )}

      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {action && (
            <Button
              variant={action.variant ?? "default"}
              onClick={action.onClick}
              className="min-w-[140px]"
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick} className="min-w-[140px]">
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
}
