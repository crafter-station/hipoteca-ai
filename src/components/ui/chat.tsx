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
		<div className="min-h-screen border-2 border-gray-700 bg-black p-5 font-mono text-green-400">
			<div className="mb-5 max-h-[70vh] overflow-y-auto border border-gray-700 bg-gray-900 p-2.5">
				{messages
					.toSorted(
						(a, b) =>
							new Date(a.createdAt ?? new Date()).getTime() -
							new Date(b.createdAt ?? new Date()).getTime(),
					)
					.map((m) => (
						<div
							key={m.id}
							className="mb-2.5 border-gray-700 border-b border-dotted py-1.5"
						>
							<span
								className={
									m.role === "user" ? "text-cyan-400" : "text-green-400"
								}
							>
								{m.role === "user" ? "user@terminal:~$ " : "ai@system:~$ "}
							</span>
							{m.content}
						</div>
					))}
			</div>

			<form onSubmit={handleSubmit}>
				<div className="flex items-center">
					<span className="mr-2 text-cyan-400">&gt;</span>
					<input
						value={input}
						onChange={handleInputChange}
						className="flex-1 border-none bg-transparent p-1.5 font-mono text-base text-green-400 outline-none"
						placeholder="Type your message..."
					/>
				</div>
			</form>
		</div>
	);
}
