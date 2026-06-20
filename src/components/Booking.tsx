'use client';
import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';


export default function Booking() {
  const { language } = useLanguage();
  const currentLang = (language as 'az' | 'en' | 'ru') || 'az';
  const session: any = null;
  
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    roomType: '',
    checkIn: '',
    checkOut: '',
    fullName: '',
    phone: '',
    adults: 1,
    kids: 0
  });

  const today = new Date().toISOString().split('T')[0];
  const cleanedSessionName = session?.user?.name
    ? session.user.name.replace(/[^a-zA-Zа-яА-ЯёЁçÇəƏğĞıIöÖşŞüÜ\s-]/g, '')
    : '';

  useEffect(() => {
    const handleAutoSelect = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setFormData((prev) => ({ ...prev, roomType: customEvent.detail }));
      }
    };

    // Слушаем данные из Hero (срабатывает автоматически при заполнении)
    const handleHeroData = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        const { checkIn, checkOut, adults, kids } = customEvent.detail;
        setFormData((prev) => ({
          ...prev,
          checkIn: checkIn || prev.checkIn,
          checkOut: checkOut || prev.checkOut,
          adults: adults ?? prev.adults,
          kids: kids ?? prev.kids
        }));
      }
    };

    window.addEventListener('selectRoomForBooking', handleAutoSelect);
    window.addEventListener('heroBookingData', handleHeroData);
    
    return () => {
      window.removeEventListener('selectRoomForBooking', handleAutoSelect);
      window.removeEventListener('heroBookingData', handleHeroData);
    };
  }, []);

  const content = {
    tag: { az: 'RESERVASYON', en: 'RESERVATION', ru: 'БРОНИРОВАНИЕ' }[currentLang],
    title: { az: 'Lüksü İndi Sifariş Edin', en: 'Book Your Luxury Stay', ru: 'Забронируйте Свой Отдых' }[currentLang],
    desc: { az: 'Arzularınızdakı tətili qabaqcadan planlaşdırın və xüsusi endirimlərdən yararlanın.', en: 'Plan your dream vacation in advance and enjoy exclusive premium rates.', ru: 'Спланируйте отдых вашей мечты заранее и воспользуйтесь эксклюзивными тарифами.' }[currentLang],
    roomLabel: { az: 'Otaq Tipi', en: 'Room Type', ru: 'Тип Номера' }[currentLang],
    selectPlaceholder: { az: 'Otaq tipini seçin', en: 'Select room type', ru: 'Выберите тип номера' }[currentLang],
    dateIn: { az: 'Giriş Tarixi', en: 'Check-In Date', ru: 'Дата Заезда' }[currentLang],
    dateOut: { az: 'Çıxış Tarixi', en: 'Check-Out Date', ru: 'Дата Выезда' }[currentLang],
    nameLabel: { az: 'Tam Adınız', en: 'Full Name', ru: 'Полное Имя' }[currentLang],
    phoneLabel: { az: 'Telefon Nömrəsi', en: 'Phone Number', ru: 'Номер Телефона' }[currentLang],
    btnSubmit: { az: 'Rezervasiyanı Təsdiqlə', en: 'Confirm Reservation', ru: 'Подтвердить Бронирование' }[currentLang],
    btnProcessing: { az: 'Göndərilir...', en: 'Processing...', ru: 'Обработка...' }[currentLang],
    successTitle: { az: 'MÜRACİƏTİNİZ ALINDI!', en: 'BOOKING REQUEST RECEIVED!', ru: 'ЗАЯВКА УСПЕШНО ПРИНЯТА!' }[currentLang],
    successDesc: { az: 'Menecerimiz rezervasiyanı təsdiqləmək üçün 15 dəқiqə ərzində sizinlə əlaqə saxlayacaq.', en: 'Our booking manager will contact you within 15 minutes to confirm your reservation.', ru: 'Наш менеджер свяжется с вами в течение 15 минут для подтверждения бронирования.' }[currentLang],
    newRequest: { az: 'Yeni müraciət', en: 'New request', ru: 'Новая заявка' }[currentLang],
    welcomeBack: {
      az: 'Məlumatlarınız Gmail hesabınızdan avtomatik dolduruldu.',
      en: 'Your details have been pre-filled via Gmail.',
      ru: 'Ваши данные были автоматически заполнены через Gmail.'
    }[currentLang]
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'fullName') {
      const onlyLetters = value.replace(/[^a-zA-Zа-яА-ЯёЁçÇəƏğĞıIöÖşŞüÜ\s-]/g, '');
      setFormData((prev) => ({ ...prev, [name]: onlyLetters }));
    } else if (name === 'phone') {
      const onlyPhoneChars = value.replace(/[^0-9+]/g, '');
      setFormData((prev) => ({ ...prev, [name]: onlyPhoneChars }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const finalBookingData = {
      ...formData,
      fullName: session?.user ? cleanedSessionName : formData.fullName
    };

    try {
      console.log('Отправляемые на сервер данные:', finalBookingData);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
      setFormData({ 
        roomType: '', checkIn: '', checkOut: '', fullName: '', phone: '', adults: 1, kids: 0
      });
   } catch (error) {
  console.error('Ошибка:', error);
} finally {
  setLoading(false);
}
  };

  return (
    <section id="booking" className="py-32 bg-[#fdfbf7] text-stone-800 scroll-mt-20 relative select-none">
      <style jsx global>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          background: transparent; bottom: 0; color: transparent; cursor: pointer; height: auto; left: 0; position: absolute; right: 0; top: 0; width: auto;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-5 space-y-6 text-left">
          <span className="text-[#00b5d5] text-xs font-semibold tracking-[0.3em] uppercase block">{content.tag}</span>
          <h2 className="text-4xl md:text-6xl font-light font-serif tracking-tight text-[#1e325c] leading-[1.15]">{content.title}</h2>
          <p className="text-sm text-stone-500 font-light leading-relaxed max-w-md">{content.desc}</p>
        </div>

        <div className="lg:col-span-7 bg-[#f4f1eb] border border-stone-200 rounded-3xl p-8 md:p-12 shadow-sm">
          {success ? (
            <div className="text-center py-16 space-y-4 animate-fade-in">
              <div className="w-14 h-14 bg-white text-[#00b5d5] rounded-full flex items-center justify-center mx-auto text-xl border border-stone-200 shadow-sm">✓</div>
              <h3 className="text-xl font-medium tracking-tight text-[#1e325c]">{content.successTitle}</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto font-light leading-relaxed">{content.successDesc}</p>
              <button type="button" onClick={() => setSuccess(false)} className="mt-4 text-xs uppercase tracking-widest text-[#ff6c02] font-semibold hover:underline cursor-pointer">{content.newRequest}</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {session?.user && (
                <div className="bg-white/80 border border-stone-200/60 rounded-xl px-4 py-2.5 flex items-center space-x-2.5 text-left shadow-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <p className="text-[11px] font-medium text-stone-600 tracking-wide">{content.welcomeBack}</p>
                </div>
              )}

              {/* Индикатор количества гостей из Hero */}
              {(formData.adults > 1 || formData.kids > 0) && (
                <div className="text-left text-[11px] bg-[#00b5d5]/5 text-[#007a91] font-bold px-4 py-2 rounded-xl border border-[#00b5d5]/10 animate-fade-in">
                  {currentLang === 'ru' ? 'Выбрано гостей:' : currentLang === 'en' ? 'Selected guests:' : 'Seçilmiş qonaqlar:'} {formData.adults} ({currentLang === 'ru' ? 'Взр.' : currentLang === 'en' ? 'Adults' : 'Yetkin'}), {formData.kids} ({currentLang === 'ru' ? 'Дет.' : currentLang === 'en' ? 'Kids' : 'Uşaq'})
                </div>
              )}

              <div className="space-y-2 text-left">
                <label className="block text-[10px] uppercase tracking-widest text-stone-400 font-bold">{content.roomLabel} *</label>
                <div className="relative">
                  <select name="roomType" required value={formData.roomType} onChange={handleInputChange} className="w-full bg-white border border-stone-200 text-stone-800 rounded-xl p-4.5 text-sm font-light outline-none focus:border-[#00b5d5] transition-all cursor-pointer appearance-none shadow-sm">
                    <option value="" disabled hidden>{content.selectPlaceholder}</option>
                    <option value="std-king">{currentLang === 'az' ? 'Superior King Otağı — 120 AZN' : currentLang === 'en' ? 'Superior King Room — 120 AZN' : 'Номер Супериор King — 120 AZN'}</option>
                    <option value="std-twin">{currentLang === 'az' ? 'Superior Twin Otağı — 135 AZN' : currentLang === 'en' ? 'Superior Twin Room — 135 AZN' : 'Номер Супериор Twin — 135 AZN'}</option>
                    <option value="std-comfort">{currentLang === 'az' ? 'Classic Comfort Otağı — 110 AZN' : currentLang === 'en' ? 'Classic Comfort Room — 110 AZN' : 'Номер Классик Комфорт — 110 AZN'}</option>
                    <option value="dlx-sea">{currentLang === 'az' ? 'Dəniz Mənzərəli Deluxe — 240 AZN' : currentLang === 'en' ? 'Deluxe Ocean Suite — 240 AZN' : 'Делюкс Суит с видом на море — 240 AZN'}</option>
                    <option value="dlx-executive">{currentLang === 'az' ? 'Executive Panoramik — 310 AZN' : currentLang === 'en' ? 'Executive Panoramic — 310 AZN' : 'Панорамный Люкс — 310 AZN'}</option>
                    <option value="dlx-family">{currentLang === 'az' ? 'Premium Ailəvi Süit — 280 AZN' : currentLang === 'en' ? 'Premium Family Suite — 280 AZN' : 'Премиум Семейный Люкс — 280 AZN'}</option>
                    <option value="cot-duplex">{currentLang === 'az' ? 'Ailəvi Kotec — 450 AZN' : currentLang === 'en' ? 'Family Cottage — 450 AZN' : 'Семейный Коттедж — 450 AZN'}</option>
                    <option value="cot-presidential">{currentLang === 'az' ? 'Prezident Rezidensiyası — 750 AZN' : currentLang === 'en' ? 'Presidential Villa — 750 AZN' : 'Президентская Вилла — 750 AZN'}</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-stone-400 text-[9px]">▼</div>
                </div>
              </div>

              {/* ОТДЕЛЬНЫЕ ПОЛЯ ДЛЯ ДАТЫ ЗАЕЗДА И ВЫЕЗДА В BOOKING */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-widest text-stone-400 font-bold">{content.dateIn} *</label>
                  <div className="relative group">
                    <input name="checkIn" required type="date" min={today} value={formData.checkIn} onChange={handleInputChange} className="w-full bg-white border border-stone-200 text-stone-900 rounded-xl p-5 text-sm font-medium tracking-wide outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all cursor-pointer pr-12 shadow-sm" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-stone-400 group-hover:text-stone-900 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-widest text-stone-400 font-bold">{content.dateOut} *</label>
                  <div className="relative group">
                    <input name="checkOut" required type="date" min={formData.checkIn || today} value={formData.checkOut} onChange={handleInputChange} className="w-full bg-white border border-stone-200 text-stone-900 rounded-xl p-5 text-sm font-medium tracking-wide outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all cursor-pointer pr-12 shadow-sm" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-stone-400 group-hover:text-stone-900 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-widest text-stone-400 font-bold">{content.nameLabel} *</label>
                  <input name="fullName" required type="text" placeholder="John Doe" value={session?.user ? cleanedSessionName : formData.fullName} onChange={handleInputChange} disabled={!!session?.user} className="w-full bg-white border border-stone-200 text-stone-900 placeholder-stone-300 rounded-xl p-4.5 text-sm font-light outline-none focus:border-[#00b5d5] transition-all cursor-pointer shadow-sm disabled:bg-stone-100 disabled:text-stone-500 disabled:cursor-not-allowed" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-widest text-stone-400 font-bold">{content.phoneLabel} *</label>
                  <input name="phone" required type="tel" placeholder="+994" value={formData.phone} onChange={handleInputChange} className="w-full bg-white border border-stone-200 text-stone-900 placeholder-stone-300 rounded-xl p-4.5 text-sm font-light outline-none focus:border-[#00b5d5] transition-all cursor-pointer shadow-sm" />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-[#ff6c02] hover:bg-[#e55f00] text-white font-semibold text-xs uppercase tracking-widest py-4.5 rounded-xl transition-all duration-300 cursor-pointer active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg">
                {loading ? (
                  <span className="inline-flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                    <span>{content.btnProcessing}</span>
                  </span>
                ) : content.btnSubmit}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}