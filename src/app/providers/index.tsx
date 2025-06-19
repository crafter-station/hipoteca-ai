import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { ClientProviders } from "./client";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NuqsAdapter>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ClientProviders>{children}</ClientProviders>
        </ThemeProvider>
      </NuqsAdapter>
      <SpeedInsights />
      <Analytics />
    </>
  );
}
