import { useState, useRef, useEffect } from "react";
import { CyberCard } from "@/components/dasom/CyberCard";
import { Mic, Play, Pause, Check, Volume2, Moon, Shield, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface VoicePersona {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  pitch: number;
  rate: number;
  voiceLang: string;
  voiceNameHint?: string;
}

const voicePersonas: VoicePersona[] = [
  {
    id: "deep-male",
    name: "Deep Male",
    description: "Deep, warm & soothing masculine voice",
    icon: Moon,
    pitch: 0.7,
    rate: 0.85,
    voiceLang: "en-GB",
    voiceNameHint: "Daniel",
  },
  {
    id: "calm-female",
    name: "Calm Female",
    description: "Calm, clear & Siri-like feminine voice",
    icon: Shield,
    pitch: 1.08,
    rate: 0.9,
    voiceLang: "en-US",
    voiceNameHint: "Samantha",
  },
  {
    id: "neutral-male",
    name: "Neutral Male",
    description: "Calm, professional & composed neutral voice",
    icon: Brain,
    pitch: 0.92,
    rate: 0.93,
    voiceLang: "en-US",
    voiceNameHint: "Aaron",
  },
];

export function VoiceScreen() {
  const [selectedVoice, setSelectedVoice] = useState<string>(
    () => localStorage.getItem("dasom-voice") || "deep-male"
  );
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  const findBestVoice = (persona: VoicePersona): SpeechSynthesisVoice | null => {
    if (!voices.length) return null;
    const enVoices = voices.filter(v => v.lang.startsWith("en"));
    const pool = enVoices.length ? enVoices : voices;

    if (persona.voiceNameHint) {
      const hintMatch = pool.find(v =>
        v.name.toLowerCase().includes(persona.voiceNameHint!.toLowerCase())
      );
      if (hintMatch) return hintMatch;
    }

    // Fallback: assign unique voice per persona index
    const idx = voicePersonas.findIndex(v => v.id === persona.id);
    return pool[idx % pool.length];
  };

  const handlePlayPreview = (personaId: string) => {
    const persona = voicePersonas.find(v => v.id === personaId);
    if (!persona) return;

    if (playingVoice === personaId) {
      window.speechSynthesis.cancel();
      setPlayingVoice(null);
      return;
    }

    window.speechSynthesis.cancel();

    const text = persona.id === "deep-male"
      ? "Hello. I'm here for you. Let me take care of everything."
      : persona.id === "calm-female"
      ? "Hi there. How can I help you today? Just let me know."
      : "Good day. I'm ready to assist you with anything you need.";

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = persona.pitch;
    utterance.rate = persona.rate;
    const voice = findBestVoice(persona);
    if (voice) utterance.voice = voice;

    utterance.onend = () => setPlayingVoice(null);
    utterance.onerror = () => { setPlayingVoice(null); toast.error("Speech synthesis failed"); };

    utteranceRef.current = utterance;
    setPlayingVoice(personaId);
    window.speechSynthesis.speak(utterance);
  };

  const handleSelectVoice = (voiceId: string) => {
    setSelectedVoice(voiceId);
    localStorage.setItem("dasom-voice", voiceId);
    const persona = voicePersonas.find(v => v.id === voiceId);
    if (persona) toast.success(`Voice set to ${persona.name}`);
  };

  const currentVoice = voicePersonas.find(v => v.id === selectedVoice);

  return (
    <div className="p-4 space-y-5 pb-24">
      <div>
        <div className="text-xs font-tech text-muted-foreground">VOICE SYNTHESIS</div>
        <h2 className="font-orbitron text-2xl font-bold text-foreground flex items-center gap-2">
          <Volume2 className="w-6 h-6 text-primary" />
          VOICE SELECT
        </h2>
      </div>

      {/* Current voice highlight */}
      {currentVoice && (
        <CyberCard variant="glow" className="border-primary/50">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/20">
              <currentVoice.icon className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-orbitron font-bold text-lg text-foreground">{currentVoice.name}</h3>
                <Check className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">{currentVoice.description}</p>
            </div>
            <Button size="icon" variant="outline" className="border-primary/30" onClick={() => handlePlayPreview(currentVoice.id)}>
              {playingVoice === currentVoice.id ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
          </div>
        </CyberCard>
      )}

      {/* Voice list */}
      <div className="space-y-3">
        <h3 className="text-sm font-tech text-muted-foreground uppercase tracking-wider">Available Voices</h3>
        {voicePersonas.map((voice) => {
          const Icon = voice.icon;
          const isSelected = selectedVoice === voice.id;
          const isPlaying = playingVoice === voice.id;

          return (
            <CyberCard
              key={voice.id}
              className={cn("cursor-pointer transition-all", isSelected && "border-primary/50 bg-primary/5")}
              onClick={() => handleSelectVoice(voice.id)}
            >
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", isSelected ? "bg-primary/20" : "bg-secondary/50")}>
                  <Icon className={cn("w-5 h-5", isSelected ? "text-primary" : "text-muted-foreground")} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground truncate">{voice.name}</h4>
                    {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{voice.description}</p>
                </div>
                <Button size="icon" variant="ghost" className="shrink-0" onClick={(e) => { e.stopPropagation(); handlePlayPreview(voice.id); }}>
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
              </div>
            </CyberCard>
          );
        })}
      </div>
    </div>
  );
}
