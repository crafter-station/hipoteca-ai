import { openai } from "@ai-sdk/openai";
import {
	type Message,
	appendClientMessage,
	appendResponseMessages,
	createIdGenerator,
	streamText,
} from "ai";

import { getMessages, setMessages } from "@/redis";
import { searchQuestions } from "@/tools/search-questions";

interface ChatRequest {
	message: Message;
	id: string;
}

export async function POST(req: Request) {
	try {
		const body = (await req.json()) as ChatRequest;
		const { message: rawMessage, id } = body;
		const message = {
			...rawMessage,
			createdAt: new Date(rawMessage.createdAt ?? new Date().toISOString()),
		};

		// Validate required fields
		if (!message || !id) {
			return new Response(
				JSON.stringify({ error: "Missing required fields: message and id" }),
				{ status: 400, headers: { "Content-Type": "application/json" } },
			);
		}

		// Retrieve existing messages from Redis
		const existingMessages = await getMessages(id);

		const messages = appendClientMessage({
			messages: existingMessages.toReversed(),
			message,
		});

		const result = streamText({
			model: openai("gpt-4.1-nano"),
			messages,
			async onFinish({ response }) {
				const updatedMessages = appendResponseMessages({
					messages,
					responseMessages: response.messages,
				});

				await setMessages({
					id,
					originalMessages: existingMessages,
					newMessages: updatedMessages,
				});
			},
			experimental_generateMessageId: createIdGenerator({
				size: 16,
			}),
			tools: {
				searchQuestions,
			},
			maxSteps: 10,
		});

		// consume the stream to ensure it runs to completion & triggers onFinish
		// even when the client response is aborted:
		result.consumeStream(); // no await

		return result.toDataStreamResponse();
	} catch (error) {
		console.error("Error in chat API:", error);
		return new Response(
			JSON.stringify({
				error: "Internal server error",
				details: error instanceof Error ? error.message : "Unknown error",
			}),
			{ status: 500, headers: { "Content-Type": "application/json" } },
		);
	}
}
