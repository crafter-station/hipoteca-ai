export const CONTRACT_CONTEXT_COLLECTION = "ContractContext";

export const MORTGAGE_KNOWLEDGE_COLLECTION = "MortgageKnowledge";

export const getContractKey = (id: string) => `contract:${id}`;

export const getUserContractsKey = (userId: string) =>
	`user:${userId}:contracts`;
