export interface ContractContextChunk {
	content: string;
	pageIndex: number;
}

export type ContractContext = Readonly<{
	content: string;
	mortgageId: string;
	pageIndex: number;
	chunkIndex: number;
}>;
