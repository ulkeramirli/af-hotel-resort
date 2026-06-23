"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, CheckCircle, CreditCard, ShieldCheck, AlertCircle, Calendar } from "lucide-react";
import { getPublicRooms, createBooking, getBookedDates } from "@/services/api";
import type { PublicRoom } from "@/services/api";

interface AuthUser {
  id: string;
  email: string;
  name?: string;
  phone?: string;
}

function CustomDatePicker({ value, onChange, bookedDates, label }: { value: string, onChange: (d: string) => void, bookedDates: {checkIn: Date, checkOut: Date}[], label: string }) {
  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const startDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const handlePrev = (e: React.MouseEvent) => { e.preventDefault(); setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)); };
  const handleNext = (e: React.MouseEvent) => { e.preventDefault(); setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)); };

  const isBooked = (d: Date) => {
    d.setHours(0,0,0,0);
    return bookedDates.some(b => {
      const ci = new Date(b.checkIn); ci.setHours(0,0,0,0);
      const co = new Date(b.checkOut); co.setHours(0,0,0,0);
      return d >= ci && d <= co;
    });
  };

  const isPast = (d: Date) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    return d < today;
  };

  return (
    <div className="relative">
      <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1.5">{label}</label>
      <div 
        onClick={() => setOpen(!open)}
        className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b5d5] bg-white text-slate-800 cursor-pointer min-h-[46px] flex items-center justify-between"
      >
        <span>{value || "Seçin / Select"}</span>
        <Calendar className="w-4 h-4 text-stone-400" />
      </div>
      {open && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-stone-200 rounded-xl shadow-xl z-50 p-4 w-72">
          <div className="flex justify-between items-center mb-4">
            <button onClick={handlePrev} className="px-2 py-1 bg-stone-100 rounded hover:bg-stone-200 text-stone-600 font-bold">&lt;</button>
            <span className="font-bold text-sm text-[#1e325c]">
              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={handleNext} className="px-2 py-1 bg-stone-100 rounded hover:bg-stone-200 text-stone-600 font-bold">&gt;</button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d} className="text-[10px] font-bold text-stone-400">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
              const booked = isBooked(date);
              const past = isPast(date);
              const disabled = booked || past;
              const dateStr = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
              const selected = value === dateStr;

              return (
                <button
                  key={day}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!disabled) {
                      onChange(dateStr);
                      setOpen(false);
                    }
                  }}
                  disabled={disabled}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
                    ${disabled ? 'bg-stone-100 text-stone-300 cursor-not-allowed' : 
                      selected ? 'bg-[#00b5d5] text-white shadow-md' : 'hover:bg-stone-100 text-stone-700 cursor-pointer'}
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
  const { language } = useLanguage();
  const currentLang = (language as "az" | "en" | "ru") || "az";
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [step, setStep] = useState<1 | 2>(1);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const [selectedRoomId, setSelectedRoomId] = useState("");

  const [rooms, setRooms] = useState<PublicRoom[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [bookedDates, setBookedDates] = useState<{checkIn: Date, checkOut: Date}[]>([]);

  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");

  const [cardName, setCardName] = useState(user?.name || "");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  useEffect(() => {
    getPublicRooms()
      .then((data) => {
        setRooms(data);
        if (data.length > 0) setSelectedRoomId(data[0].id);
      })
      .finally(() => setLoadingRooms(false));
  }, []);

  useEffect(() => {
    if (searchParams) {
      const ci = searchParams.get("checkIn");
      const co = searchParams.get("checkOut");
      const a = searchParams.get("adults");
      const k = searchParams.get("kids");
      const rt = searchParams.get("roomType");
      const rId = searchParams.get("roomId");

      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (ci) setCheckIn(ci);
       
      if (co) setCheckOut(co);
       
      if (a) setAdults(Number(a));
       
      if (k) setKids(Number(k));
      if (rId && rooms.length > 0) {
        const match = rooms.find((r) => r.id === rId);
        if (match) setSelectedRoomId(match.id);
      } else if (rt && rooms.length > 0) {
        const match = rooms.find((r) => r.category === rt || r.title[currentLang] === rt);
        if (match) setSelectedRoomId(match.id);
      }
    }
  }, [searchParams, rooms, currentLang]);

  useEffect(() => {
    if (selectedRoomId) {
      getBookedDates(selectedRoomId).then(data => {
        setBookedDates(data.map(d => ({ checkIn: new Date(d.checkIn), checkOut: new Date(d.checkOut) })));
      }).catch(console.error);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBookedDates([]);
    }
  }, [selectedRoomId]);

  const dict = {
    title1: { az: "Otaq və Tarix Seçimi", en: "Room & Date Selection", ru: "Выбор номера и дат" }[currentLang],
    title2: { az: "Təhlükəsiz Onlayn Ödəniş", en: "Secure Online Payment", ru: "Безопасная онлайн-оплата" }[currentLang],
    roomLabel: { az: "Eksklüziv Otaq Seçimi", en: "Exclusive Room Selection", ru: "Выбор эксклюзивного номера" }[currentLang],
    adultsLabel: { az: "Böyüklər", en: "Adults", ru: "Взрослые" }[currentLang],
    kidsLabel: { az: "Uşaqlar (0-12 yaş)", en: "Children (0-12 years old)", ru: "Дети (0-12 лет)" }[currentLang],
    phoneLabel: { az: "Əlaqə nömrəsi", en: "Phone Number", ru: "Номер телефона" }[currentLang],
    emailLabel: { az: "Email", en: "Email", ru: "Email" }[currentLang],
    cardHolder: { az: "Kart Sahibinin Adı Soyadı", en: "Cardholder Name", ru: "Имя и фамилия владельца карты" }[currentLang],
    cardNumber: { az: "Kartın Nömrəsi", en: "Card Number", ru: "Номер карты" }[currentLang],
    expiry: { az: "Bitmə Tarixi", en: "Expiry Date", ru: "Срок действия" }[currentLang],
    nextBtn: { az: "Ödəniş Şöbəsinə Keç →", en: "Proceed to Payment →", ru: "Перейти к оплате →" }[currentLang],
    backBtn: { az: "Geri", en: "Back", ru: "Назад" }[currentLang],
    confirmBtn: { az: "Ödənişi Təsdiqlə", en: "Confirm Payment", ru: "Подтвердить оплату" }[currentLang],
    successTitle: { az: "Ödəniş və Rezervasiya Uğurludur!", en: "Payment & Booking Successful!", ru: "Оплата и бронирование успешны!" }[currentLang],
    successDesc: { az: "Məlumatlar dərhal sistem menecerinin admin panelinə göndərildi.", en: "Data has been instantly sent to the admin panel.", ru: "Данные мгновенно отправлены в админ-панель." }[currentLang],
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
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
      notes: `Adults: ${adults}, Kids: ${kids}. Payment: Online Card (${cardNumber.slice(-4)})`,
      status: "pending"
    };

    try {
      const res = await createBooking(payload);
      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.message || "Xəta baş verdi");
      }
    } catch (err: any) {
      setError(err.message || "Xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section id="booking" className="py-24 bg-white text-center flex flex-col items-center justify-center px-4 animate-in fade-in duration-500">
        <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
        <h3 className="text-2xl font-bold text-slate-800">{dict.successTitle}</h3>
        <p className="text-sm text-stone-500 mt-2 max-w-md">{dict.successDesc}</p>
      </section>
    );
  }

  return (
    <section id="booking" className="py-24 md:py-32 bg-stone-50/60 border-t border-stone-200/50 scroll-mt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center gap-4 mb-10 text-xs font-bold tracking-widest text-stone-400">
          <span className={step === 1 ? "text-[#00b5d5]" : "text-emerald-500"}>1. DETAILS</span>
          <div className="w-12 h-px bg-stone-300" />
          <span className={step === 2 ? "text-[#00b5d5]" : ""}>2. SECURE PAYMENT</span>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-4 bg-rose-50 border border-rose-100 rounded-2xl mb-6 shadow-sm">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
            <p className="text-sm text-rose-700 font-medium">{error}</p>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleNextStep} className="bg-white border border-stone-200/80 p-6 md:p-10 rounded-3xl shadow-xl space-y-6">
            <h2 className="text-xl font-bold text-[#1e325c] border-b border-stone-100 pb-3">{dict.title1}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CustomDatePicker label="Check-In" value={checkIn} onChange={setCheckIn} bookedDates={bookedDates} />
              <CustomDatePicker label="Check-Out" value={checkOut} onChange={setCheckOut} bookedDates={bookedDates} />
            </div>

            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1.5">{dict.roomLabel}</label>
              <select required value={selectedRoomId} onChange={(e) => setSelectedRoomId(e.target.value)} className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b5d5] bg-white text-slate-800 cursor-pointer">
                {loadingRooms && <option value="">Loading...</option>}
                {!loadingRooms && rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title[currentLang]} - ${r.price}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1.5">{dict.adultsLabel}</label>
                <select value={adults} onChange={(e) => setAdults(Number(e.target.value))} className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm bg-white text-slate-800 outline-none">
                  {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1.5">{dict.kidsLabel}</label>
                <select value={kids} onChange={(e) => setKids(Number(e.target.value))} className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm bg-white text-slate-800 outline-none">
                  {[0, 1, 2, 3].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1.5">{dict.emailLabel}</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@mail.com" className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b5d5] bg-white text-slate-800" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1.5">{dict.phoneLabel}</label>
                <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+994" className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b5d5] bg-white text-slate-800" />
              </div>
            </div>

            <button type="submit" className="w-full bg-[#00b5d5] hover:bg-[#009cae] text-white font-bold text-xs uppercase tracking-widest py-4 rounded-xl shadow-md transition-transform duration-150 active:scale-[0.98] cursor-pointer mt-4">
              {dict.nextBtn}
            </button>
          </form>
        ) : (
          <form onSubmit={handleFinalSubmit} className="bg-white border border-stone-200/80 p-6 md:p-10 rounded-3xl shadow-xl space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h2 className="text-xl font-bold text-[#1e325c] flex items-center gap-2"><CreditCard className="w-5 h-5 text-[#00b5d5]" /> {dict.title2}</h2>
              <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2.5 py-1 rounded-md flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> SSL Secured</span>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-600">Total Price:</span>
                <span className="text-xl font-bold text-slate-800">
                  ${rooms.find(r => r.id === selectedRoomId)?.price || 0}
                  <span className="text-xs text-slate-400 font-normal ml-1">/ night</span>
                </span>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1.5">{dict.cardHolder}</label>
              <input type="text" required value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="JOHN DOE" className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b5d5] bg-white uppercase text-slate-800 placeholder-stone-300" />
            </div>

            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1.5">{dict.cardNumber}</label>
              <input type="text" required maxLength={16} value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))} placeholder="4129 0000 0000 0000" className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b5d5] bg-white text-slate-800 placeholder-stone-300 tracking-widest" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1.5">{dict.expiry}</label>
                <input type="text" required maxLength={5} placeholder="MM/YY" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b5d5] bg-white text-slate-800 text-center" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1.5">CVC / CVC2</label>
                <input type="password" required maxLength={3} placeholder="***" value={cardCvc} onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ""))} className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b5d5] bg-white text-slate-800 text-center tracking-[0.2em]" />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={() => setStep(1)} className="w-1/3 bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold text-xs uppercase tracking-widest py-4 rounded-xl transition-colors cursor-pointer">
                {dict.backBtn}
              </button>
              <button type="submit" disabled={loading} className="w-2/3 bg-[#ff6c02] hover:bg-[#e55f00] disabled:bg-stone-300 text-white font-bold text-xs uppercase tracking-widest py-4 rounded-xl shadow-md transition-all duration-150 active:scale-[0.98] flex justify-center items-center gap-2 cursor-pointer">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : dict.confirmBtn}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

export default function Booking() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#00b5d5]" /></div>}>
      <BookingContent />
    </Suspense>
  );
}