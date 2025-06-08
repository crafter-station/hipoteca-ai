"use client";

import { useRouter } from "next/navigation";
import React from "react";

import { type Message, useChat } from "@ai-sdk/react";
import { createIdGenerator } from "ai";

export function Chat({
	id,
	initialMessages,
}: { id?: string | undefined; initialMessages?: Message[] } = {}) {
	const {
		input,
		handleInputChange,
		handleSubmit,
		messages,
		status,
		id: chatId,
	} = useChat({
		id, // use the provided chat ID
		initialMessages, // initial messages if provided
		sendExtraMessageFields: true, // send id and createdAt for each message
		experimental_prepareRequestBody({ messages, id }) {
			return { message: messages[messages.length - 1], id };
		},
		generateId: createIdGenerator({
			size: 16,
		}),
	});

	const router = useRouter();

	React.useEffect(() => {
		if (!id) {
			if (status === "ready" && messages.length > 0) {
				router.push(`/chat/${chatId}`);
			}
		}
	}, [status, id, chatId, router, messages.length]);

	// simplified rendering code, extend as needed:
	return (
		<div>
			{messages
				.sort(
					(b, a) =>
						(b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
				)
				.map((m) => (
					<div key={m.id}>
						{m.role === "user" ? "User: " : "AI: "}
						{m.content}
					</div>
				))}

			<form onSubmit={handleSubmit}>
				<input value={input} onChange={handleInputChange} />
			</form>
		</div>
	);
}
