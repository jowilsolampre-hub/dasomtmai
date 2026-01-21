import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "online" | "offline" | "processing" | "warning" | "error";
  label?: string;
  className?: string;
  showPulse?: boolean;
}

export function StatusBadge({
  status,
  label,
  className,
  showPulse = true,
}: StatusBadgeProps) {
  const statusConfig = {
    online: {
      color: "bg-success",
      text: label || "ONLINE",
      textColor: "text-success",
    },
    offline: {
      color: "bg-muted-foreground",
      text: label || "OFFLINE",
      textColor: "text-muted-foreground",
    },
    processing: {
      color: "bg-primary",
      text: label || "PROCESSING",
      textColor: "text-primary",
    },
    warning: {
      color: "bg-warning",
      text: label || "WARNING",
      textColor: "text-warning",
    },
    error: {
      color: "bg-destructive",
      text: label || "ERROR",
      textColor: "text-destructive",
    },
  };

  const config = statusConfig[status];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <div
          className={cn(
            "w-2 h-2 rounded-full",
            config.color,
            showPulse && status !== "offline" && "animate-pulse"
          )}
        />
        {showPulse && status === "online" && (
          <div
            className={cn(
              "absolute inset-0 w-2 h-2 rounded-full animate-ping",
              config.color,
              "opacity-75"
            )}
          />
        )}
      </div>
      <span className={cn("text-xs font-tech uppercase tracking-wider", config.textColor)}>
        {config.text}
      </span>
    </div>
  );
}
