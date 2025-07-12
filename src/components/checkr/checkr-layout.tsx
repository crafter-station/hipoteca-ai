import { AppSidebarClient } from "@/components/app-sidebar-client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import type { Contract } from "@/models/contract";

interface CheckrLayoutProps {
  contracts: Contract[];
  children: React.ReactNode;
}

export function CheckrLayout({ contracts, children }: CheckrLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebarClient contracts={contracts} />
        <div className="flex min-w-0 flex-1 flex-col bg-ui-base p-2">
          <SidebarTrigger variant="outline" />
          <main className="flex flex-1 items-center justify-center p-4">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
