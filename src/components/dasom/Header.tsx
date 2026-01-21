import { cn } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";
import { Cloud, Settings } from "lucide-react";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showStatus?: boolean;
  isOnline?: boolean;
  onSettingsClick?: () => void;
}

export function Header({
  title = "DASOM",
  subtitle = "// 2.0",
  showStatus = true,
  isOnline = true,
  onSettingsClick,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-primary/10 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Cloud className="w-6 h-6 text-primary" />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-success rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-orbitron font-bold text-lg text-foreground text-glow-sm">
                {title}
              </h1>
              <span className="font-tech text-xs text-muted-foreground">
                {subtitle}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {showStatus && (
            <StatusBadge status={isOnline ? "online" : "offline"} />
          )}
          {onSettingsClick && (
            <button
              onClick={onSettingsClick}
              className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
