// src/components/Providers.tsx
'use client';

import { LanguageProvider } from "@/contexts/LanguageContext";
import { SessionProvider } from "next-auth/react"; // <-- Добавили провайдер сессий

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </SessionProvider>
  );
}