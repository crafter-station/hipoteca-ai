import { MORTGAGE_KNOWLEDGE_DOCUMENT_ID } from "@/models/constants";
import type { ContractContextChunk } from "@/models/contract-context";
import { createSearchMortgageKnowledgeTool } from "@/tools/search-mortgage-knowledge";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { z } from "zod";

const searchMortgageKnowledge = createSearchMortgageKnowledgeTool(
  MORTGAGE_KNOWLEDGE_DOCUMENT_ID,
);

// Schema for the summary data structure
const SummarySchema = z.object({
  rate_percent: z.number(),
  apr_percent: z.number(),
  term_years: z.number(),
  monthly_payment: z.string(),
  total_interest_paid: z.string(),
  fees: z.array(
    z.object({
      label: z.string(),
      amount: z.string(),
      due: z.string(),
    }),
  ),
  prepayment_penalty: z.object({
    exists: z.boolean(),
    detail: z.string(),
  }),
  variable_rate_trigger: z.object({
    exists: z.boolean(),
    detail: z.string(),
  }),
  red_flags: z.array(z.string()).max(4),
  plain_summary: z.string(),
  lawyer_summary: z.string(),
  risk_score: z.number().min(0).max(100),
  health_label: z.enum(["Riesgoso", "Aceptable", "Bueno", "Excelente"]),
});

export type ContractSummary = z.infer<typeof SummarySchema>;

export async function extractSummaryFromContent(
  chunks: ContractContextChunk[],
): Promise<ContractSummary> {
  // First, extract key financial data from chunks
  const financialData = await extractFinancialData(chunks);

  // Then create comprehensive summaries and risk analysis
  const summaryData = await generateSummaryAndRiskAnalysis(
    chunks,
    financialData,
  );

  return summaryData;
}

async function extractFinancialData(chunks: ContractContextChunk[]) {
  const financialPrompt = `Eres un extractor especializado en datos financieros de contratos hipotecarios.

TAREA: Extrae los datos financieros clave del contrato hipotecario.

INSTRUCCIONES:
- Analiza todo el contenido proporcionado
- Extrae solo datos que estén explícitamente mencionados
- Si no encuentras un dato, usa valores por defecto razonables
- Para montos monetarios, incluye la moneda y formato original
- Para porcentajes, usa decimales (ej: 3.85 para 3.85%)

FORMATO DE SALIDA (JSON sin \`\`\`):
{
  "rate_percent": number,
  "apr_percent": number, 
  "term_years": number,
  "monthly_payment": string,
  "total_interest_paid": string,
  "fees": [{"label": string, "amount": string, "due": string}],
  "prepayment_penalty": {"exists": boolean, "detail": string},
  "variable_rate_trigger": {"exists": boolean, "detail": string}
}`;

  const allContent = chunks.map((chunk) => chunk.content).join("\n\n");

  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    tools: { searchMortgageKnowledge },
    prompt: `${financialPrompt}\n\nCONTENIDO DEL CONTRATO:\n${allContent}`,
    maxSteps: 3,
  });

  // Parse the JSON response
  const parsed = JSON.parse(text);
  return parsed;
}

async function generateSummaryAndRiskAnalysis(
  chunks: ContractContextChunk[],
  financialData: Record<string, unknown>,
): Promise<ContractSummary> {
  const analysisPrompt = `Eres un experto analista legal especializado en contratos hipotecarios.

TAREA: Genera un análisis completo del contrato hipotecario con resúmenes y evaluación de riesgo.

DATOS FINANCIEROS EXTRAÍDOS:
${JSON.stringify(financialData, null, 2)}

INSTRUCCIONES:
1. **Red Flags**: Identifica máximo 4 alertas críticas (cláusulas abusivas, costes ocultos, etc.)
2. **Plain Summary**: Resumen ejecutivo en español llano (≤120 palabras)
3. **Lawyer Summary**: Análisis legal técnico (≤120 palabras)  
4. **Risk Score**: Puntuación 0-100 (0=excelente, 100=muy riesgoso)
5. **Health Label**: Basado en risk_score: 0-19="Excelente", 20-39="Bueno", 40-69="Aceptable", 70-100="Riesgoso"

CRITERIOS DE RIESGO:
- Tasas de interés altas vs mercado
- Comisiones excesivas
- Penalizaciones por reembolso anticipado
- Cláusulas de tipo variable sin límites
- Vinculación de productos
- Gastos no transparentes

FORMATO DE SALIDA (JSON completo sin \`\`\`):
{
  "rate_percent": ${financialData.rate_percent || 0},
  "apr_percent": ${financialData.apr_percent || 0},
  "term_years": ${financialData.term_years || 30},
  "monthly_payment": "${financialData.monthly_payment || "N/A"}",
  "total_interest_paid": "${financialData.total_interest_paid || "N/A"}",
  "fees": ${JSON.stringify(financialData.fees || [])},
  "prepayment_penalty": ${JSON.stringify(
    financialData.prepayment_penalty || { exists: false, detail: "" },
  )},
  "variable_rate_trigger": ${JSON.stringify(
    financialData.variable_rate_trigger || { exists: false, detail: "" },
  )},
  "red_flags": [strings],
  "plain_summary": string,
  "lawyer_summary": string,
  "risk_score": number,
  "health_label": string
}`;

  const allContent = chunks.map((chunk) => chunk.content).join("\n\n");

  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    tools: { searchMortgageKnowledge },
    prompt: `${analysisPrompt}\n\nCONTENIDO DEL CONTRATO:\n${allContent}`,
    maxSteps: 5,
  });

  // Parse and validate the response
  const parsed = SummarySchema.parse(JSON.parse(text));
  return parsed;
}
