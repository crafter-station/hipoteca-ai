import type { Source } from "@/lib/chat-utils";

interface SourcesProps {
  sources: Source[];
}

export function Sources({ sources }: SourcesProps) {
  if (sources.length === 0) return null;

  const mortgagePdf =
    "https://www.bde.es/f/webbde/Secciones/Publicaciones/Folletos/Fic/Guia_hipotecaria_2013.pdf";
  const contractDoc =
    "https://o6dbw19iyd.ufs.sh/f/dgFwWFXCXZVhT5Loy8B7YUFvSi8RlzkwVJnbZ6ypt93rXGOs";

  return (
    <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-2 font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300">
        Referencias
      </div>
      <div className="space-y-1">
        {sources.map((source) => {
          let link: string | null = null;
          if (source.name === "Mortgage Knowledge" && source.pages.length > 0) {
            link = `${mortgagePdf}#page=${source.pages[0]}`;
          } else if (source.name === "Contract Context") {
            link = `${contractDoc}#page=${source.pages[0]}`;
          }
          return (
            <div
              key={`${source.name}-${source.pages.join("-")}`}
              className="flex items-baseline gap-2"
            >
              <span className="inline-block min-w-[1.5em] text-center font-bold text-blue-600 dark:text-blue-400">
                {sources.indexOf(source) + 1}.
              </span>
              <span className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                {source.name === "Mortgage Knowledge"
                  ? "Guía Hipotecaria del Banco de España"
                  : "Tu contrato hipotecario"}
                {link && (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 text-blue-600 hover:underline dark:text-blue-400"
                    title="Abrir documento de referencia"
                  >
                    <span style={{ fontSize: "1em", verticalAlign: "middle" }}>
                      🔗
                    </span>
                  </a>
                )}
              </span>
              <span className="ml-2 text-gray-500 dark:text-gray-400">
                Páginas: {source.pages.join(", ")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
