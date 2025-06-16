import { nanoid } from "@/lib/nanoid";
import { type Mortgage, saveMortgage } from "@/models/mortgage";
import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { extractContentFromPdf } from "./extract-content";
import { fillKnowledge } from "./fill-knowledge";

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
			logger.info("extracting content from pdf");
			const { markdown, html, chunks } = await extractContentFromPdf(fileUrl);

			const mortgage: Mortgage = {
				id: nanoid(),
				userId: userId,
				pdfUrl: fileUrl,
				pdfName: fileName,
				htmlContent: html,
				markdownContent: markdown,
				createdAt: new Date(),
			};

			logger.info("saving mortgage", { id: mortgage.id });
			await saveMortgage(mortgage);
			logger.info("mortgage saved successfully");

			logger.info("filling knowledge database");

			const result = await fillKnowledge(chunks, mortgage.id);

			logger.info("database knowledge filled successfully", { result });
		} catch (error) {
			logger.error("process pdf task failed", {
				error,
			});
			return error;
		} finally {
			logger.info("process pdf task finished");
		}
	},
});
