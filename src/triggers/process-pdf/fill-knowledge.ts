import { weaviate } from "@/clients/weaviate";
import { CONTRACT_CONTEXT_COLLECTION } from "@/models/constants";
import type { ContractContext } from "@/models/contract-context";
import type { MortgageChunk } from "@/models/mortgage";

export async function fillKnowledge(
	chunks: MortgageChunk[],
	mortgageId: string,
) {
	const contractContextCollection = weaviate.collections.get<ContractContext>(
		CONTRACT_CONTEXT_COLLECTION,
	);

	return await contractContextCollection.data.insertMany(
		chunks.map((chunk, index) => ({
			properties: {
				pageIndex: chunk.pageIndex,
				content: chunk.content,
				chunkIndex: index,
				mortgageId,
			},
		})),
	);
}
