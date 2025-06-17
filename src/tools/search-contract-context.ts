import { tool } from "ai";
import z from "zod";

import { weaviate } from "@/clients/weaviate";
import { CONTRACT_CONTEXT_COLLECTION } from "@/models/constants";
import type { ContractContext } from "@/models/contract-context";
import { Filters } from "weaviate-client";

export const createSearchContractContextTool = (documentId: string) =>
  tool({
    description: `Retrieve contract context. It's a list of chunks of text from the contract. 
		Whenever you need information about the user's mortgage, you can use this tool.
		You can use this tool to answer questions about the contract.`,
    parameters: z.object({
      query: z.string(),
    }),
    execute: async ({ query }) => {
      try {
        const contractContextCollection =
          weaviate.collections.get<ContractContext>(
            CONTRACT_CONTEXT_COLLECTION,
          );

        // Get initial relevant chunks
        const { objects: initialChunks } =
          await contractContextCollection.query.nearText(query, {
            limit: 3,
            filters: contractContextCollection.filter
              .byProperty("documentId")
              .equal(documentId),
          });

        // Calculate adjacent chunk indexes efficiently
        const extraChunkIndexes = new Set<number>();
        for (const {
          properties: { chunkIndex },
        } of initialChunks) {
          extraChunkIndexes.add(chunkIndex - 1).add(chunkIndex + 1);
        }

        // Get adjacent chunks if any exist
        const { objects: adjacentChunks } =
          extraChunkIndexes.size > 0
            ? await contractContextCollection.query.nearText(query, {
                filters: Filters.and(
                  contractContextCollection.filter
                    .byProperty("documentId")
                    .equal(documentId),
                  Filters.or(
                    ...Array.from(extraChunkIndexes).map((chunkIndex) =>
                      contractContextCollection.filter
                        .byProperty("chunkIndex")
                        .equal(chunkIndex),
                    ),
                  ),
                ),
              })
            : { objects: [] };

        // Combine and sort all chunks
        const allChunks = [...initialChunks, ...adjacentChunks].sort(
          (a, b) => a.properties.chunkIndex - b.properties.chunkIndex,
        );

        // Build XML-like string efficiently
        return `<contract-context>\n${allChunks
          .map(
            ({ properties: { chunkIndex, content, pageIndex } }) =>
              `  <chunk>\n    <chunkIndex>${chunkIndex}</chunkIndex>\n    <content>${content}</content>\n    <pageNumber>${pageIndex}</pageNumber>\n  </chunk>`,
          )
          .join("\n")}\n</contract-context>`;
      } catch (error) {
        return `Error: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  });
