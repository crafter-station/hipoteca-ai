# LLMS.md - Tools Directory (AI Tools for Vector Search)

## File Structure

```
src/tools/
├── search-contract-context.ts     # Contract-specific search tool
└── search-mortgage-knowledge.ts   # General mortgage knowledge search tool
```

## Business Relevance

### Core AI Tools:

**Hipoteca Findr** uses sophisticated AI tools to provide dual-source search capabilities for the chat system. These tools enable the AI assistant to access both contract-specific information and general mortgage knowledge, providing comprehensive responses to Spanish mortgage consumers.

### Key Features:

1. **🔍 Dual Search Architecture**: Contract-specific + general knowledge
2. **📄 Source Citation**: Mandatory source attribution for all responses
3. **🤖 AI-Powered RAG**: Retrieval-Augmented Generation for accurate responses
4. **🇪🇸 Spanish Market Focus**: Tailored for Spanish mortgage regulations
5. **⚡ Efficient Vector Search**: Optimized Weaviate queries with adjacent chunk retrieval

## File Details

### `search-contract-context.ts` - Contract-Specific Search

**Purpose**: Search within a specific user's mortgage contract
**Key Features**:

#### Function: `createSearchContractContextTool(contractId: string)`

- **Input**: Contract ID for document-specific search
- **Output**: Vercel AI SDK tool for contract search
- **Search Scope**: User's specific mortgage contract chunks

#### Search Capabilities:

- **Semantic Search**: Natural language queries about contract terms
- **Page-Level Results**: Exact page numbers for source citation
- **Adjacent Chunk Retrieval**: Context-aware chunk collection
- **Risk-Aware Search**: Prioritizes highlighted risk areas

#### Example Queries:

- "¿Cuál es mi TAE?"
- "¿Qué comisiones tengo que pagar?"
- "¿Hay penalizaciones por reembolso anticipado?"
- "¿Cuándo puedo cancelar mi hipoteca?"

#### Tool Response Format:

```xml
<source>
  <name>Contract Context</name>
  <pages>
    <page>3</page>
    <page>7</page>
  </pages>
</source>
```

### `search-mortgage-knowledge.ts` - General Knowledge Search

**Purpose**: Search general mortgage knowledge base
**Key Features**:

#### Function: `createSearchMortgageKnowledgeTool(documentId: string)`

- **Input**: Knowledge base document ID
- **Output**: Vercel AI SDK tool for knowledge search
- **Search Scope**: Guía Hipotecaria del Banco de España + mortgage regulations

#### Search Capabilities:

- **Regulatory Information**: Spanish mortgage law and regulations
- **Market Standards**: Current market rates and benchmarks
- **Consumer Protection**: Rights and protections for mortgage consumers
- **Educational Content**: Mortgage terminology and concepts

#### Example Queries:

- "¿Qué es la TAE?"
- "¿Cuáles son mis derechos como hipotecado?"
- "¿Cómo funciona el tipo de interés variable?"
- "¿Qué es una cláusula suelo?"

#### Tool Response Format:

```xml
<source>
  <name>Mortgage Knowledge</name>
  <pages>
    <page>12</page>
    <page>14</page>
  </pages>
</source>
```

## Change-Log

### Recent Major Changes:

**PR #6 (June 2025)** - Tool Standardization

- Refactored both tools for consistent structure
- Improved adjacent chunk retrieval efficiency
- Enhanced XML output formatting
- Better error handling and validation

**PR #4 (June 2025)** - Dual Knowledge Integration

- Created `search-mortgage-knowledge.ts` for general knowledge
- Enhanced `search-contract-context.ts` with document-specific IDs
- Improved source citation system
- Better separation of contract vs. general knowledge

**PR #2 (June 2025)** - Foundation Tools

- Created initial `search-contract-context.ts` for contract search
- Basic Weaviate integration for vector search
- Initial RAG implementation for chat system

## Key Architecture Decisions

1. **Dual Search Strategy**: Contract-specific + general knowledge tools
2. **Mandatory Source Citation**: All responses must include source XML
3. **Spanish Market Focus**: Knowledge base tailored for Spanish consumers
4. **Efficient Vector Search**: Optimized Weaviate queries with similarity scoring
5. **Adjacent Chunk Retrieval**: Context-aware chunk collection for better answers
6. **Tool Modularity**: Separate tools for different search contexts
7. **Error Resilience**: Graceful handling of search failures
8. **Consumer Language**: Results optimized for B2C understanding

## Tool Integration

### Chat System Integration:

```typescript
const tools: Record<string, Tool> = {
  searchMortgageKnowledge: createSearchMortgageKnowledgeTool(
    MORTGAGE_KNOWLEDGE_DOCUMENT_ID
  ),
};

if (contractId) {
  tools.searchContractContext = createSearchContractContextTool(contractId);
}
```

### AI System Prompt Integration:

- Tools are dynamically available based on contract context
- AI must use at least one tool to back responses
- Mandatory source citation in XML format
- Spanish language responses with English source citations

## Search Performance

### Optimization Strategies:

- **Vector Similarity**: Cosine similarity with minimum threshold
- **Chunk Adjacency**: Retrieve surrounding chunks for context
- **Query Optimization**: Semantic search with keyword fallback
- **Result Ranking**: Relevance scoring with page-level aggregation

### Performance Metrics:

- **Search Latency**: Target <500ms per query
- **Relevance Score**: Minimum 0.7 similarity threshold
- **Context Quality**: Adjacent chunk retrieval for complete answers
- **Source Accuracy**: Exact page number citation

## Development Notes

- **Weaviate Integration**: Efficient vector database queries
- **Error Handling**: Graceful fallback for failed searches
- **Logging**: Comprehensive search analytics and debugging
- **Testing**: Unit tests for search accuracy and performance
- **Documentation**: Clear tool descriptions for AI system
- **Security**: User-specific contract access control
- **Scalability**: Optimized for concurrent search operations
- **Maintenance**: Easy tool updates and knowledge base refresh

## Integration Points

### External Dependencies:

- **Weaviate**: Vector database for semantic search
- **Vercel AI SDK**: Tool framework for AI integration
- **Contract Models**: Access to contract and knowledge data structures

### Internal Dependencies:

- **Chat API**: Primary consumer of search tools
- **AI System Prompts**: Tool usage instructions and formatting
- **Models**: Contract and MortgageKnowledge data structures
- **Constants**: Collection names and document IDs

## Future Enhancements

### Planned Features:

- **Multi-language Support**: English and other languages
- **Advanced Filtering**: Date ranges, contract types, risk levels
- **Search Analytics**: Query performance and user behavior tracking
- **Personalization**: User-specific search optimization
- **Hybrid Search**: Combine vector and keyword search
- **Real-time Updates**: Live knowledge base synchronization
