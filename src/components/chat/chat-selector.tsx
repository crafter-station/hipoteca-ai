"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatSummary } from "@/lib/chat-history";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronDown, MessageCircle } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";

export function ChatSelector() {
  const [chatId, setChatId] = useQueryState("chatId", parseAsString);

  const { data: chats, isLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const res = await fetch("/api/chat");
      if (!res.ok) {
        throw new Error("Failed to fetch chats");
      }
      return res.json() as Promise<ChatSummary[]>;
    },
  });

  const currentChat = chats?.find((chat) => chat.id === chatId);
  const chatTitle = currentChat?.title || "Nuevo Chat";

  const handleChatSelect = (selectedChatId: string) => {
    setChatId(selectedChatId);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-8 justify-between gap-2 px-3 font-medium text-sm"
        >
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span className="max-w-[200px] truncate">{chatTitle}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="border-b p-3">
          <h4 className="font-semibold text-sm">Seleccionar Chat</h4>
        </div>
        <ScrollArea className="max-h-[300px]">
          <div className="p-1">
            {isLoading ? (
              <div className="p-3 text-muted-foreground text-sm">
                Cargando chats...
              </div>
            ) : chats && chats.length > 0 ? (
              <div className="space-y-1">
                {chats.map((chat) => (
                  <button
                    key={chat.id}
                    type="button"
                    onClick={() => handleChatSelect(chat.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md p-3 text-left text-sm transition-colors hover:bg-accent",
                      chat.id === chatId && "bg-accent",
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{chat.title}</div>
                      <div className="text-muted-foreground text-xs">
                        {new Date(chat.lastMessageAt).toLocaleString()}
                      </div>
                    </div>
                    {chat.id === chatId && (
                      <Check className="h-4 w-4 flex-shrink-0 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-3 text-muted-foreground text-sm">
                No hay chats disponibles
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
