// src/components/Providers.tsx
'use client';

import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import GlobalPreloader from "@/components/GlobalPreloader";

import { CurrencyProvider } from "@/contexts/CurrencyContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SettingsProvider>
        <LanguageProvider>
          <CurrencyProvider>
            <GlobalPreloader />
            {children}
          </CurrencyProvider>
        </LanguageProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}