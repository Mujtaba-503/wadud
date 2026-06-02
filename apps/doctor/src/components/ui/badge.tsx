import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:     "border-transparent bg-primary text-white",
        secondary:   "border-transparent bg-secondary/15 text-secondary",
        outline:     "border-border text-foreground",
        success:     "border-transparent bg-green-100 text-green-800",
        warning:     "border-transparent bg-amber-100 text-amber-800",
        destructive: "border-transparent bg-red-100 text-red-800",
        info:        "border-transparent bg-blue-100 text-blue-800",
        ghost:       "border-transparent bg-muted text-muted-foreground",
        confirmed:   "border-transparent bg-green-100 text-green-800",
        pending:     "border-transparent bg-amber-100 text-amber-800",
        completed:   "border-transparent bg-blue-100 text-blue-800",
        cancelled:   "border-transparent bg-red-100 text-red-800",
        verified:    "border-transparent bg-teal-100 text-teal-800",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
