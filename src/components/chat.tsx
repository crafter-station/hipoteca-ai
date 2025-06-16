"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Message, useChat } from "@ai-sdk/react";
import { useQueryClient } from "@tanstack/react-query";
import { createIdGenerator } from "ai";

export function Chat({
	id,
	initialMessages,
}: { id?: string | undefined; initialMessages?: Message[] } = {}) {
	const queryClient = useQueryClient();
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
			return { message: messages[messages.length - 1], chat_id: id };
		},
		generateId: createIdGenerator({
			size: 16,
		}),
		onFinish: () => {
			queryClient.invalidateQueries({ queryKey: ["chats"] });
		},
	});

	const router = useRouter();

	React.useEffect(() => {
		if (!id) {
			if (status === "ready" && messages.length > 0) {
				router.push(`/chat/${chatId}`);
			}
		}
	}, [status, id, chatId, router, messages.length]);

	return (
		<div className="min-h-screen border-2 border-gray-300 bg-gray-50 p-5 font-mono text-gray-800 dark:border-green-700 dark:bg-black dark:text-green-400">
			<div className="mb-5 max-h-[70vh] overflow-y-auto border border-gray-300 bg-white p-2.5 dark:border-gray-700 dark:bg-gray-900">
				{messages
					.toSorted(
						(a, b) =>
							new Date(a.createdAt ?? new Date()).getTime() -
							new Date(b.createdAt ?? new Date()).getTime(),
					)
					.map((m) => (
						<div
							key={m.id}
							className="mb-2.5 border-gray-300 border-b border-dotted py-1.5 dark:border-gray-700"
						>
							<span
								className={cn(
									"text-blue-700 dark:text-cyan-400",
									m.role === "user" && "text-green-700 dark:text-green-400",
								)}
							>
								{m.role === "user" ? "user@terminal:~$ " : "ai@system:~$ "}
							</span>
							{m.parts
								.filter((p) => p.type === "tool-invocation")
								.map(({ toolInvocation }) => (
									<span
										key={toolInvocation.toolCallId}
										className="text-green-600 dark:text-green-600"
									>
										{toolInvocation.toolName === "searchContractContext" ? (
											<span>
												Searching contract information for "
												{toolInvocation.args.query}"
											</span>
										) : null}
									</span>
								))}
							<br />

							{m.content}
						</div>
					))}
			</div>

			<form onSubmit={handleSubmit}>
				<div className="flex items-center">
					<span className="mr-2 text-blue-700 dark:text-cyan-400">&gt;</span>
					<input
						value={input}
						onChange={handleInputChange}
						className="flex-1 border-none bg-transparent p-1.5 font-mono text-base text-gray-800 outline-none dark:text-green-400"
						placeholder="Type your message..."
					/>
				</div>
			</form>
		</div>
	);
}
