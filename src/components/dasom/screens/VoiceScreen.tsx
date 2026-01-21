import { useState } from "react";
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
  Waves
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VoicePersona {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ElementType;
  accent: string;
  style: string;
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

const voicePersonas: VoicePersona[] = [
  // Professional Voices
  { id: "commander", name: "Commander", description: "Authoritative & decisive military-style voice", category: "professional", icon: Shield, accent: "American", style: "Commanding" },
  { id: "analyst", name: "Analyst", description: "Precise & data-driven technical voice", category: "professional", icon: Brain, accent: "British", style: "Analytical" },
  { id: "executive", name: "Executive", description: "Confident & polished corporate voice", category: "professional", icon: Crown, accent: "American", style: "Professional" },
  { id: "professor", name: "Professor", description: "Wise & educational academic voice", category: "professional", icon: Star, accent: "British", style: "Educational" },
  { id: "journalist", name: "Journalist", description: "Clear & articulate news anchor voice", category: "professional", icon: Mic, accent: "American", style: "Broadcast" },
  { id: "diplomat", name: "Diplomat", description: "Smooth & refined international voice", category: "professional", icon: Sparkles, accent: "European", style: "Diplomatic" },
  { id: "lawyer", name: "Lawyer", description: "Persuasive & articulate legal voice", category: "professional", icon: Shield, accent: "American", style: "Formal" },
  { id: "doctor", name: "Doctor", description: "Calm & reassuring medical voice", category: "professional", icon: Heart, accent: "British", style: "Clinical" },
  { id: "scientist", name: "Scientist", description: "Curious & methodical research voice", category: "professional", icon: Zap, accent: "German", style: "Scientific" },
  { id: "mentor", name: "Mentor", description: "Encouraging & experienced guide voice", category: "professional", icon: Star, accent: "American", style: "Guiding" },
  
  // Friendly Voices
  { id: "bestie", name: "Bestie", description: "Warm & supportive best friend voice", category: "friendly", icon: Heart, accent: "American", style: "Casual" },
  { id: "cheerful", name: "Cheerful", description: "Upbeat & energetic happy voice", category: "friendly", icon: Sun, accent: "Australian", style: "Energetic" },
  { id: "companion", name: "Companion", description: "Loyal & understanding partner voice", category: "friendly", icon: User, accent: "British", style: "Supportive" },
  { id: "storyteller", name: "Storyteller", description: "Engaging & expressive narrator voice", category: "friendly", icon: Wand2, accent: "Irish", style: "Narrative" },
  { id: "coach", name: "Coach", description: "Motivating & empowering fitness voice", category: "friendly", icon: Flame, accent: "American", style: "Motivational" },
  { id: "gamer", name: "Gamer", description: "Excited & enthusiastic gaming voice", category: "friendly", icon: Zap, accent: "American", style: "Playful" },
  { id: "artist", name: "Artist", description: "Creative & expressive artistic voice", category: "friendly", icon: Sparkles, accent: "French", style: "Creative" },
  { id: "adventurer", name: "Adventurer", description: "Bold & exciting explorer voice", category: "friendly", icon: Star, accent: "Australian", style: "Adventurous" },
  { id: "optimist", name: "Optimist", description: "Positive & uplifting hopeful voice", category: "friendly", icon: Star, accent: "American", style: "Positive" },
  { id: "jokester", name: "Jokester", description: "Witty & humorous comedic voice", category: "friendly", icon: Heart, accent: "British", style: "Comedic" },
  
  // Robotic Voices
  { id: "nexus", name: "NEXUS-7", description: "Advanced synthetic AI core voice", category: "robotic", icon: Bot, accent: "Synthetic", style: "AI Core", premium: true },
  { id: "cipher", name: "CIPHER", description: "Encrypted & mysterious digital voice", category: "robotic", icon: Shield, accent: "Synthetic", style: "Encrypted" },
  { id: "quantum", name: "QUANTUM", description: "Futuristic quantum computing voice", category: "robotic", icon: Zap, accent: "Synthetic", style: "Quantum" },
  { id: "android", name: "Android", description: "Humanoid robot assistant voice", category: "robotic", icon: Bot, accent: "Synthetic", style: "Humanoid" },
  { id: "mainframe", name: "Mainframe", description: "Classic computer terminal voice", category: "robotic", icon: Bot, accent: "Synthetic", style: "Retro" },
  { id: "neural", name: "Neural", description: "Neural network processed voice", category: "robotic", icon: Brain, accent: "Synthetic", style: "Neural" },
  { id: "hologram", name: "Hologram", description: "Ethereal holographic projection voice", category: "robotic", icon: Sparkles, accent: "Synthetic", style: "Holographic" },
  { id: "mecha", name: "Mecha", description: "Giant robot warrior voice", category: "robotic", icon: Shield, accent: "Japanese", style: "Mechanical" },
  { id: "drone", name: "Drone", description: "Efficient autonomous unit voice", category: "robotic", icon: Bot, accent: "Synthetic", style: "Autonomous" },
  { id: "cybernetic", name: "Cybernetic", description: "Human-machine hybrid voice", category: "robotic", icon: Zap, accent: "Synthetic", style: "Hybrid" },
  
  // Character Voices
  { id: "wizard", name: "Wizard", description: "Mystical & ancient sorcerer voice", category: "character", icon: Wand2, accent: "British", style: "Mystical", premium: true },
  { id: "vampire", name: "Vampire", description: "Seductive & eternal dark voice", category: "character", icon: Moon, accent: "Romanian", style: "Gothic" },
  { id: "pirate", name: "Pirate", description: "Rough & adventurous sea captain voice", category: "character", icon: Waves, accent: "British", style: "Seafarer" },
  { id: "ninja", name: "Ninja", description: "Silent & precise shadow warrior voice", category: "character", icon: Shield, accent: "Japanese", style: "Stealth" },
  { id: "dragon", name: "Dragon", description: "Powerful & ancient beast voice", category: "character", icon: Flame, accent: "Deep", style: "Legendary" },
  { id: "fairy", name: "Fairy", description: "Magical & whimsical sprite voice", category: "character", icon: Sparkles, accent: "Irish", style: "Magical" },
  { id: "knight", name: "Knight", description: "Noble & honorable warrior voice", category: "character", icon: Shield, accent: "British", style: "Chivalrous" },
  { id: "alien", name: "Alien", description: "Otherworldly extraterrestrial voice", category: "character", icon: Ghost, accent: "Unknown", style: "Extraterrestrial" },
  { id: "ghost", name: "Ghost", description: "Ethereal & haunting spirit voice", category: "character", icon: Ghost, accent: "Whispered", style: "Spectral" },
  { id: "demon", name: "Demon", description: "Dark & powerful underworld voice", category: "character", icon: Flame, accent: "Deep", style: "Infernal" },
  
  // Calm Voices
  { id: "zen", name: "Zen Master", description: "Peaceful & enlightened meditation voice", category: "calm", icon: Moon, accent: "Asian", style: "Meditative", premium: true },
  { id: "asmr", name: "ASMR", description: "Soft & soothing whisper voice", category: "calm", icon: Waves, accent: "American", style: "Whisper" },
  { id: "therapist", name: "Therapist", description: "Understanding & gentle counselor voice", category: "calm", icon: Heart, accent: "American", style: "Therapeutic" },
  { id: "nature", name: "Nature Guide", description: "Serene & peaceful outdoor voice", category: "calm", icon: Sun, accent: "Australian", style: "Natural" },
  { id: "lullaby", name: "Lullaby", description: "Gentle & soothing bedtime voice", category: "calm", icon: Moon, accent: "British", style: "Soothing" },
  { id: "poet", name: "Poet", description: "Artistic & flowing literary voice", category: "calm", icon: Wand2, accent: "British", style: "Poetic" },
  { id: "sage", name: "Sage", description: "Ancient & wise elder voice", category: "calm", icon: Star, accent: "Indian", style: "Wisdom" },
  { id: "ocean", name: "Ocean", description: "Deep & flowing water voice", category: "calm", icon: Waves, accent: "Hawaiian", style: "Oceanic" },
  { id: "forest", name: "Forest", description: "Earthy & grounding woodland voice", category: "calm", icon: Sun, accent: "Celtic", style: "Woodland" },
  { id: "dreamer", name: "Dreamer", description: "Soft & imaginative visionary voice", category: "calm", icon: Moon, accent: "French", style: "Dreamlike" },
  
  // Additional Premium Voices
  { id: "celestial", name: "Celestial", description: "Divine & heavenly angelic voice", category: "character", icon: Star, accent: "Ethereal", style: "Divine", premium: true },
  { id: "phoenix", name: "Phoenix", description: "Reborn & powerful fire bird voice", category: "character", icon: Flame, accent: "Mythical", style: "Legendary", premium: true },
  { id: "oracle", name: "Oracle", description: "Prophetic & mysterious seer voice", category: "calm", icon: Moon, accent: "Greek", style: "Prophetic", premium: true },
  { id: "titan", name: "Titan", description: "Immense & powerful giant voice", category: "character", icon: Shield, accent: "Deep", style: "Colossal", premium: true },
  
  // More variety voices
  { id: "butler", name: "Butler", description: "Refined & proper servant voice", category: "professional", icon: Crown, accent: "British", style: "Formal" },
  { id: "detective", name: "Detective", description: "Sharp & observant investigator voice", category: "professional", icon: Brain, accent: "American", style: "Noir" },
  { id: "pilot", name: "Pilot", description: "Cool & collected aviator voice", category: "professional", icon: Zap, accent: "American", style: "Aviation" },
  { id: "chef", name: "Chef", description: "Passionate & expressive culinary voice", category: "friendly", icon: Flame, accent: "Italian", style: "Culinary" },
  { id: "musician", name: "Musician", description: "Rhythmic & melodic artist voice", category: "friendly", icon: Waves, accent: "American", style: "Musical" },
  { id: "surfer", name: "Surfer", description: "Laid-back & chill beach voice", category: "friendly", icon: Waves, accent: "Californian", style: "Relaxed" },
  { id: "cowboy", name: "Cowboy", description: "Rugged & frontier western voice", category: "character", icon: Star, accent: "Texan", style: "Western" },
  { id: "samurai", name: "Samurai", description: "Honorable & disciplined warrior voice", category: "character", icon: Shield, accent: "Japanese", style: "Bushido" },
  { id: "elf", name: "Elf", description: "Graceful & ancient woodland voice", category: "character", icon: Sparkles, accent: "Elvish", style: "Immortal" },
  { id: "dwarf", name: "Dwarf", description: "Gruff & hearty mountain voice", category: "character", icon: Shield, accent: "Scottish", style: "Mountain" },
  
  // Tech voices
  { id: "hacker", name: "Hacker", description: "Quick & edgy cyber punk voice", category: "robotic", icon: Bot, accent: "American", style: "Underground" },
  { id: "glitch", name: "Glitch", description: "Distorted & fragmented digital voice", category: "robotic", icon: Zap, accent: "Corrupted", style: "Glitched" },
  { id: "satellite", name: "Satellite", description: "Distant & cosmic space voice", category: "robotic", icon: Zap, accent: "Synthetic", style: "Orbital" },
  { id: "protocol", name: "Protocol", description: "Precise & systematic droid voice", category: "robotic", icon: Bot, accent: "Synthetic", style: "Protocol" },
  
  // More calm voices
  { id: "moonlight", name: "Moonlight", description: "Gentle & luminous night voice", category: "calm", icon: Moon, accent: "Japanese", style: "Nocturnal" },
  { id: "rainfall", name: "Rainfall", description: "Soft & rhythmic weather voice", category: "calm", icon: Waves, accent: "British", style: "Ambient" },
  { id: "starlight", name: "Starlight", description: "Distant & twinkling cosmic voice", category: "calm", icon: Star, accent: "Ethereal", style: "Celestial" },
  { id: "breeze", name: "Breeze", description: "Light & refreshing wind voice", category: "calm", icon: Sun, accent: "Hawaiian", style: "Airy" },
  
  // International voices
  { id: "parisian", name: "Parisian", description: "Elegant & romantic French voice", category: "friendly", icon: Heart, accent: "French", style: "Romantic" },
  { id: "tokyo", name: "Tokyo", description: "Modern & stylish Japanese voice", category: "friendly", icon: Zap, accent: "Japanese", style: "Urban" },
  { id: "viking", name: "Viking", description: "Fierce & bold Nordic voice", category: "character", icon: Shield, accent: "Scandinavian", style: "Norse" },
  { id: "pharaoh", name: "Pharaoh", description: "Regal & ancient Egyptian voice", category: "character", icon: Crown, accent: "Egyptian", style: "Ancient" },
  
  // Specialty voices
  { id: "narrator", name: "Narrator", description: "Epic & cinematic movie voice", category: "professional", icon: Star, accent: "American", style: "Cinematic" },
  { id: "announcer", name: "Announcer", description: "Bold & exciting sports voice", category: "professional", icon: Mic, accent: "American", style: "Broadcast" },
  { id: "host", name: "Host", description: "Charming & welcoming show voice", category: "friendly", icon: Star, accent: "American", style: "Entertainment" },
  { id: "guardian", name: "Guardian", description: "Protective & vigilant defender voice", category: "character", icon: Shield, accent: "Deep", style: "Protective" },
  { id: "spirit", name: "Spirit", description: "Ethereal & transcendent soul voice", category: "calm", icon: Ghost, accent: "Ethereal", style: "Spiritual" },
  
  // More unique voices to reach 100+
  { id: "steampunk", name: "Steampunk", description: "Victorian & mechanical inventor voice", category: "character", icon: Zap, accent: "British", style: "Victorian" },
  { id: "cyberpunk", name: "Cyberpunk", description: "Edgy & neon future voice", category: "robotic", icon: Zap, accent: "American", style: "Dystopian" },
  { id: "astronaut", name: "Astronaut", description: "Calm & professional space voice", category: "professional", icon: Star, accent: "American", style: "Space" },
  { id: "sensei", name: "Sensei", description: "Wise & patient teacher voice", category: "calm", icon: Brain, accent: "Japanese", style: "Martial" },
  { id: "valkyrie", name: "Valkyrie", description: "Fierce & noble warrior voice", category: "character", icon: Shield, accent: "Norse", style: "Divine" },
  { id: "siren", name: "Siren", description: "Enchanting & melodic sea voice", category: "character", icon: Waves, accent: "Greek", style: "Enchanting" },
  { id: "architect", name: "Architect", description: "Precise & visionary builder voice", category: "professional", icon: Star, accent: "European", style: "Design" },
  { id: "nomad", name: "Nomad", description: "Free & worldly traveler voice", category: "friendly", icon: Star, accent: "Mixed", style: "Wanderer" },
  { id: "mystic", name: "Mystic", description: "Enigmatic & powerful magic voice", category: "calm", icon: Wand2, accent: "Unknown", style: "Arcane" },
  { id: "echo", name: "Echo", description: "Reverberating & distant voice", category: "robotic", icon: Waves, accent: "Synthetic", style: "Resonant" },
  
  // Extra voices for 100+
  { id: "captain", name: "Captain", description: "Commanding & strategic leader voice", category: "professional", icon: Shield, accent: "American", style: "Leadership" },
  { id: "inventor", name: "Inventor", description: "Curious & innovative genius voice", category: "professional", icon: Zap, accent: "German", style: "Inventive" },
  { id: "bard", name: "Bard", description: "Musical & poetic performer voice", category: "character", icon: Wand2, accent: "Celtic", style: "Bardic" },
  { id: "shaman", name: "Shaman", description: "Spiritual & ancient healer voice", category: "calm", icon: Moon, accent: "Native", style: "Shamanic" },
  { id: "empress", name: "Empress", description: "Regal & commanding ruler voice", category: "character", icon: Crown, accent: "Russian", style: "Imperial" },
  { id: "mercenary", name: "Mercenary", description: "Tough & experienced soldier voice", category: "character", icon: Shield, accent: "American", style: "Combat" },
  { id: "scholar", name: "Scholar", description: "Learned & thoughtful academic voice", category: "professional", icon: Brain, accent: "British", style: "Academic" },
  { id: "healer", name: "Healer", description: "Gentle & nurturing care voice", category: "calm", icon: Heart, accent: "Irish", style: "Healing" },
  { id: "storm", name: "Storm", description: "Powerful & electric weather voice", category: "robotic", icon: Zap, accent: "Deep", style: "Elemental" },
  { id: "crystal", name: "Crystal", description: "Clear & resonant gem voice", category: "calm", icon: Sparkles, accent: "Ethereal", style: "Crystalline" },
];

export function VoiceScreen() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedVoice, setSelectedVoice] = useState<string | null>("nexus");
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);

  const filteredVoices = selectedCategory === "all" 
    ? voicePersonas 
    : voicePersonas.filter(v => v.category === selectedCategory);

  const handlePlayPreview = (voiceId: string) => {
    if (playingVoice === voiceId) {
      setPlayingVoice(null);
    } else {
      setPlayingVoice(voiceId);
      // Simulate voice preview duration
      setTimeout(() => setPlayingVoice(null), 3000);
    }
  };

  const selectedVoiceData = voicePersonas.find(v => v.id === selectedVoice);

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-orbitron text-lg font-bold text-foreground">
          VOICE SYNTHESIS
        </h2>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Volume2 className="w-4 h-4 text-primary" />
          <span className="font-tech">{voicePersonas.length} PERSONAS</span>
        </div>
      </div>

      {/* Selected Voice Preview */}
      {selectedVoiceData && (
        <CyberCard variant="glow" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
          <div className="relative flex items-center gap-4">
            <div className="relative">
              <div className={cn(
                "w-20 h-20 rounded-2xl flex items-center justify-center",
                "bg-gradient-to-br from-primary to-accent"
              )}>
                <selectedVoiceData.icon className="w-10 h-10 text-primary-foreground" />
              </div>
              {selectedVoiceData.premium && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-warning rounded-full flex items-center justify-center">
                  <Crown className="w-3 h-3 text-warning-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-orbitron font-bold text-lg text-foreground">
                  {selectedVoiceData.name}
                </h3>
                <Check className="w-4 h-4 text-success" />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedVoiceData.description}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs font-tech text-primary">{selectedVoiceData.accent}</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs font-tech text-accent">{selectedVoiceData.style}</span>
              </div>
            </div>
            <Button
              size="icon"
              className={cn(
                "w-12 h-12 rounded-full",
                playingVoice === selectedVoiceData.id
                  ? "bg-accent text-accent-foreground"
                  : "bg-primary text-primary-foreground"
              )}
              onClick={() => handlePlayPreview(selectedVoiceData.id)}
            >
              {playingVoice === selectedVoiceData.id ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </Button>
          </div>
          
          {/* Waveform visualization when playing */}
          {playingVoice === selectedVoiceData.id && (
            <div className="mt-4 flex items-center justify-center gap-1 h-8">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-primary rounded-full animate-pulse"
                  style={{
                    height: `${Math.random() * 24 + 8}px`,
                    animationDelay: `${i * 50}ms`,
                  }}
                />
              ))}
            </div>
          )}
        </CyberCard>
      )}

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {voiceCategories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all",
                "font-tech text-xs uppercase tracking-wider",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
              )}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Voice Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filteredVoices.map((voice) => {
          const Icon = voice.icon;
          const isSelected = selectedVoice === voice.id;
          const isPlaying = playingVoice === voice.id;
          
          return (
            <CyberCard
              key={voice.id}
              className={cn(
                "relative transition-all duration-200",
                isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background"
              )}
              onClick={() => setSelectedVoice(voice.id)}
            >
              {voice.premium && (
                <div className="absolute top-2 right-2">
                  <Crown className="w-4 h-4 text-warning" />
                </div>
              )}
              
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                  isSelected
                    ? "bg-gradient-to-br from-primary to-accent"
                    : "bg-secondary"
                )}>
                  <Icon className={cn(
                    "w-6 h-6",
                    isSelected ? "text-primary-foreground" : "text-muted-foreground"
                  )} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className={cn(
                    "font-orbitron font-semibold text-sm truncate",
                    isSelected ? "text-primary" : "text-foreground"
                  )}>
                    {voice.name}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                    {voice.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <span className="text-[10px] font-tech text-muted-foreground uppercase">
                  {voice.accent}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayPreview(voice.id);
                  }}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                    isPlaying
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary hover:bg-secondary/80 text-muted-foreground"
                  )}
                >
                  {isPlaying ? (
                    <Pause className="w-3 h-3" />
                  ) : (
                    <Play className="w-3 h-3 ml-0.5" />
                  )}
                </button>
              </div>
              
              {/* Playing indicator */}
              {isPlaying && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary overflow-hidden rounded-b-lg">
                  <div className="h-full bg-gradient-to-r from-primary to-accent animate-pulse" />
                </div>
              )}
            </CyberCard>
          );
        })}
      </div>

      {/* Apply Button */}
      <div className="fixed bottom-20 left-4 right-4 z-40">
        <Button
          className="w-full h-14 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-orbitron"
          disabled={!selectedVoice}
        >
          <Mic className="w-5 h-5 mr-2" />
          APPLY VOICE PERSONA
        </Button>
      </div>
    </div>
  );
}
