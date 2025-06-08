"use client";

import { SmoothScrollLink } from "@/components/landing/smooth-scroll-link";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import Link from "next/link";

export function Header() {
	const navLinks = [
		{ href: "#hero", label: "Inicio" },
		{ href: "#problem", label: "El Reto" },
		{ href: "#solution", label: "Solución" },
		{ href: "#features", label: "Capacidades" },
		{ href: "#pricing", label: "Planes" },
		{ href: "#faq", label: "FAQ" },
	];

	return (
		<header className="sticky top-0 z-50 flex h-14 w-full shrink-0 items-center justify-between gap-3 border-border/30 border-b bg-background/80 px-3 py-2 backdrop-blur-lg sm:h-11 sm:px-2">
			<div className="flex min-w-0 flex-1 items-center">
				<SmoothScrollLink
					href="#hero"
					className="mr-1 inline-flex h-10 shrink-0 cursor-pointer select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border-none bg-transparent px-4 font-medium text-sm outline-none transition-all hover:bg-transparent focus:bg-transparent focus-visible:bg-transparent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 has-[>svg]:p-0 [&>svg]:size-8 [&>svg]:w-7"
				>
					<Bot className="h-8 w-8 text-primary group-hover:animate-subtle-pulse" />
					<span className="font-bold text-foreground text-xl">
						Hipoteca<span className="text-primary">Copilot</span>
					</span>
					<span className="sr-only">HipotecaCopilot</span>
				</SmoothScrollLink>
			</div>

			{/* Center Navigation */}
			<nav className="hidden items-center gap-1 md:flex">
				{navLinks.map((link) => (
					<SmoothScrollLink
						key={link.label}
						href={link.href}
						className="rounded-md px-3 py-2 font-medium text-muted-foreground text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
					>
						{link.label}
					</SmoothScrollLink>
				))}
			</nav>

			<div className="flex flex-1 items-center justify-end gap-2">
				<div className="flex gap-2">
					<Button
						variant="outline"
						size="sm"
						asChild
						className="h-7 rounded-md px-3 text-sm"
					>
						<Link href="/dashboard">Sign In</Link>
					</Button>
					<Button size="sm" asChild className="h-7 rounded-md px-3 text-sm">
						<Link href="/dashboard">Sign Up</Link>
					</Button>
				</div>
			</div>
		</header>
	);
}
