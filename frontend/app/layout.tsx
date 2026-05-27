import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Toaster } from "react-hot-toast";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VedaAI - AI Assessment Creator",
  description: "Create AI powered assessments easily.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </head>
      <body className="h-screen flex bg-[#F0F0F0] text-gray-900 overflow-hidden p-0 md:p-3 md:gap-3 font-sans">
        {/* Sidebar Island - hidden on mobile */}
        <div className="hidden md:block h-full bg-white shadow-[0_32px_48px_rgba(0,0,0,0.20),0_16px_48px_rgba(0,0,0,0.12)] rounded-[24px] overflow-hidden shrink-0">
          <Sidebar />
        </div>
        {/* Right Column */}
        <div className="flex-1 flex flex-col h-full overflow-hidden md:gap-3">
          {/* Header Island */}
          <div className="bg-white md:bg-white/75 md:rounded-[16px] shrink-0 z-50">
            <Header />
          </div>
          {/* Main Content Island */}
          <main className="flex-1 overflow-hidden relative md:rounded-[24px] pb-[72px] md:pb-0">
            {children}
          </main>
        </div>
        {/* Mobile Bottom Navigation */}
        <BottomNav />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
