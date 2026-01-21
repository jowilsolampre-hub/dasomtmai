import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CyberCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "glow" | "holo";
  noPadding?: boolean;
}

export function CyberCard({
  children,
  className,
  variant = "default",
  noPadding = false,
}: CyberCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-lg border border-primary/20 bg-card/80 backdrop-blur-sm",
        variant === "glow" && "border-glow",
        variant === "holo" && "holo-card",
        !noPadding && "p-4",
        className
      )}
    >
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-primary/60 rounded-tl" />
      <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-primary/60 rounded-tr" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-primary/60 rounded-bl" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-primary/60 rounded-br" />
      {children}
    </div>
  );
}
