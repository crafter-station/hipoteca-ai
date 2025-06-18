import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UploadEmptyState } from "@/components/upload-empty-state";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";

export default function CheckrPage() {
  return (
    <>
      <SignedIn>
        <SidebarProvider>
          <div className="flex h-screen w-full">
            {/* Application Sidebar */}
            <AppSidebar />

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
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
