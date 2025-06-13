// Key for storing a user's chat IDs
export const getUserChatsKey = (userId: string) => `user:${userId}:chats`;

// Key for storing messages in a specific chat
export const getChatMessagesKey = (chatId: string) => `chat:${chatId}:messages`;

// Key for storing chat metadata
export const getChatMetadataKey = (chatId: string) => `chat:${chatId}:metadata`;
