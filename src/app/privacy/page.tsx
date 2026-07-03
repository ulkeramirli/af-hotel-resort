'use client';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PrivacyPolicy() {
  const { language } = useLanguage();
  const currentLang = (language as 'az' | 'en' | 'ru') || 'az';

  const content = {
    az: {
      title: "Məxfilik Siyasəti",
      sec1Title: "1. Ümumi müddəalar",
      sec1Text: "AF Hotel & Aqua Park istifadəçilərin şəxsi məlumatlarının məxfiliyini qorumağı öz öhdəsinə götürür. Bu Məxfilik Siyasəti saytımızdan istifadə zamanı hansı məlumatların toplandığını və necə istifadə edildiyini izah edir.",
      sec2Title: "2. Toplanan məlumatlar",
      sec2Desc: "Rezervasiya zamanı aşağıdakı məlumatlar toplana bilər:",
      sec2List: ["Ad və soyad", "Elektron poçt ünvanı", "Telefon nömrəsi", "Gəliş tarixi", "Gediş tarixi", "Rezervasiya qeydləri"],
      sec3Title: "3. Məlumatlardan istifadə məqsədi",
      sec3Desc: "Toplanan məlumatlar aşağıdakı məqsədlər üçün istifadə olunur:",
      sec3List: ["Rezervasiyanın yaradılması", "Müştəri ilə əlaqə saxlanılması", "Rezervasiyanın təsdiqlənməsi", "Ödəniş prosesinin həyata keçirilməsi", "Xidmət keyfiyyətinin artırılması"],
      sec4Title: "4. Ödəniş məlumatları",
      sec4Text: "Saytda edilən ödənişlər Epoint ödəniş sistemi vasitəsilə həyata keçirilir.",
      sec4Highlight: "AF Hotel bank kartı məlumatlarını saxlamır və həmin məlumatlara çıxış əldə etmir.",
      sec5Title: "5. Məlumatların qorunması",
      sec5Text: "Toplanan şəxsi məlumatlar yalnız səlahiyyətli əməkdaşlar tərəfindən istifadə olunur və icazəsiz girişdən qorunur.",
      sec6Title: "6. Məlumatların paylaşılması",
      sec6Text: "Şəxsi məlumatlar qanunvericiliyin tələb etdiyi hallar istisna olmaqla üçüncü şəxslərlə paylaşılmır.",
      sec7Title: "7. Cookie faylları",
      sec7Text: "Sayt istifadəçi təcrübəsini yaxşılaşdırmaq məqsədilə cookie fayllarından istifadə edə bilər.",
      sec8Title: "8. İstifadəçinin hüquqları",
      sec8Desc: "İstifadəçi:",
      sec8List: ["məlumatlarını yeniləməyi;", "silinməsini tələb etməyi;", "emalına etiraz etməyi;"],
      sec8Footer: "istənilən vaxt tələb edə bilər.",
      sec9Title: "9. Əlaqə",
      sec9Text: "Məxfilik siyasəti ilə bağlı suallar üçün bizimlə əlaqə saxlaya bilərsiniz."
    },
    en: {
      title: "Privacy Policy",
      sec1Title: "1. General Provisions",
      sec1Text: "AF Hotel & Aqua Park is committed to protecting the privacy of our users' personal information. This Privacy Policy explains what information is collected and how it is used when you use our site.",
      sec2Title: "2. Collected Information",
      sec2Desc: "The following information may be collected during booking:",
      sec2List: ["First and last name", "Email address", "Phone number", "Check-in date", "Check-out date", "Booking notes"],
      sec3Title: "3. Purpose of Using Information",
      sec3Desc: "Collected information is used for the following purposes:",
      sec3List: ["Creating a booking", "Contacting the customer", "Confirming the booking", "Processing payments", "Improving service quality"],
      sec4Title: "4. Payment Information",
      sec4Text: "Payments made on the site are processed through the Epoint payment system.",
      sec4Highlight: "AF Hotel does not store bank card details and does not have access to this information.",
      sec5Title: "5. Protection of Information",
      sec5Text: "Collected personal information is only used by authorized employees and is protected from unauthorized access.",
      sec6Title: "6. Sharing of Information",
      sec6Text: "Personal information is not shared with third parties except as required by law.",
      sec7Title: "7. Cookie Files",
      sec7Text: "The site may use cookie files to improve user experience.",
      sec8Title: "8. User Rights",
      sec8Desc: "The user can request at any time to:",
      sec8List: ["update their information;", "delete their information;", "object to its processing;"],
      sec8Footer: "",
      sec9Title: "9. Contact",
      sec9Text: "For questions regarding our privacy policy, you can contact us."
    },
    ru: {
      title: "Политика Конфиденциальности",
      sec1Title: "1. Общие положения",
      sec1Text: "AF Hotel & Aqua Park обязуется защищать конфиденциальность личной информации пользователей. Настоящая Политика конфиденциальности объясняет, какая информация собирается и как она используется при использовании нашего сайта.",
      sec2Title: "2. Собираемая информация",
      sec2Desc: "При бронировании может собираться следующая информация:",
      sec2List: ["Имя и фамилия", "Адрес электронной почты", "Номер телефона", "Дата заезда", "Дата выезда", "Примечания к бронированию"],
      sec3Title: "3. Цель использования информации",
      sec3Desc: "Собираемая информация используется в следующих целях:",
      sec3List: ["Создание бронирования", "Связь с клиентом", "Подтверждение бронирования", "Обработка платежей", "Повышение качества обслуживания"],
      sec4Title: "4. Платежная информация",
      sec4Text: "Платежи на сайте осуществляются через платежную систему Epoint.",
      sec4Highlight: "AF Hotel не хранит данные банковских карт и не имеет к ним доступа.",
      sec5Title: "5. Защита информации",
      sec5Text: "Собранная личная информация используется только уполномоченными сотрудниками и защищена от несанкционированного доступа.",
      sec6Title: "6. Передача информации",
      sec6Text: "Личная информация не передается третьим лицам, за исключением случаев, предусмотренных законодательством.",
      sec7Title: "7. Файлы Cookie",
      sec7Text: "Сайт может использовать файлы cookie для улучшения пользовательского опыта.",
      sec8Title: "8. Права пользователя",
      sec8Desc: "Пользователь в любое время может потребовать:",
      sec8List: ["обновления своей информации;", "удаления своей информации;", "возразить против ее обработки;"],
      sec8Footer: "",
      sec9Title: "9. Контакты",
      sec9Text: "По вопросам, связанным с политикой конфиденциальности, вы можете связаться с нами."
    }
  };

  const t = content[currentLang];

  return (
    <div className="bg-white min-h-screen antialiased selection:bg-[#00b5d5] selection:text-white flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 pb-20 px-6 lg:px-16 max-w-4xl mx-auto w-full">
        <h1 className="text-3xl md:text-5xl font-bold text-stone-800 mb-10 text-center tracking-tight">{t.title}</h1>
        
        <div className="space-y-8 text-stone-600 leading-relaxed font-light">
          <section className="bg-stone-50 p-8 rounded-2xl border border-stone-100">
            <h2 className="text-xl font-semibold text-[#00b5d5] mb-4">{t.sec1Title}</h2>
            <p>{t.sec1Text}</p>
          </section>

          <section className="bg-stone-50 p-8 rounded-2xl border border-stone-100">
            <h2 className="text-xl font-semibold text-[#00b5d5] mb-4">{t.sec2Title}</h2>
            <p className="mb-4">{t.sec2Desc}</p>
            <ul className="list-disc pl-5 space-y-2">
              {t.sec2List.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </section>

          <section className="bg-stone-50 p-8 rounded-2xl border border-stone-100">
            <h2 className="text-xl font-semibold text-[#00b5d5] mb-4">{t.sec3Title}</h2>
            <p className="mb-4">{t.sec3Desc}</p>
            <ul className="list-disc pl-5 space-y-2">
              {t.sec3List.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </section>

          <section className="bg-stone-50 p-8 rounded-2xl border border-stone-100">
            <h2 className="text-xl font-semibold text-[#00b5d5] mb-4">{t.sec4Title}</h2>
            <p className="mb-4">{t.sec4Text}</p>
            <p className="font-medium text-stone-700 bg-stone-100/50 p-4 rounded-lg inline-block">
              {t.sec4Highlight}
            </p>
          </section>

          <section className="bg-stone-50 p-8 rounded-2xl border border-stone-100">
            <h2 className="text-xl font-semibold text-[#00b5d5] mb-4">{t.sec5Title}</h2>
            <p>{t.sec5Text}</p>
          </section>

          <section className="bg-stone-50 p-8 rounded-2xl border border-stone-100">
            <h2 className="text-xl font-semibold text-[#00b5d5] mb-4">{t.sec6Title}</h2>
            <p>{t.sec6Text}</p>
          </section>

          <section className="bg-stone-50 p-8 rounded-2xl border border-stone-100">
            <h2 className="text-xl font-semibold text-[#00b5d5] mb-4">{t.sec7Title}</h2>
            <p>{t.sec7Text}</p>
          </section>

          <section className="bg-stone-50 p-8 rounded-2xl border border-stone-100">
            <h2 className="text-xl font-semibold text-[#00b5d5] mb-4">{t.sec8Title}</h2>
            <p className="mb-4">{t.sec8Desc}</p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              {t.sec8List.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
            {t.sec8Footer && <p>{t.sec8Footer}</p>}
          </section>

          <section className="bg-[#e9f7fa] p-8 rounded-2xl border border-cyan-100 mt-12 text-center">
            <h2 className="text-xl font-semibold text-[#00b5d5] mb-4">{t.sec9Title}</h2>
            <p className="mb-4">{t.sec9Text}</p>
            <a href="mailto:office@afhotel.az" className="inline-flex items-center gap-2 bg-[#ff6c02] hover:bg-[#e55f00] text-white font-bold px-6 py-3 rounded-full transition-all shadow-md hover:shadow-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              office@afhotel.az
            </a>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
