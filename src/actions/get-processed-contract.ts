"use server";

import { getContractById } from "@/models/contract";

export async function getProcessedContract(id: string) {
  return getContractById(id);
}
