import { AppSidebarClient } from "@/components/app-sidebar-client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UploadEmptyState } from "@/components/upload-empty-state";
import { getUserId } from "@/lib/auth/server";
import { getUserContracts } from "@/models/contract";
import type { Contract } from "@/models/contract";

export default async function CheckrPage() {
  const userId = await getUserId();

  // Fetch user contracts on the server
  let contracts: Contract[] = [];
  try {
    contracts = await getUserContracts(userId);
    console.log(
      "Server: Fetched contracts for user:",
      userId,
      "count:",
      contracts.length,
    );
  } catch (error) {
    console.error("Server: Error fetching user contracts:", error);
    contracts = [];
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* Application Sidebar */}
        <AppSidebarClient contracts={contracts} />

        {/* Main Content Area */}
        <div className="flex min-w-0 flex-1 flex-col bg-background p-2">
          {/* Toggle sidebar button (visible on mobile) */}
          <SidebarTrigger variant="outline" />

          {/* Central content for mortgage PDF sessions */}
          <main className="flex-1">
            <UploadEmptyState />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
