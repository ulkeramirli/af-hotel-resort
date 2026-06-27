// src/components/Providers.tsx
'use client';

import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import React from "react";
import type { ReactNode } from "react";
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SettingsProvider>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}