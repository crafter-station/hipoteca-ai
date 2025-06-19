interface Source {
  name: string;
  pages: number[];
}

export function parseSources(content: string): {
  text: string;
  sources: Source[];
} {
  const sourcesMatch = content.match(/<sources>([\s\S]*?)<\/sources>/);
  if (!sourcesMatch) return { text: content, sources: [] };

  const text = content.replace(sourcesMatch[0], "").trim();
  const sourcesXml = sourcesMatch[1];
  const sources: Source[] = [];

  const sourceMatches = sourcesXml.matchAll(/<source>([\s\S]*?)<\/source>/g);
  for (const match of sourceMatches) {
    const sourceXml = match[1];
    const nameMatch = sourceXml.match(/<name>([\s\S]*?)<\/name>/);
    const pagesMatch = sourceXml.match(/<pages>([\s\S]*?)<\/pages>/);

    if (nameMatch && pagesMatch) {
      const pages =
        pagesMatch[1]
          .match(/<page>(\d+)<\/page>/g)
          ?.map((p) =>
            Number.parseInt(p.replace(/<page>(\d+)<\/page>/, "$1"), 10),
          ) || [];

      sources.push({
        name: nameMatch[1].trim(),
        pages,
      });
    }
  }

  return { text, sources };
}

export type { Source };
