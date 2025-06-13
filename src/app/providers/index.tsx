import { ThemeProvider } from "next-themes";
import { ClientProviders } from "./client";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
			<ClientProviders>{children}</ClientProviders>
		</ThemeProvider>
	);
}
