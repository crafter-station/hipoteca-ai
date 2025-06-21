"use client";

import { ChatToolbar } from "@/components/chat/chat-toolbar";
import { Sources } from "@/components/chat/sources";
import { useChatLogic } from "@/components/chat/use-chat-logic";
import { Button } from "@/components/ui/button";
import {} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { parseSources } from "@/lib/chat-utils";
import { cn } from "@/lib/utils";
import { MessageCircle, Send } from "lucide-react";

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function ChatSidebar({ isOpen, onToggle }: ChatSidebarProps) {
  const { input, handleInputChange, handleFormSubmit, messages, status } =
    useChatLogic();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="slide-in-from-right w-96 flex-shrink-0 animate-in duration-300">
      <div className="max-[100dvh] h-full rounded-lg border border-border bg-card">
        {/* Header */}
        <div>
          <ChatToolbar onClose={onToggle} />
        </div>

        {/* Messages */}
        <ScrollArea className="h-[calc(100dvh-250px)] px-4">
          <div className="space-y-4 py-4">
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
                    "max-w-full",
                    m.role === "user"
                      ? "ml-8 rounded-lg rounded-br-none bg-primary/5 p-3 text-primary-foreground dark:text-primary-foreground"
                      : "mr-0 p-2",
                  )}
                >
                  {m.parts
                    .filter((p) => p.type === "tool-invocation")
                    .map(({ toolInvocation }, index) => (
                      <p
                        key={toolInvocation.toolCallId}
                        className="mb-2 text-muted-foreground text-xs italic"
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
                        <p
                          className={cn(
                            "whitespace-pre-wrap break-words text-sm",
                            m.role === "user"
                              ? "text-foreground dark:text-foreground"
                              : "text-foreground",
                          )}
                        >
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
                  Pregúntame sobre tu contrato de hipoteca y te ayudo a
                  entenderlo.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="rounded-b-lg border-t bg-card p-4">
          <form onSubmit={handleFormSubmit}>
            <div className="relative">
              <Textarea
                value={input}
                onChange={handleInputChange}
                placeholder="¿Qué significa el TIN? ¿Cuál es mi TAE? Pregunta sobre tu hipoteca..."
                className="h-[75px] w-full flex-1 resize-none pr-12"
                disabled={status === "streaming"}
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleFormSubmit(e);
                  }
                }}
              />
              <Button
                type="submit"
                size="sm"
                disabled={status === "streaming" || !input.trim()}
                className="absolute right-2 bottom-2 h-8 w-8 rounded-full p-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {status === "streaming" && (
              <p className="mt-2 text-muted-foreground text-xs">
                El asistente está escribiendo...
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
