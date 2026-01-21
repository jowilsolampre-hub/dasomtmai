import { useState, useEffect, useCallback } from "react";
import { 
  Mic, 
  MicOff,
  X, 
  MessageSquare,
  Loader2,
  Send,
  Smartphone,
  Mail,
  Calendar,
  Phone,
  Wifi,
  Battery,
  MapPin,
  Volume2,
  VolumeX
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useDasomChat } from "@/hooks/useDasomChat";
import { useVoice } from "@/hooks/useVoice";
import { ChatMessage } from "./ChatMessage";
import { toast } from "sonner";

interface DeviceInfo {
  platform: string;
  screenWidth: number;
  screenHeight: number;
  online: boolean;
  userAgent: string;
}

export function FloatingOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  const { 
    isListening, 
    isSpeaking, 
    transcript, 
    isSupported,
    startListening, 
    stopListening, 
    speak,
    stopSpeaking 
  } = useVoice();

  const handleAssistantResponse = useCallback((text: string) => {
    if (voiceEnabled && text) {
      speak(text);
    }
  }, [voiceEnabled, speak]);

  const { messages, isLoading, sendMessage } = useDasomChat("overlay", {
    onAssistantResponse: handleAssistantResponse,
  });

  // Detect device info on mount
  useEffect(() => {
    const detectDevice = () => {
      const ua = navigator.userAgent;
      let platform = "Desktop";
      
      if (/Android/i.test(ua)) platform = "Android";
      else if (/iPhone|iPad|iPod/i.test(ua)) platform = "iOS";
      else if (/Windows Phone/i.test(ua)) platform = "Windows Phone";
      else if (/Tablet/i.test(ua)) platform = "Tablet";
      
      setDeviceInfo({
        platform,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        online: navigator.onLine,
        userAgent: ua.substring(0, 50)
      });
    };

    detectDevice();
    window.addEventListener("resize", detectDevice);
    window.addEventListener("online", detectDevice);
    window.addEventListener("offline", detectDevice);

    return () => {
      window.removeEventListener("resize", detectDevice);
      window.removeEventListener("online", detectDevice);
      window.removeEventListener("offline", detectDevice);
    };
  }, []);

  // Update input when transcript changes
  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);

  // Auto-send when speech recognition ends
  useEffect(() => {
    if (!isListening && transcript.trim()) {
      const timeout = setTimeout(() => {
        sendMessage(transcript);
        setInputValue("");
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isListening, transcript, sendMessage]);

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return;
    sendMessage(inputValue);
    setInputValue("");
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      if (!isSupported) {
        toast.error("Voice not supported in this browser");
        return;
      }
      stopSpeaking();
      startListening();
    }
  };

  const quickActions = [
    { icon: Mail, label: "Gmail", action: () => sendMessage("Connect to my Gmail and show recent emails") },
    { icon: Calendar, label: "Calendar", action: () => sendMessage("Show my upcoming calendar events") },
    { icon: Phone, label: "Calls", action: () => sendMessage("Show my recent call history") },
    { icon: MapPin, label: "Location", action: () => sendMessage("What's the current device location?") },
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed z-[100] w-14 h-14 rounded-full",
          "bg-gradient-to-br from-primary to-accent",
          "flex items-center justify-center",
          "shadow-lg shadow-primary/30",
          "hover:scale-110 transition-transform duration-200",
          "animate-pulse-glow",
          // Responsive positioning
          "bottom-24 right-4 md:bottom-8 md:right-8"
        )}
        aria-label="Open DASOM Assistant"
      >
        <Mic className="w-6 h-6 text-primary-foreground" />
      </button>
    );
  }

  return (
    <div
      className={cn(
        "fixed z-[100] bg-card/95 backdrop-blur-lg border border-primary/30 rounded-2xl shadow-2xl",
        "flex flex-col overflow-hidden transition-all duration-300",
        // Responsive sizing
        isMinimized
          ? "w-72 h-16"
          : "w-[calc(100%-2rem)] h-[70vh] md:w-[400px] md:h-[600px]",
        // Responsive positioning
        "bottom-4 right-4 left-4 md:left-auto md:bottom-8 md:right-8"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-primary/20 bg-secondary/50">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            isListening 
              ? "bg-destructive animate-pulse" 
              : isSpeaking 
              ? "bg-primary animate-pulse"
              : "bg-gradient-to-br from-primary to-accent"
          )}>
            {isListening ? (
              <MicOff className="w-5 h-5 text-destructive-foreground" />
            ) : (
              <Mic className="w-5 h-5 text-primary-foreground" />
            )}
          </div>
          <div>
            <h3 className="font-orbitron font-bold text-sm text-foreground">DASOM</h3>
            <div className="flex items-center gap-1.5">
              <span className={cn(
                "w-2 h-2 rounded-full",
                isListening ? "bg-destructive animate-pulse" :
                isSpeaking ? "bg-primary animate-pulse" :
                deviceInfo?.online ? "bg-success" : "bg-destructive"
              )} />
              <span className="text-[10px] font-tech text-muted-foreground">
                {isListening ? "Listening..." : 
                 isSpeaking ? "Speaking..." :
                 `${deviceInfo?.platform} • ${deviceInfo?.online ? "Online" : "Offline"}`}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground"
          >
            {voiceEnabled ? (
              <Volume2 className="w-4 h-4 text-primary" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Device Status Bar */}
          <div className="px-3 py-2 bg-secondary/30 border-b border-primary/10 flex items-center gap-4 overflow-x-auto">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
              <Smartphone className="w-3.5 h-3.5 text-primary" />
              <span className="font-tech">{deviceInfo?.platform}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
              <Wifi className={cn("w-3.5 h-3.5", deviceInfo?.online ? "text-success" : "text-destructive")} />
              <span className="font-tech">{deviceInfo?.online ? "Connected" : "Offline"}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
              <Battery className="w-3.5 h-3.5 text-success" />
              <span className="font-tech">100%</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="px-3 py-2 border-b border-primary/10 flex gap-2 overflow-x-auto scrollbar-hide">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={action.action}
                disabled={isLoading || isListening}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap",
                  "bg-secondary/50 hover:bg-secondary text-xs font-tech",
                  "text-muted-foreground hover:text-foreground transition-colors",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <action.icon className="w-3.5 h-3.5" />
                {action.label}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className={cn(
                  "w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center",
                  isListening 
                    ? "bg-destructive/20 animate-pulse" 
                    : "bg-gradient-to-br from-primary/20 to-accent/20"
                )}>
                  <Mic className={cn(
                    "w-8 h-8",
                    isListening ? "text-destructive" : "text-primary"
                  )} />
                </div>
                <h4 className="font-orbitron text-sm text-foreground mb-1">
                  {isListening ? "Listening..." : "Device Bridge Active"}
                </h4>
                <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">
                  {isListening 
                    ? "Speak your command now" 
                    : "Tap the mic to speak or use quick actions"}
                </p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} message={msg} />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs font-tech">Processing...</span>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-primary/20 bg-secondary/30">
            <div className="flex items-center gap-2">
              {/* Voice Input Button */}
              <Button
                size="icon"
                variant="ghost"
                onClick={handleVoiceToggle}
                disabled={isLoading}
                className={cn(
                  "w-10 h-10 rounded-lg transition-all",
                  isListening 
                    ? "bg-destructive text-destructive-foreground animate-pulse" 
                    : "bg-primary/20 text-primary hover:bg-primary/30"
                )}
              >
                {isListening ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </Button>
              
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={isListening ? "Listening..." : "Ask DASOM anything..."}
                disabled={isLoading || isListening}
                className={cn(
                  "flex-1 px-4 py-2.5 rounded-lg bg-secondary/50 border border-primary/20",
                  "text-sm text-foreground placeholder:text-muted-foreground",
                  "focus:outline-none focus:border-primary/50",
                  "disabled:opacity-50"
                )}
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading || isListening}
                className="w-10 h-10 rounded-lg bg-primary text-primary-foreground"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
