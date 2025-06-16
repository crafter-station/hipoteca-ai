import { redis } from "@/clients/redis";

export interface Mortgage {
	id: string;
	userId: string;
	pdfUrl: string;
	pdfName: string;
	htmlContent: string;
	markdownContent: string;
	createdAt: Date;
}

export interface MortgageChunk {
	content: string;
	pageIndex: number;
}

export type MortgageKnowledge = Readonly<{
	pageIndex: number;
	content: string;
	chunkIndex: number;
	mortgageId: string;
}>;

export async function saveMortgage(mortgage: Mortgage) {
	try {
		const mortgageKey = `mortgage:${mortgage.id}`;
		const userSetKey = `user:${mortgage.userId}:mortgages`;
		const userFiles = `user:${mortgage.userId}:files`;

		const pipeline = redis.pipeline();

		pipeline.hset(mortgageKey, {
			id: mortgage.id,
			userId: mortgage.userId,
			pdfUrl: mortgage.pdfUrl,
			pdfName: mortgage.pdfName,
			htmlContent: mortgage.htmlContent,
			markdownContent: mortgage.markdownContent,
			createdAt: mortgage.createdAt.toISOString(),
		});

		pipeline.sadd(userSetKey, mortgage.id);
		pipeline.sadd(userFiles, mortgage.pdfUrl);

		// Ejecutar pipeline
		await pipeline.exec();
	} catch (error) {
		console.error("Error saving mortgage to Redis:", error);
		throw error;
	}
}

export async function getMortgageById(id: string): Promise<Mortgage | null> {
	try {
		const mortgageKey = `mortgage:${id}`;
		const data = await redis.hgetall(mortgageKey);

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
