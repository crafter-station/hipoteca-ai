import type { Message } from "ai";

import { redis } from "@/clients/redis";

import { getChatKey } from "./keys";

export async function setMessages({
	id,
	originalMessages,
	newMessages,
}: {
	id: string;
	originalMessages: Message[];
	newMessages: Message[];
}): Promise<void> {
	try {
		const key = getChatKey(id);

		const pipeline = redis.pipeline();

		for (let i = 0; i < newMessages.length; i++) {
			const newMessage = newMessages[i];
			const existingMessage = originalMessages.find(
				(m) => m.id === newMessage.id,
			);

			if (!existingMessage) {
				pipeline.lpush<Message>(key, {
					...newMessage,
					createdAt:
						newMessage.role === "user"
							? newMessage.createdAt
							: new Date(Date.now() + 1000),
				});
			} else {
				if (JSON.stringify(existingMessage) !== JSON.stringify(newMessage)) {
					pipeline.lset<Message>(key, i, newMessage);
				}
			}
		}

		await pipeline.exec();
	} catch (error) {
		console.error("Error saving messages to Redis:", error);
		// We may need to retry this operation
	}
}
