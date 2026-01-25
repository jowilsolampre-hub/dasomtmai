import { cn } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";
import { Cloud, Settings, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  const handleAuthClick = async () => {
    if (isAuthenticated) {
      await signOut();
      toast.success("Neural link disconnected");
    } else {
      navigate("/auth");
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-primary/10 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Cloud className="w-6 h-6 text-primary" />
            <div className={cn(
              "absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full",
              isAuthenticated ? "bg-success" : "bg-warning"
            )} />
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
            {isAuthenticated && user?.email && (
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <User className="w-3 h-3" />
                <span className="truncate max-w-[120px]">{user.email}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {showStatus && (
            <StatusBadge status={isOnline ? "online" : "offline"} />
          )}
          <button
            onClick={handleAuthClick}
            className={cn(
              "p-2 rounded-lg transition-colors flex items-center gap-1",
              isAuthenticated 
                ? "hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                : "hover:bg-primary/20 text-primary"
            )}
          >
            {isAuthenticated ? (
              <LogOut className="w-5 h-5" />
            ) : (
              <LogIn className="w-5 h-5" />
            )}
          </button>
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
