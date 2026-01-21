import { useState, useRef, useEffect, useCallback } from "react";
import { CyberCard } from "@/components/dasom/CyberCard";
import { NeuralVisualizer } from "@/components/dasom/NeuralVisualizer";
import { QuickCommand } from "@/components/dasom/QuickCommand";
import { ChatMessage } from "@/components/dasom/ChatMessage";
import { useDasomChat } from "@/hooks/useDasomChat";
import { useVoice } from "@/hooks/useVoice";
import { 
  Mic, 
  MicOff,
  Send, 
  Home as HomeIcon, 
  Brain, 
  Shield, 
  Sparkles,
  Trash2,
  Volume2,
  VolumeX,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function HomeScreen() {
  const [input, setInput] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
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
      // Speak the response
      speak(text);
    }
  }, [voiceEnabled, speak]);

  const { messages, isLoading, isStreaming, sendMessage, clearChat } = useDasomChat("home", {
    onAssistantResponse: handleAssistantResponse,
  });

  // Update input when transcript changes
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  // Auto-send when speech recognition ends with content
  useEffect(() => {
    if (!isListening && transcript.trim()) {
      // Small delay to ensure transcript is complete
      const timeout = setTimeout(() => {
        sendMessage(transcript);
        setInput("");
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isListening, transcript, sendMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  const handleQuickCommand = (command: string) => {
    sendMessage(command);
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      if (!isSupported) {
        toast.error("Voice input not supported in this browser");
        return;
      }
      stopSpeaking(); // Stop any ongoing speech
      startListening();
    }
  };

  const toggleVoiceOutput = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
    setVoiceEnabled(!voiceEnabled);
    toast.success(voiceEnabled ? "Voice responses disabled" : "Voice responses enabled");
  };

  return (
    <div className="flex flex-col h-full pb-4">
      {/* Neural Visualizer Section */}
      <div className="flex flex-col items-center py-6 border-b border-primary/10">
        <NeuralVisualizer 
          isActive={true} 
          isProcessing={isLoading || isStreaming || isListening || isSpeaking}
          size="lg"
        />
        <p className="mt-4 text-center text-muted-foreground text-sm max-w-xs">
          {isListening 
            ? '"Listening... speak now"' 
            : isSpeaking
            ? '"Speaking..."'
            : isLoading 
            ? '"Processing neural query..."' 
            : '"Ready to assist. How may I optimize your experience?"'}
        </p>
        
        {/* Voice Status Indicator */}
        <div className="mt-2 flex items-center gap-3">
          {isListening && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/20 border border-destructive/30">
              <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
              <span className="text-xs font-tech text-destructive">RECORDING</span>
            </div>
          )}
          {isSpeaking && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30">
              <Volume2 className="w-3 h-3 text-primary animate-pulse" />
              <span className="text-xs font-tech text-primary">SPEAKING</span>
            </div>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-[200px]">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm mb-2">
              RESPONSE <span className="text-primary">•</span>
            </p>
            <p className="text-foreground">
              Systems nominal. All sectors report stable integrity.
              Neural sync rate at optimal levels.
            </p>
            {isSupported && (
              <p className="text-xs text-muted-foreground mt-4">
                Tap the microphone to speak or type your command
              </p>
            )}
          </div>
        ) : (
          messages.map((msg, idx) => (
            <ChatMessage 
              key={msg.id} 
              message={msg}
              isStreaming={isStreaming && idx === messages.length - 1 && msg.role === "assistant"}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Commands */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-2 mb-4">
          <QuickCommand
            icon={HomeIcon}
            label="Home Automation"
            onClick={() => handleQuickCommand("Show me home automation status and controls")}
            disabled={isLoading || isListening}
          />
          <QuickCommand
            icon={Brain}
            label="Psych Profile"
            onClick={() => handleQuickCommand("Analyze my current psychological profile and patterns")}
            disabled={isLoading || isListening}
          />
          <QuickCommand
            icon={Shield}
            label="Secure Comms"
            onClick={() => handleQuickCommand("Check secure communications status and encryption levels")}
            disabled={isLoading || isListening}
          />
          <QuickCommand
            icon={Sparkles}
            label="Deep Learning"
            onClick={() => handleQuickCommand("What have you learned about my preferences recently?")}
            disabled={isLoading || isListening}
          />
        </div>

        {/* Chat Input */}
        <CyberCard className="p-3" variant="glow">
          <div className="flex items-center gap-2">
            {/* Voice Input Button */}
            <Button
              size="icon"
              variant="ghost"
              onClick={handleVoiceToggle}
              disabled={isLoading}
              className={cn(
                "transition-all",
                isListening 
                  ? "text-destructive bg-destructive/20 hover:bg-destructive/30 animate-pulse" 
                  : "text-primary hover:bg-primary/20"
              )}
            >
              {isListening ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </Button>
            
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={isListening ? "Listening..." : "Enter command or query..."}
              className="flex-1 bg-transparent border-none focus-visible:ring-0 text-foreground placeholder:text-muted-foreground"
              disabled={isLoading || isListening}
            />
            
            {/* Voice Output Toggle */}
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleVoiceOutput}
              className={cn(
                "transition-all",
                voiceEnabled 
                  ? "text-primary hover:bg-primary/20" 
                  : "text-muted-foreground hover:bg-secondary/50"
              )}
            >
              {voiceEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </Button>
            
            {messages.length > 0 && (
              <Button
                size="icon"
                variant="ghost"
                onClick={clearChat}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/20"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
            
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim() || isLoading || isListening}
              className="bg-primary hover:bg-primary/80 text-primary-foreground"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CyberCard>
      </div>
    </div>
  );
}
