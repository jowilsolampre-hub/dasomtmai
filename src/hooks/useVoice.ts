import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";

interface VoiceConfig {
  selectedVoice?: string;
  rate?: number;
  pitch?: number;
}

interface UseVoiceReturn {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  availableVoices: SpeechSynthesisVoice[];
}

// Voice persona configs matching VoiceScreen
const VOICE_PERSONAS: Record<string, { pitch: number; rate: number; voiceNameHint: string }> = {
  "deep-male": { pitch: 0.7, rate: 0.85, voiceNameHint: "Daniel" },
  "calm-female": { pitch: 1.08, rate: 0.9, voiceNameHint: "Samantha" },
  "neutral-male": { pitch: 0.92, rate: 0.93, voiceNameHint: "Aaron" },
};

function getStoredPersona() {
  const id = localStorage.getItem("dasom-voice") || "deep-male";
  return VOICE_PERSONAS[id] || VOICE_PERSONAS["deep-male"];
}

export function useVoice(config?: VoiceConfig): UseVoiceReturn {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const isSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => setAvailableVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (!isSupported || typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        if (event.error !== 'aborted') {
          toast.error(`Voice input error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [isSupported]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;
    
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setTranscript("");
    setIsListening(true);
    
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setIsListening(false);
      toast.error("Failed to start voice input");
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.error('Failed to stop speech recognition:', error);
    }
    setIsListening(false);
  }, []);

  const speak = useCallback((text: string) => {
    if (!text.trim()) return;

    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const persona = getStoredPersona();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = persona.pitch;
    utterance.rate = persona.rate;

    // Try to find the matching system voice
    const allVoices = window.speechSynthesis.getVoices();
    const enVoices = allVoices.filter(v => v.lang.startsWith("en"));
    const pool = enVoices.length ? enVoices : allVoices;

    const match = pool.find(v =>
      v.name.toLowerCase().includes(persona.voiceNameHint.toLowerCase())
    );
    if (match) utterance.voice = match;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return {
    isListening,
    isSpeaking,
    transcript,
    isSupported,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    availableVoices,
  };
}

// Type declarations for Web Speech API
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpeechRecognition: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webkitSpeechRecognition: any;
  }
}
