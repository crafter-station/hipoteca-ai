# LLMS.md - Models Directory (Data Models & Schemas)

## File Structure

```
src/models/
├── constants.ts              # Model constants and collection names
├── contract-context.ts       # Contract context chunks for vector search
├── contract.ts               # Main contract model with highlights
├── mortgage-knowledge.ts     # General mortgage knowledge base
└── user.ts                   # User model and contract associations
```

## Business Relevance

### Core Data Models:

**Hipoteca Findr** uses a sophisticated data model architecture to support comprehensive mortgage contract analysis for Spanish consumers. The models are designed to support both real-time analysis and historical contract management.

### Key Business Entities:

1. **Contract**: Complete mortgage contract with AI-extracted insights
2. **ContractContext**: Searchable text chunks for RAG-based chat
3. **MortgageKnowledge**: General mortgage knowledge base
4. **User**: Consumer accounts with contract history
5. **ContractHighlight**: Risk classifications and important clauses

## File Details

### `constants.ts` - Model Constants

**Purpose**: Central configuration for data collections and keys
**Key Constants**:

- `CONTRACT_CONTEXT_COLLECTION`: Weaviate collection for contract-specific search
- `MORTGAGE_KNOWLEDGE_COLLECTION`: Weaviate collection for general mortgage knowledge
- `MORTGAGE_KNOWLEDGE_DOCUMENT_ID`: Reference ID for knowledge base
- Redis key generators for consistent data access

### `contract.ts` - Main Contract Model

**Purpose**: Complete mortgage contract representation with AI analysis
**Key Interfaces**:

#### `Contract` Interface:

```typescript
{
  id: string;                    // Unique contract identifier
  userId: string;                // Owner identification
  pdfUrl: string;                // Original PDF location
  pdfName: string;               // User-friendly filename
  htmlContent: string;           // AI-generated HTML for viewer
  markdownContent: string;       // Structured markdown content
  chunks: ContractContextChunk[]; // Text chunks for analysis
  highlights: ContractHighlight[]; // Risk classifications
  summary?: ContractSummary;     // AI-generated summary
  createdAt: Date;               // Processing timestamp
}
```

#### `ContractHighlight` Interface:

```typescript
{
  id: string; // Highlight identifier
  type: ContractHighlightType; // Risk category
  content: string; // Highlighted text
  explanation: string; // AI-generated explanation
  pageIndex: number; // PDF page location
  position: number; // Position within page
}
```

#### `ContractHighlightType` Enum:

**Red (High Risk)**:

- `ABUSIVE_CLAUSE`: Potentially harmful contract terms
- `FINANCIAL_RISK`: High-cost or risky financial conditions
- `PENALTIES`: Excessive penalty clauses

**Green (Information)**:

- `LOAN`: Basic loan information
- `INTEREST_RATE`: Interest rate details
- `INSURANCE_COVERAGE`: Insurance requirements
- `MORTGAGE_TERM`: Loan duration
- `MONTHLY_PAYMENT`: Payment information
- `INITIAL_EXPENSES`: Upfront costs
- `COSTS`: Additional costs
- `FEES`: Service fees

**Yellow (Attention)**:

- `CONSULT_THE_BANK`: Requires bank consultation
- `NEGOTIABLE_CLAUSE`: Potentially negotiable terms
- `UNDISCLOSED_CHARGE_IN_PDF`: Hidden charges
- `POSSIBLE_FUTURE_CHANGES`: Variable terms

### `contract-context.ts` - Vector Search Model

**Purpose**: Searchable text chunks for RAG-based contract queries
**Key Interface**:

#### `ContractContext` Interface:

```typescript
{
  content: string; // Text chunk content
  pageIndex: number; // Source PDF page
  chunkIndex: number; // Position within document
  documentId: string; // Contract reference
}
```

#### `ContractContextChunk` Interface:

```typescript
{
  content: string; // Chunk text
  pageIndex: number; // Source page
}
```

### `mortgage-knowledge.ts` - Knowledge Base Model

**Purpose**: General mortgage knowledge for consumer education
**Key Interface**:

#### `MortgageKnowledge` Interface:

```typescript
{
  content: string; // Knowledge content
  pageIndex: number; // Source document page
  chunkIndex: number; // Position within knowledge base
  documentId: string; // Knowledge base reference
}
```

**Knowledge Sources**:

- Guía Hipotecaria del Banco de España
- Spanish mortgage regulations
- Market standards and benchmarks
- Consumer protection guidelines

### `user.ts` - User Model

**Purpose**: Consumer account management and contract associations
**Key Functions**:

- `saveUserContractUrl()`: Associate contract with user
- `getUserContractsUrls()`: Retrieve user's contract history
- User-contract relationship management

## Change-Log

### Recent Major Changes:

**PR #5 (June 2025)** - Contract Highlights System

- Added `ContractHighlight` interface with risk categorization
- Implemented `ContractHighlightType` enum with 14 categories
- Enhanced `Contract` model with `chunks` and `highlights`
- Added `allContractHighlightTypes()` utility function

**PR #4 (June 2025)** - Mortgage Knowledge Integration

- Added `MortgageKnowledge` model for general knowledge base
- Enhanced `ContractContext` with document-specific IDs
- Improved contract-knowledge separation for dual search
- Added constants for collection management

**PR #2 (June 2025)** - Foundation Models

- Created core `Contract` model structure
- Implemented `ContractContext` for vector search
- Added `User` model with contract associations
- Established Redis-based data persistence

## Key Architecture Decisions

1. **Spanish Market Focus**: Models tailored for Spanish mortgage regulations
2. **Consumer-Centric Design**: Data structures optimized for B2C interactions
3. **Risk Classification**: Comprehensive highlight system with color coding
4. **Dual Search Support**: Separate models for contract-specific vs. general knowledge
5. **Vector Search Ready**: Optimized chunk sizes for semantic search
6. **Redis Persistence**: Fast access to contract data and user associations
7. **AI-Friendly Structure**: Models designed for AI processing and analysis
8. **Scalable Design**: Efficient data structures for multiple contracts per user

## Data Flow Architecture

### Contract Processing Flow:

1. **Upload**: User uploads PDF → generates contract ID
2. **Processing**: Trigger.dev extracts content → populates Contract model
3. **Analysis**: AI generates highlights → adds to Contract.highlights
4. **Storage**: Redis stores Contract → Weaviate stores ContractContext
5. **Access**: User queries → search both contract-specific and general knowledge

### User Data Management:

- **Authentication**: Clerk user ID → internal user mapping
- **Contract Association**: User ID → list of contract IDs
- **Privacy**: User data isolated per account
- **History**: Chronological contract processing history

## Development Notes

- **Data Validation**: Zod schemas for type safety
- **Error Handling**: Graceful handling of incomplete data
- **Performance**: Optimized for Redis and Weaviate operations
- **Security**: No sensitive data in models, secure user association
- **Testing**: Comprehensive model validation tests
- **Documentation**: Clear interfaces for AI integration
- **Scalability**: Designed for thousands of contracts per user
- **Maintenance**: Easy model evolution with versioning support

## Integration Points

### External Services:

- **Redis**: Primary data store for contracts and user data
- **Weaviate**: Vector storage for ContractContext and MortgageKnowledge
- **Trigger.dev**: Background processing of contract models
- **Clerk**: User authentication and identification

### Internal Dependencies:

- **AI Tools**: Models consumed by search-contract-context and search-mortgage-knowledge
- **Chat System**: Contract and knowledge models power chat responses
- **PDF Viewer**: Contract highlights displayed in PDF interface
- **Analytics**: Contract processing metrics and user behavior
