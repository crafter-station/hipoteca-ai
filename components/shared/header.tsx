"use client";

import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import Link from "next/link";

export function Header() {
	return (
		<header className="sticky top-0 z-50 flex h-14 w-full shrink-0 items-center justify-between gap-3 border-border/30 border-b bg-background/80 px-3 py-2 backdrop-blur-lg sm:h-11 sm:px-2">
			<div className="flex min-w-0 flex-1 items-center">
				<Link
					href="/"
					className="mr-1 inline-flex h-10 shrink-0 cursor-pointer select-none items-center justify-center gap-1.5 whitespace-nowrap text-nowrap rounded-lg border border-transparent border-none bg-transparent px-4 font-medium text-gray-900 text-sm outline-none ring-blue-600 transition-[background,border-color,color,transform,opacity,box-shadow] hover:border-transparent hover:bg-transparent focus:border-transparent focus:bg-transparent focus-visible:border-transparent focus-visible:bg-transparent focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:border-transparent disabled:bg-transparent disabled:text-gray-400 disabled:ring-0 has-[>svg]:p-0 has-[:focus-visible]:ring-2 aria-disabled:cursor-not-allowed aria-disabled:border-transparent aria-disabled:bg-transparent aria-disabled:text-gray-400 aria-disabled:ring-0 [&>svg]:pointer-events-none [&>svg]:size-8 [&>svg]:w-7 [&_svg]:shrink-0"
				>
					<Bot className="h-8 w-8 text-primary group-hover:animate-subtle-pulse" />
					<span className="font-bold text-foreground text-xl">
						Hipoteca<span className="text-primary">Copilot</span>
					</span>
					<span className="sr-only">HipotecaCopilot</span>
				</Link>
			</div>
			<div className="flex flex-1 items-center justify-end gap-2">
				<div className="flex gap-2">
					<Button
						variant="outline"
						size="sm"
						asChild
						className="h-7 rounded-md border-alpha-400 bg-background-subtle px-3 text-gray-900 text-sm hover:border-alpha-400 hover:bg-gray-100 focus:border-alpha-400 focus:bg-gray-100 focus-visible:border-alpha-400 focus-visible:bg-gray-100 focus-visible:ring-offset-background disabled:border-alpha-300 aria-disabled:border-alpha-300"
					>
						<Link href="/dashboard">Sign In</Link>
					</Button>
					<Button
						size="sm"
						asChild
						className="h-7 rounded-md border-gray-900 bg-gray-900 px-3 text-background text-sm hover:border-gray-700 hover:bg-gray-700 focus:border-gray-700 focus:bg-gray-700 focus-visible:border-gray-700 focus-visible:bg-gray-700 focus-visible:ring-offset-background disabled:border-alpha-400 aria-disabled:border-alpha-400"
					>
						<Link href="/dashboard">Sign Up</Link>
					</Button>
				</div>
			</div>
		</header>
	);
}
