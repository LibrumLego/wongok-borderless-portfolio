import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import HtmlLangSync from "@/components/HtmlLangSync";
import LanguageToggle from "@/components/LanguageToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "원곡 보더리스 | Wongok Borderless",
  description: "안산 원곡동 다문화거리 음식·문화 체험 통합 관광 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <HtmlLangSync />
        <TopNav />
        {/* 데스크톱은 TopNav 안에 토글이 있어 여기선 모바일에만 띄운다 */}
        <LanguageToggle
          variant="cycle"
          className="fixed right-3 top-3 z-30 border-navy/15 bg-white/90 text-navy/70 shadow-sm backdrop-blur hover:border-orange/50 hover:text-orange md:hidden"
        />
        {/* 모바일은 max-w-md 한 칼럼, 데스크톱은 폭 제한 없이 각 페이지가 자체 컨테이너를 가짐 */}
        <main className="flex-1 mx-auto w-full max-w-md pb-28 md:max-w-none md:pb-0">
          {children}
        </main>
        <Footer />
        <div className="md:hidden">
          <BottomNav />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
