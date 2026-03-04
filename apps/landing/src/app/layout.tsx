import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@repo/ui";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MarketSage — AI Finance Agent & API",
  description:
    "Modern AI finance agent chat and API for research, risk analysis, and portfolio intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans min-h-screen bg-bg text-fg antialiased`}
      >
        <ThemeProvider storageKey="marketsage-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

