"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { parseSources } from "@/lib/chat-utils";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type Message, createIdGenerator } from "ai";
import { MessageCircle, Send } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ChatToolbar } from "./chat-toolbar";
import { Sources } from "./sources";
import { useChatId } from "./use-chat-id";
import { useChatOpen } from "./use-chat-open";

export function ChatPopup() {
  const [isOpen, setIsOpen] = useChatOpen();
  const [isMinimized, setIsMinimized] = useState(false);
  const queryClient = useQueryClient();

  const [chatId] = useChatId();

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

  const { key } = useParams<{ key: string | undefined }>();

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

  if (isMinimized) {
    return (
      <div className="fixed right-6 bottom-6 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="h-14 w-14 rounded-full bg-blue-600 p-0 shadow-lg transition-all hover:scale-110 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <div className="fixed right-6 bottom-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="group h-14 w-14 rounded-full bg-blue-600 p-0 shadow-lg transition-all hover:scale-110 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          <MessageCircle className="h-6 w-6 text-white transition-transform group-hover:scale-110" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed right-6 bottom-6 z-50">
      <Card className="h-[500px] w-[400px] shadow-2xl">
        <ChatToolbar />
        <CardContent className="flex h-full flex-col p-0">
          <div className="flex flex-1 flex-col">
            <ScrollArea className="max-h-[340px] flex-1 px-4 pb-4">
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
                        "max-w-full rounded-lg p-3",
                        m.role === "user"
                          ? "ml-8 bg-blue-100 dark:bg-blue-900/30"
                          : "mr-8 bg-gray-100 dark:bg-gray-800",
                      )}
                    >
                      {m.parts
                        .filter((p) => p.type === "tool-invocation")
                        .map(({ toolInvocation }, index) => (
                          <p
                            key={toolInvocation.toolCallId}
                            className="text-blue-600 text-sm dark:text-blue-400"
                          >
                            {toolInvocation.toolName ===
                            "searchContractContext" ? (
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
                                  Buscando información oficial sobre hipotecas
                                  para "{toolInvocation.args.query}"
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
                            <p className="whitespace-pre-wrap break-words text-gray-900 text-sm dark:text-gray-100">
                              {text}
                            </p>
                            <Sources sources={sources} />
                          </>
                        );
                      })()}
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </div>
          <form onSubmit={handleFormSubmit} className="border-t p-4">
            <div className="flex items-center gap-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Escribe tu mensaje..."
                className="flex-1"
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
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
