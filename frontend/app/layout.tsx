import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased">{children}</body>
    </html>
  );
}
