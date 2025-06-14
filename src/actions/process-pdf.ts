"use server";

import { processPDFTask } from "@/triggers/process-pdf";
import { auth } from "@clerk/nextjs/server";
import { tasks } from "@trigger.dev/sdk/v3";

export async function processPDF(fileUrl: string, fileName: string) {
	const session = await auth();

	if (!session.userId) {
		return { error: "Unauthorized" };
	}

	try {
		const handle = await tasks.trigger<typeof processPDFTask>(
			processPDFTask.id,
			{
				fileUrl: fileUrl,
				userId: session.userId,
				fileName: fileName,
			},
		);

		return {
			success: true,
			runId: handle.id,
			token: handle.publicAccessToken,
		};
	} catch (error) {
		console.error("Failed to trigger task:", error);
		return {
			success: false,
			error: "Failed to process CV",
			cause: error,
		};
	}
}
