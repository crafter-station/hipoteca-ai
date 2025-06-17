import fs from "node:fs";
import { mistral } from "@/clients/mistral";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function extractContentFromPdf(fileUrlOrPath: string) {
  try {
    const fileUrl = isUrl(fileUrlOrPath)
      ? fileUrlOrPath
      : await uploadPdf(fileUrlOrPath);

    const texts = await getTextFromPdf(fileUrl);
    return generateHtmlFromText(texts);
  } catch (error) {
    throw new Error("Error generating object from PDF", { cause: error });
  }
}

function isUrl(fileUrlOrPath: string) {
  return fileUrlOrPath.startsWith("http");
}

async function processInParallel<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
): Promise<R[]> {
  const promises = items.map(processor);
  return Promise.all(promises);
}

function ensureArray<T>(item: T | T[]): T[] {
  return Array.isArray(item) ? item : [item];
}

async function uploadPdf(path: string) {
  const pdfBytes = fs.readFileSync(path);

  const uploadedPdf = await mistral.files.upload({
    file: {
      fileName: generateFileName(path),
      content: pdfBytes,
    },
    purpose: "ocr",
  });
  const { url } = await mistral.files.getSignedUrl({
    fileId: uploadedPdf.id,
  });
  return url;
}

function generateFileName(path: string) {
  return (path.split("/").pop() || "uploaded_file.pdf") + Date.now();
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

  return resp.pages
    .toSorted((a, b) => a.index - b.index)
    .map((page) => page.markdown)
    .join("\n");
}

async function generateHtmlFromText(text: string) {
  const texts = splitTextIntoSemanticChunks(text, 1000);

  const htmlResponses = await processInParallel(texts, (t) =>
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

function splitTextIntoSemanticChunks(text: string, maxLen: number): string[] {
  // 1. Split the text into sentences
  const sentences =
    text
      .match(/[^.!?]+[.!?]+[\])'"`’”]*|\s*$/g)
      ?.map((s) => s.trim())
      .filter(Boolean) || [];

  const chunks: string[] = [];
  let buffer = "";

  for (const sentence of sentences) {
    // If adding this sentence exceeds the limit:
    if (`${buffer} ${sentence}`.length > maxLen) {
      if (buffer) {
        chunks.push(buffer.trim());
        buffer = "";
      }
      // If the sentence itself exceeds the limit, split it into parts
      if (sentence.length > maxLen) {
        let start = 0;
        while (start < sentence.length) {
          const part = sentence.slice(start, start + maxLen);
          chunks.push(part);
          start += maxLen;
        }
        continue;
      }
    }
    // If it fits, add it to the buffer
    buffer = buffer ? `${buffer} ${sentence}` : sentence;
  }

  if (buffer) {
    chunks.push(buffer.trim());
  }

  return chunks;
}
