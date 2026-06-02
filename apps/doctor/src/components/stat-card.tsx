import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  accent = "primary",
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: number;
  accent?: "primary" | "secondary" | "accent" | "amber";
}) {
  const accentMap: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/15 text-secondary",
    accent: "bg-accent/15 text-accent",
    amber: "bg-amber-100 text-amber-700",
  };
  const up = (trend ?? 0) >= 0;
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-extrabold tracking-tight text-foreground">{value}</p>
        </div>
        <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center", accentMap[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {typeof trend === "number" ? (
        <div className="mt-3 flex items-center gap-1 text-xs font-semibold">
          <span className={cn("flex items-center gap-0.5", up ? "text-accent" : "text-destructive")}>
            {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {Math.abs(trend)}%
          </span>
          <span className="text-muted-foreground">vs last week</span>
        </div>
      ) : null}
    </Card>
  );
}
