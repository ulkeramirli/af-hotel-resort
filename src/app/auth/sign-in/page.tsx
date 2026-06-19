"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export default function SignInPage() {
  const { signIn, signInGoogle } = useAuth();
  const router = useRouter();
  
  // Убрали предзаполненные данные для чистого входа
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const res = await signIn(email, password);
    if (res.ok) {
      router.push(res.redirect ?? "/account");
    } else {
      // Проверяем, если аккаунт не найден или пароль неверный
      const isNotFound = res.message?.toLowerCase().includes("not found") || 
                         res.message?.toLowerCase().includes("invalid") ||
                         res.message === "Xəta baş verdi";
                         
      if (isNotFound) {
        setError("Belə bir hesab tapılmadı. Zəhmət olmasa, qeydiyyatdan keçin.");
      } else {
        setError(res.message ?? "Email və ya parol yanlışdır");
      }
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await signInGoogle();
      if (res.ok) {
        router.push(res.redirect ?? "/account");
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
      setError("Google ilə daxil olma zamanı xəta baş verdi");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--color-hotel-light)" }}
    >
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-stone-100 shadow-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-full  max-w-56 h-28 mx-auto flex items-center justify-center relative">
            <Image 
              src="/loqo-af.png" 
              alt="AF Hotel Logo" 
              fill
              priority
              className="object-contain" 
            />
          </div>
          <h1 className="text-2xl font-bold text-[#1e325c] mt-2">Daxil ol</h1>
          <p className="text-xs text-stone-400">AF Hotel & Aqua Park daxil ol</p>
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-500">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#00b5d5] transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-500">Parol</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 pr-10 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#00b5d5] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-xs font-semibold hover:underline"
              style={{ color: "#00b5d5" }}
            >
              Parolu unutmusan?
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-70 transition-opacity"
            style={{ background: "var(--color-hotel-orange)" }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Yoxlanılır...
              </>
            ) : (
              "Daxil ol"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative text-center">
          <div className="absolute inset-x-0 top-1/2 border-t border-stone-100" />
          <span className="relative bg-white px-3 text-xs text-stone-400">və ya</span>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full py-2.5 border border-stone-200 rounded-xl text-sm font-semibold flex items-center justify-center gap-3 hover:bg-stone-50 transition-colors disabled:opacity-70"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google ilə davam et
        </button>

        <p className="text-center text-xs text-stone-500">
          Hesabın yoxdur?{" "}
          <Link
            href="/auth/sign-up"
            className="font-bold hover:underline"
            style={{ color: "#00b5d5" }}
          >
            Qeydiyyat
          </Link>
        </p>
      </div>
    </div>
  );
}

// admin@afhotel.az
// admin123