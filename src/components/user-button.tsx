"use client";

import { UserButton as ClerkUserButton, SignedIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function UserButton() {
	const router = useRouter();

	return (
		<div className="ml-2 flex items-center gap-4 lg:ml-0">
			<SignedIn>
				<ClerkUserButton />
			</SignedIn>
		</div>
	);
}
