import type { Message } from "ai";

import { redis } from "@/clients/redis";
import { updateChatMetadata } from "./chat-management";
import { getChatMessagesKey } from "./keys";

export async function setMessages({
	chatId,
	originalMessages,
	newMessages,
}: {
	chatId: string;
	originalMessages: Message[];
	newMessages: Message[];
}): Promise<void> {
	try {
		const key = getChatMessagesKey(chatId);

		const pipeline = redis.pipeline();

		let lastMessageCreatedAt: Date | undefined;

		for (let i = 0; i < newMessages.length; i++) {
			const newMessage = newMessages[i];
			const existingMessage = originalMessages.find(
				(m) => m.id === newMessage.id,
			);

			if (!existingMessage) {
				if (newMessage.role === "user") {
					lastMessageCreatedAt = newMessage.createdAt;
				} else if (lastMessageCreatedAt) {
					lastMessageCreatedAt = new Date(Date.now() + 1000);
				}

				pipeline.lpush<Message>(key, {
					...newMessage,
					createdAt: lastMessageCreatedAt,
				});
			} else {
				if (JSON.stringify(existingMessage) !== JSON.stringify(newMessage)) {
					pipeline.lset<Message>(key, i, newMessage);
				}
			}
		}

		await pipeline.exec();

		// Update chat metadata with last message time
		await updateChatMetadata(chatId, {
			lastMessageAt: lastMessageCreatedAt?.toISOString(),
		});
	} catch (error) {
		console.error("Error saving messages to Redis:", error);
		// We may need to retry this operation
	}
}
