import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme/theme-context";

export const metadata: Metadata = {
  title: "Smart Symptom Log & Triage Assistant",
  description:
    "Intelligent symptom tracking and triage guidance for better healthcare decisions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
