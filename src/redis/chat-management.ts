import { redis } from "@/clients/redis";
import {
	getChatMessagesKey,
	getChatMetadataKey,
	getUserChatsKey,
} from "./keys";

export interface ChatMetadata {
	id: string;
	title: string;
	createdAt: string;
	lastMessageAt: string;
	[key: string]: string; // Add index signature to allow string indexing
}

export async function chatExists(chatId: string): Promise<boolean> {
	// Check if either messages or metadata exists for this chat
	const [hasMessages, hasMetadata] = await Promise.all([
		redis.exists(getChatMessagesKey(chatId)),
		redis.exists(getChatMetadataKey(chatId)),
	]);
	return hasMessages === 1 || hasMetadata === 1;
}

export async function isChatOwnedByUser(
	userId: string,
	chatId: string,
): Promise<boolean> {
	// For new chats, we'll consider them as "owned" by the user
	// since they're being created with this request
	const exists = await chatExists(chatId);
	if (!exists) {
		// Add the chat to user's chat list and create metadata
		const now = new Date().toISOString();
		const metadata: ChatMetadata = {
			id: chatId,
			title: "New Chat",
			createdAt: now,
			lastMessageAt: now,
		};

		const pipeline = redis.pipeline();
		pipeline.sadd(getUserChatsKey(userId), chatId);
		pipeline.hset(getChatMetadataKey(chatId), metadata);
		await pipeline.exec();

		return true;
	}

	// For existing chats, check ownership
	const result = await redis.sismember(getUserChatsKey(userId), chatId);
	return result === 1;
}

export async function listUserChats(userId: string): Promise<ChatMetadata[]> {
	// Get all chat IDs for the user
	const chatIds = await redis.smembers(getUserChatsKey(userId));

	if (chatIds.length === 0) {
		return [];
	}

	// Get metadata for all chats
	const pipeline = redis.pipeline();
	for (const chatId of chatIds) {
		pipeline.hgetall(getChatMetadataKey(chatId));
	}

	const results = await pipeline.exec();

	// Transform results into ChatMetadata objects
	return results
		.map((result, index) => {
			if (!result) return null;
			const metadata = result as unknown as Record<string, string>;
			return {
				id: chatIds[index],
				title: metadata.title,
				createdAt: metadata.createdAt,
				lastMessageAt: metadata.lastMessageAt,
			};
		})
		.filter((chat): chat is ChatMetadata => chat !== null)
		.sort(
			(a, b) =>
				new Date(b.lastMessageAt).getTime() -
				new Date(a.lastMessageAt).getTime(),
		);
}

export async function updateChatMetadata(
	chatId: string,
	updates: Partial<ChatMetadata>,
): Promise<void> {
	if (Object.keys(updates).length === 0) return;

	await redis.hset(getChatMetadataKey(chatId), updates);
}

export async function deleteChat(
	userId: string,
	chatId: string,
): Promise<void> {
	const pipeline = redis.pipeline();

	// Remove chat ID from user's chat list
	pipeline.srem(getUserChatsKey(userId), chatId);

	// Delete chat messages
	pipeline.del(getChatMessagesKey(chatId));

	// Delete chat metadata
	pipeline.del(getChatMetadataKey(chatId));

	await pipeline.exec();
}
