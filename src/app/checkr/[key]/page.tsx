import { getUserContracts } from "@/actions/get-user-contracts";
import type { Contract } from "@/models/contract";
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { CheckrAnalysisClient } from "./checkr-analysis-client";

interface CheckrAnalysisPageProps {
  params: { key: string };
  searchParams: Promise<{ runId?: string; token?: string }>;
}

export default async function CheckrAnalysisPage({
  params,
  searchParams,
}: CheckrAnalysisPageProps) {
  const { runId, token } = await searchParams;
  const session = await auth();

  // Fetch user contracts on the server
  let contracts: Contract[] = [];
  if (session.userId) {
    try {
      contracts = await getUserContracts(session.userId);
    } catch (error) {
      console.error("Error fetching user contracts:", error);
      contracts = [];
    }
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckrAnalysisClient
        keyParam={params.key}
        runId={runId || null}
        token={token || null}
        contracts={contracts}
      />
    </Suspense>
  );
}
