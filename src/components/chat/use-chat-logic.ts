"use client";

import { useChat } from "@ai-sdk/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type Message, createIdGenerator } from "ai";
import { useParams } from "next/navigation";
import { useChatId } from "./use-chat-id";

export function useChatLogic() {
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

  return {
    input,
    handleInputChange,
    handleFormSubmit,
    messages,
    status,
  };
}
