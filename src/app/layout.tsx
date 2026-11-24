import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { SvgFilters } from "@/components/design-system/SvgFilters";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VERDICT — See beyond the buy.",
  description: "Buyer-side AI that cross-examines marketing claims, forecasts multi-year ownership, and delivers evidence-backed purchase verdicts.",
  openGraph: {
    title: "VERDICT — See beyond the buy.",
    description: "Buyer-side AI cross-examination. We test seller claims against owner evidence.",
    url: "https://verdict.app",
    siteName: "VERDICT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VERDICT — See beyond the buy.",
    description: "Buyer-side AI cross-examination before you pay.",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bricolage.variable} ${ibmPlexMono.variable}`}>
      <body className="bg-[#F2EBD8] text-[#1B1A17] antialiased selection:bg-[#F3C94B] selection:text-[#1B1A17]">
        <SvgFilters />
        <SmoothScroll />
        {/* Grain overlay */}
        <div
          className="pointer-events-none fixed inset-0 z-50 opacity-[0.05] mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
          aria-hidden="true"
        />
        <main className="relative min-h-screen flex flex-col">{children}</main>
      </body>
    </html>
  );
}
