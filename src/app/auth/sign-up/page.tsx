"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Eye, EyeOff, User } from "lucide-react";
import Image from "next/image";

export default function SignUpPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Parol ən az 6 simvol olmalıdır");
      return;
    }
    setLoading(true);
    setError("");
    const res = await signUp(name, email, password);
    if (res.ok) {
      // Перенаправляем на ГЛАВНУЮ страницу, а не в личный кабинет!
      router.push("/");
    } else {
      setError(res.message ?? "Qeydiyyat zamanı xəta baş verdi");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--color-hotel-light)" }}
    >
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-stone-100 shadow-lg space-y-6">
        {/* Header с логотипом AF Hotel */}
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
          <h1 className="text-2xl font-bold text-[#1e325c] mt-2">Qeydiyyat</h1>
          <p className="text-xs text-stone-400">AF Hotel & Aqua Park hesabı yarat</p>
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
            <label className="text-xs font-bold text-stone-500">Ad Soyad</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Adınızı daxil edin"
                className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#00b5d5] transition-colors"
              />
            </div>
          </div>
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
            <div className="relative w-full">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifrə"
                className="w-full pl-4 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#00b5d5] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-70 transition-opacity cursor-pointer"
            style={{ background: "var(--color-hotel-orange)" }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Qeydiyyat...
              </>
            ) : (
              "Hesab Yarat"
            )}
          </button>
        </form>

        <p className="text-center text-xs text-stone-500">
          Artıq hesabın var?{" "}
          <Link
            href="/auth/sign-in"
            className="font-bold hover:underline"
            style={{ color: "#00b5d5" }}
          >
            Daxil ol
          </Link>
        </p>
      </div>
    </div>
  );
}