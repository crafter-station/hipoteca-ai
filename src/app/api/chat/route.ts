import { openai } from "@ai-sdk/openai";
import {
  type Message,
  type Tool,
  appendClientMessage,
  appendResponseMessages,
  createIdGenerator,
  generateText,
  streamText,
} from "ai";

import { generateUserId } from "@/lib/user-identification";
import { MORTGAGE_KNOWLEDGE_DOCUMENT_ID } from "@/models/constants";
import { getContractIdByKey } from "@/models/contract";
import { CHAT_SYSTEM_PROMPT } from "@/prompts/chat-system-prompt";
import { getMessages, setMessages } from "@/redis";
import {
  isChatOwnedByUser,
  listUserChats,
  updateChatMetadata,
} from "@/redis/chat-management";
import { createSearchContractContextTool } from "@/tools/search-contract-context";
import { createSearchMortgageKnowledgeTool } from "@/tools/search-mortgage-knowledge";
import { getTracer } from "@lmnr-ai/lmnr";

interface ChatRequest {
  message: Message;
  chat_id: string;
  contract_id: string;
}

export async function GET(req: Request) {
  const userId = generateUserId(getUserHeaders(req));

  const chats = await listUserChats(userId);

  return Response.json(chats);
}

async function getChatTitle(messages: Message[]) {
  const response = await generateText({
    model: openai("gpt-4.1-nano"),
    prompt: `Generate a title for the chat.
			The title should be a single word or phrase that captures the essence of the chat.
			The title should be no more than 10 words.
			Do not include any other text in your response.
      Title must be in the same language as the messages.

			<Chat>
				${messages.map((m) => `<Message role="${m.role}" createdAt="${m.createdAt?.toISOString()}" content="${m.content}">${m.content}</Message>`).join("\n")}
			</Chat>`,
    temperature: 0.1,
  });

  return response.text;
}

export async function POST(req: Request) {
  try {
    // Generate user ID from request headers
    const userId = generateUserId(getUserHeaders(req));

    const body = (await req.json()) as ChatRequest;
    const { message: rawMessage, chat_id, contract_id: key } = body;
    const message = {
      ...rawMessage,
      createdAt: new Date(rawMessage.createdAt ?? new Date().toISOString()),
    };

    const contractId = await getContractIdByKey(key);
    if (!contractId && key) {
      return new Response(JSON.stringify({ error: "Contract not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    // Validate required fields
    if (!message || !chat_id) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: message and chat_id",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Verify the chat belongs to the user
    const isOwned = await isChatOwnedByUser(userId, chat_id);
    if (!isOwned) {
      return new Response(
        JSON.stringify({ error: "Chat not found or access denied" }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    // Retrieve existing messages from Redis
    const existingMessages = await getMessages(chat_id);

    const messages = appendClientMessage({
      messages: existingMessages.toReversed(),
      message,
    });

    const tools: Record<string, Tool> = {
      searchMortgageKnowledge: createSearchMortgageKnowledgeTool(
        MORTGAGE_KNOWLEDGE_DOCUMENT_ID,
      ),
    };

    if (contractId) {
      tools.searchContractContext = createSearchContractContextTool(contractId);
    }

    const result = streamText({
      model: openai("gpt-4.1-nano"),
      system: CHAT_SYSTEM_PROMPT,
      messages,
      async onFinish({ response }) {
        const updatedMessages = appendResponseMessages({
          messages,
          responseMessages: response.messages,
        });

        await setMessages({
          chatId: chat_id,
          originalMessages: existingMessages,
          newMessages: updatedMessages,
        });

        const title = await getChatTitle(updatedMessages);
        await updateChatMetadata(chat_id, { title });
      },
      experimental_generateMessageId: createIdGenerator({
        size: 16,
      }),
      tools,
      maxSteps: 10,
      experimental_telemetry: {
        isEnabled: true,
        tracer: getTracer(),
      },
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

function getUserHeaders(req: Request) {
  return {
    "x-forwarded-for": req.headers.get("x-forwarded-for") || undefined,
    "user-agent": req.headers.get("user-agent") || undefined,
    "accept-language": req.headers.get("accept-language") || undefined,
    "sec-ch-ua": req.headers.get("sec-ch-ua") || undefined,
    "sec-ch-ua-platform": req.headers.get("sec-ch-ua-platform") || undefined,
  };
}
