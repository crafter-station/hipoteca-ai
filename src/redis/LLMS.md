# LLMS.md - Redis Directory (Redis Operations)

## File Structure

```
src/redis/
├── chat-management.ts       # Chat session management
├── get-messages.ts          # Message retrieval operations
├── index.ts                 # Redis client and core operations
├── keys.ts                  # Redis key generation utilities
└── set-messages.ts          # Message storage operations
```

## Business Relevance

### Core Redis Operations:

**Hipoteca Findr** uses Redis as the primary data store for contracts, user data, and chat sessions. Redis provides fast, reliable data access for real-time mortgage contract analysis and consumer interactions.

### Key Data Categories:

1. **📄 Contract Data**: Processed mortgage contracts with metadata
2. **👤 User Data**: User profiles and contract associations
3. **💬 Chat Sessions**: Conversation history and context
4. **🔄 Processing Status**: Real-time job tracking and progress

### Performance Characteristics:

- **Sub-millisecond Access**: Fast data retrieval for real-time UX
- **High Availability**: Reliable data persistence
- **Scalable Architecture**: Handles concurrent user sessions
- **Data Consistency**: Transactional operations where needed

## File Details

### `index.ts` - Redis Client & Core Operations

**Purpose**: Central Redis client configuration and core operations
**Key Functions**:

- `redis`: Redis client instance
- `getContract()`: Retrieve contract by ID
- `setContract()`: Store contract data
- `getUser()`: Retrieve user data
- `setUser()`: Store user data

**Client Configuration**:

- Upstash Redis integration
- Connection pooling
- Error handling and retry logic
- Environment-based configuration

### `keys.ts` - Redis Key Generation

**Purpose**: Consistent key generation for Redis operations
**Key Functions**:

- `contractKey()`: Generate contract key by ID
- `userKey()`: Generate user key by ID
- `chatKey()`: Generate chat session key
- `messageKey()`: Generate message key

**Key Patterns**:

- **Contracts**: `contract:{contractId}`
- **Users**: `user:{userId}`
- **Chats**: `chat:{chatId}`
- **Messages**: `messages:{chatId}`

### `chat-management.ts` - Chat Session Management

**Purpose**: Manage chat sessions and conversation state
**Key Functions**:

- `createChatSession()`: Initialize new chat session
- `updateChatSession()`: Update chat metadata
- `getChatSession()`: Retrieve chat session data
- `deleteChatSession()`: Clean up chat sessions

**Chat Data Structure**:

- Chat ID and metadata
- User association
- Contract context (if applicable)
- Creation and update timestamps
- Message count and summary

### `get-messages.ts` - Message Retrieval

**Purpose**: Retrieve chat messages with pagination
**Key Functions**:

- `getMessages()`: Retrieve messages for chat session
- `getMessageHistory()`: Get paginated message history
- `searchMessages()`: Search within message history
- `getMessageContext()`: Get surrounding message context

**Message Retrieval Features**:

- Pagination support
- Message filtering
- Context-aware retrieval
- Efficient loading for large conversations

### `set-messages.ts` - Message Storage

**Purpose**: Store chat messages and maintain conversation history
**Key Functions**:

- `setMessages()`: Store message batch
- `addMessage()`: Add single message
- `updateMessage()`: Update existing message
- `deleteMessage()`: Remove message

**Message Storage Features**:

- Atomic message operations
- Message ordering and timestamps
- Efficient batch operations
- Data consistency guarantees

## Change-Log

### Recent Major Changes:

**PR #8 (June 2025)** - Enhanced Chat Management

- Improved `chat-management.ts` with better session handling
- Enhanced message retrieval with pagination
- Better error handling and data consistency
- Optimized Redis operations for performance

**PR #6 (June 2025)** - Redis Standardization

- Improved error handling across all operations
- Better TypeScript typing and interfaces
- Enhanced connection management
- Standardized key generation patterns

**PR #4 (June 2025)** - Message System Enhancement

- Enhanced `get-messages.ts` and `set-messages.ts`
- Better message history management
- Improved chat session persistence
- Enhanced Spanish language support

**PR #2 (June 2025)** - Foundation Redis Operations

- Created core Redis client and operations
- Basic contract and user data management
- Initial chat message system
- Key generation utilities

## Key Architecture Decisions

1. **Performance First**: Optimized for fast data access
2. **Data Consistency**: Transactional operations for critical data
3. **Scalable Design**: Handles concurrent user sessions
4. **Error Resilience**: Comprehensive error handling and recovery
5. **Spanish Market Focus**: Optimized for Spanish mortgage data
6. **Consumer-Friendly**: Data structures optimized for B2C interactions
7. **Security**: Secure data access patterns
8. **Maintenance**: Easy data management and cleanup

## Redis Data Patterns

### Contract Storage Pattern:

```typescript
// Contract data structure
const contract = {
  id: string,
  userId: string,
  pdfUrl: string,
  htmlContent: string,
  highlights: ContractHighlight[],
  summary: ContractSummary,
  createdAt: Date
};
```

### User Data Pattern:

```typescript
// User data structure
const user = {
  id: string,
  contractIds: string[],
  createdAt: Date,
  lastActive: Date
};
```

### Chat Session Pattern:

```typescript
// Chat session structure
const chatSession = {
  id: string,
  userId: string,
  contractId: string,
  messageCount: number,
  createdAt: Date,
  updatedAt: Date,
};
```

### Message Storage Pattern:

```typescript
// Message structure
const message = {
  id: string,
  chatId: string,
  role: 'user' | 'assistant',
  content: string,
  sources?: Source[],
  timestamp: Date
};
```

## Development Notes

- **Performance**: Optimized for high-volume operations
- **Memory Management**: Efficient data structures and cleanup
- **Type Safety**: Full TypeScript with comprehensive interfaces
- **Testing**: Unit tests for all Redis operations
- **Documentation**: Clear operation documentation
- **Monitoring**: Redis performance and health monitoring
- **Security**: Secure data access and user isolation
- **Maintenance**: Easy data management and migration

## Integration Points

### Internal Dependencies:

- **Models**: Contract, User, and Chat data structures
- **Actions**: Server actions using Redis operations
- **Chat System**: Message persistence and retrieval
- **Triggers**: Background job status tracking

### External Dependencies:

- **Upstash Redis**: Managed Redis service
- **Clerk**: User authentication and identification
- **Trigger.dev**: Job status and metadata storage
- **Environment Config**: Redis connection configuration

## Performance Optimization

### Strategies:

- **Connection Pooling**: Efficient connection management
- **Batch Operations**: Bulk data operations
- **Key Optimization**: Efficient key patterns
- **Memory Management**: Optimal data structures

### Monitoring:

- **Response Times**: Sub-millisecond access tracking
- **Memory Usage**: Redis memory optimization
- **Connection Health**: Connection monitoring
- **Error Rates**: Operation failure tracking

## Security Considerations

### Data Protection:

- User data isolation
- Secure key patterns
- No sensitive data in keys
- Encryption for sensitive data

### Access Control:

- User-based data access
- Session management
- Rate limiting
- Audit logging

## Future Enhancements

### Planned Features:

- **Advanced Caching**: Intelligent cache management
- **Data Analytics**: Usage patterns and optimization
- **Enhanced Security**: Advanced security features
- **Performance Optimization**: Further performance improvements
- **Backup and Recovery**: Automated backup strategies
- **Multi-region Support**: Geographic data distribution
