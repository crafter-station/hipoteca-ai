"use client";

import type { ChatSummary } from "@/lib/chat-history";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface ChatSidebarProps {
	chats: ChatSummary[];
}

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
		<div className="flex h-screen w-64 flex-col border-gray-200 border-r bg-gray-50">
			{/* New Chat Button */}
			<div className="border-gray-200 border-b p-4">
				<Link
					href="/chat"
					className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-sm transition-colors ${
						isNewChat
							? "bg-blue-600 text-white"
							: "bg-blue-600 text-white hover:bg-blue-700"
					}`}
				>
					<PlusCircle className="h-4 w-4" />
					New Chat
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
								className={`mb-2 block rounded-lg p-3 text-sm transition-colors ${
									isActive
										? "border border-blue-200 bg-blue-50"
										: "hover:bg-gray-100"
								}`}
							>
								<div
									className={`truncate font-medium ${
										isActive ? "text-blue-700" : "text-gray-900"
									}`}
								>
									{chat.title}
								</div>
								<div
									className={`mt-1 text-xs ${
										isActive ? "text-blue-500" : "text-gray-400"
									}`}
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
