import { useState } from "react";
import { CyberCard } from "@/components/dasom/CyberCard";
import { ProgressRing } from "@/components/dasom/ProgressRing";
import { useDasomChat } from "@/hooks/useDasomChat";
import { 
  Shield, 
  ShieldCheck, 
  AlertTriangle, 
  Wifi, 
  Eye, 
  Mic,
  MapPin,
  RefreshCw,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ThreatInfo {
  name: string;
  risk: "high" | "medium" | "low";
  description: string;
}

export function SecurityScreen() {
  const [securityScore, setSecurityScore] = useState(98);
  const [threats, setThreats] = useState(0);
  const [highRiskApps, setHighRiskApps] = useState(3);
  const [isScanning, setIsScanning] = useState(false);
  const { sendMessage, isLoading } = useDasomChat("security");

  const [riskyApps] = useState<ThreatInfo[]>([
    { name: "Recorder App", risk: "high", description: "Background mic access while closed" },
    { name: "Weather Pro", risk: "medium", description: "Excessive location tracking" },
    { name: "Free VPN", risk: "high", description: "Unencrypted data transmission" },
  ]);

  const runSecurityScan = async () => {
    setIsScanning(true);
    await sendMessage("Run a comprehensive security scan. Check for malware, suspicious permissions, network vulnerabilities, and app risks.");
    setTimeout(() => {
      setSecurityScore(98);
      setThreats(0);
      setIsScanning(false);
    }, 2000);
  };

  const permissionStats = [
    { icon: Eye, label: "Camera", apps: 12, status: "safe" },
    { icon: Mic, label: "Microphone", apps: 8, status: "warning" },
    { icon: MapPin, label: "Location", apps: 24, status: "safe" },
    { icon: Wifi, label: "Network", apps: 45, status: "safe" },
  ];

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-orbitron text-lg font-bold text-foreground">
          DASOM <span className="text-primary">Security</span>
        </h2>
        <Button
          size="sm"
          variant="outline"
          onClick={runSecurityScan}
          disabled={isScanning || isLoading}
          className="border-primary/30 hover:bg-primary/20"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
          Scan
        </Button>
      </div>

      {/* Security Score */}
      <CyberCard variant="glow" className="flex flex-col items-center py-6">
        <ProgressRing 
          value={securityScore}
          size={160}
          strokeWidth={10}
          color={securityScore > 90 ? "success" : securityScore > 70 ? "warning" : "destructive"}
          label="Protected"
        />
        <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/20 border border-success/30">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-sm font-tech text-success">REAL-TIME SHIELD ACTIVE</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Last scan: 2 mins ago
        </p>
      </CyberCard>

      {/* DASOM Insight */}
      <CyberCard className="bg-primary/5 border-primary/30">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="font-tech text-xs text-primary mb-1">DASOM INSIGHT</div>
            <p className="text-sm text-foreground">
              I've blocked <span className="text-primary font-semibold">3 intrusion attempts</span> while 
              you were sleeping. Your digital footprint remains secure.
            </p>
          </div>
        </div>
      </CyberCard>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2">
        <button 
          className="p-3 rounded-lg bg-success/10 border border-success/30 text-center hover:bg-success/20 transition-colors"
          onClick={() => sendMessage("Show detailed security scan results")}
        >
          <ShieldCheck className="w-5 h-5 text-success mx-auto mb-1" />
          <div className="text-xs text-muted-foreground">Safe</div>
        </button>
        <button 
          className="p-3 rounded-lg bg-card border border-primary/20 text-center hover:bg-secondary/50 transition-colors"
          onClick={() => sendMessage("Show permission audit details")}
        >
          <Eye className="w-5 h-5 text-primary mx-auto mb-1" />
          <div className="text-xs text-muted-foreground">Audit</div>
        </button>
        <button 
          className="p-3 rounded-lg bg-card border border-primary/20 text-center hover:bg-secondary/50 transition-colors"
          onClick={() => sendMessage("Analyze app permissions and suspicious activities")}
        >
          <Shield className="w-5 h-5 text-primary mx-auto mb-1" />
          <div className="text-xs text-muted-foreground">Apps</div>
        </button>
      </div>

      {/* Threat Summary */}
      <div className="grid grid-cols-2 gap-3">
        <CyberCard>
          <div className="text-xs text-muted-foreground font-tech mb-2">MALWARE SCAN</div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-success" />
            <span className="font-orbitron text-xl font-bold text-success">{threats}</span>
            <span className="text-sm text-muted-foreground">Threats</span>
          </div>
        </CyberCard>
        <CyberCard>
          <div className="text-xs text-muted-foreground font-tech mb-2">PERMISSIONS</div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <span className="font-orbitron text-xl font-bold text-warning">{highRiskApps}</span>
            <span className="text-sm text-muted-foreground">High Risk</span>
          </div>
        </CyberCard>
      </div>

      {/* Network Traffic */}
      <CyberCard>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-primary" />
            <span className="font-tech text-xs text-muted-foreground uppercase">Network Traffic</span>
          </div>
          <span className="text-xs text-success">Monitoring 12 active connections</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-success via-primary to-success w-full animate-pulse" />
        </div>
      </CyberCard>

      {/* Recommended Actions */}
      <div>
        <h3 className="font-tech text-sm text-muted-foreground mb-3 uppercase tracking-wider">
          Recommended Actions
        </h3>
        <div className="space-y-2">
          {riskyApps.map((app, i) => (
            <CyberCard 
              key={i} 
              className={`${app.risk === 'high' ? 'border-destructive/30' : 'border-warning/30'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${app.risk === 'high' ? 'bg-destructive/20' : 'bg-warning/20'}`}>
                    <AlertTriangle className={`w-4 h-4 ${app.risk === 'high' ? 'text-destructive' : 'text-warning'}`} />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{app.name}</div>
                    <div className="text-xs text-muted-foreground">{app.description}</div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={app.risk === 'high' ? 'destructive' : 'outline'}
                  onClick={() => sendMessage(`Revoke permissions for ${app.name}`)}
                >
                  {app.risk === 'high' ? 'Revoke' : 'Review'}
                </Button>
              </div>
            </CyberCard>
          ))}
        </div>
      </div>
    </div>
  );
}
