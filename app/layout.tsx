import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Sans } from "next/font/google";

import "@/app/globals.css";

const headingFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading"
});

const bodyFont = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://minimal-work-job-finder.vercel.app"),
  title: {
    default: "Minimal Work Job Finder",
    template: "%s | Minimal Work Job Finder"
  },
  description:
    "Find remote and hybrid tech jobs from companies that support sustainable workloads, predictable hours, and real work-life balance.",
  keywords: [
    "work life balance jobs",
    "low stress tech jobs",
    "remote developer jobs",
    "sustainable tech careers",
    "burnout safe jobs"
  ],
  openGraph: {
    title: "Minimal Work Job Finder",
    description:
      "Curated tech roles from companies known for sane expectations and healthier work cultures.",
    url: "https://minimal-work-job-finder.vercel.app",
    siteName: "Minimal Work Job Finder",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Minimal Work Job Finder",
    description:
      "Skip burnout factories. Find balanced roles with transparent workload scoring."
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
