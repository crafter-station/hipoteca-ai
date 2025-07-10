# LLMS.md - Prompts Directory (AI System Prompts)

## File Structure

```
src/prompts/
├── chat-system-prompt.ts      # Chat AI system prompt
└── explain-system-prompt.ts   # Explanation AI system prompt
```

## Business Relevance

### Core AI System Prompts:

**Hipoteca Findr** uses carefully crafted system prompts to ensure AI responses are accurate, professional, and consumer-friendly for Spanish mortgage analysis. These prompts define the AI's behavior, tone, and expertise boundaries.

### Key Prompt Categories:

1. **💬 Chat Assistant**: Conversational mortgage expertise
2. **📖 Content Explanation**: Document and terminology explanations
3. **🇪🇸 Spanish Market**: Local regulations and practices
4. **🔍 Source Citation**: Mandatory source attribution

### AI Personality & Expertise:

- **Professional but Accessible**: B2C language for consumers
- **Spanish Market Expert**: Deep knowledge of Spanish mortgage regulations
- **Source-Backed**: All responses must cite sources
- **Consumer-Protective**: Focused on consumer rights and protection

## File Details

### `chat-system-prompt.ts` - Chat AI System Prompt

**Purpose**: Define AI behavior for the main chat assistant
**Key Characteristics**:

#### **Core Identity**:

- **Name**: Hipoteca Findr
- **Expertise**: Spanish mortgage contracts and regulations
- **Tone**: Professional but accessible, consumer-friendly
- **Language**: Spanish-first with technical accuracy

#### **Specialized Knowledge**:

- **Regulatory Expertise**: Spanish mortgage law and consumer protection
- **Market Knowledge**: Current Spanish mortgage market standards
- **Risk Assessment**: Identification of abusive clauses and red flags
- **Consumer Education**: Mortgage terminology and processes

#### **Response Requirements**:

- **Mandatory Source Citation**: All responses must include XML source tags
- **Dual Search Strategy**: Use both contract-specific and general knowledge
- **Professional Language**: B2C tone without condescension
- **Actionable Advice**: Practical recommendations for consumers

#### **Tool Usage**:

- **searchContractContext**: For contract-specific queries
- **searchMortgageKnowledge**: For general mortgage knowledge
- **Source Format**: XML tags with page numbers
- **Response Structure**: Answer + source citation

#### **Expertise Boundaries**:

- **Scope**: Only mortgage-related topics
- **Limitations**: No legal advice, only information and guidance
- **Referrals**: Suggest professional consultation when appropriate
- **Accuracy**: Acknowledge uncertainty when appropriate

### `explain-system-prompt.ts` - Explanation AI System Prompt

**Purpose**: Define AI behavior for content explanation API
**Key Characteristics**:

#### **Core Function**:

- **Purpose**: Explain mortgage terms and document content
- **Audience**: Spanish consumers without mortgage expertise
- **Approach**: Educational and accessible explanations
- **Context**: Spanish mortgage market and regulations

#### **Explanation Style**:

- **Clarity**: Simple, jargon-free explanations
- **Relevance**: Spanish market context and examples
- **Practicality**: Real-world implications and examples
- **Completeness**: Comprehensive but digestible information

#### **Content Areas**:

- **Mortgage Terminology**: TAE, cuotas, comisiones, etc.
- **Legal Concepts**: Contract clauses and consumer rights
- **Market Standards**: Typical rates and conditions
- **Risk Factors**: Potential issues and red flags

## Change-Log

### Recent Major Changes:

**PR #6 (June 2025)** - Prompt Enhancement

- Enhanced `chat-system-prompt.ts` with better source citation requirements
- Improved tool usage instructions
- Better Spanish market context integration
- Enhanced consumer-friendly language guidelines

**PR #4 (June 2025)** - Dual Knowledge Integration

