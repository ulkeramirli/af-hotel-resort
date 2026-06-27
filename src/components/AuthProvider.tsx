"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}