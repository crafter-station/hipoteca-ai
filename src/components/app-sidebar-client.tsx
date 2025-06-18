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
import type { Contract } from "@/models/contract";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import Link from "next/link";

interface ContractItem {
  id: string;
  pdfName: string;
  createdAt: Date;
  key: string; // For navigation to /checkr/[key]
}

interface AppSidebarClientProps {
  contracts: Contract[];
}

export function AppSidebarClient({
  contracts: initialContracts,
}: AppSidebarClientProps) {
  const [open, setOpen] = useState(false);
  const [contractsLoaded] = useState(true);
  const { user, isLoaded } = useUser();

  // Transform contracts directly - no state, no effects, no loops
  const contracts: ContractItem[] = initialContracts
    .map((contract: Contract) => {
      // Extract key from pdfUrl (assuming format: https://o6dbw19iyd.ufs.sh/f/{key})
      const urlParts = contract.pdfUrl.split("/");
      const key = urlParts[urlParts.length - 1];

      return {
        id: contract.id,
        pdfName: contract.pdfName,
        createdAt: contract.createdAt,
        key: key,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

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

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  // Truncate contract name for display
  const truncateContractName = (name: string, maxLength = 25) => {
    if (name.length <= maxLength) return name;
    return `${name.substring(0, maxLength)}...`;
  };

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
            disabled={
              !isLoaded || !user || !contractsLoaded || contracts.length === 0
            }
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
          {/* User Contracts - Scrolleable */}
          <SidebarGroup className="min-h-0 flex-1">
            <SidebarGroupLabel>
              Historial de Análisis
              {isLoaded && user && contractsLoaded && (
                <span className="ml-2 text-muted-foreground text-xs">
                  ({contracts.length})
                </span>
              )}
              {(!isLoaded || (user && !contractsLoaded)) && (
                <span className="ml-2 animate-pulse text-muted-foreground text-xs">
                  (...)
                </span>
              )}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <ScrollArea className="h-full w-full">
                <SidebarMenu className="gap-1">
                  {!isLoaded || (user && !contractsLoaded) ? (
                    // Show skeletons while loading user data OR while loading contracts for authenticated user
                    <>
                      <SidebarMenuItem className="w-full">
                        <SidebarMenuButton className="w-full cursor-default">
                          <div className="flex w-full items-center gap-2">
                            <div className="h-4 w-4 animate-pulse rounded bg-muted" />
                            <div className="flex-1 space-y-1">
                              <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
                              <div className="h-2 w-1/2 animate-pulse rounded bg-muted" />
                            </div>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem className="w-full">
                        <SidebarMenuButton className="w-full cursor-default">
                          <div className="flex w-full items-center gap-2">
                            <div className="h-4 w-4 animate-pulse rounded bg-muted" />
                            <div className="flex-1 space-y-1">
                              <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
                              <div className="h-2 w-1/2 animate-pulse rounded bg-muted" />
                            </div>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem className="w-full">
                        <SidebarMenuButton className="w-full cursor-default">
                          <div className="flex w-full items-center gap-2">
                            <div className="h-4 w-4 animate-pulse rounded bg-muted" />
                            <div className="flex-1 space-y-1">
                              <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
                              <div className="h-2 w-1/2 animate-pulse rounded bg-muted" />
                            </div>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </>
                  ) : !user ? (
                    // Show not logged in only after we're sure user is not authenticated
                    <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
                      Inicia sesión para ver tu historial
                    </div>
                  ) : contracts.length === 0 ? (
                    // Show empty state ONLY when user is loaded AND contracts are loaded AND array is empty
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <FileText className="mb-2 h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground text-sm">
                        No tienes análisis aún
                      </p>
                      <p className="mt-1 text-muted-foreground text-xs">
                        Sube tu primer contrato para comenzar
                      </p>
                    </div>
                  ) : (
                    // Show actual contracts
                    contracts.map((contract) => (
                      <SidebarMenuItem key={contract.id} className="w-full">
                        <SidebarMenuButton asChild className="w-full">
                          <Link
                            href={`/checkr/${contract.key}`}
                            className="flex flex-col items-start text-[#0f0f10] text-sm dark:text-[#D4D4D8]"
                          >
                            <span className="max-w-full truncate text-ellipsis font-medium">
                              {truncateContractName(contract.pdfName)}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))
                  )}
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
          {contracts.length > 0 && (
            <CommandGroup heading="Tus Análisis de Hipoteca">
              {contracts
                .filter((contract) =>
                  contract.pdfName.toLowerCase().includes(open ? "" : ""),
                )
                .map((contract) => (
                  <CommandItem
                    key={contract.id}
                    onSelect={() => {
                      setOpen(false);
                      // Navigate to the contract using the key
                      window.location.href = `/checkr/${contract.key}`;
                    }}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    <div className="flex flex-col">
                      <span>{contract.pdfName}</span>
                      <span className="text-muted-foreground text-xs">
                        {formatDate(contract.createdAt)}
                      </span>
                    </div>
                  </CommandItem>
                ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
