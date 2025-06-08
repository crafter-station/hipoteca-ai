import { redis } from "@/clients/redis";
import type { Message } from "ai";

// Define the Redis key pattern for storing chat messages
const getChatKey = (id: string) => `chat:${id}:messages`;

// Function to retrieve messages from Redis
export async function getMessages(id: string): Promise<Message[]> {
	try {
		const key = getChatKey(id);
		const messagesData = await redis.lrange<Message>(key, 0, -1);

		if (!messagesData || messagesData.length === 0) {
			return [];
		}

		// Parse the JSON strings back to message objects
		return messagesData.map((message) => ({
			...message,
			createdAt: new Date(message.createdAt ?? new Date().toISOString()),
		}));
	} catch (error) {
		console.error("Error retrieving messages from Redis:", error);
		return []; // Return empty array on error to prevent app crash
	}
}

// Function to save chat messages to Redis
export async function saveMessages({
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

		// Clear existing messages and store new ones using pipeline for atomicity
		const pipeline = redis.pipeline();

		// Store each message as a JSON string in the list
		for (let i = 0; i < newMessages.length; i++) {
			const newMessage = newMessages[i];
			const existingMessage = originalMessages.find(
				(m) => m.id === newMessage.id,
			);

			if (!existingMessage) {
				pipeline.lpush<Message>(key, {
					...newMessage,
					createdAt:
						newMessage.role === "assistant" ? new Date() : newMessage.createdAt,
				});
			} else {
				if (JSON.stringify(existingMessage) !== JSON.stringify(newMessage)) {
					pipeline.lset<Message>(key, i, newMessage);
				}
			}
		}

		await pipeline.exec();
		console.log(
			`Successfully saved ${newMessages.length} messages for chat ${id}`,
		);
	} catch (error) {
		console.error("Error saving messages to Redis:", error);
		// Don't throw here to prevent breaking the response stream
		// Consider implementing a retry mechanism or fallback storage
	}
} // Define the Redis key pattern for storing chat messages
