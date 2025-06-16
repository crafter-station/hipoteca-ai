import { mistral } from "@/clients/mistral";

import { weaviate } from "@/clients/weaviate";
import {
	MORTGAGE_KNOWLEDGE_COLLECTION,
	MORTGAGE_KNOWLEDGE_DOCUMENT_ID,
} from "@/models/constants";
import type { MortgageKnowledge } from "@/models/mortgage-knowledge";
import { splitTextIntoSemanticChunks } from "@/triggers/process-pdf/extract-content";

const mortgageKnowledgeCollection = weaviate.collections.get<MortgageKnowledge>(
	MORTGAGE_KNOWLEDGE_COLLECTION,
);

const resp = await mistral.ocr.process({
	model: "mistral-ocr-latest",
	document: {
		type: "document_url",
		documentUrl:
			"https://www.bde.es/f/webbde/Secciones/Publicaciones/Folletos/Fic/Guia_hipotecaria_2013.pdf",
	},
	includeImageBase64: false,
});

const chunks = splitTextIntoSemanticChunks(
	resp.pages.map((page) => ({
		pageContent: page.markdown,
		pageIndex: page.index,
	})),
	1000,
);

console.log(chunks);

await mortgageKnowledgeCollection.data.insertMany(
	chunks.map((chunk, index) => ({
		content: chunk.content,
		pageIndex: chunk.pageIndex,
		chunkIndex: index,
		documentId: MORTGAGE_KNOWLEDGE_DOCUMENT_ID,
	})),
);
