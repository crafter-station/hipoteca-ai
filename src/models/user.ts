import { redis } from "@/clients/redis";

export async function getUserFilesUrls(userId: string): Promise<string[]> {
	try {
		const key = `user:${userId}:files`;
		const urls = await redis.smembers(key);
		return urls;
	} catch (error) {
		console.error("Error fetching user file URLs from Redis:", error);
		throw error;
	}
}
