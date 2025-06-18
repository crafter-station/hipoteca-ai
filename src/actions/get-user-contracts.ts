"use server";

import { getUserContracts as getUserContractsFromModel } from "@/models/contract";
import type { Contract } from "@/models/contract";

export async function getUserContracts(userId: string): Promise<Contract[]> {
  try {
    const contracts = await getUserContractsFromModel(userId);
    return contracts;
  } catch (error) {
    console.error("Error in getUserContracts action:", error);
    return [];
  }
}
