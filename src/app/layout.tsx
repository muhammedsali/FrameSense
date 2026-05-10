import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Doğanay Balaban — Full Stack Developer",
  description:
    "Üretim kalitesinde SaaS platformları, AI destekli uygulamalar ve gerçek zamanlı sistemler geliştiren Full-Stack Software Engineer.",
  keywords:
    "full stack developer, next.js, typescript, node.js, react, ai, llm, backend",
  authors: [{ name: "Doğanay Balaban" }],
  creator: "Doğanay Balaban",
  openGraph: {
    title: "Doğanay Balaban — Full Stack Developer",
    description:
      "Full-Stack Software Engineer. Next.js, Node.js, TypeScript, AI/LLM.",
    url: "https://doganaybalaban.com",
    siteName: "Doğanay Balaban Portfolio",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Doğanay Balaban — Full Stack Developer",
    description: "Full-Stack Software Engineer. Next.js, Node.js, TypeScript, AI/LLM.",
    creator: "@doganaybalaban",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${dmSans.variable} ${dmMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
