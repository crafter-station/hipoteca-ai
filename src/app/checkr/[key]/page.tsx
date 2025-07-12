import { getUserContracts } from "@/actions/get-user-contracts";
import { getUserId } from "@/lib/auth/server";
import { Suspense } from "react";
import { CheckrAnalysisClientRefactored } from "./checkr-analysis-client-refactored";

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
  const contracts = await getUserContracts(userId);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckrAnalysisClientRefactored
        keyParam={key}
        runId={runId || null}
        token={token || null}
        contracts={contracts}
      />
    </Suspense>
  );
}
