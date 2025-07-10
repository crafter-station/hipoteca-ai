# LLMS.md - Actions Directory (Next.js Server Actions)

## File Structure

```
src/actions/
├── extract-content-from-pdf.ts    # PDF text extraction action
├── generate-object-from-pdf.ts    # PDF object generation action
├── get-processed-contract.ts      # Contract retrieval action
├── get-user-contracts.ts          # User contract listing action
└── process-pdf.ts                 # PDF processing trigger action
```

## Business Relevance

### Core Server Actions:

**Hipoteca Findr** uses Next.js server actions to provide secure, server-side operations for mortgage contract processing. These actions handle file processing, data retrieval, and trigger background jobs for comprehensive contract analysis tailored to Spanish mortgage consumers.

### Key Action Categories:

1. **📄 PDF Processing**: Content extraction and object generation
2. **🔍 Data Retrieval**: Contract and user data access
3. **⚡ Background Jobs**: Trigger.dev job initiation
4. **🔐 Secure Operations**: Authentication-protected data access

## File Details

### `extract-content-from-pdf.ts` - PDF Text Extraction

**Purpose**: Extract text content from PDF files using AI OCR
**Key Functions**:

- `extractContentFromPdf()`: Main extraction function
- Mistral AI OCR integration for text recognition
- Text chunking for semantic analysis
- HTML generation for PDF viewer

**Process Flow**:

1. PDF URL validation and access
2. Mistral AI OCR processing
3. Text chunking with semantic boundaries
4. HTML generation for viewer display
5. Structured data return

**Output Format**:

- Markdown content for processing
- HTML content for PDF viewer
- Text chunks for vector search
- Page-level content mapping

### `generate-object-from-pdf.ts` - PDF Object Generation

**Purpose**: Generate structured objects from PDF content
**Key Functions**:

- `generateObjectFromPdf()`: Main object generation
- AI-powered content structuring
- Mortgage-specific data extraction
- Spanish market context integration

**Generated Objects**:

- Financial metrics (TAE, cuotas, comisiones)
- Contract terms and conditions
- Risk classifications
- Regulatory compliance data

### `get-processed-contract.ts` - Contract Retrieval

**Purpose**: Retrieve processed contract data by ID
**Key Functions**:

- `getProcessedContract()`: Contract data retrieval
- User authorization validation
- Contract data access control
- Structured data formatting

**Access Control**:

- User authentication required
- Contract ownership validation
- Secure data access patterns
- Error handling for unauthorized access

### `get-user-contracts.ts` - User Contract Listing

**Purpose**: List all contracts for authenticated user
**Key Functions**:

- `getUserContracts()`: User contract enumeration
- Contract metadata retrieval
- Processing status information
- Chronological ordering

**Returned Data**:

- Contract IDs and names
- Processing status and timestamps
- Basic contract metadata
- User-specific contract history

### `process-pdf.ts` - PDF Processing Trigger

**Purpose**: Initiate background PDF processing via Trigger.dev
**Key Functions**:

- `processPdf()`: Trigger background processing
- User authentication validation
- Processing job initiation
- Progress tracking setup

**Processing Pipeline**:

1. User authentication check
2. PDF URL validation
3. Trigger.dev job creation
4. Processing status initialization
5. Real-time progress tracking

## Change-Log

### Recent Major Changes:

**PR #8 (June 2025)** - Enhanced Data Retrieval

- Added `get-user-contracts.ts` for comprehensive user contract listing
- Improved `get-processed-contract.ts` with better error handling
- Enhanced authentication and authorization checks
- Better data formatting for client consumption

**PR #6 (June 2025)** - Action Standardization

- Improved error handling across all actions
- Better TypeScript typing and validation
- Enhanced user authentication patterns
- Standardized response formats

**PR #5 (June 2025)** - Contract Processing Enhancement

- Enhanced `get-processed-contract.ts` with highlight data
- Improved contract data structure handling
- Better integration with parallel processing
- Enhanced error recovery mechanisms

**PR #4 (June 2025)** - Dual Knowledge Integration

- Enhanced actions to support contract-specific and general knowledge
- Better integration with vector search capabilities
- Improved data access patterns
- Enhanced Spanish market context

**PR #2 (June 2025)** - Foundation Actions

- Created core `process-pdf.ts` for background processing
- Basic PDF extraction actions
- User authentication integration
- Initial Trigger.dev integration

## Key Architecture Decisions

1. **Authentication First**: All actions require user authentication
2. **Error Resilience**: Comprehensive error handling and recovery
3. **Type Safety**: Full TypeScript integration with validation
4. **Performance Optimized**: Efficient data retrieval and processing
5. **Spanish Market Focus**: Actions tailored for Spanish mortgage analysis
6. **Secure Data Access**: User-based authorization for all operations
7. **Background Processing**: Heavy operations delegated to Trigger.dev
8. **Consumer-Focused**: B2C language and user experience considerations

## Action Patterns

### Authentication Pattern:

```typescript
export async function actionName() {
  const userId = await getUserId();
  // Action logic with authenticated user context
}
```

### Error Handling Pattern:

```typescript
try {
  // Action logic
  return { success: true, data: result };
} catch (error) {
  console.error("Action failed:", error);
  return { success: false, error: error.message };
}
```

### Data Validation Pattern:

```typescript
const validatedData = schema.parse(input);
// Proceed with validated data
```

### Background Job Pattern:

```typescript
const job = await trigger.task.trigger({
  userId,
  fileUrl,
  fileName,
});
return { jobId: job.id };
```

## Development Notes

- **Security**: All actions include authentication and authorization
- **Performance**: Optimized for quick response times
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Type Safety**: Full TypeScript with runtime validation
- **Testing**: Unit tests for all action functions
- **Documentation**: Clear JSDoc comments for all public functions
- **Monitoring**: Logging and analytics for action performance
- **Scalability**: Designed for high-volume operations

## Integration Points

### External Dependencies:

- **Clerk**: User authentication and session management
- **Trigger.dev**: Background job processing
- **Mistral AI**: OCR and text extraction
- **OpenAI**: Content analysis and generation
- **Redis**: Data storage and retrieval

### Internal Dependencies:

- **Models**: Contract and user data structures
- **Lib**: Authentication and utility functions
- **Clients**: External service connections
- **Tools**: AI search and analysis tools

## Security Considerations

### Authentication:

- All actions require authenticated user context
- User ID extraction and validation
- Session management and expiration

### Authorization:

- User-specific data access controls
- Contract ownership validation
- Secure data filtering

### Data Protection:

- Input validation and sanitization
- Secure data transmission
- No sensitive data in logs

### Error Handling:

- Graceful error responses
- No sensitive information in error messages
- Proper error logging and monitoring

## Future Enhancements

### Planned Features:

- **Batch Processing**: Multiple PDF processing in parallel
- **Advanced Analytics**: Processing metrics and user behavior
- **Enhanced Validation**: More sophisticated input validation
- **Caching**: Response caching for better performance
- **Rate Limiting**: API rate limiting for fair usage
- **Audit Logging**: Comprehensive action audit trails
