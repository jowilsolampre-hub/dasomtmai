import { useDevices } from "@/hooks/useDevices";
import { useAuth } from "@/hooks/useAuth";
import { CyberCard } from "../CyberCard";
import { Button } from "@/components/ui/button";
import { 
  Smartphone, 
  Monitor, 
  Tablet, 
  Trash2, 
  RefreshCw, 
  CheckCircle2,
  Clock,
  Wifi,
  WifiOff,
  LogIn
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

function getDeviceIcon(type: string) {
  switch (type) {
    case "mobile":
      return Smartphone;
    case "tablet":
      return Tablet;
    default:
      return Monitor;
  }
}

export function DevicesScreen() {
  const { devices, currentDeviceId, isLoading, removeDevice, refreshDevices } = useDevices();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleRemoveDevice = async (deviceId: string, deviceName: string) => {
    const { error } = await removeDevice(deviceId);
    if (error) {
      toast.error("Failed to remove device");
    } else {
      toast.success(`${deviceName} has been disconnected`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 space-y-6">
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
            <WifiOff className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-orbitron text-xl text-foreground mb-2">Not Connected</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Sign in with Google to sync your devices and access your assistant everywhere.
          </p>
          <Button 
            onClick={() => navigate("/auth")}
            className="bg-gradient-to-r from-primary to-accent"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Sign In to Connect
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-orbitron text-lg text-foreground">Connected Devices</h2>
          <p className="text-xs text-muted-foreground mt-1">
            {user?.email}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={refreshDevices}
          disabled={isLoading}
          className="text-primary hover:text-primary/80"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Sync Status */}
      <CyberCard variant="glow" className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
            <Wifi className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Device Sync Active</p>
            <p className="text-xs text-muted-foreground">
              {devices.length} device{devices.length !== 1 ? "s" : ""} connected
            </p>
          </div>
          <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
        </div>
      </CyberCard>

      {/* Device List */}
      <div className="space-y-3">
        <h3 className="text-sm font-tech text-muted-foreground uppercase tracking-wider">
          Your Devices
        </h3>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <CyberCard key={i} className="p-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-secondary rounded w-32" />
                    <div className="h-3 bg-secondary rounded w-24" />
                  </div>
                </div>
              </CyberCard>
            ))}
          </div>
        ) : devices.length === 0 ? (
          <CyberCard className="p-6 text-center">
            <p className="text-muted-foreground text-sm">
              No devices registered yet. This device will be added automatically.
            </p>
          </CyberCard>
        ) : (
          devices.map((device) => {
            const DeviceIcon = getDeviceIcon(device.device_type);
            const isCurrent = device.id === currentDeviceId;
            const lastActive = formatDistanceToNow(new Date(device.last_active), { addSuffix: true });

            return (
              <CyberCard 
                key={device.id} 
                variant={isCurrent ? "glow" : "default"}
                className="p-4"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isCurrent 
                      ? "bg-gradient-to-br from-primary to-accent" 
                      : "bg-secondary"
                  }`}>
                    <DeviceIcon className={`w-6 h-6 ${
                      isCurrent ? "text-primary-foreground" : "text-muted-foreground"
                    }`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground truncate">
                        {device.device_name}
                      </p>
                      {isCurrent && (
                        <span className="flex items-center gap-1 text-xs text-accent">
                          <CheckCircle2 className="w-3 h-3" />
                          Current
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{isCurrent ? "Active now" : lastActive}</span>
                    </div>
                  </div>

                  {!isCurrent && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveDevice(device.id, device.device_name)}
                      className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CyberCard>
            );
          })
        )}
      </div>

      {/* Info Section */}
      <CyberCard className="p-4 bg-secondary/30">
        <h4 className="text-sm font-medium text-foreground mb-2">About Device Sync</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Devices sync automatically when signed in with the same Google account</li>
          <li>• Your conversations and preferences are shared across all devices</li>
          <li>• Remove unused devices to keep your account secure</li>
        </ul>
      </CyberCard>
    </div>
  );
}
