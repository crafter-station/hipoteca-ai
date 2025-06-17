export interface ContractContextChunk {
  content: string;
  pageIndex: number;
}

export type ContractContext = Readonly<{
  content: string;
  documentId: string;
  pageIndex: number;
  chunkIndex: number;
}>;
