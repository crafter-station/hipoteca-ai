# LLMS.md - Triggers Directory (Background Processing)

## File Structure

```
src/triggers/
└── process-pdf/                   # PDF Processing Pipeline
    ├── extract-content.ts         # PDF text extraction and chunking
    ├── extract-highlights.ts      # Risk analysis and highlight extraction
    ├── extract-summary.ts         # Contract summary generation
    ├── index.ts                   # Main processing task orchestrator
    └── store-contract-context.ts  # Vector database storage
```

## Business Relevance

### Core Processing Pipeline:

**Hipoteca Findr** uses Trigger.dev for asynchronous PDF processing to deliver comprehensive mortgage contract analysis. The pipeline transforms raw PDF contracts into structured, analyzable data for Spanish mortgage consumers.

### Processing Flow:

1. **PDF Upload Trigger** → User uploads mortgage contract PDF
2. **Content Extraction** → OCR and text extraction using Mistral AI
3. **Highlight Analysis** → Risk assessment and clause classification
4. **Summary Generation** → Consumer-friendly contract summary
5. **Vector Storage** → Searchable contract context in Weaviate

### Key Features:

- **🔍 Comprehensive Analysis**: Extract TAE, cuotas, comisiones, and risk factors
- **⚠️ Risk Classification**: Identify up to 4 red flags with 0-100 scoring
- **📊 Spanish Market Context**: Benchmarking against Spanish mortgage standards
- **🤖 AI-Powered Insights**: Generate consumer-friendly explanations
- **⚡ Parallel Processing**: Optimized for performance with concurrent operations

## File Details

### `index.ts` - Main Processing Task

**Purpose**: Orchestrates the entire PDF processing pipeline
**Key Functions**:

- File URL validation and key extraction
- Progress tracking with metadata updates
- Error handling and retry logic
- Contract object creation and storage
- Key-to-contract mapping for quick access

**Processing Stages**:

1. `extract_content` - PDF text extraction
2. `extract_highlights` - Risk analysis
3. `extract_summary` - Summary generation
4. `store_contract_context` - Vector database storage
5. `completed` - Final status update

### `extract-content.ts` - Content Extraction

**Purpose**: Extract text content from PDF using AI OCR
**Key Functions**:

- `getTextFromPdf()` - Mistral AI OCR processing
- `splitTextIntoSemanticChunks()` - Text chunking for analysis
- `generateHtmlFromText()` - OpenAI HTML conversion

**Output**:

- Markdown content for processing
- Structured chunks for vector storage
- HTML content for PDF viewer

### `extract-highlights.ts` - Risk Analysis

**Purpose**: Identify and classify contract risks and important clauses
**Key Functions**:

- `extractHighlightsFromContent()` - Main extraction logic
- `processInParallel()` - Concurrent chunk processing
- Risk categorization with `ContractHighlightType` enum

**Risk Categories**:

- **Red (High Risk)**: Abusive clauses, financial risks, penalties
- **Green (Information)**: Loan details, interest rates, insurance
- **Yellow (Attention)**: Consult bank, negotiable clauses, future changes

### `extract-summary.ts` - Summary Generation

**Purpose**: Generate consumer-friendly contract summaries
**Key Functions**:

- Extract key financial metrics (TAE, cuota mensual, plazo)
- Identify main risks and benefits
- Generate actionable recommendations
- Spanish market context and comparisons

### `store-contract-context.ts` - Vector Storage

**Purpose**: Store contract chunks in Weaviate for RAG search
**Key Functions**:

- `storeContractContext()` - Batch vector insertion
- Contract-specific document ID mapping
- Chunk indexing for efficient retrieval

## Change-Log

### Recent Major Changes:

**PR #5 (June 2025)** - Contract Highlights System

- Added `extract-highlights.ts` for risk analysis
- Implemented parallel processing utilities
- Enhanced contract model with highlights and chunks
- Added AI-powered highlight explanations

**PR #4 (June 2025)** - Summary and Context Integration

- Added `extract-summary.ts` for contract summaries
- Enhanced vector storage with document-specific context
- Improved contract-specific search capabilities
- Better integration with chat system

**PR #2 (June 2025)** - Foundation Pipeline

- Created core `processPDFTask` with Trigger.dev
- Implemented `extract-content.ts` with Mistral OCR
- Added `store-contract-context.ts` for Weaviate storage
- Basic contract processing workflow

## Key Architecture Decisions

1. **Asynchronous Processing**: Heavy AI operations run in background
2. **Parallel Processing**: Concurrent operations for better performance
3. **Progress Tracking**: Real-time progress updates via metadata
4. **Error Resilience**: Comprehensive error handling and retry logic
5. **Modular Design**: Separate concerns for each processing step
6. **Spanish Market Focus**: Analysis tailored for Spanish mortgage regulations
7. **Consumer-Friendly Output**: B2C language in all generated content
8. **Vector Search Ready**: Optimized for RAG-based chat system

## Processing Metrics

### Performance Targets:

- **Content Extraction**: ~30-60 seconds per PDF
- **Highlight Analysis**: ~60-120 seconds per contract
- **Summary Generation**: ~30-45 seconds per contract
- **Vector Storage**: ~10-20 seconds per contract

### Quality Metrics:

- **Highlight Accuracy**: Target 85%+ relevant risk identification
- **Summary Completeness**: All key financial metrics extracted
- **Search Relevance**: Vector chunks optimized for consumer queries
- **Spanish Context**: Market-appropriate benchmarking

## Development Notes

- **AI Models**: Mistral for OCR, OpenAI for analysis and summaries
- **Error Handling**: Comprehensive logging and error recovery
- **Monitoring**: Trigger.dev dashboard for job tracking
- **Scalability**: Designed for concurrent processing of multiple PDFs
- **Data Flow**: Redis for contract storage, Weaviate for vector search
- **Security**: No sensitive data in logs, secure PDF URL handling
- **Testing**: CLI utilities for testing individual processing steps

## Integration Points

### Input Sources:

- UploadThing PDF URLs from user uploads
- User ID from authentication system
- File metadata (name, size, type)

### Output Destinations:

- Redis: Contract metadata and processed content
- Weaviate: Vector embeddings for search
- Client: Real-time progress updates

### Dependencies:

- Mistral AI: OCR and text extraction
- OpenAI: Content analysis and HTML generation
- Weaviate: Vector database for semantic search
- Redis: Contract and user data storage
