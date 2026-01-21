import { useState, useEffect } from "react";
import { CyberCard } from "@/components/dasom/CyberCard";
import { ProgressRing } from "@/components/dasom/ProgressRing";
import { MetricCard } from "@/components/dasom/MetricCard";
import { useDasomChat } from "@/hooks/useDasomChat";
import { 
  Thermometer, 
  Zap, 
  Clock, 
  Cpu, 
  HardDrive,
  Wifi,
  Activity,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SystemMetrics {
  cpu: number;
  ram: number;
  storage: number;
  temperature: number;
  batteryDrain: number;
  latency: number;
}

export function DiagnosticsScreen() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 32,
    ram: 68,
    storage: 64,
    temperature: 34,
    batteryDrain: 12,
    latency: 24,
  });
  const [cpuHistory, setCpuHistory] = useState<number[]>([28, 35, 32, 40, 38, 32, 30, 35]);
  const [isScanning, setIsScanning] = useState(false);
  const { sendMessage, isLoading } = useDasomChat("diagnostics");

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        cpu: Math.max(10, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)),
        ram: Math.max(40, Math.min(95, prev.ram + (Math.random() - 0.5) * 5)),
        temperature: Math.max(28, Math.min(50, prev.temperature + (Math.random() - 0.5) * 3)),
        latency: Math.max(10, Math.min(100, prev.latency + (Math.random() - 0.5) * 20)),
      }));

      setCpuHistory(prev => [...prev.slice(1), metrics.cpu]);
    }, 2000);

    return () => clearInterval(interval);
  }, [metrics.cpu]);

  const runDiagnostics = async () => {
    setIsScanning(true);
    await sendMessage("Run a full system diagnostic scan and report all metrics including CPU, RAM, storage, temperature, and network status.");
    setTimeout(() => setIsScanning(false), 2000);
  };

  const getTemperatureStatus = () => {
    if (metrics.temperature > 45) return "critical";
    if (metrics.temperature > 38) return "warning";
    return "normal";
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-orbitron text-lg font-bold text-foreground">
          DASOM <span className="text-primary">//</span> DIAGNOSTICS
        </h2>
        <Button
          size="sm"
          variant="outline"
          onClick={runDiagnostics}
          disabled={isScanning || isLoading}
          className="border-primary/30 hover:bg-primary/20"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
          Scan
        </Button>
      </div>

      {/* Main Progress Ring */}
      <CyberCard variant="glow" className="flex flex-col items-center py-6">
        <ProgressRing 
          value={100 - Math.round((metrics.cpu + metrics.ram) / 2 * 0.5)} 
          size={140}
          color="primary"
          label="Health"
        />
        <div className="mt-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <span className="text-sm font-tech text-primary">AI CORE: OPTIMIZED</span>
        </div>
      </CyberCard>

      {/* Quick Metrics */}
      <div className="grid grid-cols-3 gap-2">
        <MetricCard
          icon={Thermometer}
          label="TEMP"
          value={Math.round(metrics.temperature)}
          unit="°C"
          status={getTemperatureStatus()}
        />
        <MetricCard
          icon={Zap}
          label="DRAIN"
          value={`-${Math.round(metrics.batteryDrain)}`}
          unit="mA"
        />
        <MetricCard
          icon={Clock}
          label="LATENCY"
          value={Math.round(metrics.latency)}
          unit="ms"
        />
      </div>

      {/* CPU Chart */}
      <CyberCard>
        <div className="flex items-center justify-between mb-3">
          <span className="font-tech text-xs text-muted-foreground uppercase tracking-wider">
            CPU LOAD (LAST 60S)
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">CORE_01 -</span>
            <span className="text-xs text-primary">ACTIVE</span>
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-orbitron text-3xl font-bold text-foreground">
            {Math.round(metrics.cpu)}%
          </span>
          <span className={`text-xs ${metrics.cpu > cpuHistory[cpuHistory.length - 2] ? 'text-warning' : 'text-success'}`}>
            {metrics.cpu > cpuHistory[cpuHistory.length - 2] ? '↑+4%' : '↓-2%'}
          </span>
        </div>
        {/* Simple chart visualization */}
        <div className="h-20 flex items-end gap-1">
          {cpuHistory.map((val, i) => (
            <div
              key={i}
              className="flex-1 bg-primary/30 rounded-t transition-all duration-300"
              style={{ 
                height: `${val}%`,
                background: i === cpuHistory.length - 1 
                  ? 'linear-gradient(to top, hsl(var(--primary)), hsl(var(--accent)))'
                  : undefined
              }}
            />
          ))}
        </div>
      </CyberCard>

      {/* RAM & Storage */}
      <div className="grid grid-cols-2 gap-3">
        <CyberCard>
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-4 h-4 text-primary" />
            <span className="font-tech text-xs text-muted-foreground uppercase">RAM USAGE</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-orbitron text-xl font-bold">{Math.round(metrics.ram)}%</span>
            <span className="text-xs text-muted-foreground">6.2GB / 8GB</span>
          </div>
          <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${metrics.ram}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Neural Engine <span className="text-success">Active</span>
          </div>
        </CyberCard>

        <CyberCard>
          <div className="flex items-center gap-2 mb-2">
            <HardDrive className="w-4 h-4 text-primary" />
            <span className="font-tech text-xs text-muted-foreground uppercase">STORAGE</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-orbitron text-xl font-bold">{metrics.storage}%</span>
            <span className="text-xs text-muted-foreground">84GB / 128GB</span>
          </div>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">MEDIA</span>
              <span className="text-foreground">32GB</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">CACHE</span>
              <span className="text-foreground">8GB</span>
            </div>
          </div>
        </CyberCard>
      </div>

      {/* Optimization Suggestion */}
      <CyberCard className="border-warning/30 bg-warning/5">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-warning/20">
            <AlertTriangle className="w-5 h-5 text-warning" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-foreground mb-1">
              Optimization Suggested
            </div>
            <p className="text-sm text-muted-foreground">
              5 background processes are consuming excessive power. 
              Terminate to improve battery life?
            </p>
            <Button 
              size="sm" 
              className="mt-3 bg-warning hover:bg-warning/80 text-warning-foreground"
              onClick={() => sendMessage("Terminate unnecessary background processes to optimize performance")}
            >
              Resolve
            </Button>
          </div>
        </div>
      </CyberCard>
    </div>
  );
}
