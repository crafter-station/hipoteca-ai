import { redis } from "@/clients/redis";
import { getUserContractsKey } from "./constants";

export async function getUserContractsUrls(userId: string): Promise<string[]> {
  try {
    const key = getUserContractsKey(userId);
    const urls = await redis.smembers(key);
    return urls;
  } catch (error) {
    console.error("Error fetching user file URLs from Redis:", error);
    throw error;
  }
}
