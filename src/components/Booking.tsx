 
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2, CheckCircle, CreditCard, ShieldCheck } from 'lucide-react';

interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export default function Booking() {
  const { user } = useAuth() as { user: AuthUser | null };
  const { language } = useLanguage();
  const currentLang = (language as 'az' | 'en' | 'ru') || 'az';
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);


  const [step, setStep] = useState<1 | 2>(1);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState('1');
  
  // Поля банковской карты
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');


  // Мультиязычные тексты для самого модуля бронирования
  const dict = {
    title1: { az: 'Otaq və Tarix Seçimi', en: 'Room & Date Selection', ru: 'Выбор номера и дат' }[currentLang],
    title2: { az: 'Təhlükəsiz Onlayn Ödəniş', en: 'Secure Online Payment', ru: 'Безопасная онлайн-оплата' }[currentLang],
    roomLabel: { az: 'Eksklüziv Otaq Seçimi', en: 'Exclusive Room Selection', ru: 'Выбор эксклюзивного номера' }[currentLang],
    adultsLabel: { az: 'Böyüklər', en: 'Adults', ru: 'Взрослые' }[currentLang],
    // Чёткое обозначение возрастной категории для детей (0-12 yaş / 0-12 years / 0-12 лет)
    kidsLabel: { 
      az: 'Uşaqlar (0-12 yaş)', 
      en: 'Children (0-12 years old)', 
      ru: 'Дети (0-12 лет)' 
    }[currentLang],
    cardHolder: { az: 'Kart Sahibinin Adı Soyadı', en: 'Cardholder Name', ru: 'Имя и фамилия владельца карты' }[currentLang],
    cardNumber: { az: 'Kartın Nömrəsi', en: 'Card Number', ru: 'Номер карты' }[currentLang],
    expiry: { az: 'Bitmə Tarixi', en: 'Expiry Date', ru: 'Срок действия' }[currentLang],
    nextBtn: { az: 'Ödəniş Şöbəsinə Keç →', en: 'Proceed to Payment →', ru: 'Перейти к оплате →' }[currentLang],
    backBtn: { az: 'Geri', en: 'Back', ru: 'Назад' }[currentLang],
    confirmBtn: { az: 'Ödənişi Təsdiqlə', en: 'Confirm Payment', ru: 'Подтвердить оплату' }[currentLang],
    successTitle: { az: 'Ödəniş və Rezervasiya Uğurludur!', en: 'Payment & Booking Successful!', ru: 'Оплата и бронирование успешны!' }[currentLang],
    successDesc: { az: 'Məlumatlar dərhal sistem menecerinin admin panelinə göndərildi.', en: 'Data has been instantly sent to the admin panel.', ru: 'Данные мгновенно отправлены в админ-панель.' }[currentLang]
  };

  const availableRooms = [
    { id: '1', name: 'Premium Single Room', type: 'Single' },
    { id: '2', name: 'Standard Double Room', type: 'Standard Double' },
    { id: '3', name: 'Standard Twin Room', type: 'Standard Twin' },
    { id: '4', name: 'Family Apartments for 4', type: 'Apartments for 4' }
  ];

  useEffect(() => {
    const handleHeroData = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setCheckIn(customEvent.detail.checkIn || '');
        setCheckOut(customEvent.detail.checkOut || '');
        setAdults(customEvent.detail.adults || 1);
        setKids(customEvent.detail.kids || 0);
      }
    };
    window.addEventListener('fillHeroBooking', handleHeroData);
    return () => window.removeEventListener('fillHeroBooking', handleHeroData);
  }, []);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const targetRoom = availableRooms.find(r => r.id === selectedRoom);

    // Логика формирования данных под твою админку
    const adminBookingPayload = {
      guest: user?.name || user?.email || cardName || 'Anonim Qonaq',
      room: targetRoom ? targetRoom.name : 'Standart Otaq',
      roomType: targetRoom ? targetRoom.type : 'Standart',
      checkIn: checkIn,
      checkOut: checkOut,
      status: 'Gözləyir', 
      paymentMethod: 'Card Online',
      details: { adults, kids }
    };

    try {
      // Здесь отправка на бэкенд в Prisma/API
      // await createBooking(adminBookingPayload);
      console.log('Отправлено в админку:', adminBookingPayload);
      
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSuccess(true);
    } catch (err) {
      console.error(err);
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
          <span className={step === 1 ? 'text-[#00b5d5]' : 'text-emerald-500'}>1. DETAILS</span>
          <div className="w-12 h-px bg-stone-300" />
          <span className={step === 2 ? 'text-[#00b5d5]' : ''}>2. SECURE PAYMENT</span>
        </div>

        {step === 1 ? (
          <form onSubmit={handleNextStep} className="bg-white border border-stone-200/80 p-6 md:p-10 rounded-3xl shadow-xl space-y-6">
            <h2 className="text-xl font-bold text-[#1e325c] border-b border-stone-100 pb-3">{dict.title1}</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1.5">Check-In</label>
                <input type="date" required value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b5d5] bg-white text-slate-800" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1.5">Check-Out</label>
                <input type="date" required value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b5d5] bg-white text-slate-800" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1.5">{dict.roomLabel}</label>
              <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)} className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b5d5] bg-white text-slate-800 cursor-pointer">
                {availableRooms.map(r => <option key={r.id} value={r.id}>{r.name} ({r.type})</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1.5">{dict.adultsLabel}</label>
                <select value={adults} onChange={(e) => setAdults(Number(e.target.value))} className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm bg-white text-slate-800 outline-none">{[1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}</select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1.5">{dict.kidsLabel}</label>
                <select value={kids} onChange={(e) => setKids(Number(e.target.value))} className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm bg-white text-slate-800 outline-none">{[0,1,2,3].map(n => <option key={n} value={n}>{n}</option>)}</select>
              </div>
            </div>

            <button type="submit" className="w-full bg-[#00b5d5] hover:bg-[#009cae] text-white font-bold text-xs uppercase tracking-widest py-4 rounded-xl shadow-md transition-transform duration-150 active:scale-[0.98] cursor-pointer">
              {dict.nextBtn}
            </button>
          </form>
        ) : (
          <form onSubmit={handleFinalSubmit} className="bg-white border border-stone-200/80 p-6 md:p-10 rounded-3xl shadow-xl space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h2 className="text-xl font-bold text-[#1e325c] flex items-center gap-2"><CreditCard className="w-5 h-5 text-[#00b5d5]" /> {dict.title2}</h2>
              <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2.5 py-1 rounded-md flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> SSL Secured</span>
            </div>

            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1.5">{dict.cardHolder}</label>
              <input type="text" required value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="JOHN DOE" className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b5d5] bg-white uppercase text-slate-800 placeholder-stone-300" />
            </div>

            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1.5">{dict.cardNumber}</label>
              <input type="text" required maxLength={16} value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))} placeholder="4129 0000 0000 0000" className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b5d5] bg-white text-slate-800 placeholder-stone-300" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1.5">{dict.expiry}</label>
                <input type="text" required maxLength={5} placeholder="MM/YY" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b5d5] bg-white text-slate-800 text-center" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1.5">CVC / CVC2</label>
                <input type="password" required maxLength={3} placeholder="***" value={cardCvc} onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))} className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b5d5] bg-white text-slate-800 text-center" />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
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