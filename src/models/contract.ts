import { redis } from "@/clients/redis";
import { getContractKey, getUserContractsKey } from "./constants";

export interface Contract {
	id: string;
	userId: string;
	pdfUrl: string;
	pdfName: string;
	htmlContent: string;
	markdownContent: string;
	createdAt: Date;
}

export async function saveContract(contract: Contract) {
	try {
		const contractKey = getContractKey(contract.id);
		const userSetKey = getUserContractsKey(contract.userId);

		const pipeline = redis.pipeline();

		pipeline.hset(contractKey, {
			id: contract.id,
			userId: contract.userId,
			pdfUrl: contract.pdfUrl,
			pdfName: contract.pdfName,
			htmlContent: contract.htmlContent,
			markdownContent: contract.markdownContent,
			createdAt: contract.createdAt.toISOString(),
		});

		pipeline.sadd(userSetKey, contract.id);

		// Ejecutar pipeline
		await pipeline.exec();
	} catch (error) {
		console.error("Error saving mortgage to Redis:", error);
		throw error;
	}
}

export async function getContractById(id: string): Promise<Contract | null> {
	try {
		const contractKey = getContractKey(id);
		const data = await redis.hgetall(contractKey);

		if (!data || Object.keys(data).length === 0) {
			return null;
		}

		return {
			id: data.id as string,
			userId: data.userId as string,
			pdfUrl: data.pdfUrl as string,
			pdfName: data.pdfName as string,
			htmlContent: data.htmlContent as string,
			markdownContent: data.markdownContent as string,
			createdAt: new Date(data.createdAt as string),
		};
	} catch (error) {
		console.error("Error fetching mortgage from Redis:", error);
		throw error;
	}
}
