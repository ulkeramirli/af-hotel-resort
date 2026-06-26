"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { resetPassword } from "@/services/api";
import { Loader2, KeyRound, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

type LangType = "az" | "en" | "ru";

const translations = {
  az: {
    title: "Yeni Parol",
    desc: "Email ünvanınıza göndərilən 6 rəqəmli kodu və yeni parolunuzu daxil edin.",
    otpLabel: "Təsdiq Kodu",
    otpPlaceholder: "6 rəqəmli kod",
    passLabel: "Yeni Parol",
    passPlaceholder: "Ən az 6 simvol",
    btn: "Parolu Yenilə",
    updating: "Yenilənir...",
    successMsg: "Parolunuz uğurla yeniləndi! Daxil olun.",
    errorMsg: "Xəta baş verdi. Kod yanlış və ya vaxtı bitmiş ola bilər."
  },
  ru: {
    title: "Новый пароль",
    desc: "Введите 6-значный код, отправленный на ваш email, и новый пароль.",
    otpLabel: "Код подтверждения",
    otpPlaceholder: "6-значный код",
    passLabel: "Новый пароль",
    passPlaceholder: "Не менее 6 символов",
    btn: "Обновить пароль",
    updating: "Обновление...",
    successMsg: "Пароль успешно обновлен! Войдите в систему.",
    errorMsg: "Ошибка. Код неверный или срок его действия истек."
  },
  en: {
    title: "New Password",
    desc: "Enter the 6-digit code sent to your email and your new password.",
    otpLabel: "Verification Code",
    otpPlaceholder: "6-digit code",
    passLabel: "New Password",
    passPlaceholder: "At least 6 characters",
    btn: "Reset Password",
    updating: "Updating...",
    successMsg: "Password reset successful! Please sign in.",
    errorMsg: "An error occurred. The code might be invalid or expired."
  }
};

function ResetPasswordForm() {
  const { language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const l = (language as LangType) || "az";
  const t = translations[l];

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError(t.errorMsg); return; }
    setLoading(true);
    setError("");
    try {
      const res = await resetPassword(email.trim(), otp, newPassword);
      if (res.success) {
        setSuccess(true);
        router.push("/auth/sign-in");
      } else {
        let errorText = res.message;
        if (res.message === "Invalid OTP") {
          errorText = l === "az" ? "Təsdiq kodu yanlışdır" : l === "ru" ? "Неверный код" : "Invalid OTP";
        } else if (res.message === "OTP expired") {
          errorText = l === "az" ? "Təsdiq kodunun vaxtı bitib" : l === "ru" ? "Срок действия кода истек" : "OTP expired";
        } else if (res.message === "User not found") {
          errorText = l === "az" ? "Hesab tapılmadı" : l === "ru" ? "Аккаунт не найден" : "User not found";
        }
        setError(errorText || t.errorMsg);
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
          <br/>
          <span className="font-semibold text-stone-700">{email}</span>
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
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">{t.otpLabel}</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder={t.otpPlaceholder}
                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#00b5d5] focus:bg-white focus:ring-2 focus:ring-[#00b5d5]/10 transition-all text-center tracking-[0.2em] font-bold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">{t.passLabel}</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t.passPlaceholder}
                className="w-full pl-10 pr-11 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#00b5d5] focus:bg-white focus:ring-2 focus:ring-[#00b5d5]/10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || otp.length < 6}
            className="w-full py-3 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            style={{ background: "linear-gradient(135deg, #00b5d5, #00406a)" }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t.updating}
              </>
            ) : (
              t.btn
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-stone-50">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-stone-100">
        <Suspense fallback={<div className="flex justify-center p-10"><Loader2 className="w-6 h-6 animate-spin text-[#00b5d5]" /></div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
