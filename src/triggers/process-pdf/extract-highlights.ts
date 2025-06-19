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

- Solo usas el texto dado por el usuario.
- Devuelves hasta 5 frases textuales del contrato que correspondan a uno de estos tipos: ${allContractHighlightTypes().join(
      ", ",
    )}.
- Devuelve ÚNICAMENTE un JSON válido sin código markdown ni explicaciones adicionales.
- IMPORTANTE: Convierte cualquier notación matemática LaTeX (como $\\mathrm{CO}^{2}$) a texto plano (como CO2).
- IMPORTANTE: Evita caracteres especiales que puedan causar problemas en JSON.

Formato JSON requerido:
{
  "highlights": [
    { "sentence": "texto exacto del contrato", "type": "tipo_de_highlight" }
  ]
}`;

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `${prompt}\n\nTexto:\n${chunk.content}`,
    });

    // Clean the text response to remove any markdown formatting and fix JSON issues
    let cleanedText = text.replace(/```json\s*|\s*```/g, "").trim();

    // Handle common LaTeX mathematical notation that causes JSON parsing issues
    cleanedText = cleanedText
      .replace(/\$\\mathrm\{([^}]+)\}\^?\{?([^}]*)\}?\$/g, "$1$2") // Convert $\mathrm{CO}^{2}$ to CO2
      .replace(/\$\\text\{([^}]+)\}/g, "$1") // Convert $\text{...}$ to plain text
      .replace(/\$([^$]+)\$/g, "$1") // Remove simple $ delimiters
      .replace(/\\([a-zA-Z]+)/g, "$1"); // Remove backslashes from LaTeX commands

    let parsed: z.infer<typeof ClassificationSchema>;
    try {
      parsed = ClassificationSchema.parse(JSON.parse(cleanedText));
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      console.error("Raw text:", text);
      console.error("Cleaned text:", cleanedText);
      const errorMessage =
        parseError instanceof Error ? parseError.message : "Unknown error";
      throw new Error(`Failed to parse JSON response: ${errorMessage}`);
    }

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

4. **Resumen de descripción**
Con la descripción actual, genera un resumen muy preciso y directo, sin repetir la información del término original para no ser redundante.
  - El resumen debe caber en una oracion corta de como máximo 30 palabras.
  - El resumen debe resaltar lo mas importante.
  - Este resumen irá a la salida como valor del campo "description".
  - IMPORTANTE: Ten en cuenta que esta descripción se mostrará en un tooltip pequeño, por lo que no debe ser muy larga.

FORMATO DE SALIDA:
Devuelve ÚNICAMENTE un JSON válido sin código markdown ni explicaciones adicionales:
{
  "description": "tu descripción aquí"
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

      // Clean the text response to remove any markdown formatting and fix JSON issues
      let cleanedText = text.replace(/```json\s*|\s*```/g, "").trim();

      // Handle common LaTeX mathematical notation that causes JSON parsing issues
      cleanedText = cleanedText
        .replace(/\$\\mathrm\{([^}]+)\}\^?\{?([^}]*)\}?\$/g, "$1$2") // Convert $\mathrm{CO}^{2}$ to CO2
        .replace(/\$\\text\{([^}]+)\}/g, "$1") // Convert $\text{...}$ to plain text
        .replace(/\$([^$]+)\$/g, "$1") // Remove simple $ delimiters
        .replace(/\\([a-zA-Z]+)/g, "$1"); // Remove backslashes from LaTeX commands

      let parsed: z.infer<typeof DescriptionSchema>;
      try {
        parsed = DescriptionSchema.parse(JSON.parse(cleanedText));
      } catch (parseError) {
        console.error("JSON parsing error in description:", parseError);
        console.error("Raw text:", text);
        console.error("Cleaned text:", cleanedText);
        const errorMessage =
          parseError instanceof Error ? parseError.message : "Unknown error";
        throw new Error(
          `Failed to parse description JSON response: ${errorMessage}`,
        );
      }

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
