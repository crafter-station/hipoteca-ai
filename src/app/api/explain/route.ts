import { weaviate } from "@/clients/weaviate";
import {
  CONTRACT_CONTEXT_COLLECTION,
  MORTGAGE_KNOWLEDGE_DOCUMENT_ID,
} from "@/models/constants";
import { getContractIdByKey } from "@/models/contract";
import type { ContractContext } from "@/models/contract-context";
import { EXPLAIN_SYSTEM_PROMPT } from "@/prompts/explain-system-prompt";
import { createSearchContractContextTool } from "@/tools/search-contract-context";
import { createSearchMortgageKnowledgeTool } from "@/tools/search-mortgage-knowledge";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { Filters } from "weaviate-client";

export async function POST(req: Request) {
  const { prompt, pageIndex, contractId: key, question } = await req.json();

  if (!prompt || pageIndex === null) {
    return new Response(
      JSON.stringify({
        error: "Missing required query params: prompt, pageIndex, contractId",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const contractId = await getContractIdByKey(key);
  if (!contractId) {
    return new Response(JSON.stringify({ error: "Contract not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const highlightedChunk = await getHighlightedChunk(
    prompt,
    Number(pageIndex),
    contractId,
  );

  const userMessage = {
    role: "user" as const,
    content: `<surrounding-text>${highlightedChunk}</surrounding-text>
    <highlighted-text>${prompt}</highlighted-text>`,
  };

  if (question) {
    userMessage.content = `${userMessage.content}
    <question>${question}</question>`;
  }

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: EXPLAIN_SYSTEM_PROMPT,
    messages: [userMessage],
    tools: {
      searchMortgageKnowledge: createSearchMortgageKnowledgeTool(
        MORTGAGE_KNOWLEDGE_DOCUMENT_ID,
      ),
      searchContractContext: createSearchContractContextTool(contractId),
    },
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}

async function getHighlightedChunk(
  text: string,
  pageIndex: number,
  contractId: string,
) {
  const contractContextCollection = weaviate.collections.get<ContractContext>(
    CONTRACT_CONTEXT_COLLECTION,
  );

  const { objects: chunks } = await contractContextCollection.query.nearText(
    text,
    {
      limit: 1,
      filters: Filters.and(
        contractContextCollection.filter
          .byProperty("documentId")
          .equal(contractId),
        contractContextCollection.filter
          .byProperty("pageIndex")
          .equal(pageIndex),
      ),
    },
  );

  const highlightedChunk = chunks[0].properties.content;

  return highlightedChunk;
}
