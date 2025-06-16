"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";

import type { ChatSummary } from "@/lib/chat-history";
import { cn } from "@/lib/utils";

export function ChatSidebar() {
	const params = useParams<{ id: string }>();
	const currentChatId = params.id;
	const isNewChat = !currentChatId;

	const { data: chats, isLoading } = useQuery({
		queryKey: ["chats"],
		queryFn: async () => {
			const res = await fetch("/api/chat");
			if (!res.ok) {
				throw new Error("Failed to fetch chats");
			}
			return res.json() as Promise<ChatSummary[]>;
		},
	});

	return (
		<div className="flex h-screen w-64 flex-col border-gray-200 border-r bg-gray-50 font-mono dark:border-green-700 dark:bg-black dark:font-mono">
			{/* New Chat Button */}
			<div className="border-gray-200 border-b bg-gray-50 p-4 dark:border-green-700 dark:bg-black">
				<Link
					href="/chat"
					className={`flex items-center gap-2 rounded border px-4 py-2 font-bold text-sm transition-colors shadow-sm${
						isNewChat
							? "border-cyan-400 bg-black text-cyan-300 dark:border-cyan-400 dark:bg-black dark:text-cyan-300"
							: "border-green-300 bg-green-100 text-green-700 hover:bg-green-200 hover:text-cyan-700 dark:border-green-700 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800 dark:hover:text-cyan-300"
					}
					`}
				>
					<PlusCircle className="h-4 w-4 text-cyan-300 dark:text-cyan-300" />
					<span>&gt; Nuevo Chat</span>
				</Link>
			</div>

			{/* Chat List */}
			<div className="flex-1 overflow-y-auto">
				<div className="p-2">
					{(chats || []).map((chat) => {
						const isActive = chat.id === currentChatId;
						return (
							<Link
								key={chat.id}
								href={`/chat/${chat.id}`}
								className={cn(
									"mb-2 block rounded border p-3 font-mono text-sm transition-colors",
									isActive
										? "border-cyan-400 bg-green-50 text-cyan-700 dark:border-cyan-400 dark:bg-green-950 dark:text-cyan-300"
										: "border-green-300 bg-white text-green-700 hover:bg-green-100 hover:text-cyan-700 dark:border-green-700 dark:bg-black dark:text-green-300 dark:hover:bg-green-900 dark:hover:text-cyan-300",
								)}
							>
								<div
									className={cn(
										"truncate font-bold",
										isActive
											? "text-cyan-700 dark:text-cyan-300"
											: "text-green-700 dark:text-green-300",
									)}
								>
									{chat.title}
								</div>
								<div
									className={cn(
										"mt-1 text-xs",
										isActive
											? "text-cyan-500 dark:text-cyan-200"
											: "text-green-500 dark:text-green-500",
									)}
								>
									{new Date(chat.lastMessageAt).toLocaleString()}
								</div>
							</Link>
						);
					})}
				</div>
			</div>
		</div>
	);
}
