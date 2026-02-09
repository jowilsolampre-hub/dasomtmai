import { useState, useRef, useEffect } from "react";
import { CyberCard } from "@/components/dasom/CyberCard";
import { 
  Mic, Play, Pause, Check, Sparkles, Volume2, Zap, Heart, Brain, Shield,
  Moon, Wand2
} from "lucide-react";
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
  gender: "male" | "female";
  voiceNameHint?: string;
}

const maleVoices: VoicePersona[] = [
  { id: "james", name: "James", description: "Warm & calm English gentleman", icon: Shield, pitch: 0.85, rate: 0.92, voiceLang: "en-GB", gender: "male", voiceNameHint: "Daniel" },
  { id: "marcus", name: "Marcus", description: "Deep, soothing & reassuring", icon: Moon, pitch: 0.75, rate: 0.88, voiceLang: "en-US", gender: "male", voiceNameHint: "Aaron" },
  { id: "oliver", name: "Oliver", description: "Friendly & casual conversationalist", icon: Heart, pitch: 0.95, rate: 0.95, voiceLang: "en-GB", gender: "male", voiceNameHint: "Oliver" },
  { id: "ethan", name: "Ethan", description: "Relaxed & easygoing storyteller", icon: Sparkles, pitch: 0.9, rate: 0.9, voiceLang: "en-US", gender: "male", voiceNameHint: "Evan" },
  { id: "noah", name: "Noah", description: "Gentle & thoughtful advisor", icon: Brain, pitch: 0.8, rate: 0.85, voiceLang: "en-US", gender: "male", voiceNameHint: "Tom" },
];

const femaleVoices: VoicePersona[] = [
  { id: "sophia", name: "Sophia", description: "Warm & nurturing companion", icon: Heart, pitch: 1.05, rate: 0.92, voiceLang: "en-US", gender: "female", voiceNameHint: "Samantha" },
  { id: "emma", name: "Emma", description: "Soft-spoken & calming presence", icon: Moon, pitch: 1.1, rate: 0.88, voiceLang: "en-GB", gender: "female", voiceNameHint: "Kate" },
  { id: "aria", name: "Aria", description: "Smooth & elegant narrator", icon: Sparkles, pitch: 1.08, rate: 0.9, voiceLang: "en-US", gender: "female", voiceNameHint: "Ava" },
  { id: "lily", name: "Lily", description: "Cheerful & uplifting friend", icon: Zap, pitch: 1.15, rate: 0.95, voiceLang: "en-US", gender: "female", voiceNameHint: "Victoria" },
  { id: "grace", name: "Grace", description: "Poised & articulate speaker", icon: Brain, pitch: 1.02, rate: 0.93, voiceLang: "en-GB", gender: "female", voiceNameHint: "Fiona" },
  { id: "maya", name: "Maya", description: "Gentle & soothing whisperer", icon: Wand2, pitch: 1.12, rate: 0.82, voiceLang: "en-US", gender: "female", voiceNameHint: "Allison" },
];

const voicePersonas: VoicePersona[] = [...maleVoices, ...femaleVoices];

export function VoiceScreen() {
  const [selectedVoice, setSelectedVoice] = useState<string>(() => localStorage.getItem("dasom-voice") || "james");
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
    // Try exact name hint match first
    if (persona.voiceNameHint) {
      const hintMatch = voices.find(v => v.name.includes(persona.voiceNameHint!) && v.lang.startsWith(persona.voiceLang.split("-")[0]));
      if (hintMatch) return hintMatch;
    }
    // Then match by language
    const langMatch = voices.filter(v => v.lang.startsWith(persona.voiceLang.split("-")[0]));
    return langMatch[0] || voices[0];
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

    const utterance = new SpeechSynthesisUtterance(`Hello, I am ${persona.name}. ${persona.description}. How may I assist you today?`);
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
    if (persona) toast.success(`Voice persona updated to ${persona.name}`);
  };

  const currentVoice = voicePersonas.find(v => v.id === selectedVoice);

  const renderVoiceCard = (voice: VoicePersona) => {
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
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-tech text-muted-foreground">VOICE SYNTHESIS</div>
          <h2 className="font-orbitron text-2xl font-bold text-foreground flex items-center gap-2">
            <Volume2 className="w-6 h-6 text-primary" />
            {voicePersonas.length} VOICES
          </h2>
        </div>
      </div>

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

      <div>
        <h3 className="text-sm font-tech text-muted-foreground mb-2 uppercase tracking-wider">Male Voices</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {maleVoices.map(renderVoiceCard)}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-tech text-muted-foreground mb-2 uppercase tracking-wider">Female Voices</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {femaleVoices.map(renderVoiceCard)}
        </div>
      </div>

      <div className="fixed bottom-20 left-4 right-4 z-40">
        <Button
          className="w-full h-12 bg-gradient-to-r from-primary to-accent text-primary-foreground font-tech"
          onClick={() => toast.success("Voice persona applied successfully")}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          APPLY VOICE PERSONA
        </Button>
      </div>
    </div>
  );
}
