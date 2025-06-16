import { weaviate } from "@/clients/weaviate";
import { CONTRACT_CONTEXT_COLLECTION } from "@/models/constants";
import type {
	ContractContext,
	ContractContextChunk,
} from "@/models/contract-context";

export async function storeContractContext(
	chunks: ContractContextChunk[],
	documentId: string,
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
				documentId,
			},
		})),
	);
}
