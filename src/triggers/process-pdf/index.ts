import { nanoid } from "@/lib/nanoid";
import {
  type Contract,
  saveContract,
  saveKeyToContractMapping,
} from "@/models/contract";
import { logger, metadata, schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { extractContentFromPdf } from "./extract-content";
import { extractHighlightsFromContent } from "./extract-highlights";
import { extractSummaryFromContent } from "./extract-summary";
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
      // Extract key from fileUrl (e.g., "https://o6dbw19iyd.ufs.sh/f/KEY" -> "KEY")
      const urlParts = fileUrl.split("/");
      const key = urlParts[urlParts.length - 1];
      logger.info("extracted key from fileUrl", { key });

      // Update progress: extracting content
      metadata.set("progress", "extract_content");
      logger.info("extracting content from pdf");
      const { markdown, html, chunks } = await extractContentFromPdf(fileUrl);

      // Update progress: extracting highlights
      metadata.set("progress", "extract_highlights");
      logger.info("extracting highlights from pdf");
      const highlights = await extractHighlightsFromContent(chunks);

      // Update progress: extracting summary
      metadata.set("progress", "extract_summary");
      logger.info("extracting summary from pdf");
      const summary = await extractSummaryFromContent(chunks);

      const document: Contract = {
        id: nanoid(),
        userId: userId,
        pdfUrl: fileUrl,
        pdfName: fileName,
        htmlContent: html,
        markdownContent: markdown,
        chunks,
        highlights,
        summary,
        createdAt: new Date(),
      };

      logger.info("saving contract", {
        id: document.id,
        userId: document.userId,
      });
      await saveContract(document);
      logger.info("contract saved successfully in redis");

      // Save key-to-contract mapping
      logger.info("saving key-to-contract mapping", {
        key,
        contractId: document.id,
      });
      await saveKeyToContractMapping(key, document.id);
      logger.info("key-to-contract mapping saved successfully");

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
        key: key,
      };
    } catch (error) {
      logger.error("process pdf task failed", {
        error,
      });
      throw error;
    }
  },
});
