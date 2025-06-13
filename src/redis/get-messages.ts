import type { Message } from "ai";

import { redis } from "@/clients/redis";

import { getChatMessagesKey } from "./keys";

export async function getMessages(chatId: string): Promise<Message[]> {
	const key = getChatMessagesKey(chatId);
	const messagesData = await redis.lrange<Message>(key, 0, -1);

	if (!messagesData || messagesData.length === 0) {
		return [];
	}

	return messagesData.map((message) => ({
		...message,
		createdAt: new Date(message.createdAt ?? new Date().toISOString()),
	}));
}
