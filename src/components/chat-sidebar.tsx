"use client";

import { Sources } from "@/components/chat/sources";
import { useChatId } from "@/components/chat/use-chat-id";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { parseSources } from "@/lib/chat-utils";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type Message, createIdGenerator } from "ai";
import { MessageCircle, Send, X } from "lucide-react";
import { useParams } from "next/navigation";

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function ChatSidebar({ isOpen, onToggle }: ChatSidebarProps) {
  const queryClient = useQueryClient();
  const [chatId] = useChatId();
  const { key } = useParams<{ key: string | undefined }>();

  const { data: initialMessages } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const res = await fetch(`/api/chat/${chatId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch chat");
      }
      return res.json() as Promise<Message[]>;
    },
  });

  const { input, handleInputChange, handleSubmit, messages, status } = useChat({
    id: chatId ?? undefined,
    sendExtraMessageFields: true,
    initialMessages: initialMessages ?? [],
    experimental_prepareRequestBody({ messages, id }) {
      return {
        message: messages[messages.length - 1],
        chat_id: id,
        contract_id: key,
      };
    },
    generateId: createIdGenerator({
      size: 16,
    }),
    onFinish: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleSubmit(e);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="slide-in-from-right w-80 flex-shrink-0 animate-in border-border border-l bg-card duration-300">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-border border-b p-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-sm">Chat de Análisis</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Chat Content */}
      <div className="flex h-full flex-col">
        {/* Messages Area */}
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-4">
            {messages
              .toSorted(
                (a, b) =>
                  new Date(a.createdAt ?? new Date()).getTime() -
                  new Date(b.createdAt ?? new Date()).getTime(),
              )
              .map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "max-w-full rounded-lg p-3 text-sm",
                    m.role === "user"
                      ? "ml-4 bg-primary/10 text-foreground"
                      : "mr-4 bg-muted text-foreground",
                  )}
                >
                  {m.parts
                    .filter((p) => p.type === "tool-invocation")
                    .map(({ toolInvocation }, index) => (
                      <p
                        key={toolInvocation.toolCallId}
                        className="mb-2 text-primary text-xs"
                      >
                        {toolInvocation.toolName === "searchContractContext" ? (
                          <>
                            <span>
                              Buscando información sobre tu contrato para "
                              {toolInvocation.args.query}"
                            </span>
                          </>
                        ) : toolInvocation.toolName ===
                          "searchMortgageKnowledge" ? (
                          <>
                            <span>
                              Buscando información oficial sobre hipotecas para
                              "{toolInvocation.args.query}"
                            </span>
                          </>
                        ) : null}
                        {index !== m.parts.length - 1 && <br />}
                      </p>
                    ))}
                  {(() => {
                    const { text, sources } = parseSources(m.content);
                    return (
                      <>
                        <p className="whitespace-pre-wrap break-words">
                          {text}
                        </p>
                        <Sources sources={sources} />
                      </>
                    );
                  })()}
                </div>
              ))}

            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <MessageCircle className="mb-3 h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground text-sm">
                  ¡Hola! Soy tu asistente de análisis hipotecario.
                </p>
                <p className="mt-1 text-muted-foreground text-xs">
                  Pregúntame sobre tu contrato y te ayudo a entenderlo.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-border border-t p-3">
          <form onSubmit={handleFormSubmit} className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Pregunta sobre tu contrato..."
                className="flex-1 text-sm"
                disabled={status === "streaming"}
              />
              <Button
                type="submit"
                size="sm"
                disabled={status === "streaming" || !input.trim()}
                className="h-9 w-9 p-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {status === "streaming" && (
              <p className="text-muted-foreground text-xs">
                El asistente está escribiendo...
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
