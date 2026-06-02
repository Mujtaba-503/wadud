"use client";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}

export function StarRating({
  rating,
  max = 5,
  size = "md",
  interactive = false,
  onChange,
  showValue = false,
  reviewCount,
  className,
}: StarRatingProps) {
  const sizeMap = { sm: "h-3 w-3", md: "h-4 w-4", lg: "h-5 w-5" };
  const iconSize = sizeMap[size];

  return (
    <div className={cn("flex items-center gap-1", className)} aria-label={`${rating} out of ${max} stars`}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => {
          const filled = i < Math.floor(rating);
          const partial = !filled && i < rating;
          return (
            <button
              key={i}
              type={interactive ? "button" : undefined}
              onClick={() => interactive && onChange?.(i + 1)}
              className={cn(
                "relative",
                interactive && "cursor-pointer hover:scale-110 transition-transform"
              )}
              aria-label={interactive ? `Rate ${i + 1} stars` : undefined}
            >
              <Star
                className={cn(
                  iconSize,
                  filled   && "fill-amber-400 text-amber-400",
                  partial  && "fill-amber-200 text-amber-400",
                  !filled && !partial && "fill-muted text-muted-foreground/30"
                )}
              />
              {partial && (
                <Star
                  className={cn(iconSize, "absolute inset-0 fill-amber-400 text-amber-400")}
                  style={{ clipPath: `inset(0 ${100 - (rating % 1) * 100}% 0 0)` }}
                />
              )}
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className={cn("font-semibold text-foreground", size === "sm" ? "text-xs" : "text-sm")}>
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className={cn("text-muted-foreground", size === "sm" ? "text-xs" : "text-sm")}>
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
}
