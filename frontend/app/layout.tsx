import type { Metadata } from "next";
import { Inter, Archivo_Black, Outfit, Space_Grotesk, Pixelify_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { HistoryProvider } from "@/lib/history-context";

import { AuthProvider } from "@/components/auth-provider";

const inter = Inter({ subsets: ["latin"] });
const archivoBlack = Archivo_Black({ weight: "400", subsets: ["latin"], variable: "--font-cratos" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-chopin" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-rizo" });
const pixelifySans = Pixelify_Sans({ subsets: ["latin"], variable: "--font-pixel" });

export const metadata: Metadata = {
  title: "Cratos - Creator Content Intelligence",
  description: "AI-powered cross-platform creator content intelligence system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${archivoBlack.variable} ${outfit.variable} ${spaceGrotesk.variable} ${pixelifySans.variable}`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
          >
            <HistoryProvider>
              {children}
            </HistoryProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
