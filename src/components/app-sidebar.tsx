import { getUserContracts } from "@/models/contract";
import type { Contract } from "@/models/contract";
import { auth } from "@clerk/nextjs/server";
import { AppSidebarClient } from "./app-sidebar-client";

export async function AppSidebar() {
  const session = await auth();

  // Fetch user contracts on the server
  let contracts: Contract[] = [];
  if (session.userId) {
    try {
      contracts = await getUserContracts(session.userId);
      console.log(
        "Server: Fetched contracts for user:",
        session.userId,
        "count:",
        contracts.length,
      );
    } catch (error) {
      console.error("Server: Error fetching user contracts:", error);
      contracts = [];
    }
  }

  return <AppSidebarClient contracts={contracts} />;
}
