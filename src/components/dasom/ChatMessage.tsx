import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "@/hooks/useDasomChat";

interface ChatMessageProps {
  message: ChatMessageType;
  isStreaming?: boolean;
}

export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 animate-fade-in",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
          isUser
            ? "bg-secondary border border-primary/30"
            : "bg-primary/20 border border-primary/50"
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-foreground" />
        ) : (
          <Bot className="w-4 h-4 text-primary" />
        )}
      </div>
      <div
        className={cn(
          "flex-1 max-w-[85%] rounded-lg p-3",
          isUser
            ? "bg-secondary border border-primary/20"
            : "bg-card/80 border border-primary/30"
        )}
      >
        <div className="text-xs font-tech text-muted-foreground mb-1 uppercase tracking-wider">
          {isUser ? "USER" : "DASOM"}
        </div>
        <div className="text-foreground whitespace-pre-wrap leading-relaxed">
          {message.content}
          {isStreaming && !isUser && (
            <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />
          )}
        </div>
      </div>
    </div>
  );
}
