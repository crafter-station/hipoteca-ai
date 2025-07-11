"use client";

import { SmoothScrollLink } from "@/components/landing/smooth-scroll-link";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { SignedOut } from "@clerk/clerk-react";
import Link from "next/link";
import { UserButton } from "../user-button";
import { Logo } from "./logo";

export function Header() {
  const navLinks = [
    { href: "#hero", label: "Inicio" },
    { href: "#problem", label: "Problema" },
    { href: "#solution", label: "Solución" },
  ];

  return (
    <header className="sticky top-0 z-50 flex h-14 w-full shrink-0 items-center justify-between gap-3 border-border/30 border-b bg-background/80 px-3 py-2 backdrop-blur-lg sm:h-11 sm:px-2">
      <div className="flex min-w-0 flex-1 items-center">
        <SmoothScrollLink
          href="#hero"
          className="mr-1 inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border-none bg-transparent px-4 font-medium text-sm outline-none transition-all hover:bg-transparent focus:bg-transparent focus-visible:bg-transparent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 has-[>svg]:p-0 [&>svg]:size-12"
        >
          <Logo className="w-32 py-2" />
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
        <SignedOut>
          <Button size="sm" asChild className="h-7 rounded-md px-3 text-sm">
            <Link href="/checkr/new">Comenzar</Link>
          </Button>
        </SignedOut>
        <ThemeSwitcher />
        <UserButton />
      </div>
    </header>
  );
}
