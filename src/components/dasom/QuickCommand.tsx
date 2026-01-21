import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface QuickCommandProps {
  icon: LucideIcon;
  label: string;
  description?: string;
  onClick: () => void;
  variant?: "default" | "primary" | "warning";
  disabled?: boolean;
}

export function QuickCommand({
  icon: Icon,
  label,
  description,
  onClick,
  variant = "default",
  disabled = false,
}: QuickCommandProps) {
  const variants = {
    default: "bg-secondary/50 border-primary/20 hover:border-primary/40 hover:bg-secondary",
    primary: "bg-primary/10 border-primary/40 hover:border-primary/60 hover:bg-primary/20",
    warning: "bg-warning/10 border-warning/40 hover:border-warning/60 hover:bg-warning/20",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "active:scale-[0.98]",
        variants[variant]
      )}
    >
      <div className={cn(
        "p-2 rounded-lg",
        variant === "default" && "bg-primary/20 text-primary",
        variant === "primary" && "bg-primary/30 text-primary",
        variant === "warning" && "bg-warning/30 text-warning"
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 text-left">
        <div className="font-semibold text-foreground">{label}</div>
        {description && (
          <div className="text-xs text-muted-foreground">{description}</div>
        )}
      </div>
    </button>
  );
}
