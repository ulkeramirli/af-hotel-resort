"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, AlertCircle, Hotel } from "lucide-react";
import { login } from "@/services/api";
import type { FormEvent } from "react";
export default function LoginPage() {
  const [email, setEmail] = useState("admin@afhotel.az");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await login(email, password);

    if (result.success) {
      router.push("/admin");
    } else {
      setError(result.message || "Email və ya parol yanlış daxil edilib!");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--color-hotel-light)" }}
    >
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl border border-stone-100 shadow-lg">
        <div className="text-center space-y-2">
          <div
            className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center"
            style={{ background: "var(--color-hotel-blue)" }}
          >
            <Hotel className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold" style={{ color: "#1e325c" }}>
            AF Hotel Admin
          </h2>
          <p className="text-xs text-stone-400">
            Mock: admin@afhotel.az / admin123
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2 text-rose-600 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-500">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#00b5d5] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-500">Parol</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#00b5d5] focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            style={{ background: "var(--color-hotel-blue)" }}
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Yoxlanılır...
              </>
            ) : (
              "Daxil ol"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}