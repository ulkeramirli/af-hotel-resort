// src/app/account/page.tsx
'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function AccountPage() {
  const { user } = useAuth();

  return (
    <div className="pt-32 px-8 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Xoş gəldiniz, {user?.name || user?.email}!</h1>
      <p className="text-stone-600 text-sm">Bu sizin şəxsi kabinetinizdir.</p>
    </div>
  );
}