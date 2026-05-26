import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
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
      <body className="h-screen flex bg-[#F0F0F0] text-gray-900 overflow-hidden p-3 gap-3 font-sans">
        {/* Sidebar Island */}
        <div className="h-full bg-white shadow-[0_32px_48px_rgba(0,0,0,0.20),0_16px_48px_rgba(0,0,0,0.12)] rounded-[24px] overflow-hidden shrink-0">
          <Sidebar />
        </div>
        {/* Right Column */}
        <div className="flex-1 flex flex-col h-full overflow-hidden gap-3">
          {/* Header Island */}
          <div className="bg-white/75 rounded-[16px] shrink-0 overflow-hidden">
            <Header />
          </div>
          {/* Main Content Island */}
          <main className="flex-1 overflow-hidden relative rounded-[24px]">
            {children}
          </main>
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
