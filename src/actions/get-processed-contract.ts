"use server";

import { getContractById, getContractByKey } from "@/models/contract";

export async function getProcessedContract(id: string) {
  return getContractById(id);
}

export async function getProcessedContractByKey(key: string) {
  return getContractByKey(key);
}
