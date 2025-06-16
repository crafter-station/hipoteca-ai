import { mistral } from "@/clients/mistral";
import type { ContractContextChunk } from "@/models/contract-context";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function extractContentFromPdf(fileUrl: string) {
	try {
		const { markdown, pages } = await getTextFromPdf(fileUrl);
		const chunks = splitTextIntoSemanticChunks(
			pages.map((page) => ({
				pageContent: page.markdown,
				pageIndex: page.index,
			})),
			1000,
		);
		const html = await generateHtmlFromText(chunks);

		return {
			markdown,
			chunks,
			html,
		};
	} catch (error) {
		console.error(error);
		throw new Error("Error generating object from PDF", { cause: error });
	}
}

async function processInParallel<T, R>(
	items: T[],
	processor: (item: T) => Promise<R>,
): Promise<R[]> {
	const promises = items.map(processor);
	return Promise.all(promises);
}

async function getTextFromPdf(fileUrl: string) {
	const resp = await mistral.ocr.process({
		model: "mistral-ocr-latest",
		document: {
			type: "document_url",
			documentUrl: fileUrl,
		},
		includeImageBase64: false,
	});

	return {
		markdown: resp.pages
			.toSorted((a, b) => a.index - b.index)
			.map((page) => page.markdown)
			.join("\n"),
		pages: resp.pages,
	};
}

async function generateHtmlFromText(
	chunks: { content: string; pageIndex: number }[],
) {
	const htmlResponses = await processInParallel(chunks, (t) =>
		generateText({
			model: openai("gpt-4o-mini"),
			prompt: `Convert this markdown text into a more structured one, that could be a HTML. You should focus on putting the right tags. The text: ${t}. You should return only the HTML without \`\`\`html \`\`\``,
		}),
	);

	const content = htmlResponses
		.map((resp: { text: string }) => resp.text)
		.join("\n");
	return `<main>${content}</main>`;
}

export function splitTextIntoSemanticChunks(
	pages: { pageContent: string; pageIndex: number }[],
	maxLen: number,
): ContractContextChunk[] {
	const chunks: ContractContextChunk[] = [];

	for (const page of pages) {
		// 1. Split the text into sentences
		const sentences =
			page.pageContent
				.match(/[^.!?]+[.!?]+[\])'"`’”]*|\s*$/g)
				?.map((s) => s.trim())
				.filter(Boolean) || [];

		let buffer = "";

		for (const sentence of sentences) {
			// If adding this sentence exceeds the limit:
			if (`${buffer} ${sentence}`.length > maxLen) {
				if (buffer) {
					chunks.push({
						content: buffer.trim(),
						pageIndex: page.pageIndex,
					});
					buffer = "";
				}
				// If the sentence itself exceeds the limit, split it into parts
				if (sentence.length > maxLen) {
					let start = 0;
					while (start < sentence.length) {
						const part = sentence.slice(start, start + maxLen);
						chunks.push({
							content: part,
							pageIndex: page.pageIndex,
						});
						start += maxLen;
					}
					continue;
				}
			}
			// If it fits, add it to the buffer
			buffer = buffer ? `${buffer} ${sentence}` : sentence;
		}

		if (buffer) {
			chunks.push({
				content: buffer.trim(),
				pageIndex: page.pageIndex,
			});
		}
	}
	return chunks;
}
