"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Message, useChat } from "@ai-sdk/react";
import { useQueryClient } from "@tanstack/react-query";
import { createIdGenerator } from "ai";

interface Source {
	name: string;
	pages: number[];
}

function parseSources(content: string): { text: string; sources: Source[] } {
	const sourcesMatch = content.match(/<sources>([\s\S]*?)<\/sources>/);
	if (!sourcesMatch) return { text: content, sources: [] };

	const text = content.replace(sourcesMatch[0], "").trim();
	const sourcesXml = sourcesMatch[1];
	const sources: Source[] = [];

	const sourceMatches = sourcesXml.matchAll(/<source>([\s\S]*?)<\/source>/g);
	for (const match of sourceMatches) {
		const sourceXml = match[1];
		const nameMatch = sourceXml.match(/<name>([\s\S]*?)<\/name>/);
		const pagesMatch = sourceXml.match(/<pages>([\s\S]*?)<\/pages>/);

		if (nameMatch && pagesMatch) {
			const pages =
				pagesMatch[1]
					.match(/<page>(\d+)<\/page>/g)
					?.map((p) =>
						Number.parseInt(p.replace(/<page>(\d+)<\/page>/, "$1"), 10),
					) || [];

			sources.push({
				name: nameMatch[1].trim(),
				pages,
			});
		}
	}

	return { text, sources };
}

function Sources({ sources }: { sources: Source[] }) {
	if (sources.length === 0) return null;

	// URLs for the sources
	const mortgagePdf =
		"https://www.bde.es/f/webbde/Secciones/Publicaciones/Folletos/Fic/Guia_hipotecaria_2013.pdf";
	const contractDoc =
		"https://o6dbw19iyd.ufs.sh/f/dgFwWFXCXZVhT5Loy8B7YUFvSi8RlzkwVJnbZ6ypt93rXGOs";

	return (
		<div className="mt-2 border border-gray-500 border-dotted bg-transparent p-2 font-mono text-gray-800 text-xs dark:border-green-700 dark:text-green-400">
			<div className="mb-1 font-bold text-gray-700 text-xs uppercase tracking-widest dark:text-green-400">
				References
			</div>
			<div className="space-y-1">
				{sources.map((source) => {
					let link: string | null = null;
					if (source.name === "Mortgage Knowledge" && source.pages.length > 0) {
						link = `${mortgagePdf}#page=${source.pages[0]}`;
					} else if (source.name === "Contract Context") {
						link = `${contractDoc}#page=${source.pages[0]}`;
					}
					return (
						<div
							key={`${source.name}-${source.pages.join("-")}`}
							className="flex items-baseline gap-2"
						>
							<span className="inline-block min-w-[1.5em] text-center font-bold text-green-700 dark:text-green-400">
								{sources.indexOf(source) + 1}.
							</span>
							<span className="flex items-center gap-1 text-gray-800 text-xs dark:text-green-400">
								{source.name}
								{link && (
									<a
										href={link}
										target="_blank"
										rel="noopener noreferrer"
										className="ml-1 text-green-700 hover:underline dark:text-green-400"
										title="Open reference document"
									>
										{/* Unicode link icon for retro look */}
										<span style={{ fontSize: "1em", verticalAlign: "middle" }}>
											🔗
										</span>
									</a>
								)}
							</span>
							<span className="ml-2 text-[0.9em] text-gray-500 dark:text-green-700">
								Pages: {source.pages.join(", ")}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}

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
								.map(({ toolInvocation }, index) => (
									<p
										key={toolInvocation.toolCallId}
										className="text-green-600 dark:text-green-600"
									>
										{toolInvocation.toolName === "searchContractContext" ? (
											<>
												<span>
													Searching contract information for "
													{toolInvocation.args.query}"
												</span>
											</>
										) : toolInvocation.toolName ===
											"searchMortgageKnowledge" ? (
											<>
												<span>
													Searching mortgage knowledge for "
													{toolInvocation.args.query}"
												</span>
											</>
										) : null}
										{index !== m.parts.length - 1 && <br />}
									</p>
								))}
							{(() => {
								const { text, sources } = parseSources(m.content);
								return (
									<>
										{text}
										<Sources sources={sources} />
									</>
								);
							})()}
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
