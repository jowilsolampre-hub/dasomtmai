import { useState, useRef, useEffect } from "react";
import { CyberCard } from "@/components/dasom/CyberCard";
import { NeuralVisualizer } from "@/components/dasom/NeuralVisualizer";
import { QuickCommand } from "@/components/dasom/QuickCommand";
import { ChatMessage } from "@/components/dasom/ChatMessage";
import { useDasomChat } from "@/hooks/useDasomChat";
import { 
  Mic, 
  Send, 
  Home as HomeIcon, 
  Brain, 
  Shield, 
  Sparkles,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HomeScreen() {
  const [input, setInput] = useState("");
  const { messages, isLoading, isStreaming, sendMessage, clearChat } = useDasomChat("home");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="flex flex-col h-full pb-4">
      {/* Neural Visualizer Section */}
      <div className="flex flex-col items-center py-6 border-b border-primary/10">
        <NeuralVisualizer 
          isActive={true} 
          isProcessing={isLoading || isStreaming}
          size="lg"
        />
        <p className="mt-4 text-center text-muted-foreground text-sm max-w-xs">
          {isLoading 
            ? '"Processing neural query..."' 
            : '"Ready to assist. How may I optimize your experience?"'}
        </p>
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
            disabled={isLoading}
          />
          <QuickCommand
            icon={Brain}
            label="Psych Profile"
            onClick={() => handleQuickCommand("Analyze my current psychological profile and patterns")}
            disabled={isLoading}
          />
          <QuickCommand
            icon={Shield}
            label="Secure Comms"
            onClick={() => handleQuickCommand("Check secure communications status and encryption levels")}
            disabled={isLoading}
          />
          <QuickCommand
            icon={Sparkles}
            label="Deep Learning"
            onClick={() => handleQuickCommand("What have you learned about my preferences recently?")}
            disabled={isLoading}
          />
        </div>

        {/* Chat Input */}
        <CyberCard className="p-3" variant="glow">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="text-primary hover:bg-primary/20"
              disabled={isLoading}
            >
              <Mic className="w-5 h-5" />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Enter command or query..."
              className="flex-1 bg-transparent border-none focus-visible:ring-0 text-foreground placeholder:text-muted-foreground"
              disabled={isLoading}
            />
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
              disabled={!input.trim() || isLoading}
              className="bg-primary hover:bg-primary/80 text-primary-foreground"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CyberCard>
      </div>
    </div>
  );
}
