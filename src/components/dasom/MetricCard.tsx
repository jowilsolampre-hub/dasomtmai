import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  status?: "normal" | "warning" | "critical";
  className?: string;
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  unit,
  status = "normal",
  className,
}: MetricCardProps) {
  const statusColors = {
    normal: "text-primary border-primary/30",
    warning: "text-warning border-warning/30",
    critical: "text-destructive border-destructive/30",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border bg-card/50 backdrop-blur-sm",
        statusColors[status],
        className
      )}
    >
      <Icon className="w-5 h-5 opacity-70" />
      <div className="flex-1">
        <div className="text-xs text-muted-foreground uppercase tracking-wider">
          {label}
        </div>
        <div className="font-orbitron font-bold text-lg">
          {value}
          {unit && <span className="text-sm font-normal ml-1 opacity-70">{unit}</span>}
        </div>
      </div>
    </div>
  );
}
