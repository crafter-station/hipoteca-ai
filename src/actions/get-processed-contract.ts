"use server";

import { getContractById } from "@/models/contract";

export function getProcessedContract(id: string) {
	return getContractById(id);
}
