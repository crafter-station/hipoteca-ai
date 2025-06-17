"use client";

import { FileText, Search } from "lucide-react";
import { useEffect, useState } from "react";

import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserButton } from "@/components/user-button";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import Link from "next/link";

// Contratos de hipoteca de ejemplo
const contractosHipoteca = [
  "Hipoteca Variable BBVA - Análisis completo",
  "Contrato Santander Fija 30 años",
  "ING Hipoteca Mixta - Revisión",
  "CaixaBank Variable Euribor + 0.99%",
  "Bankinter Hipoteca Sin Comisiones",
  "Unicaja Fija 2.5% - 25 años",
  "Openbank Variable Online",
  "Evo Banco Hipoteca Joven",
  "Sabadell Hipoteca Expansión",
  "Kutxabank Variable Euribor",
  "Cajamar Hipoteca Rural",
  "Bankia Hipoteca Sostenible",
  "Deutsche Bank Premium",
  "ABANCA Hipoteca Galicia",
  "Liberbank Hipoteca Familiar",
];

export function AppSidebar() {
  const [open, setOpen] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Sidebar variant="floating">
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="size-8" />
            <span className="font-semibold text-sm">HipoCheckr</span>
          </div>

          {/* Nueva Hipoteca - Styled like v0 */}
          <Button size="sm" variant="outline" asChild>
            <Link href="/checkr/new">Nuevo Análisis</Link>
          </Button>

          {/* Search - Styled like v0 with hover effects */}
          <Button
            variant="ghost"
            onClick={() => setOpen(true)}
            className="group/search text-muted-foreground hover:bg-[#EDEDED] hover:text-foreground"
          >
            <Search className="h-4 w-4" />
            <span>Buscar análisis</span>
            <kbd className="ml-auto hidden items-center gap-1 opacity-0 transition-opacity group-hover/search:opacity-100 sm:flex">
              <kbd className="pointer-events-none flex h-4 w-4 select-none items-center justify-center rounded-sm bg-muted px-0 font-normal text-muted-foreground text-xs tabular-nums tracking-tight">
                ⌘
              </kbd>
              <kbd className="pointer-events-none flex h-4 w-4 select-none items-center justify-center rounded-sm bg-muted px-0 font-normal text-muted-foreground text-xs tabular-nums tracking-tight">
                K
              </kbd>
            </kbd>
          </Button>
        </SidebarHeader>

        <SidebarContent>
          {/* Contratos de Hipoteca - Scrolleable */}
          <SidebarGroup className="min-h-0 flex-1">
            <SidebarGroupLabel>Análisis de Hipoteca</SidebarGroupLabel>
            <SidebarGroupContent>
              <ScrollArea className="h-full w-full">
                <SidebarMenu className="gap-1">
                  {contractosHipoteca.map((contrato) => (
                    <SidebarMenuItem key={contrato} className="w-full">
                      <SidebarMenuButton asChild className="w-full">
                        <a
                          href={`/hipoteca/${encodeURIComponent(contrato)}`}
                          className="w-full min-w-0 text-[#52525B] text-sm dark:text-[#D4D4D8]"
                        >
                          <span className="max-w-[21ch] truncate text-ellipsis">
                            {contrato}
                          </span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </ScrollArea>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="!p-2">
          <SignedIn>
            <div className="flex items-center gap-2 rounded-lg border bg-card p-2">
              <div className="flex h-8 w-8 items-center">
                <UserButton />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-sm">
                  {user?.firstName || user?.username || "Usuario"}
                </p>
                <p className="truncate text-muted-foreground text-xs">
                  {user?.emailAddresses[0]?.emailAddress}
                </p>
              </div>
            </div>
          </SignedIn>

          <SignedOut>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="h-8 rounded-md px-3 text-sm"
              >
                <Link href="/sign-in">Iniciar Sesión</Link>
              </Button>
              <Button size="sm" asChild className="h-8 rounded-md px-3 text-sm">
                <Link href="/sign-up">Registrarse</Link>
              </Button>
            </div>
          </SignedOut>
        </SidebarFooter>
      </Sidebar>

      {/* Command Dialog for Search */}
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Buscar Análisis"
        description="Busca entre tus análisis de hipoteca"
      >
        <CommandInput placeholder="Escribe para buscar análisis..." />
        <CommandList>
          <CommandEmpty>No se encontraron contratos.</CommandEmpty>
          <CommandGroup heading="Contratos de Hipoteca">
            {contractosHipoteca.map((contrato) => (
              <CommandItem
                key={contrato}
                onSelect={() => {
                  setOpen(false);
                  // Navigate to the contract
                  window.location.href = `/hipoteca/${encodeURIComponent(contrato)}`;
                }}
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>{contrato}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
