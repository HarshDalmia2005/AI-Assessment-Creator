import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Assessment Creator",
  description: "Create structured AI-generated assessments from assignment inputs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
