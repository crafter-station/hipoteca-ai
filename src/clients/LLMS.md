# LLMS.md - Clients Directory (External Service Clients)

## File Structure

```
src/clients/
├── mistral.ts          # Mistral AI client configuration
├── redis.ts            # Redis client configuration
└── weaviate.ts         # Weaviate vector database client
```

## Business Relevance

### Core External Services:

**Hipoteca Findr** integrates with three critical external services to deliver comprehensive mortgage contract analysis for Spanish consumers. These clients provide AI-powered analysis, data persistence, and semantic search capabilities.

### Key Service Categories:

1. **🤖 AI Services**: Content analysis and generation
2. **💾 Data Storage**: Contract and user data persistence
3. **🔍 Vector Search**: Semantic search for chat and analysis

### Service Architecture:

- **Mistral AI**: OCR, text extraction, and content analysis
- **Redis**: Fast data storage for contracts and user sessions
- **Weaviate**: Vector database for semantic search and RAG

## File Details

### `mistral.ts` - Mistral AI Client

**Purpose**: AI-powered PDF processing and content analysis
**Key Features**:

- OCR text extraction from PDF documents
- Content analysis and structuring
- Spanish language processing optimization
- Mortgage-specific terminology understanding

**Primary Use Cases**:

- PDF text extraction and OCR
- Content analysis and highlight extraction
- Mortgage document understanding
- Spanish market context analysis

**Integration Points**:

- PDF processing pipeline (Trigger.dev)
- Highlight extraction system
- Content generation for explanations
- Risk assessment and classification

### `redis.ts` - Redis Client

**Purpose**: High-performance data storage and caching
**Key Features**:

- Contract data persistence
- User session management
- Chat history storage
- Fast data retrieval

**Data Structures**:

- **Contracts**: Complete contract objects with metadata
- **Users**: User profiles and contract associations
- **Chat History**: Conversation persistence
- **Processing Status**: Real-time job tracking

**Performance Characteristics**:

- Sub-millisecond data access
- High-availability configuration
- Automatic data expiration
- Concurrent access optimization

### `weaviate.ts` - Weaviate Vector Database Client

**Purpose**: Semantic search and vector embeddings
**Key Features**:

- Vector storage for contract content
- Semantic search capabilities
- Dual knowledge collections
- RAG (Retrieval-Augmented Generation) support

**Collections**:

- **ContractContext**: User-specific contract chunks
- **MortgageKnowledge**: General mortgage knowledge base
- **Vector Embeddings**: Semantic representations
- **Metadata**: Page references and document IDs

**Search Capabilities**:

- Contract-specific semantic search
- General mortgage knowledge queries
- Adjacent chunk retrieval
- Similarity-based matching

## Change-Log

### Recent Major Changes:

**PR #6 (June 2025)** - Client Standardization

- Improved error handling across all clients
- Better connection management and retry logic
- Enhanced configuration management
- Standardized client initialization

**PR #4 (June 2025)** - Dual Knowledge Integration

- Enhanced Weaviate client with dual collection support
- Better separation of contract and knowledge data
- Improved search capabilities
- Enhanced Spanish market context

**PR #2 (June 2025)** - Foundation Clients

- Created core client configurations
- Basic service integrations
- Initial connection management
- Error handling and retry logic

## Key Architecture Decisions

1. **Service Reliability**: Robust error handling and retry mechanisms
2. **Performance Optimization**: Connection pooling and caching
3. **Security**: Secure credential management and API access
4. **Scalability**: Client configurations optimized for high load
5. **Spanish Market Focus**: Services configured for Spanish language processing
6. **Data Consistency**: Transactional operations where needed
7. **Monitoring**: Comprehensive logging and metrics collection
8. **Cost Optimization**: Efficient resource usage and rate limiting

## Client Configuration Patterns

### Connection Management:

```typescript
const client = new ServiceClient({
  apiKey: process.env.SERVICE_API_KEY,
  retryConfig: {
    maxRetries: 3,
    backoffStrategy: "exponential",
  },
});
```

### Error Handling:

```typescript
try {
  const result = await client.operation();
  return result;
} catch (error) {
  console.error("Service operation failed:", error);
  // Fallback or retry logic
}
```

### Resource Management:

```typescript
// Connection pooling and cleanup
const client = createClient({
  pool: {
    min: 2,
    max: 10,
    idleTimeout: 30000,
  },
});
```

## Development Notes

- **Environment Variables**: All clients use secure environment configuration
- **Error Handling**: Comprehensive error boundaries and recovery mechanisms
- **Performance**: Optimized for high-volume operations
- **Security**: Secure credential management and API access
- **Monitoring**: Logging and analytics for client performance
- **Testing**: Unit tests for all client operations
- **Documentation**: Clear configuration and usage documentation
- **Maintenance**: Easy client updates and configuration changes

## Integration Points

### Internal Dependencies:

- **Models**: Data structures for contracts and knowledge
- **Actions**: Server actions using client services
- **Tools**: AI tools consuming client services
- **Triggers**: Background jobs using client services

### External Dependencies:

- **Mistral AI**: API for OCR and content analysis
- **Upstash Redis**: Managed Redis service
- **Weaviate Cloud**: Managed vector database service
- **Environment Config**: Secure credential management

## Service Specifications

### Mistral AI Integration:

- **Model**: Latest Mistral models for OCR and analysis
- **Language**: Spanish language optimization
- **Rate Limits**: Configured for high-volume processing
- **Error Handling**: Retry logic for API failures

### Redis Integration:

- **Configuration**: Upstash Redis with persistence
- **Data TTL**: Appropriate expiration for different data types
- **Connection Pool**: Optimized for concurrent access
- **Monitoring**: Performance metrics and health checks

### Weaviate Integration:

- **Schema**: Configured for contract and knowledge collections
- **Vectors**: Optimized embedding dimensions
- **Search**: Semantic search with similarity thresholds
- **Backup**: Data backup and recovery procedures

## Security Considerations

### API Security:

- Secure API key management
- Rate limiting and throttling
- Request validation and sanitization
- Secure data transmission

### Data Protection:

- No sensitive data in client logs
- Secure data at rest and in transit
- User data isolation
- Compliance with data protection regulations

### Access Control:

- Service-specific authentication
- Role-based access where applicable
- Audit logging for service access
- Secure credential rotation

## Future Enhancements

### Planned Features:

- **Enhanced Monitoring**: Better observability and alerting
- **Performance Optimization**: Further client performance improvements
- **Advanced Security**: Enhanced security features
- **Multi-region Support**: Geographic distribution of services
- **Backup and Recovery**: Improved data backup strategies
- **Cost Optimization**: Better resource utilization and cost management
