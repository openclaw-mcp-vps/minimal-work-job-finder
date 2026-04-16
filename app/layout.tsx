import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MinimalWork — Find Tech Jobs That Respect Your Time",
  description: "AI-curated tech job listings scored for low workload. Filter by flexible hours, autonomous work, and minimal meetings."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0d1117] text-[#c9d1d9] antialiased">{children}</body>
    </html>
  );
}
