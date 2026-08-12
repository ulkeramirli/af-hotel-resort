'use client';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BookingPolicy() {
  const { language } = useLanguage();
  const currentLang = language;

  const content = {
    az: {
      title: "Rezervasiya və Ləğv Qaydaları",
      sec1Title: "1. Rezervasiya Qaydaları",
      sec1List: [
        "Otaq rezervasiyası yalnız saytımız, rəsmi telefon nömrələrimiz və ya tərəfdaş platformalar vasitəsilə həyata keçirilə bilər.",
        "Rezervasiyanın təsdiqlənməsi üçün ödənişin müəyyən hissəsi və ya tam məbləği əvvəlcədən tələb oluna bilər.",
        "Giriş (Check-in) saatı standart olaraq 14:00, Çıxış (Check-out) saatı isə 12:00-dır."
      ],
      sec2Title: "2. Ödənişlər",
      sec2Text: "Saytımız vasitəsilə edilən ödənişlər təhlükəsiz şəkildə həyata keçirilir. Gecikmiş ödənişlər və ya natamam məlumat təqdim edildiyi halda rezervasiya ləğv edilə bilər.",
      sec3Title: "3. Ləğv və Qaytarılma Qaydaları",
      sec3List: [
        "Gəliş tarixinə 48 saat qalmışa qədər edilən ləğv müraciətlərində tam məbləğ geri qaytarılır.",
        "48 saatdan az müddət qaldıqda ləğv edildikdə isə bir günlük otaq haqqı tutulur, qalan məbləğ qaytarılır.",
        "\"Non-refundable\" (qaytarılmayan) təkliflərlə edilmiş rezervasiyalar ləğv edildikdə məbləğ geri qaytarılmır.",
        "No-show (Qonaq gəlmədikdə) vəziyyətində heç bir ödəniş geri qaytarılmır."
      ],
      sec4Title: "4. Uşaqlar və Əlavə Yataqlar",
      sec4Text: "Müəyyən yaşa qədər uşaqlar üçün ödəniş tələb olunmur (siyasət mövsümə görə dəyişə bilər). Əlavə yataq tələbləri əlavə ödənişlə təmin edilir və əvvəlcədən otel rəhbərliyinə bildirilməlidir."
    },
    en: {
      title: "Booking and Cancellation Policy",
      sec1Title: "1. Booking Rules",
      sec1List: [
        "Room bookings can only be made through our site, official phone numbers, or partner platforms.",
        "A partial or full payment may be required in advance to confirm the booking.",
        "Standard check-in time is 14:00, and check-out time is 12:00."
      ],
      sec2Title: "2. Payments",
      sec2Text: "Payments made through our site are processed securely. Bookings may be canceled in case of delayed payments or incomplete information.",
      sec3Title: "3. Cancellation and Refund Policy",
      sec3List: [
        "For cancellation requests made up to 48 hours before the arrival date, the full amount is refunded.",
        "For cancellations made less than 48 hours in advance, a one-night room charge is deducted, and the rest is refunded.",
        "For bookings made with \"non-refundable\" offers, no refund is provided upon cancellation.",
        "In case of a no-show, no payments are refunded."
      ],
      sec4Title: "4. Children and Extra Beds",
      sec4Text: "No fee is charged for children up to a certain age (policy may vary by season). Extra bed requests are provided for an additional fee and must be communicated to the hotel management in advance."
    },
    ru: {
      title: "Правила Бронирования и Отмены",
      sec1Title: "1. Правила бронирования",
      sec1List: [
        "Бронирование номеров может осуществляться только через наш сайт, по официальным номерам телефонов или через партнерские платформы.",
        "Для подтверждения бронирования может потребоваться частичная или полная предварительная оплата.",
        "Стандартное время заезда (Check-in) - 14:00, время выезда (Check-out) - 12:00."
      ],
      sec2Title: "2. Платежи",
      sec2Text: "Платежи через наш сайт осуществляются безопасным способом. Бронирование может быть отменено в случае просрочки платежа или предоставления неполной информации.",
      sec3Title: "3. Правила отмены и возврата",
      sec3List: [
        "При отмене бронирования не позднее чем за 48 часов до даты заезда возвращается полная сумма.",
        "При отмене менее чем за 48 часов удерживается стоимость одной ночи, а остаток возвращается.",
        "При отмене бронирований, сделанных по «невозвратным» (non-refundable) тарифам, сумма не возвращается.",
        "В случае незаезда (No-show) оплата не возвращается."
      ],
      sec4Title: "4. Дети и дополнительные кровати",
      sec4Text: "За детей до определенного возраста плата не взимается (политика может меняться в зависимости от сезона). Дополнительные кровати предоставляются за дополнительную плату и должны быть предварительно согласованы с администрацией отеля."
    }
  };

  const t = content[currentLang];

  return (
    <div className="bg-white min-h-screen antialiased selection:bg-[#00b5d5] selection:text-white flex flex-col">
      <Header />
      
      <main className="grow pt-32 pb-20 px-6 lg:px-16 max-w-4xl mx-auto w-full">
        <h1 className="text-3xl md:text-5xl font-bold text-stone-800 mb-10 text-center tracking-tight">{t.title}</h1>
        
        <div className="space-y-8 text-stone-600 leading-relaxed font-light">
          <section className="bg-stone-50 p-8 rounded-2xl border border-stone-100">
            <h2 className="text-xl font-semibold text-[#00b5d5] mb-4">{t.sec1Title}</h2>
            <ul className="list-disc pl-5 space-y-2">
              {t.sec1List.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </section>

          <section className="bg-stone-50 p-8 rounded-2xl border border-stone-100">
            <h2 className="text-xl font-semibold text-[#00b5d5] mb-4">{t.sec2Title}</h2>
            <p>{t.sec2Text}</p>
          </section>

          <section className="bg-stone-50 p-8 rounded-2xl border border-stone-100">
            <h2 className="text-xl font-semibold text-[#00b5d5] mb-4">{t.sec3Title}</h2>
            <ul className="list-disc pl-5 space-y-2">
              {t.sec3List.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </section>

          <section className="bg-stone-50 p-8 rounded-2xl border border-stone-100">
            <h2 className="text-xl font-semibold text-[#00b5d5] mb-4">{t.sec4Title}</h2>
            <p>{t.sec4Text}</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
