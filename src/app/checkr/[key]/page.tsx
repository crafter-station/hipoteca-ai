import { getUserContracts } from "@/actions/get-user-contracts";
import { getUserId } from "@/lib/auth/server";
import type { Contract } from "@/models/contract";
import { Suspense } from "react";
import { CheckrAnalysisClient } from "./checkr-analysis-client";

interface CheckrAnalysisPageProps {
  params: Promise<{ key: string }>;
  searchParams: Promise<{ runId?: string; token?: string }>;
}

export default async function CheckrAnalysisPage({
  params,
  searchParams,
}: CheckrAnalysisPageProps) {
  const { key } = await params;
  const { runId, token } = await searchParams;
  const userId = await getUserId();

  // Fetch user contracts on the server
  let contracts: Contract[] = [];
  try {
    contracts = await getUserContracts(userId);
  } catch (error) {
    console.error("Error fetching user contracts:", error);
    contracts = [];
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckrAnalysisClient
        keyParam={key}
        runId={runId || null}
        token={token || null}
        contracts={contracts}
      />
    </Suspense>
  );
}
