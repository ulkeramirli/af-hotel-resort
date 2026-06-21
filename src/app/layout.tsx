// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AF Hotel & Aqua Park",
  description: "Resort and Hotel in Baku",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 
          Оборачиваем всё приложение в единый клиентский компонент Providers.
          Внутри него уже должны лежать LanguageProvider и AuthProvider, 
          чтобы контексты работали на всех страницах без ошибок.
        */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}