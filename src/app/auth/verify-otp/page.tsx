"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, Shield, CheckCircle, AlertCircle, RotateCcw } from "lucide-react";
import type { KeyboardEvent,ClipboardEvent } from "react";
type LangType = "az" | "en" | "ru";

const translations = {
  az: {
    heroTitle: "Email\ntəsdiqi",
    heroDesc: "Hesabınızı aktivləşdirmək üçün emailinizə göndərilən kodu daxil edin.",
    title: "Email-i doğrulayın",
    subtitle: "Kodu emailinizə göndərdik",
    otpLabel: "Doğrulama kodu",
    verifyBtn: "Doğrula",
    checking: "Yoxlanılır...",
    resend: "Kodu yenidən göndər",
    resending: "Göndərilir...",
    backToSignIn: "Girişə qayıt",
    successTitle: "Uğurla doğrulandı!",
    successDesc: "Hesabınız aktivləşdirildi. İndi daxil ola bilərsiniz.",
    goToSignIn: "Daxil ol",
    errorInvalid: "Kod yanlışdır",
    errorExpired: "Kodun vaxtı keçib",
    errorGeneral: "Doğrulama zamanı xəta baş verdi",
    resendSuccess: "Yeni kod emailinizə göndərildi",
  },
  ru: {
    heroTitle: "Подтверждение\nEmail",
    heroDesc: "Введите код, отправленный на ваш email, чтобы активировать аккаунт.",
    title: "Подтвердите Email",
    subtitle: "Мы отправили код на ваш email",
    otpLabel: "Код подтверждения",
    verifyBtn: "Подтвердить",
    checking: "Проверка...",
    resend: "Отправить код повторно",
    resending: "Отправка...",
    backToSignIn: "Вернуться к входу",
    successTitle: "Успешно подтверждено!",
    successDesc: "Ваш аккаунт активирован. Теперь вы можете войти.",
    goToSignIn: "Войти",
    errorInvalid: "Неверный код",
    errorExpired: "Срок действия кода истёк",
    errorGeneral: "Произошла ошибка при подтверждении",
    resendSuccess: "Новый код отправлен на ваш email",
  },
  en: {
    heroTitle: "Email\nVerification",
    heroDesc: "Enter the code sent to your email to activate your account.",
    title: "Verify Your Email",
    subtitle: "We sent a code to your email",
    otpLabel: "Verification Code",
    verifyBtn: "Verify",
    checking: "Verifying...",
    resend: "Resend Code",
    resending: "Sending...",
    backToSignIn: "Back to Sign In",
    successTitle: "Successfully Verified!",
    successDesc: "Your account has been activated. You can now sign in.",
    goToSignIn: "Sign In",
    errorInvalid: "Invalid code",
    errorExpired: "Code has expired",
    errorGeneral: "An error occurred during verification",
    resendSuccess: "A new code has been sent to your email",
  },
};

function VerifyOTPContent() {
  const { language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const l = (language as LangType) || "az";
  const t = translations[l];

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) {
      const el = document.getElementById(`otp-${index + 1}`);
      el?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const el = document.getElementById(`otp-${index - 1}`);
      el?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) {
      setOtp(text.split(""));
      document.getElementById("otp-5")?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) { setError(t.errorInvalid); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message?.includes("expired") ? t.errorExpired : t.errorInvalid);
      }
    } catch {
      setError(t.errorGeneral);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    setResendMsg("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setResendMsg(t.resendSuccess);
        setOtp(["", "", "", "", "", ""]);
        document.getElementById("otp-0")?.focus();
      }
    } catch {
      /* silent */
    } finally {
      setResending(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-sm w-full text-center space-y-5 mx-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-800">{t.successTitle}</h2>
            <p className="text-sm text-stone-500 mt-2">{t.successDesc}</p>
          </div>
          <button
            onClick={() => router.push("/auth/sign-in")}
            className="w-full py-3 text-white font-bold rounded-xl transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #00b5d5, #00406a)" }}
          >
            {t.goToSignIn}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&q=85"
          alt="AF Hotel"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#00406a]/80" />
        <div className="absolute top-4 left-4 z-20 flex flex-col items-start">
          <div className="w-32 h-32 relative">
            <Image src="/loqo-af.png" alt="AF Hotel" fill className="object-contain brightness-0 invert" />
          </div>
          <span className="text-[10px] font-medium text-white/80 tracking-wider italic uppercase -mt-2">
            AF Hotel &amp; Aqua Park Resort
          </span>
        </div>
        <div className="relative z-10 flex flex-col justify-end p-12 text-white h-full">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-3 leading-tight whitespace-pre-line">{t.heroTitle}</h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-xs">{t.heroDesc}</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 lg:max-w-md flex flex-col justify-center px-8 py-12 bg-white">
        <div className="max-w-sm w-full mx-auto space-y-7">
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="w-32 h-32 relative">
              <Image src="/loqo-af.png" alt="AF Hotel" fill className="object-contain" priority />
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#1e325c]">{t.title}</h1>
            <p className="text-sm text-stone-400 mt-1">{t.subtitle}</p>
            {email && (
              <p className="text-xs text-[#00b5d5] font-semibold mt-1 break-all">{email}</p>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-100 rounded-xl">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <p className="text-xs text-rose-700 font-medium">{error}</p>
            </div>
          )}

          {resendMsg && (
            <div className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-700 font-medium">{resendMsg}</p>
            </div>
          )}

          <div className="space-y-3">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wide block">
              {t.otpLabel}
            </label>
            <div className="flex gap-2 justify-between" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl outline-none transition-all
                    ${digit ? "border-[#00b5d5] bg-[#00b5d5]/5 text-[#00406a]" : "border-stone-200 bg-stone-50 text-stone-800"}
                    focus:border-[#00b5d5] focus:bg-[#00b5d5]/5 focus:ring-2 focus:ring-[#00b5d5]/10`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleVerify}
            disabled={loading || otp.join("").length < 6}
            className="w-full py-3 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            style={{ background: "linear-gradient(135deg, #00b5d5, #00406a)" }}
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" />{t.checking}</> : t.verifyBtn}
          </button>

          <div className="flex flex-col gap-2 text-center">
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-sm text-[#00b5d5] hover:underline font-semibold flex items-center justify-center gap-1.5 disabled:opacity-60 cursor-pointer bg-transparent border-none"
            >
              {resending ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" />{t.resending}</>
              ) : (
                <><RotateCcw className="w-3.5 h-3.5" />{t.resend}</>
              )}
            </button>
            <a href="/auth/sign-in" className="text-sm text-stone-400 hover:text-stone-600 transition-colors">
              {t.backToSignIn}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#00b5d5]" /></div>}>
      <VerifyOTPContent />
    </Suspense>
  );
}
