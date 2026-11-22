import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "@/components/providers/toaster";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NyayaAI | Legal Research & Document Intelligence",
  description:
    "Explore Indian legal documents with multilingual AI-powered research and source-grounded insights.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
