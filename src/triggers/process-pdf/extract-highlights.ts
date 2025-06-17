import { processInParallel } from "@/lib/utils";
import { MORTGAGE_KNOWLEDGE_DOCUMENT_ID } from "@/models/constants";
import {
  type ContractHighlight,
  type ContractHighlightType,
  allContractHighlightTypes,
} from "@/models/contract";
import type { ContractContextChunk } from "@/models/contract-context";
import { createSearchMortgageKnowledgeTool } from "@/tools/search-mortgage-knowledge";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { z } from "zod";

const searchMortgageKnowledge = createSearchMortgageKnowledgeTool(
  MORTGAGE_KNOWLEDGE_DOCUMENT_ID,
);

const ClassificationSchema = z.object({
  highlights: z.array(
    z.object({
      sentence: z.string(),
      type: z.string(),
    }),
  ),
});

const DescriptionSchema = z.object({
  description: z.string(),
});

export async function extractHighlightsFromContent(
  chunks: ContractContextChunk[],
): Promise<ContractHighlight[]> {
  const partialResults = await processInParallel(chunks, async (chunk) => {
    const prompt = `Eres un extractor de highlights de contratos hipotecarios.

– Solo usas el texto dado por el usuario.
– Devuelves hasta 5 frases textuales del contrato que correspondan a uno de estos tipos: ${allContractHighlightTypes().join(", ")}.
– Devuelve solo un JSON con este formato (remueve los \`\`\`json \`\`\`)

{
  "highlights": [
    { "sentence": string, "type": string }
  ]
}`;

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `${prompt}\n\nTexto:\n${chunk.content}`,
    });

    const parsed = ClassificationSchema.parse(JSON.parse(text));

    return parsed.highlights.filter((h) =>
      allContractHighlightTypes().includes(h.type as ContractHighlightType),
    );
  });

  const highlights = flatten(partialResults);

  const enrichedResults = await processInParallel(
    highlights,
    async (highlight) => {
      const prompt = `Eres un asistente legal que enriquece cláusulas de contratos hipotecarios.
TAREA:
Toma la siguiente cláusula y devuelve una descripción explicativa en formato JSON. 

PASOS:
1. **Normalización de términos**  
  - Define internamente un “diccionario de normalización” que mapee todos los sinónimos o variantes de un mismo concepto a una forma estándar.
  - Reemplaza en la cláusula cada variante por su forma estándar según el diccionario.

2. **Contextualización y enriquecimiento**
Puedes usar la función \`searchMortgageKnowledge(query)\` si necesitas contexto adicional, pero no inventes datos. Si la función no aporta, basa la descripción solo en la cláusula.

3. **Generación de descripción**  
Con la cláusula normalizada, redacta un párrafo que explique clara y concisamente:
  - Obligaciones y derechos: ¿qué establece la cláusula?
  - Riesgos principales para las partes.
  - Otra información importante que hayas encontrado y que sea necesario mencionar.

FORMATO DE SALIDA:
Devuelve exactamente este formato (remueve los \`\`\`json \`\`\`):
{
  "description": string
}

Donde "description" es lo del paso 3.

Cláusula:
"${highlight.sentence}"
Tipo: ${highlight.type}`;

      const { text } = await generateText({
        model: openai("gpt-4o-mini"),
        tools: { searchMortgageKnowledge },
        prompt,
        maxSteps: 3,
      });

      const parsed = DescriptionSchema.parse(JSON.parse(text));

      return {
        ...highlight,
        type: highlight.type as ContractHighlightType,
        description: parsed.description,
      };
    },
  );

  return enrichedResults;
}

function flatten<T>(nested: T[][]): T[] {
  return nested.reduce((acc, curr) => acc.concat(curr), []);
}
