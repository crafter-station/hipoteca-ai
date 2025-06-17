import { redis } from "@/clients/redis";
import { getContractKey, getUserContractsKey } from "./constants";
import type { ContractContextChunk } from "./contract-context";

export interface Contract {
  id: string;
  userId: string;
  pdfUrl: string;
  pdfName: string;
  htmlContent: string;
  markdownContent: string;
  chunks: ContractContextChunk[];
  highlights: ContractHighlight[];
  createdAt: Date;
}

// ContractHighlight should only live inside a Contract
export interface ContractHighlight {
  sentence: string;
  type: ContractHighlightType;
  description: string;
}

export enum ContractHighlightType {
  // Red
  ABUSIVE_CLAUSE = "abusive clause",
  FINANCIAL_RISK = "financial risk",
  PENALTIES = "penalties",

  // Green
  LOAN = "loan",
  INTEREST_RATE = "interest rate",
  INSURANCE_COVERAGE = "insurance coverage",
  MORTGAGE_TERM = "mortgage term",
  MONTHLY_PAYMENT = "monthly payment",
  INITIAL_EXPENSES = "initial expenses",
  COSTS = "costs",
  FEES = "fees",

  // Yellow
  CONSULT_THE_BANK = "consult the bank",
  NEGOTIABLE_CLAUSE = "negotiable clause",
  UNDISCLOSED_CHARGE_IN_PDF = "undisclosed charge in PDF",
  POSSIBLE_FUTURE_CHANGES = "possible future changes",
}

export async function saveContract(contract: Contract) {
  try {
    const contractKey = getContractKey(contract.id);
    const userSetKey = getUserContractsKey(contract.userId);

    const pipeline = redis.pipeline();

    pipeline.hset(contractKey, {
      id: contract.id,
      userId: contract.userId,
      pdfUrl: contract.pdfUrl,
      pdfName: contract.pdfName,
      htmlContent: contract.htmlContent,
      markdownContent: contract.markdownContent,
      highlights: contract.highlights,
      chunks: contract.chunks,
      createdAt: contract.createdAt.toISOString(),
    });

    pipeline.sadd(userSetKey, contract.id);

    // Ejecutar pipeline
    await pipeline.exec();
  } catch (error) {
    console.error("Error saving mortgage to Redis:", error);
    throw error;
  }
}

export async function getContractById(id: string): Promise<Contract | null> {
  try {
    const contractKey = getContractKey(id);
    const data = await redis.hgetall(contractKey);

    if (!data || Object.keys(data).length === 0) {
      return null;
    }

    return {
      id: data.id as string,
      userId: data.userId as string,
      pdfUrl: data.pdfUrl as string,
      pdfName: data.pdfName as string,
      htmlContent: data.htmlContent as string,
      markdownContent: data.markdownContent as string,
      chunks: data.chunks as [],
      highlights: data.highlights as [],
      createdAt: new Date(data.createdAt as string),
    };
  } catch (error) {
    console.error("Error fetching mortgage from Redis:", error);
    throw error;
  }
}

export function allContractHighlightTypes(): string[] {
  return Object.values(ContractHighlightType);
}

// Key-to-Contract mapping functions
export async function saveKeyToContractMapping(
  key: string,
  contractId: string,
) {
  try {
    const mappingKey = `key_to_contract:${key}`;
    await redis.set(mappingKey, contractId);
  } catch (error) {
    console.error("Error saving key-to-contract mapping:", error);
    throw error;
  }
}

export async function getContractIdByKey(key: string): Promise<string | null> {
  try {
    const mappingKey = `key_to_contract:${key}`;
    return await redis.get(mappingKey);
  } catch (error) {
    console.error("Error getting contract ID by key:", error);
    throw error;
  }
}

export async function getContractByKey(key: string): Promise<Contract | null> {
  try {
    const contractId = await getContractIdByKey(key);
    if (!contractId) {
      return null;
    }
    return await getContractById(contractId);
  } catch (error) {
    console.error("Error getting contract by key:", error);
    throw error;
  }
}
