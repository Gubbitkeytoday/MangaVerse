import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MangaVerse — แหล่งรวมมังงะแปลไทย",
  description:
    "MangaVerse คือแพลตฟอร์มอ่านมังงะแปลไทยออนไลน์ รวบรวมมังงะ มังฮวา มังฮัว ครบทุกแนว อัปเดตรวดเร็ว ระบบหลังบ้านครบครัน",
  keywords: ["manga", "มังงะ", "manhwa", "manhua", "อ่านการ์ตูน", "แปลไทย", "mangaverse"],
  authors: [{ name: "MangaVerse Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "MangaVerse",
    description: "แหล่งรวมมังงะแปลไทยออนไลน์ ครบทุกแนว",
    siteName: "MangaVerse",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
          <Toaster />
          <SonnerToaster richColors position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
