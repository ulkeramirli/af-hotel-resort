"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";

type LangType = "az" | "en" | "ru";

const translations = {
  az: {
    heroTitle: "Xəzər sahilinin\nən lüks istirahəti",
    heroDesc: "5 ulduzlu otel, akvapak, 3 restoran və özəl çimərlik ilə unudulmaz istirahət yaşayın.",
    statRoom: "Otaq",
    statRest: "Restoran",
    statRating: "Reytinq",
    welcome: "Xoş gəldiniz",
    subtitle: "Hesabınıza daxil olun",
    googleBtn: "Google ilə daxil ol",
    orWith: "və ya email ilə",
    emailLabel: "Email",
    passwordLabel: "Parol",
    forgotPass: "Parolu unutmusunuz?",
    signInBtn: "Daxil ol",
    checking: "Yoxlanılır...",
    noAccount: "Hesabın yoxdur?",
    signUp: "Qeydiyyat",
    errorAuth: "Email və ya parol yanlışdır",
    errorGoogle: "Google ilə daxil olma zamanı xəta baş verdi"
  },
  ru: {
    heroTitle: "Самый роскошный\nотдых на Каспии",
    heroDesc: "Испытайте незабываемый отдых в 5-звездочном отеле с аквапарком, 3 ресторанами и частным пляжем.",
    statRoom: "Номеров",
    statRest: "Ресторана",
    statRating: "Рейтинг",
    welcome: "Добро пожаловать",
    subtitle: "Войдите в свой аккаунт",
    googleBtn: "Войти через Google",
    orWith: "или с помощью email",
    emailLabel: "Email",
    passwordLabel: "Пароль",
    forgotPass: "Забыли пароль?",
    signInBtn: "Войти",
    checking: "Проверка...",
    noAccount: "Нет аккаунта?",
    signUp: "Регистрация",
    errorAuth: "Неверный email или пароль",
    errorGoogle: "Произошла ошибка при входе через Google"
  },
  en: {
    heroTitle: "The most luxurious\nvacation on the Caspian",
    heroDesc: "Experience an unforgettable stay in a 5-star hotel with a water park, 3 restaurants, and a private beach.",
    statRoom: "Rooms",
    statRest: "Restaurants",
    statRating: "Rating",
    welcome: "Welcome back",
    subtitle: "Sign in to your account",
    googleBtn: "Sign in with Google",
    orWith: "or with email",
    emailLabel: "Email",
    passwordLabel: "Password",
    forgotPass: "Forgot password?",
    signInBtn: "Sign In",
    checking: "Checking...",
    noAccount: "Don't have an account?",
    signUp: "Sign Up",
    errorAuth: "Incorrect email or password",
    errorGoogle: "An error occurred during Google sign-in"
  }
};

export default function SignInPage() {
  const { signIn, signInGoogle } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();

  const l = (language as LangType) || "az";
  const t = translations[l];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await signIn(email, password);
      if (res && res.ok) {
        router.push(res.redirect ?? "/account");
      } else {
        setError(t.errorAuth);
        setLoading(false);
      }
    } catch {
      setError(t.errorAuth);
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      const res = await signInGoogle();
      if (res && res.ok) {
        router.push(res.redirect ?? "/account");
      } else {
        setError(t.errorGoogle);
        setGoogleLoading(false);
      }
    } catch {
      setError(t.errorGoogle);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--color-hotel-light)" }}>
      {/* Левая декоративная панель (Компьютерная версия) */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=85"
          alt="AF Hotel"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#00406a]/80" />
        
        {/* ИЗМЕНЕНО: ПОДНЯТО МАКСИМАЛЬНО ВЫШЕ В УГОЛ (top-4 left-4) */}
        <div className="absolute top-4 left-4 z-20 flex flex-col items-start">
          <div className="w-32 h-32 relative">
            <Image src="/loqo-af.png" alt="AF Hotel" fill className="object-contain brightness-0 invert" />
          </div>
          <span className="text-[10px] font-medium text-white/80 tracking-wider italic uppercase text-left -mt-2">
            AF Hotel & Aqua Park Resort
          </span>
        </div>

        {/* Контент слева снизу */}
        <div className="relative z-10 flex flex-col justify-end p-12 text-white h-full">
          <h2 className="text-4xl font-bold mb-3 leading-tight whitespace-pre-line">
            {t.heroTitle}
          </h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-xs">
            {t.heroDesc}
          </p>
          <div className="mt-8 flex gap-6">
            {[["500+", t.statRoom], ["3", t.statRest], ["5★", t.statRating]].map(([num, label]) => (
              <div key={label}>
                <div className="text-2xl font-bold">{num}</div>
                <div className="text-white/60 text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Правая панель с формой */}
      <div className="flex-1 lg:max-w-md flex flex-col justify-center px-8 py-12 bg-white">
        <div className="max-w-sm w-full mx-auto space-y-7">
          
          {/* Мобильный блок логотипа */}
          <div className="lg:hidden flex flex-col items-center mb-12 -mt-10">
            <div className="w-40 h-40 relative">
              <Image src="/loqo-af.png" alt="AF Hotel" fill className="object-contain" priority />
            </div>
            <span className="text-[11px] font-medium text-stone-400 tracking-wider italic text-center opacity-90 -mt-2">
              AF Hotel & Aqua Park Resort
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#1e325c]">{t.welcome}</h1>
            <p className="text-sm text-stone-400 mt-1">{t.subtitle}</p>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-100 rounded-xl">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <p className="text-xs text-rose-700 font-medium">{error}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="w-full py-3 border-2 border-stone-200 rounded-xl text-sm font-semibold flex items-center justify-center gap-3 hover:border-[#00b5d5] hover:bg-[#00b5d5]/5 transition-all disabled:opacity-60 cursor-pointer"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#00b5d5]" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            {t.googleBtn}
          </button>

          <div className="relative flex items-center gap-3">
            <div className="flex-1 border-t border-stone-200" />
            <span className="text-xs text-stone-400 font-medium">{t.orWith}</span>
            <div className="flex-1 border-t border-stone-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">{t.emailLabel}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#00b5d5] focus:bg-white focus:ring-2 focus:ring-[#00b5d5]/10 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">{t.passwordLabel}</label>
                <Link href={`/auth/forgot-password?email=${encodeURIComponent(email)}`} className="text-xs font-semibold hover:underline" style={{ color: "#00b5d5" }}>
                  {t.forgotPass}
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#00b5d5] focus:bg-white focus:ring-2 focus:ring-[#00b5d5]/10 transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer">
                  {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full py-3 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
              style={{ background: "linear-gradient(135deg, #00b5d5, #00406a)" }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t.checking}
                </>
              ) : t.signInBtn}
            </button>
          </form>

          <p className="text-center text-sm text-stone-500">
            {t.noAccount}{" "}
            <Link href="/auth/sign-up" className="font-bold hover:underline" style={{ color: "#00b5d5" }}>
              {t.signUp}
            </Link>
          </p>

          <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-center">
            <p className="text-[10px] text-amber-700 font-medium">
              Demo: <span className="font-bold">admin@afhotel.az</span> / <span className="font-bold">admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}