- Enhanced prompts to support dual search capabilities
- Better separation of contract-specific vs. general knowledge
- Improved source citation system
- Enhanced Spanish market expertise

**PR #2 (June 2025)** - Foundation Prompts

- Created core chat system prompt
- Basic explanation prompt
- Spanish market focus
- Consumer-friendly tone establishment

## Key Architecture Decisions

1. **Spanish Market Focus**: Prompts optimized for Spanish mortgage regulations
2. **Consumer-Centric**: B2C language and approach throughout
3. **Source Citation**: Mandatory source attribution for all responses
4. **Dual Knowledge**: Separate prompts for different AI functions
5. **Professional Boundaries**: Clear scope and limitation definitions
6. **Accuracy Standards**: High accuracy requirements with uncertainty acknowledgment
7. **Tool Integration**: Seamless integration with search tools
8. **Regulatory Compliance**: Adherence to Spanish consumer protection laws

## Prompt Engineering Patterns

### System Prompt Structure:

```typescript
const systemPrompt = `
You are ${identity}
Your expertise: ${expertise}
Your tone: ${tone}
Your requirements: ${requirements}
Your tools: ${tools}
Your boundaries: ${boundaries}
`;
```

### Source Citation Pattern:

```xml
<source>
  <name>Contract Context</name>
  <pages>
    <page>3</page>
    <page>7</page>
  </pages>
</source>
```

### Response Format Pattern:

```
[Direct answer to user question]

[Source citation in XML format]

[Additional context if helpful]
```

## Development Notes

- **Prompt Versioning**: Careful versioning of prompt changes
- **A/B Testing**: Testing different prompt variations
- **Performance Monitoring**: Tracking response quality and accuracy
- **User Feedback**: Incorporating user feedback into prompt improvements
- **Regulatory Updates**: Keeping prompts current with regulation changes
- **Language Optimization**: Continuous refinement of Spanish language usage
- **Consumer Testing**: Validating consumer understanding and satisfaction
- **Expert Review**: Regular review by mortgage industry experts

## Integration Points

### Internal Dependencies:

- **Chat API**: Primary consumer of chat system prompt
- **Explanation API**: Consumer of explanation system prompt
- **Tools**: Search tools integrated via prompt instructions
- **Models**: Data structures referenced in prompts

### External Dependencies:

- **AI Models**: OpenAI GPT models for response generation
- **Spanish Regulations**: Current Spanish mortgage law and consumer protection
- **Market Data**: Current Spanish mortgage market conditions
- **Consumer Research**: User behavior and preference data

## Quality Assurance

### Prompt Testing:

- **Accuracy Testing**: Verify factual accuracy of responses
- **Tone Testing**: Ensure appropriate B2C tone
- **Completeness Testing**: Check response completeness
- **Source Citation Testing**: Verify proper source attribution

### Performance Metrics:

- **Response Relevance**: Measure response relevance to queries
- **User Satisfaction**: Track user satisfaction scores
- **Accuracy Rates**: Monitor factual accuracy
- **Source Quality**: Evaluate source citation quality

## Spanish Market Expertise

### Regulatory Knowledge:

- **Ley Hipotecaria**: Spanish mortgage law
- **Banco de España**: Central bank regulations
- **Consumer Protection**: Spanish consumer rights
- **Market Standards**: Current industry practices

### Market Context:

- **TAE**: Annual Equivalent Rate (Spanish APR)
- **Comisiones**: Various mortgage fees and commissions
- **Cláusulas Suelo**: Floor clauses and consumer protection
- **Reembolso Anticipado**: Early repayment conditions

## Future Enhancements

### Planned Features:

- **Advanced Personalization**: User-specific prompt customization
- **Multi-language Support**: Additional language versions
- **Context Awareness**: Better context understanding
- **Regulatory Updates**: Automated regulatory change integration
- **Expert Knowledge**: Enhanced industry expert knowledge
- **Interactive Elements**: More interactive response formats
