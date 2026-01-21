import { useState } from "react";
import { CyberCard } from "@/components/dasom/CyberCard";
import { useDasomChat } from "@/hooks/useDasomChat";
import { 
  Brain, 
  Mic, 
  Eye, 
  Wifi, 
  Shield, 
  Database,
  ChevronRight,
  User,
  Lock,
  Trash2,
  Sliders,
  Volume2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

export function SettingsScreen() {
  const [settings, setSettings] = useState({
    voiceSynthesis: "natural",
    empathyThreshold: 85,
    fullDeviceAccess: true,
    backgroundDiagnostics: true,
    holographicOverlay: false,
    localProcessingOnly: false,
  });
  const { sendMessage } = useDasomChat("settings");

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-orbitron text-lg font-bold text-foreground">
          SYSTEM CONFIG
        </h2>
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-primary" />
        </div>
      </div>

      {/* Profile Card */}
      <CyberCard variant="glow">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Brain className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-background flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </div>
          <div className="flex-1">
            <div className="font-orbitron font-bold text-lg text-foreground">
              DASOM Unit-01
            </div>
            <div className="text-sm text-muted-foreground">
              Neural Link: <span className="text-success">Active</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Sync Rate: <span className="text-primary">98%</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </CyberCard>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search neural protocols..."
          className="w-full px-4 py-3 bg-secondary/50 border border-primary/20 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
        />
      </div>

      {/* Neural Core Section */}
      <div>
        <h3 className="font-tech text-xs text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
          <Brain className="w-4 h-4" />
          NEURAL CORE (SOUL)
        </h3>
        
        <div className="space-y-2">
          {/* Voice Synthesis Mode */}
          <CyberCard>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">Voice Synthesis Mode</span>
              </div>
              <div className="flex gap-1">
                {["SYNTH", "NATURAL", "MUTED"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSettings(prev => ({ ...prev, voiceSynthesis: mode.toLowerCase() }))}
                    className={`px-3 py-1 text-xs font-tech rounded ${
                      settings.voiceSynthesis === mode.toLowerCase()
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </CyberCard>

          {/* Empathy Threshold */}
          <CyberCard>
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-foreground">Empathy Threshold</span>
              <span className="font-tech text-primary">{settings.empathyThreshold}%</span>
            </div>
            <Slider
              value={[settings.empathyThreshold]}
              onValueChange={(val) => setSettings(prev => ({ ...prev, empathyThreshold: val[0] }))}
              max={100}
              step={1}
              className="w-full"
            />
          </CyberCard>

          {/* Persona Archetype */}
          <CyberCard>
            <button 
              className="w-full flex items-center justify-between"
              onClick={() => sendMessage("Show available AI persona archetypes and voice profiles")}
            >
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <span className="font-semibold text-foreground">Persona Archetype</span>
                  <div className="text-xs text-muted-foreground">Logical Commander</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </CyberCard>
        </div>
      </div>

      {/* System Integration Section */}
      <div>
        <h3 className="font-tech text-xs text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
          <Wifi className="w-4 h-4" />
          SYSTEM INTEGRATION (BODY)
        </h3>
        
        <div className="space-y-2">
          <CyberCard>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-primary" />
                <div>
                  <span className="font-semibold text-foreground">Full Device Access</span>
                  <div className="text-xs text-muted-foreground">Read and interact with system files</div>
                </div>
              </div>
              <Switch 
                checked={settings.fullDeviceAccess}
                onCheckedChange={() => toggleSetting('fullDeviceAccess')}
              />
            </div>
          </CyberCard>

          <CyberCard>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">Background Diagnostics</span>
              </div>
              <Switch 
                checked={settings.backgroundDiagnostics}
                onCheckedChange={() => toggleSetting('backgroundDiagnostics')}
              />
            </div>
          </CyberCard>

          <CyberCard>
            <button 
              className="w-full flex items-center justify-between"
              onClick={() => sendMessage("Show automation rules configuration")}
            >
              <div className="flex items-center gap-3">
                <Sliders className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">Automation Rules</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </CyberCard>
        </div>
      </div>

      {/* Privacy Section */}
      <div>
        <h3 className="font-tech text-xs text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          PRIVACY (SHIELD)
        </h3>
        
        <div className="space-y-2">
          <CyberCard>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-success" />
                <div>
                  <span className="font-semibold text-foreground">Local Processing Only</span>
                  <div className="text-xs text-muted-foreground">Disconnect from cloud neural link</div>
                </div>
              </div>
              <Switch 
                checked={settings.localProcessingOnly}
                onCheckedChange={() => toggleSetting('localProcessingOnly')}
              />
            </div>
          </CyberCard>

          <CyberCard className="border-destructive/30">
            <button 
              className="w-full flex items-center justify-between"
              onClick={() => sendMessage("Explain what memory wipe does and confirm if I want to proceed")}
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-destructive" />
                <div>
                  <span className="font-semibold text-foreground">Memory Wipe</span>
                  <div className="text-xs text-muted-foreground">Irrevocable reset of learned patterns</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </CyberCard>
        </div>
      </div>

      {/* Sync Button */}
      <Button
        className="w-full h-14 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-orbitron"
        onClick={() => sendMessage("Sync neural core with current settings configuration")}
      >
        ⚡ SYNC NEURAL CORE
      </Button>
    </div>
  );
}
