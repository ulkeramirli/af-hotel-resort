import { Montserrat } from "next/font/google";
import "./globals.css";
import React from "react";
import { LanguageProvider } from "@/context/LanguageContext";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-montserrat",
});

export const metadata = {
  title: "AF Hotel & Aqua Park | Modern Resort Novxanı",
  description: "Novxanıda dəniz kənarında lüks otel, möhtəşəm Aqua Park və unudulmaz ailəvi istirahət.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="az" className="scroll-smooth">
      <body className={`${montserrat.variable} font-sans bg-[#fcfbf7] text-[#121212] antialiased min-h-screen flex flex-col`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}