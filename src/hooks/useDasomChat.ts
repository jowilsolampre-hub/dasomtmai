import { useState, useCallback } from "react";
import { streamDasomChat } from "@/lib/dasomChat";
import { toast } from "sonner";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export function useDasomChat(intent?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessage = useCallback(async (input: string) => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setIsStreaming(true);

    let assistantContent = "";
    const assistantId = crypto.randomUUID();

    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && last.id === assistantId) {
          return prev.map((m) =>
            m.id === assistantId ? { ...m, content: assistantContent } : m
          );
        }
        return [
          ...prev,
          {
            id: assistantId,
            role: "assistant" as const,
            content: assistantContent,
            timestamp: new Date(),
          },
        ];
      });
    };

    try {
      await streamDasomChat({
        messages: [...messages, userMessage].map((m) => ({
          role: m.role,
          content: m.content,
        })),
        intent,
        onDelta: updateAssistant,
        onDone: () => {
          setIsLoading(false);
          setIsStreaming(false);
        },
        onError: (error) => {
          toast.error(error);
          setIsLoading(false);
          setIsStreaming(false);
        },
      });
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Neural connection failed");
      setIsLoading(false);
      setIsStreaming(false);
    }
  }, [messages, isLoading, intent]);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    isStreaming,
    sendMessage,
    clearChat,
  };
}
