import { weaviate } from "@/clients/weaviate";
import { MORTGAGE_KNOWLEDGE_COLLECTION } from "@/models/constants";
import type { MortgageChunk } from "@/models/mortgage";

export async function fillKnowledge(chunks: MortgageChunk[]) {
	const knowledges = weaviate.collections.get(MORTGAGE_KNOWLEDGE_COLLECTION);
	return await knowledges.data.insertMany(
		chunks.map((chunk) => ({
			content: chunk.content,
		})),
	);
}
