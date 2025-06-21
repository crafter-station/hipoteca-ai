"use client";

import { UserButton as ClerkUserButton, SignedIn } from "@clerk/nextjs";

export function UserButton() {
  return (
    <div className="ml-2 flex items-center gap-4 lg:ml-0">
      <SignedIn>
        <ClerkUserButton />
      </SignedIn>
    </div>
  );
}
