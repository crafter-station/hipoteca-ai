import { weaviate } from "@/clients/weaviate";
import { CONTRACT_CONTEXT_COLLECTION } from "@/models/constants";
import type { ContractContext } from "@/models/contract-context";
import { Filters } from "weaviate-client";

const highlightedText = "Impuesto sobre Actos Jurídicos Documentados (IAJD)";

const pageIndex = 3;

const contractId = "sNy0sDBuIx0O";

const contractContextCollection = weaviate.collections.get<ContractContext>(
  CONTRACT_CONTEXT_COLLECTION,
);

// Get initial relevant chunks
const { objects: chunks } = await contractContextCollection.query.nearText(
  highlightedText,
  {
    limit: 1,
    filters: Filters.and(
      contractContextCollection.filter
        .byProperty("documentId")
        .equal(contractId),
      contractContextCollection.filter.byProperty("pageIndex").equal(pageIndex),
    ),
  },
);

console.log(chunks);

const chunk = chunks[0].properties.content;

let highlightedChunk = chunk;

highlightedChunk = highlightedChunk.replace(
  highlightedText,
  `<highlighted>${highlightedText}</highlighted>`,
);

console.log(highlightedChunk);
