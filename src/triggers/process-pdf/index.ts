import { nanoid } from "@/lib/nanoid";
import { type Contract, saveContract } from "@/models/contract";
import { logger, metadata, schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { extractContentFromPdf } from "./extract-content";
import { extractHighlightsFromContent } from "./extract-highlights";
import { storeContractContext } from "./store-contract-context";

export const processPDFTask = schemaTask({
  id: "process-pdf-task",
  schema: z.object({
    userId: z.string(),
    fileUrl: z.string().url(),
    fileName: z.string(),
  }),
  run: async ({ userId, fileUrl, fileName }) => {
    logger.info("process pdf task started", {
      userId,
      fileUrl,
    });

    try {
      // Update progress: extracting content
      metadata.set("progress", "extract_content");
      logger.info("extracting content from pdf");
      const { markdown, html, chunks } = await extractContentFromPdf(fileUrl);

      // Update progress: extracting highlights
      metadata.set("progress", "extract_highlights");
      logger.info("extracting highlights from pdf");
      const highlights = await extractHighlightsFromContent(chunks);

      const document: Contract = {
        id: nanoid(),
        userId: userId,
        pdfUrl: fileUrl,
        pdfName: fileName,
        htmlContent: html,
        markdownContent: markdown,
        chunks,
        highlights,
        createdAt: new Date(),
      };

      logger.info("saving contract", { id: document.id });
      await saveContract(document);
      logger.info("contract saved successfully in redis");

      // Update progress: storing contract context
      metadata.set("progress", "store_contract_context");
      logger.info("storing contract context");
      const result = await storeContractContext(chunks, document.id);

      logger.info("contract context stored successfully in weaviate", {
        result,
      });

      // Update progress: completed
      metadata.set("progress", "completed");
      await metadata.flush();
      logger.info("process pdf task finished");

      return {
        contractId: document.id,
      };
    } catch (error) {
      logger.error("process pdf task failed", {
        error,
      });
      throw error;
    }
  },
});
