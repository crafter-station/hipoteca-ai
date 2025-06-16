import { tool } from "ai";
import z from "zod";

import { weaviate } from "@/clients/weaviate";
import { MORTGAGE_KNOWLEDGE_COLLECTION } from "@/models/constants";
import type { MortgageKnowledge } from "@/models/mortgage-knowledge";
import { Filters } from "weaviate-client";

export const createSearchMortgageKnowledgeTool = (documentId: string) =>
	tool({
		description: `Retrieve mortgage knowledge. It's a list of chunks of text from the mortgage knowledge database. 
		This is a database of information about mortgages. This is reliable information about mortgages.
		Whenever you need mortgage information, you can use this tool. This will help you to back your answers with reliable information.
		You can use this tool to answer questions about the mortgage.`,
		parameters: z.object({
			query: z.string(),
		}),
		execute: async ({ query }) => {
			try {
				const mortgageKnowledgeCollection =
					weaviate.collections.get<MortgageKnowledge>(
						MORTGAGE_KNOWLEDGE_COLLECTION,
					);

				// Get initial relevant chunks
				const { objects: initialChunks } =
					await mortgageKnowledgeCollection.query.nearText(query, {
						limit: 3,
						filters: mortgageKnowledgeCollection.filter
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
						? await mortgageKnowledgeCollection.query.nearText(query, {
								filters: Filters.and(
									mortgageKnowledgeCollection.filter
										.byProperty("documentId")
										.equal(documentId),
									Filters.or(
										...Array.from(extraChunkIndexes).map((chunkIndex) =>
											mortgageKnowledgeCollection.filter
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
				return `<mortgage-knowledge>\n${allChunks
					.map(
						({ properties: { chunkIndex, content, pageIndex } }) =>
							`  <chunk>\n    <chunkIndex>${chunkIndex}</chunkIndex>\n    <content>${content}</content>\n    <pageNumber>${pageIndex}</pageNumber>\n  </chunk>`,
					)
					.join("\n")}\n</mortgage-knowledge>`;
			} catch (error) {
				return `Error: ${error instanceof Error ? error.message : "Unknown error"}`;
			}
		},
	});
