import { useState } from "react";
import { CyberCard } from "@/components/dasom/CyberCard";
import { ProgressRing } from "@/components/dasom/ProgressRing";
import { useDasomChat } from "@/hooks/useDasomChat";
import { 
  HardDrive, 
  Trash2, 
  FileBox, 
  Image, 
  Archive,
  Zap,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CleanupItem {
  icon: typeof FileBox;
  label: string;
  size: string;
  description: string;
}

export function OptimizerScreen() {
  const [storageUsed, setStorageUsed] = useState(64);
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleaningComplete, setCleaningComplete] = useState(false);
  const { sendMessage, isLoading } = useDasomChat("optimizer");

  const cleanupItems: CleanupItem[] = [
    { icon: Trash2, label: "Junk Files", size: "490 MB found", description: "Temporary and cache files" },
    { icon: Archive, label: "Old APKs", size: "3 files found", description: "Outdated installation packages" },
    { icon: Image, label: "App Cache", size: "1.2 GB found", description: "Application cached data" },
  ];

  const runOptimization = async () => {
    setIsCleaning(true);
    setCleaningComplete(false);
    await sendMessage("Run system optimization: clean junk files, clear app caches, and remove old APKs. Report freed space and performance improvement.");
    setTimeout(() => {
      setStorageUsed(prev => Math.max(40, prev - 12));
      setIsCleaning(false);
      setCleaningComplete(true);
    }, 3000);
  };

  const storageBreakdown = [
    { label: "SYSTEM", value: 18, color: "bg-primary" },
    { label: "APPS", value: 24, color: "bg-accent" },
    { label: "MEDIA", value: 32, color: "bg-success" },
    { label: "CACHE", value: 8, color: "bg-warning" },
    { label: "TRASH", value: 6, color: "bg-destructive" },
  ];

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-orbitron text-lg font-bold text-foreground">
          <span className="text-muted-foreground">←</span> SYSTEM OPTIMIZATION
        </h2>
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-primary" />
          <span className="text-xs font-tech text-muted-foreground">DASOM CORE V.2.0</span>
        </div>
      </div>

      {/* Storage Usage Ring */}
      <CyberCard variant="glow" className="flex flex-col items-center py-6">
        <div className="text-xs font-tech text-muted-foreground mb-2 uppercase tracking-wider">
          USED SPACE
        </div>
        <ProgressRing 
          value={storageUsed}
          size={160}
          strokeWidth={12}
          color={storageUsed > 80 ? "warning" : "primary"}
        />
        <div className="mt-3 text-sm text-muted-foreground">
          <span className="text-foreground font-semibold">84GB</span> / 128GB
        </div>

        {/* Storage Breakdown */}
        <div className="mt-4 flex gap-4 text-xs">
          {storageBreakdown.slice(0, 4).map((item) => (
            <div key={item.label} className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${item.color}`} />
              <span className="text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </CyberCard>

      {/* Analysis Status */}
      <CyberCard className={cleaningComplete ? "border-success/30 bg-success/5" : "border-primary/30 bg-primary/5"}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${cleaningComplete ? 'bg-success/20' : 'bg-primary/20'}`}>
            {cleaningComplete ? (
              <CheckCircle2 className="w-5 h-5 text-success" />
            ) : (
              <Zap className="w-5 h-5 text-primary" />
            )}
          </div>
          <div className="flex-1">
            <div className="font-tech text-xs text-primary mb-1">
              {cleaningComplete ? '✓ OPTIMIZATION COMPLETE' : '↻ Analysis Complete'}
            </div>
            <p className="text-sm text-foreground">
              {cleaningComplete 
                ? "Freed 1.69GB of storage. System performance improved by 15%." 
                : "System efficiency is at 82%. 1.69GB of redundant data detected. Optimization recommended."}
            </p>
            {!cleaningComplete && (
              <Button
                size="sm"
                className="mt-3"
                variant="outline"
                onClick={() => sendMessage("Show detailed analysis of redundant data")}
              >
                View Details
              </Button>
            )}
          </div>
        </div>
      </CyberCard>

      {/* Cleanup Items */}
      <div className="space-y-2">
        {cleanupItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <CyberCard key={i}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.size}</div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-primary hover:bg-primary/20"
                  onClick={() => sendMessage(`Clean ${item.label.toLowerCase()} to free up space`)}
                >
                  Clean
                </Button>
              </div>
            </CyberCard>
          );
        })}
      </div>

      {/* RAM Status */}
      <div className="grid grid-cols-2 gap-3">
        <CyberCard>
          <div className="text-xs font-tech text-muted-foreground mb-2 uppercase">RAM STATUS</div>
          <div className="flex items-baseline gap-2">
            <span className="font-orbitron text-2xl font-bold text-foreground">5.4</span>
            <span className="text-sm text-muted-foreground">GB / 8GB</span>
          </div>
          <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-accent w-[68%]" />
          </div>
        </CyberCard>

        <CyberCard>
          <div className="text-xs font-tech text-muted-foreground mb-2 uppercase">PROCESSES</div>
          <div className="flex items-baseline gap-2">
            <span className="font-orbitron text-2xl font-bold text-foreground">47</span>
            <span className="text-sm text-success">Active</span>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            12 background tasks
          </div>
        </CyberCard>
      </div>

      {/* Quick Boost Button */}
      <Button
        className="w-full h-14 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-orbitron text-lg"
        onClick={runOptimization}
        disabled={isCleaning || isLoading}
      >
        {isCleaning ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            OPTIMIZING...
          </>
        ) : (
          <>
            <Zap className="w-5 h-5 mr-2" />
            QUICK BOOST OPTIMIZATION
          </>
        )}
      </Button>
    </div>
  );
}
