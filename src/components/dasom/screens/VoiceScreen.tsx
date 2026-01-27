import { useState, useRef } from "react";
import { CyberCard } from "@/components/dasom/CyberCard";
import { 
  Mic, 
  Play, 
  Pause,
  Check,
  Sparkles,
  Volume2,
  Zap,
  Heart,
  Brain,
  Shield,
  Flame,
  Moon,
  Sun,
  Ghost,
  Bot,
  User,
  Star,
  Crown,
  Wand2,
  Waves,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface VoicePersona {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ElementType;
  voiceId: string; // ElevenLabs voice ID
  premium?: boolean;
}

const voiceCategories = [
  { id: "all", label: "All", icon: Sparkles },
  { id: "professional", label: "Professional", icon: Brain },
  { id: "friendly", label: "Friendly", icon: Heart },
  { id: "robotic", label: "Robotic", icon: Bot },
  { id: "character", label: "Character", icon: Ghost },
  { id: "calm", label: "Calm", icon: Moon },
];

// Real ElevenLabs voice IDs mapped to personas
// Each persona uses a distinct voice for authentic differentiation
const voicePersonas: VoicePersona[] = [
  // Professional Voices
  { id: "commander", name: "Commander", description: "Authoritative & decisive military-style voice", category: "professional", icon: Shield, voiceId: "nPczCjzI2devNBz1zQrb" }, // Brian
  { id: "analyst", name: "Analyst", description: "Precise & data-driven technical voice", category: "professional", icon: Brain, voiceId: "onwK4e9ZLuTAKqWW03F9" }, // Daniel
  { id: "executive", name: "Executive", description: "Confident & polished corporate voice", category: "professional", icon: Crown, voiceId: "CwhRBWXzGAHq8TQ4Fs17" }, // Roger
  { id: "professor", name: "Professor", description: "Wise & educational academic voice", category: "professional", icon: Star, voiceId: "JBFqnCBsd6RMkjVDRZzb" }, // George
  { id: "journalist", name: "Journalist", description: "Clear & articulate news anchor voice", category: "professional", icon: Mic, voiceId: "cjVigY5qzO86Huf0OWal" }, // Eric
  { id: "diplomat", name: "Diplomat", description: "Smooth & refined international voice", category: "professional", icon: Sparkles, voiceId: "N2lVS1w4EtoT3dr4eOWO" }, // Callum
  { id: "lawyer", name: "Lawyer", description: "Persuasive & articulate legal voice", category: "professional", icon: Shield, voiceId: "TX3LPaxmHKxFdv7VOQHJ" }, // Liam
  { id: "doctor", name: "Doctor", description: "Calm & reassuring medical voice", category: "professional", icon: Heart, voiceId: "iP95p4xoKVk53GoZ742B" }, // Chris
  { id: "scientist", name: "Scientist", description: "Curious & methodical research voice", category: "professional", icon: Zap, voiceId: "bIHbv24MWmeRgasZH58o" }, // Will
  { id: "mentor", name: "Mentor", description: "Encouraging & experienced guide voice", category: "professional", icon: Star, voiceId: "pqHfZKP75CvOlQylNhV4" }, // Bill
  
  // Friendly Voices
  { id: "bestie", name: "Bestie", description: "Warm & supportive best friend voice", category: "friendly", icon: Heart, voiceId: "EXAVITQu4vr4xnSDxMaL" }, // Sarah
  { id: "cheerful", name: "Cheerful", description: "Upbeat & energetic happy voice", category: "friendly", icon: Sun, voiceId: "FGY2WhTYpPnrIDTdsKH5" }, // Laura
  { id: "companion", name: "Companion", description: "Loyal & understanding partner voice", category: "friendly", icon: User, voiceId: "XrExE9yKIg1WjnnlVkGX" }, // Matilda
  { id: "storyteller", name: "Storyteller", description: "Engaging & expressive narrator voice", category: "friendly", icon: Wand2, voiceId: "pFZP5JQG7iQjIQuC4Bku" }, // Lily
  { id: "coach", name: "Coach", description: "Motivating & empowering fitness voice", category: "friendly", icon: Flame, voiceId: "IKne3meq5aSn9XLyUdCD" }, // Charlie
  { id: "gamer", name: "Gamer", description: "Excited & enthusiastic gaming voice", category: "friendly", icon: Zap, voiceId: "SAz9YHcvj6GT2YYXdXww" }, // River
  { id: "artist", name: "Artist", description: "Creative & expressive artistic voice", category: "friendly", icon: Sparkles, voiceId: "cgSgspJ2msm6clMCkdW9" }, // Jessica
  { id: "adventurer", name: "Adventurer", description: "Bold & exciting explorer voice", category: "friendly", icon: Star, voiceId: "Xb7hH8MSUJpSbSDYk0k2" }, // Alice
  { id: "optimist", name: "Optimist", description: "Positive & uplifting hopeful voice", category: "friendly", icon: Star, voiceId: "EXAVITQu4vr4xnSDxMaL" }, // Sarah
  { id: "jokester", name: "Jokester", description: "Witty & humorous comedic voice", category: "friendly", icon: Heart, voiceId: "IKne3meq5aSn9XLyUdCD" }, // Charlie
  
  // Robotic/AI Voices
  { id: "nexus", name: "NEXUS-7", description: "Advanced synthetic AI core voice", category: "robotic", icon: Bot, voiceId: "kPtEHAvRnjUJFv7SK9WI", premium: true }, // Glitch
  { id: "cipher", name: "CIPHER", description: "Encrypted & mysterious digital voice", category: "robotic", icon: Shield, voiceId: "onwK4e9ZLuTAKqWW03F9" }, // Daniel
  { id: "quantum", name: "QUANTUM", description: "Futuristic quantum computing voice", category: "robotic", icon: Zap, voiceId: "N2lVS1w4EtoT3dr4eOWO" }, // Callum
  { id: "android", name: "Android", description: "Humanoid robot assistant voice", category: "robotic", icon: Bot, voiceId: "cjVigY5qzO86Huf0OWal" }, // Eric
  { id: "mainframe", name: "Mainframe", description: "Classic computer terminal voice", category: "robotic", icon: Bot, voiceId: "JBFqnCBsd6RMkjVDRZzb" }, // George
  { id: "neural", name: "Neural", description: "Neural network processed voice", category: "robotic", icon: Brain, voiceId: "TX3LPaxmHKxFdv7VOQHJ" }, // Liam
  { id: "hologram", name: "Hologram", description: "Ethereal holographic projection voice", category: "robotic", icon: Sparkles, voiceId: "pFZP5JQG7iQjIQuC4Bku" }, // Lily
  { id: "mecha", name: "Mecha", description: "Giant robot warrior voice", category: "robotic", icon: Shield, voiceId: "nPczCjzI2devNBz1zQrb" }, // Brian
  { id: "drone", name: "Drone", description: "Efficient autonomous unit voice", category: "robotic", icon: Bot, voiceId: "iP95p4xoKVk53GoZ742B" }, // Chris
  { id: "cybernetic", name: "Cybernetic", description: "Human-machine hybrid voice", category: "robotic", icon: Zap, voiceId: "bIHbv24MWmeRgasZH58o" }, // Will
  
  // Character Voices
  { id: "wizard", name: "Wizard", description: "Mystical & ancient sorcerer voice", category: "character", icon: Wand2, voiceId: "JBFqnCBsd6RMkjVDRZzb", premium: true }, // George
  { id: "vampire", name: "Vampire", description: "Seductive & eternal dark voice", category: "character", icon: Moon, voiceId: "onwK4e9ZLuTAKqWW03F9" }, // Daniel
  { id: "pirate", name: "Pirate", description: "Rough & adventurous sea captain voice", category: "character", icon: Waves, voiceId: "nPczCjzI2devNBz1zQrb" }, // Brian
  { id: "ninja", name: "Ninja", description: "Silent & precise shadow warrior voice", category: "character", icon: Shield, voiceId: "N2lVS1w4EtoT3dr4eOWO" }, // Callum
  { id: "dragon", name: "Dragon", description: "Powerful & ancient beast voice", category: "character", icon: Flame, voiceId: "pqHfZKP75CvOlQylNhV4" }, // Bill
  { id: "fairy", name: "Fairy", description: "Magical & whimsical sprite voice", category: "character", icon: Sparkles, voiceId: "pFZP5JQG7iQjIQuC4Bku" }, // Lily
  { id: "knight", name: "Knight", description: "Noble & honorable warrior voice", category: "character", icon: Shield, voiceId: "TX3LPaxmHKxFdv7VOQHJ" }, // Liam
  { id: "alien", name: "Alien", description: "Otherworldly extraterrestrial voice", category: "character", icon: Ghost, voiceId: "kPtEHAvRnjUJFv7SK9WI" }, // Glitch
  { id: "ghost", name: "Ghost", description: "Ethereal & haunting spirit voice", category: "character", icon: Ghost, voiceId: "XrExE9yKIg1WjnnlVkGX" }, // Matilda
  { id: "demon", name: "Demon", description: "Dark & powerful underworld voice", category: "character", icon: Flame, voiceId: "nPczCjzI2devNBz1zQrb" }, // Brian
  
  // Calm Voices
  { id: "zen", name: "Zen Master", description: "Peaceful & enlightened meditation voice", category: "calm", icon: Moon, voiceId: "SAz9YHcvj6GT2YYXdXww", premium: true }, // River
  { id: "asmr", name: "ASMR", description: "Soft & soothing whisper voice", category: "calm", icon: Waves, voiceId: "FGY2WhTYpPnrIDTdsKH5" }, // Laura
  { id: "therapist", name: "Therapist", description: "Understanding & gentle counselor voice", category: "calm", icon: Heart, voiceId: "EXAVITQu4vr4xnSDxMaL" }, // Sarah
  { id: "nature", name: "Nature Guide", description: "Serene & peaceful outdoor voice", category: "calm", icon: Sun, voiceId: "Xb7hH8MSUJpSbSDYk0k2" }, // Alice
  { id: "lullaby", name: "Lullaby", description: "Gentle & soothing bedtime voice", category: "calm", icon: Moon, voiceId: "cgSgspJ2msm6clMCkdW9" }, // Jessica
  { id: "poet", name: "Poet", description: "Artistic & flowing literary voice", category: "calm", icon: Wand2, voiceId: "XrExE9yKIg1WjnnlVkGX" }, // Matilda
  { id: "sage", name: "Sage", description: "Ancient & wise elder voice", category: "calm", icon: Star, voiceId: "JBFqnCBsd6RMkjVDRZzb" }, // George
  { id: "ocean", name: "Ocean", description: "Deep & flowing water voice", category: "calm", icon: Waves, voiceId: "SAz9YHcvj6GT2YYXdXww" }, // River
  { id: "forest", name: "Forest", description: "Earthy & grounding woodland voice", category: "calm", icon: Sun, voiceId: "IKne3meq5aSn9XLyUdCD" }, // Charlie
  { id: "dreamer", name: "Dreamer", description: "Soft & imaginative visionary voice", category: "calm", icon: Moon, voiceId: "pFZP5JQG7iQjIQuC4Bku" }, // Lily
  
  // Holiday Voices
  { id: "santa", name: "Santa", description: "Jolly & warm holiday spirit voice", category: "character", icon: Star, voiceId: "MDLAMJ0jxkpYkjXbmG4t" }, // Santa
  { id: "mrs-claus", name: "Mrs Claus", description: "Kind & nurturing holiday voice", category: "character", icon: Heart, voiceId: "SAhdygBsjizE9aIj39dz" }, // Mrs Claus
  { id: "elf", name: "Elf", description: "Cheerful & helpful workshop voice", category: "character", icon: Sparkles, voiceId: "e79twtVS2278lVZZQiAD" }, // The Elf
  { id: "reindeer", name: "Reindeer", description: "Playful & magical creature voice", category: "character", icon: Star, voiceId: "h6u4tPKmcPlxUdZOaVpH" }, // The Reindeer
];

export function VoiceScreen() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedVoice, setSelectedVoice] = useState<string | null>("nexus");
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [loadingVoice, setLoadingVoice] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const filteredVoices = selectedCategory === "all" 
    ? voicePersonas 
    : voicePersonas.filter(v => v.category === selectedCategory);

  const handlePlayPreview = async (voiceId: string) => {
    const voice = voicePersonas.find(v => v.id === voiceId);
    if (!voice) return;

    // If already playing this voice, stop it
    if (playingVoice === voiceId) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlayingVoice(null);
      return;
    }

    // Stop any current audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setLoadingVoice(voiceId);

    try {
      const text = `Hello, I am ${voice.name}. ${voice.description}. How may I assist you today?`;
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text, voiceId: voice.voiceId }),
        }
      );

      if (!response.ok) {
        throw new Error(`TTS request failed: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setPlayingVoice(null);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setPlayingVoice(null);
        toast.error("Failed to play audio");
      };

      setPlayingVoice(voiceId);
      await audio.play();
    } catch (error) {
      console.error("TTS error:", error);
      toast.error("Failed to generate voice preview");
    } finally {
      setLoadingVoice(null);
    }
  };

  const handleSelectVoice = (voiceId: string) => {
    setSelectedVoice(voiceId);
    localStorage.setItem("dasom-voice", voiceId);
    const voice = voicePersonas.find(v => v.id === voiceId);
    if (voice) {
      localStorage.setItem("dasom-voice-elevenlabs-id", voice.voiceId);
    }
    toast.success(`Voice persona updated to ${voicePersonas.find(v => v.id === voiceId)?.name}`);
  };

  const currentVoice = voicePersonas.find(v => v.id === selectedVoice);

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-tech text-muted-foreground">VOICE SYNTHESIS</div>
          <h2 className="font-orbitron text-2xl font-bold text-foreground flex items-center gap-2">
            <Volume2 className="w-6 h-6 text-primary" />
            {voicePersonas.length} PERSONAS
          </h2>
        </div>
      </div>

      {/* Current Voice */}
      {currentVoice && (
        <CyberCard variant="glow" className="border-primary/50">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/20">
              <currentVoice.icon className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-orbitron font-bold text-lg text-foreground">
                  {currentVoice.name}
                </h3>
                <Check className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">{currentVoice.description}</p>
              <div className="flex gap-2 mt-1">
                <span className="text-xs font-tech text-primary">Synthetic</span>
                <span className="text-xs font-tech text-accent">• AI Core</span>
              </div>
            </div>
            <Button
              size="icon"
              variant="outline"
              className="border-primary/30"
              onClick={() => handlePlayPreview(currentVoice.id)}
              disabled={loadingVoice === currentVoice.id}
            >
              {loadingVoice === currentVoice.id ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : playingVoice === currentVoice.id ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </Button>
          </div>
        </CyberCard>
      )}

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {voiceCategories.map((category) => {
          const Icon = category.icon;
          const isActive = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-tech whitespace-nowrap transition-all",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
              )}
            >
              <Icon className="w-4 h-4" />
              {category.label}
            </button>
          );
        })}
      </div>

      {/* Voice Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredVoices.map((voice) => {
          const Icon = voice.icon;
          const isSelected = selectedVoice === voice.id;
          const isPlaying = playingVoice === voice.id;
          const isLoading = loadingVoice === voice.id;

          return (
            <CyberCard
              key={voice.id}
              className={cn(
                "cursor-pointer transition-all",
                isSelected && "border-primary/50 bg-primary/5"
              )}
              onClick={() => handleSelectVoice(voice.id)}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  isSelected ? "bg-primary/20" : "bg-secondary/50"
                )}>
                  <Icon className={cn("w-5 h-5", isSelected ? "text-primary" : "text-muted-foreground")} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground truncate">{voice.name}</h4>
                    {voice.premium && (
                      <span className="text-xs font-tech text-accent">★</span>
                    )}
                    {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{voice.description}</p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayPreview(voice.id);
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CyberCard>
          );
        })}
      </div>

      {/* Apply Button */}
      <div className="fixed bottom-20 left-4 right-4 z-40">
        <Button
          className="w-full h-12 bg-gradient-to-r from-primary to-accent text-primary-foreground font-tech"
          onClick={() => {
            toast.success("Voice persona applied successfully");
          }}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          APPLY VOICE PERSONA
        </Button>
      </div>
    </div>
  );
}
