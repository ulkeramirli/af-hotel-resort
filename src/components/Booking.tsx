"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import {
  Loader2,
  CheckCircle,
  CreditCard,
  ShieldCheck,
  AlertCircle,
  Calendar,
} from "lucide-react";
import dynamic from "next/dynamic";
import { getPublicRooms, createPayment, getBookedDates } from "@/services/api";
import type { PublicRoom } from "@/services/api";
import ErrorBoundary from "@/components/ErrorBoundary";

interface AuthUser {
  id: string;
  email: string;
  name?: string;
  phone?: string;
}

function CustomDatePicker({
  value,
  onChange,
  bookedDates,
  label,
  lang,
}: {
  value: string;
  onChange: (d: string) => void;
  bookedDates: { checkIn: Date; checkOut: Date }[];
  label: string;
  lang: string;
}) {
  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  ).getDate();
  const startDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1,
  ).getDay();

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };
  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  const isBooked = (d: Date) => {
    d.setHours(0, 0, 0, 0);
    return bookedDates.some((b) => {
      const ci = new Date(b.checkIn);
      ci.setHours(0, 0, 0, 0);
      const co = new Date(b.checkOut);
      co.setHours(0, 0, 0, 0);
      return d >= ci && d <= co;
    });
  };

  const isPast = (d: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d < today;
  };

  const localeStr = lang === 'ru' ? 'ru-RU' : lang === 'az' ? 'az-AZ' : 'en-US';
  const weekDays = {
    az: ["B", "Be", "Ça", "Ç", "Ca", "C", "Ş"],
    ru: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    en: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
  }[lang as "az" | "en" | "ru"] || ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className="relative w-full group">
      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block mb-2 ml-1 transition-colors group-focus-within:text-[#00b5d5]">
        {label}
      </label>
      <div
        onClick={() => setOpen(!open)}
        className="w-full bg-white hover:bg-stone-50 border border-stone-200/80 hover:border-[#00b5d5]/50 rounded-2xl px-5 h-14 text-sm outline-none focus:border-[#00b5d5] focus:ring-4 focus:ring-[#00b5d5]/10 text-slate-800 cursor-pointer flex items-center justify-between shadow-sm transition-all duration-300"
      >
        <span className="font-medium text-slate-700">{value || (lang === 'ru' ? "Выберите" : lang === 'az' ? "Seçin" : "Select")}</span>
        <Calendar className="w-5 h-5 text-stone-400 group-hover:text-[#00b5d5] transition-colors duration-300" />
      </div>
      {open && (
        <div className="absolute top-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-0 bg-white/95 backdrop-blur-xl border border-stone-200/60 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] p-5 z-50 w-[calc(100vw-4rem)] sm:w-85 max-w-85 animate-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-5 px-1">
            <button onClick={handlePrev} className="w-8 h-8 flex items-center justify-center bg-stone-100/50 hover:bg-[#00b5d5]/10 hover:text-[#00b5d5] rounded-full text-stone-600 font-bold transition-colors">&lt;</button>
            <span className="font-bold text-[15px] text-[#1e325c] tracking-tight capitalize">
              {currentMonth.toLocaleString(localeStr, { month: "long", year: "numeric" })}
            </span>
            <button onClick={handleNext} className="w-8 h-8 flex items-center justify-center bg-stone-100/50 hover:bg-[#00b5d5]/10 hover:text-[#00b5d5] rounded-full text-stone-600 font-bold transition-colors">&gt;</button>
          </div>
          <div className="grid grid-cols-7 gap-1.5 text-center mb-3">
            {weekDays.map((d) => (
              <div key={d} className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
              const booked = isBooked(date);
              const past = isPast(date);
              const disabled = booked || past;
              const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const selected = value === dateStr;

              return (
                <button
                  key={day}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!disabled) { onChange(dateStr); setOpen(false); }
                  }}
                  disabled={disabled}
                  className={`w-9 h-9 sm:w-10 sm:h-10 mx-auto rounded-full flex items-center justify-center text-[13px] font-semibold transition-all duration-200
                    ${disabled ? "bg-stone-50/50 text-stone-300 cursor-not-allowed line-through decoration-stone-300/50" 
                      : selected ? "bg-[#00b5d5] text-white shadow-lg shadow-[#00b5d5]/30 scale-110" 
                      : "hover:bg-[#00b5d5]/10 text-stone-700 cursor-pointer hover:scale-105"}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function BookingContent() {
  const { user } = useAuth() as { user: AuthUser | null };
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language } = useLanguage();
  const { currency } = useCurrency();
  const currentLang = (language as "az" | "en" | "ru") || "az";
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rates, setRates] = useState<{ usd: number; eur: number } | null>(null);

  useEffect(() => {
    fetch("/api/exchange-rates")
      .then(res => res.headers.get("content-type")?.includes("application/json") ? res.json() : { success: false })
      .then(data => {
        if (data.success) setRates(data.data);
      })
      .catch(console.error);
  }, []);

  const loc = (obj: any) => {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return obj[currentLang] || obj.az || "";
  };

  const [step, setStep] = useState<1 | 2>(1);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const [selectedRoomId, setSelectedRoomId] = useState("");

  const [rooms, setRooms] = useState<PublicRoom[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [bookedDates, setBookedDates] = useState<
    { checkIn: Date; checkOut: Date }[]
  >([]);

  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");

  const [cardName, setCardName] = useState(user?.name || "");

  useEffect(() => {
    getPublicRooms()
      .then((data) => {
        setRooms(data);
        if (data.length > 0) setSelectedRoomId(data[0].id);
      })
      .finally(() => setLoadingRooms(false));
  }, []);

  useEffect(() => {
    // 1. Try loading from localStorage first
    let hasDraft = false;
    const saved = localStorage.getItem("af_booking_draft");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.checkIn) setCheckIn(parsed.checkIn);
        if (parsed.checkOut) setCheckOut(parsed.checkOut);
        if (parsed.adults) setAdults(parsed.adults);
        if (parsed.kids) setKids(parsed.kids);
        if (parsed.selectedRoomId && rooms.some(r => r.id === parsed.selectedRoomId)) {
           setSelectedRoomId(parsed.selectedRoomId);
        }
        if (parsed.phone && !phone) setPhone(parsed.phone);
        if (parsed.email && !email) setEmail(parsed.email);
        hasDraft = true;
      } catch (e) {}
    }

    // 2. Override with searchParams if any
    if (searchParams && searchParams.toString() !== "") {
      const ci = searchParams.get("checkIn");
      const co = searchParams.get("checkOut");
      const a = searchParams.get("adults");
      const k = searchParams.get("kids");
      const rt = searchParams.get("roomType");
      const rId = searchParams.get("roomId");

      if (ci) setCheckIn(ci);
      if (co) setCheckOut(co);
      if (a) setAdults(Number(a));
      if (k) setKids(Number(k));
      if (rId && rooms.length > 0) {
        const match = rooms.find((r) => r.id === rId);
        if (match) setSelectedRoomId(match.id);
      } else if (rt && rooms.length > 0) {
        const match = rooms.find(
          (r) => r.category === rt || r.title[currentLang] === rt,
        );
        if (match) setSelectedRoomId(match.id);
      }
    }
  }, [searchParams, rooms, currentLang]);

  // Save to localStorage whenever form data changes
  useEffect(() => {
    if (checkIn || checkOut || selectedRoomId) {
      const draft = { checkIn, checkOut, adults, kids, selectedRoomId, phone, email };
      localStorage.setItem("af_booking_draft", JSON.stringify(draft));
    }
  }, [checkIn, checkOut, adults, kids, selectedRoomId, phone, email]);

  useEffect(() => {
    if (selectedRoomId) {
      getBookedDates(selectedRoomId)
        .then((data) => {
          setBookedDates(
            data.map((d) => ({
              checkIn: new Date(d.checkIn),
              checkOut: new Date(d.checkOut),
            })),
          );
        })
        .catch(console.error);
    } else {
      setBookedDates([]);
    }

    const match = rooms.find((r) => r.id === selectedRoomId);
    if (match) {
      const cap = match.rawCapacity || 4;
      if (adults > cap) {
        setAdults(cap);
        setKids(0);
      } else if (adults + kids > cap) {
        setKids(cap - adults);
      }
    }
  }, [selectedRoomId, rooms, adults, kids]);

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);
  const maxCapacity = selectedRoom?.rawCapacity || 4;
  const adultsOptions = Array.from({ length: maxCapacity }, (_, i) => i + 1);
  const kidsOptions = Array.from(
    { length: Math.max(1, maxCapacity - adults + 1) },
    (_, i) => i,
  );

  const dict = {
    title1: {
      az: "Otaq və Tarix Seçimi",
      en: "Room & Date Selection",
      ru: "Выбор номера и дат",
    }[currentLang],
    title2: {
      az: "Təhlükəsiz Onlayn Ödəniş",
      en: "Secure Online Payment",
      ru: "Безопасная онлайн-оплата",
    }[currentLang],
    roomLabel: {
      az: "Eksklüziv Otaq Seçimi",
      en: "Exclusive Room Selection",
      ru: "Выбор эксклюзивного номера",
    }[currentLang],
    adultsLabel: { az: "Böyüklər", en: "Adults", ru: "Взрослые" }[currentLang],
    kidsLabel: {
      az: "Uşaqlar (0-12 yaş)",
      en: "Children (0-12 years old)",
      ru: "Дети (0-12 лет)",
    }[currentLang],
    phoneLabel: {
      az: "Əlaqə nömrəsi",
      en: "Phone Number",
      ru: "Номер телефона",
    }[currentLang],
    emailLabel: { az: "Email", en: "Email", ru: "Email" }[currentLang],
    cardHolder: {
      az: "Kart Sahibinin Adı Soyadı",
      en: "Cardholder Name",
      ru: "Имя и фамилия владельца карты",
    }[currentLang],
    cardNumber: { az: "Kartın Nömrəsi", en: "Card Number", ru: "Номер карты" }[
      currentLang
    ],
    expiry: { az: "Bitmə Tarixi", en: "Expiry Date", ru: "Срок действия" }[
      currentLang
    ],
    nextBtn: {
      az: "Ödəniş Şöbəsinə Keç →",
      en: "Proceed to Payment →",
      ru: "Перейти к оплате →",
    }[currentLang],
    backBtn: { az: "Geri", en: "Back", ru: "Назад" }[currentLang],
    confirmBtn: {
      az: "Epoint ilə ödəniş et",
      en: "Pay with Epoint",
      ru: "Оплатить через Epoint",
    }[currentLang],
    successTitle: {
      az: "Ödəniş və Rezervasiya Uğurludur!",
      en: "Payment & Booking Successful!",
      ru: "Оплата и бронирование успешны!",
    }[currentLang],
    successDesc: {
      az: "Məlumatlar dərhal sistem menecerinin admin panelinə göndərildi.",
      en: "Data has been instantly sent to the admin panel.",
      ru: "Данные мгновенно отправлены в админ-панель.",
    }[currentLang],
    robot: {
      az: "Mən robot deyiləm",
      en: "I am not a robot",
      ru: "Я не робот",
    }[currentLang],
    totalPrice: {
      az: "Ümumi Qiymət:",
      en: "Total Price:",
      ru: "Итоговая цена:",
    }[currentLang],
    checkIn: {
      az: "Giriş Tarixi",
      en: "Check-In Date",
      ru: "Дата заезда",
    }[currentLang],
    checkOut: {
      az: "Çıxış Tarixi",
      en: "Check-Out Date",
      ru: "Дата выезда",
    }[currentLang],
    loginToBook: {
      az: "Rezervasiya etmək üçün daxil olun",
      en: "Log in to book",
      ru: "Войдите, чтобы забронировать",
    }[currentLang],
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }
    if (!checkIn || !checkOut || !selectedRoomId || !phone || !email) {
      setError("Zəhmət olmasa bütün xanaları doldurun.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      guestName: cardName || user?.name || "Anonim Qonaq",
      email: email,
      phone: phone,
      room: selectedRoomId,
      checkIn: checkIn,
      checkOut: checkOut,
      notes: `Adults: ${adults}, Kids: ${kids}`,
      status: "pending",
      currency: currency === "USD" ? "USD" : currency === "EUR" ? "EUR" : "AZN",
      language: currentLang,
    };
    try {
      const res = await createPayment(payload);

      console.log("Payment Response:", res);

      if (!res.success) {
        setError(res.message || "Xəta baş verdi");
        return;
      }

      const redirectUrl = res.payment?.redirect_url || res.payment?.redirectUrl;

      if (!redirectUrl) {
        console.error("Redirect URL not found:", res);
        setError("Epoint redirect URL tapılmadı.");
        return;
      }

      window.location.href = redirectUrl;
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="py-16 bg-white/80 backdrop-blur-2xl rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-white text-center flex flex-col items-center justify-center px-6 animate-in zoom-in-95 duration-500 max-w-2xl mx-auto">
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-8">
          <CheckCircle className="w-12 h-12 text-emerald-500" />
        </div>
        <h3 className="text-3xl font-bold text-[#1e325c] mb-3">
          {dict.successTitle}
        </h3>
        <p className="text-base text-stone-500 max-w-md">
          {dict.successDesc}
        </p>
      </div>
    );
  }

  const nights = checkIn && checkOut ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))) : 1;
  const roomPriceUsd = rooms.find((r) => r.id === selectedRoomId)?.priceUsd || 0;
  const roomPriceEur = rooms.find((r) => r.id === selectedRoomId)?.priceEur || 0;
  const roomPriceAzn = rooms.find((r) => r.id === selectedRoomId)?.price || 0;
  
  const totalUsd = roomPriceUsd * nights;
  const totalEur = roomPriceEur * nights;
  const totalAzn = roomPriceAzn * nights;

  return (
    <div className="w-full relative scroll-mt-20">
      <div className="w-full mx-auto px-0 md:px-2">
        <div className="flex justify-center items-center gap-2 sm:gap-4 mb-10 sm:mb-14 relative z-10">
          <div className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold tracking-widest transition-all duration-500 ${step === 1 ? "bg-[#00b5d5] text-white shadow-[0_10px_20px_-10px_rgba(0,181,213,0.5)] scale-105" : "bg-white text-stone-400 hover:bg-stone-50 border border-stone-100 shadow-sm"}`}>
            <span className={`flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full text-[10px] sm:text-[11px] ${step === 1 ? "bg-white/20" : "bg-stone-100"}`}>1</span>
            <span className="hidden sm:inline">DETAILS</span>
          </div>
          <div className="w-6 sm:w-12 h-px bg-stone-300" />
          <div className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold tracking-widest transition-all duration-500 ${step === 2 ? "bg-[#00b5d5] text-white shadow-[0_10px_20px_-10px_rgba(0,181,213,0.5)] scale-105" : "bg-white text-stone-400 hover:bg-stone-50 border border-stone-100 shadow-sm"}`}>
            <span className={`flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full text-[10px] sm:text-[11px] ${step === 2 ? "bg-white/20" : "bg-stone-100"}`}>2</span>
            <span className="hidden sm:inline">PAYMENT</span>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl mb-8 shadow-sm animate-in fade-in slide-in-from-top-4">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <p className="text-sm text-rose-700 font-medium leading-relaxed">{error}</p>
          </div>
        )}

        {step === 1 ? (
          <form
            onSubmit={handleNextStep}
            className="bg-white/90 backdrop-blur-2xl border border-stone-100 p-6 sm:p-10 md:p-12 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] space-y-6 sm:space-y-8 relative overflow-hidden"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1e325c] border-b border-stone-100 pb-6 text-center sm:text-left tracking-tight">
              {dict.title1}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <CustomDatePicker
                label={dict.checkIn || "Check-In"}
                value={checkIn}
                onChange={setCheckIn}
                bookedDates={bookedDates}
                lang={currentLang}
              />
              <CustomDatePicker
                label={dict.checkOut || "Check-Out"}
                value={checkOut}
                onChange={setCheckOut}
                bookedDates={bookedDates}
                lang={currentLang}
              />
            </div>

            <div className="group">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block mb-2 ml-1 transition-colors group-focus-within:text-[#00b5d5]">
                {dict.roomLabel}
              </label>
              <select
                required
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                className="w-full bg-white hover:bg-stone-50 border border-stone-200/80 hover:border-[#00b5d5]/50 rounded-2xl px-5 h-14 text-sm outline-none focus:border-[#00b5d5] focus:ring-4 focus:ring-[#00b5d5]/10 text-slate-800 cursor-pointer shadow-sm transition-all duration-300 font-medium appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.2rem center', backgroundSize: '1.2em 1.2em' }}
              >
                {loadingRooms && <option value="">Loading...</option>}
                {!loadingRooms &&
                  rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {loc(r.title)} - {currency === "USD" ? `$${r.priceUsd || 0}` : currency === "EUR" ? `€${r.priceEur || 0}` : `${r.price} ₼`}
                    </option>
                  ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <div className="group">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block mb-2 ml-1 transition-colors group-focus-within:text-[#00b5d5]">
                  {dict.adultsLabel}
                </label>
                <select
                  value={adults}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setAdults(val);
                    if (val + kids > maxCapacity) {
                      setKids(maxCapacity - val);
                    }
                  }}
                  className="w-full bg-white hover:bg-stone-50 border border-stone-200/80 hover:border-[#00b5d5]/50 rounded-2xl px-5 h-14 text-sm outline-none focus:border-[#00b5d5] focus:ring-4 focus:ring-[#00b5d5]/10 text-slate-800 cursor-pointer shadow-sm transition-all duration-300 font-medium appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.2rem center', backgroundSize: '1.2em 1.2em' }}
                >
                  {adultsOptions.map((n) => (
                    <option key={`adult-${n}`} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <div className="group">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block mb-2 ml-1 transition-colors group-focus-within:text-[#00b5d5]">
                  {dict.kidsLabel}
                </label>
                <select
                  value={kids}
                  onChange={(e) => setKids(Number(e.target.value))}
                  className="w-full bg-white hover:bg-stone-50 border border-stone-200/80 hover:border-[#00b5d5]/50 rounded-2xl px-5 h-14 text-sm outline-none focus:border-[#00b5d5] focus:ring-4 focus:ring-[#00b5d5]/10 text-slate-800 cursor-pointer shadow-sm transition-all duration-300 font-medium appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.2rem center', backgroundSize: '1.2em 1.2em' }}
                >
                  {kidsOptions.map((n) => (
                    <option key={`kid-${n}`} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <div className="group">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block mb-2 ml-1 transition-colors group-focus-within:text-[#00b5d5]">
                  {dict.emailLabel}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@mail.com"
                  className="w-full bg-white hover:bg-stone-50 border border-stone-200/80 hover:border-[#00b5d5]/50 rounded-2xl px-5 h-14 text-sm outline-none focus:border-[#00b5d5] focus:ring-4 focus:ring-[#00b5d5]/10 text-slate-800 shadow-sm transition-all duration-300 placeholder:text-stone-300 font-medium"
                />
              </div>
              <div className="group">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block mb-2 ml-1 transition-colors group-focus-within:text-[#00b5d5]">
                  {dict.phoneLabel}
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^\d+]/g, ''))}
                  placeholder="+994"
                  className="w-full bg-white hover:bg-stone-50 border border-stone-200/80 hover:border-[#00b5d5]/50 rounded-2xl px-5 h-14 text-sm outline-none focus:border-[#00b5d5] focus:ring-4 focus:ring-[#00b5d5]/10 text-slate-800 shadow-sm transition-all duration-300 placeholder:text-stone-300 font-medium"
                />
              </div>
            </div>

            <button
              type={user ? "submit" : "button"}
              onClick={!user ? (e) => { e.preventDefault(); router.push("/login"); } : undefined}
              className="w-full bg-[#00b5d5] hover:bg-[#00a0bc] text-white font-bold text-sm uppercase tracking-widest py-4 sm:py-5 rounded-2xl shadow-[0_10px_20px_-10px_rgba(0,181,213,0.6)] transition-all duration-200 active:scale-[0.98] mt-6 flex justify-center items-center group"
            >
              {!user ? dict.loginToBook : dict.nextBtn}
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleFinalSubmit}
            className="bg-white/90 backdrop-blur-2xl border border-stone-100 p-6 sm:p-10 md:p-12 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-right-4 duration-300"
          >
            <div className="flex justify-between items-center border-b border-stone-100 pb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1e325c] flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-[#00b5d5]" /> {dict.title2}
              </h2>
              <span className="text-[10px] sm:text-xs bg-emerald-50 text-emerald-600 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> SSL Secured
              </span>
            </div>

            <div className="bg-linear-to-br from-slate-50 to-stone-50 border border-slate-200/60 rounded-3xl p-6 mb-6 shadow-inner">
              <div className="flex flex-row justify-between items-center gap-4">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                  {dict.totalPrice}
                </span>
                <div className="text-right">
                  <span className="text-xl font-bold text-slate-800">
                    {currency === "USD" ? `$${totalUsd}` : currency === "EUR" ? `€${totalEur}` : `${totalAzn} ₼`}
                    <span className="text-xs text-slate-400 font-normal ml-1">
                      ({nights} {currentLang === 'az' ? 'gecə' : currentLang === 'ru' ? 'ночей' : 'nights'})
                    </span>
                  </span>
                  {currency === "USD" && rates?.usd && (
                    <div className="text-xs text-stone-500 font-normal mt-1">
                      (≈ {(totalUsd * rates.usd).toFixed(2)} ₼)
                    </div>
                  )}
                  {currency === "EUR" && rates?.eur && (
                    <div className="text-xs text-stone-500 font-normal mt-1">
                      (≈ {(totalEur * rates.eur).toFixed(2)} ₼)
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold text-xs sm:text-sm uppercase tracking-widest py-4 sm:py-5 rounded-2xl transition-colors"
              >
                {dict.backBtn}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 bg-linear-to-r from-[#ff6c02] to-[#ff8c3a] hover:from-[#e55f00] hover:to-[#ff6c02] disabled:from-stone-300 disabled:to-stone-400 text-white font-bold text-xs sm:text-sm uppercase tracking-widest py-4 sm:py-5 rounded-2xl shadow-[0_10px_20px_-10px_rgba(255,108,2,0.6)] transition-all duration-200 active:scale-[0.98] flex justify-center items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  dict.confirmBtn
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function Booking({ standalone = false }: { standalone?: boolean }) {
  return (
    <div id="booking" className={`w-full relative z-30 px-3 sm:px-4 md:px-8 max-w-5xl mx-auto ${standalone ? "py-20" : "-mt-32 pb-20"}`}>
      <Suspense fallback={
        <div className="min-h-[30vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#00b5d5]" />
        </div>
      }>
        <BookingContent />
      </Suspense>
    </div>
  );
}
