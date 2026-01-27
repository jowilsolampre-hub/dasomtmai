import { cn } from "@/lib/utils";
import { 
  Home, 
  Activity, 
  Shield, 
  Settings,
  Mic,
  Smartphone,
  Mail,
  Calendar
} from "lucide-react";

interface NavigationProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

const navItems = [
  { id: "home", icon: Home, label: "Home" },
  { id: "devices", icon: Smartphone, label: "Devices" },
  { id: "inbox", icon: Mail, label: "Inbox" },
  { id: "calendar", icon: Calendar, label: "Calendar" },
  { id: "diagnostics", icon: Activity, label: "Diagnostics" },
  { id: "voice", icon: Mic, label: "Voice" },
];

export function Navigation({ currentScreen, onNavigate }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-primary/20 safe-area-inset-bottom z-50">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200",
                "min-w-[50px]",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "text-glow-sm")} />
              <span className="text-[10px] font-tech uppercase tracking-wider">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
