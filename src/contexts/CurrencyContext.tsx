"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Currency = "AZN" | "USD";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "AZN",
  setCurrency: () => {},
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("AZN");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("af_currency") as Currency;
    if (saved === "AZN" || saved === "USD") {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    localStorage.setItem("af_currency", curr);
  };

  // Provide a default value during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <CurrencyContext.Provider value={{ currency: "AZN", setCurrency }}>
        {children}
      </CurrencyContext.Provider>
    );
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
