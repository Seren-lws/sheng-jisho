import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Navigation from "@/components/Navigation";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "極簡辭書",
  description: "极简 AI 日语词典 + 生词本",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#F5F5F4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F5F5F4] text-slate-900 font-sans">
        <main className="flex-1">{children}</main>
        <Navigation />
      </body>
    </html>
  );
}
