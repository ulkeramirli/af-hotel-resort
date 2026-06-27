"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { forgotPassword } from "@/services/api";
import { Loader2, Mail, AlertCircle, ArrowLeft } from "lucide-react";
import type { FormEvent } from "react";
type LangType = "az" | "en" | "ru";

const translations = {
  az: {
    title: "Parolu Yenilə",
    desc: "Qeydiyyatdan keçdiyiniz email ünvanını daxil edin və biz sizə şifrə sıfırlama kodu göndərək.",
    emailLabel: "Email",
    emailPlaceholder: "email@example.com",
    btn: "Kodu Göndər",
    sending: "Göndərilir...",
    backToLogin: "Daxil ol səhifəsinə qayıt",
    successMsg: "Şifrə sıfırlama kodu emailinizə göndərildi. Yönləndirilirsiniz...",
    successMsgDev: "Kod server terminalında görünür. Yönləndirilirsiniz...",
    errorMsg: "Xəta baş verdi. Email doğru daxil edilibmi?"
  },
  ru: {
    title: "Восстановление пароля",
    desc: "Введите адрес электронной почты, указанный при регистрации, и мы отправим вам код для сброса пароля.",
    emailLabel: "Email",
    emailPlaceholder: "email@example.com",
    btn: "Отправить код",
    sending: "Отправка...",
    backToLogin: "Вернуться ко входу",
    successMsg: "Код для сброса пароля отправлен на ваш email.",
    errorMsg: "Произошла ошибка. Правильно ли введен email?"
  },
  en: {
    title: "Reset Password",
    desc: "Enter the email address associated with your account and we'll send you a link to reset your password.",
    emailLabel: "Email",
    emailPlaceholder: "email@example.com",
    btn: "Send Code",
    sending: "Sending...",
    backToLogin: "Back to sign in",
    successMsg: "Password reset code sent to your email.",
    errorMsg: "An error occurred. Is the email correct?"
  }
};

function ForgotPasswordForm() {
  const { language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const l = (language as LangType) || "az";
  const t = translations[l];

  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const trimmedEmail = email.trim();
    try {
      const res = await forgotPassword(trimmedEmail);
      if (res.success) {
        setSuccess(true);
        // Wait 2s so user can read the success message, then redirect
        setTimeout(() => {
          router.push(`/auth/reset-password?email=${encodeURIComponent(trimmedEmail)}`);
        }, 2000);
      } else {
        const errorText = res.message === "User not found" 
          ? (l === "az" ? "Bu email ilə hesab tapılmadı" : l === "ru" ? "Аккаунт с таким email не найден" : "User not found")
          : (res.message || t.errorMsg);
        setError(errorText);
        setLoading(false);
      }
    } catch {
      setError(t.errorMsg);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm w-full mx-auto space-y-7">
      <div className="flex flex-col items-center mb-8">
        <div className="w-32 h-32 relative mb-4">
          <Image src="/loqo-af.png" alt="AF Hotel" fill className="object-contain" priority />
        </div>
        <h1 className="text-2xl font-bold text-[#1e325c] text-center">{t.title}</h1>
        <p className="text-sm text-stone-500 mt-2 text-center leading-relaxed">
          {t.desc}
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-100 rounded-xl">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <p className="text-xs text-rose-700 font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
          <AlertCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-700 font-medium">{t.successMsg}</p>
        </div>
      )}

      {!success && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">{t.emailLabel}</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#00b5d5] focus:bg-white focus:ring-2 focus:ring-[#00b5d5]/10 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            style={{ background: "linear-gradient(135deg, #00b5d5, #00406a)" }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t.sending}
              </>
            ) : (
              t.btn
            )}
          </button>
        </form>
      )}

      <div className="text-center">
        <Link href="/auth/sign-in" className="inline-flex items-center gap-2 text-sm font-semibold text-stone-500 hover:text-[#00b5d5] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {t.backToLogin}
        </Link>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-stone-50">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-stone-100">
        <Suspense fallback={<div className="flex justify-center p-10"><Loader2 className="w-6 h-6 animate-spin text-[#00b5d5]" /></div>}>
          <ForgotPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
