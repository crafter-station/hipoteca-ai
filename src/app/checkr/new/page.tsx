import { AppSidebarClient } from "@/components/app-sidebar-client";
import { ContractAnalysisFeatures } from "@/components/contract-upload/features";
import { ContractUploadFooter } from "@/components/contract-upload/footer";
import { ContractUploadHero } from "@/components/contract-upload/hero";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getUserId } from "@/lib/auth/server";
import { getUserContracts } from "@/models/contract";

export default async function CheckrPage() {
  const userId = await getUserId();
  const contracts = await getUserContracts(userId);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebarClient contracts={contracts} />
        <div className="flex min-w-0 flex-1 flex-col bg-background p-2">
          <SidebarTrigger variant="outline" />
          <main className="flex min-h-screen flex-1 flex-col">
            <ContractUploadHero />
            <ContractAnalysisFeatures />
            <ContractUploadFooter />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
