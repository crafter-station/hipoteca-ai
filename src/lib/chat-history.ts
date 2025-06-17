import { listUserChats } from "@/redis/chat-management";
import { getMessages } from "@/redis/get-messages";

export interface ChatSummary {
  id: string;
  title: string;
  createdAt: string;
  lastMessageAt: string;
  lastMessage?: string;
}

export async function getUserChats(userId: string): Promise<ChatSummary[]> {
  // Get all chats with their metadata
  const chats = await listUserChats(userId);

  // Get the last message for each chat
  const chatsWithLastMessage = await Promise.all(
    chats.map(async (chat) => {
      const messages = await getMessages(chat.id);
      const lastMessage = messages[messages.length - 1]?.content;

      return {
        id: chat.id,
        title: chat.title,
        createdAt: chat.createdAt,
        lastMessageAt: chat.lastMessageAt,
        lastMessage,
      };
    }),
  );

  return chatsWithLastMessage;
}
