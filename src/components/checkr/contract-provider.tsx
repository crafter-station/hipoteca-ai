"use client";

import {
  getProcessedContract,
  getProcessedContractByKey,
} from "@/actions/get-processed-contract";
import type { Contract } from "@/models/contract";
import { contractAnalysisStore } from "@/stores/contract-analysis-store";
import { useRealtimeRun } from "@trigger.dev/react-hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ContractProviderProps {
  keyParam: string;
  runId: string | null;
  token: string | null;
  contracts: Contract[];
  children: React.ReactNode;
}

export function ContractProvider({
  keyParam,
  runId,
  token,
  contracts,
  children,
}: ContractProviderProps) {
  const router = useRouter();

  // Real-time run hook (only if we have runId)
  const { run, error } = useRealtimeRun(runId || "", {
    enabled: !!runId,
  });

  // Initialize store on mount (only once)
  useEffect(() => {
    contractAnalysisStore.getState().initializeForKey(keyParam, runId, token);
  }, [keyParam, runId, token]);

  // Set contracts only when they change
  useEffect(() => {
    contractAnalysisStore.getState().setContracts(contracts);
  }, [contracts]);

  // Update store with run and error data
  useEffect(() => {
    contractAnalysisStore.getState().setRun(run ?? null);
    contractAnalysisStore.getState().setError(error ?? null);

    if (run) {
      contractAnalysisStore.getState().handleRunUpdate(run);
    }
  }, [run, error]);

  // Handle contract loading when no runId (simplified to avoid infinite loops)
  useEffect(() => {
    if (!runId && keyParam) {
      const state = contractAnalysisStore.getState();

      if (
        !state.contract &&
        !state.hasAttemptedLoad &&
        !state.isLoadingContract
      ) {
        const {
          setContract,
          setIsLoadingContract,
          setHasAttemptedLoad,
          setPDFData,
        } = state;

        setIsLoadingContract(true);
        setHasAttemptedLoad(true);

        getProcessedContractByKey(keyParam)
          .then((contractData) => {
            if (contractData) {
              setContract(contractData);
              const currentPDFData = contractAnalysisStore.getState().pdfData;
              if (currentPDFData) {
                setPDFData({
                  ...currentPDFData,
                  name: contractData.pdfName,
                });
              }
            }
          })
          .catch((error) => {
            console.error("Error fetching contract by key:", error);
          })
          .finally(() => {
            setIsLoadingContract(false);
          });
      }
    }
  }, [keyParam, runId]);

  // Handle completed run with contract data
  useEffect(() => {
    if (run?.status === "COMPLETED" && run.output?.contractId) {
      getProcessedContract(run.output.contractId as string)
        .then((contractData) => {
          if (contractData) {
            const { setContract, setPDFData } =
              contractAnalysisStore.getState();
            setContract(contractData);
            const currentPDFData = contractAnalysisStore.getState().pdfData;
            if (currentPDFData) {
              setPDFData({
                ...currentPDFData,
                name: contractData.pdfName,
              });
            }
            router.replace(`/checkr/${keyParam}`, { scroll: false });
          }
        })
        .catch((error) => {
          console.error("Error fetching contract:", error);
        });
    }
  }, [run, keyParam, router]);

  return <>{children}</>;
}
