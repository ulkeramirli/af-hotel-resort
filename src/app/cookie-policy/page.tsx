'use client';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CookiePolicy() {
  const { language } = useLanguage();
  const currentLang = language;

  const content = {
    az: {
      title: "Cookie Siyasəti",
      sec1Title: "1. Cookie nədir?",
      sec1Text: "Cookie, saytımıza daxil olduğunuz zaman brauzeriniz tərəfindən cihazınıza (kompüter, planşet və ya mobil telefon) saxlanılan kiçik mətn fayllarıdır. Onlar saytın düzgün işləməsini, istifadəçi təcrübəsinin yaxşılaşdırılmasını və istifadəçilərin saytda necə hərəkət etdiyini anlamaq üçün istifadə olunur.",
      sec2Title: "2. Hansı Cookie-lərdən istifadə edirik?",
      sec2List: [
        { strong: "Zəruri Cookie-lər:", text: " Saytın əsas funksiyalarının işləməsi (məsələn, rezervasiya, təhlükəsizlik) üçün mütləq lazımdır." },
        { strong: "Analitik Cookie-lər:", text: " Ziyarətçilərin saytımızı necə istifadə etdiyini (məsələn, Google Analytics) öyrənmək və fəaliyyətimizi yaxşılaşdırmaq üçün istifadə olunur." },
        { strong: "Funksional Cookie-lər:", text: " Dil seçimi və digər şəxsi tərcihlərinizi xatırlamağa kömək edir." },
        { strong: "Marketinq Cookie-ləri:", text: " Sizə daha uyğun kampaniya və reklamlar göstərmək məqsədi ilə istifadə edilir." }
      ],
      sec3Title: "3. Cookie-ləri necə idarə etmək olar?",
      sec3Text: "Siz istədiyiniz zaman brauzerinizin tənzimləmələri vasitəsilə cookie-ləri silə və ya onların saxlanılmasını bloklaya bilərsiniz. Nəzərə alın ki, bəzi cookie-lərin bloklanması saytın müəyyən funksiyalarının düzgün işləməməsinə səbəb ola bilər.",
      sec4Title: "4. Daha çox məlumat",
      sec4Text: "Cookie Siyasətimiz haqqında hər hansı sualınız yaranarsa, bizimlə əlaqə saxlayın."
    },
    en: {
      title: "Cookie Policy",
      sec1Title: "1. What is a Cookie?",
      sec1Text: "A cookie is a small text file stored on your device (computer, tablet, or mobile phone) by your browser when you visit our site. They are used to ensure the proper functioning of the site, improve user experience, and understand how users navigate the site.",
      sec2Title: "2. What Cookies do we use?",
      sec2List: [
        { strong: "Essential Cookies:", text: " Strictly necessary for the basic functions of the site (e.g., booking, security)." },
        { strong: "Analytical Cookies:", text: " Used to understand how visitors interact with our site (e.g., Google Analytics) and to improve our performance." },
        { strong: "Functional Cookies:", text: " Help to remember your language preferences and other personal settings." },
        { strong: "Marketing Cookies:", text: " Used to show you more relevant campaigns and advertisements." }
      ],
      sec3Title: "3. How to manage Cookies?",
      sec3Text: "You can delete or block cookies from being stored at any time through your browser settings. Please note that blocking some cookies may cause certain functions of the site to not work properly.",
      sec4Title: "4. More information",
      sec4Text: "If you have any questions about our Cookie Policy, please contact us."
    },
    ru: {
      title: "Политика Cookie",
      sec1Title: "1. Что такое Cookie?",
      sec1Text: "Cookie — это небольшие текстовые файлы, которые сохраняются вашим браузером на вашем устройстве (компьютере, планшете или мобильном телефоне) при посещении нашего сайта. Они используются для обеспечения правильной работы сайта, улучшения пользовательского опыта и понимания того, как пользователи перемещаются по сайту.",
      sec2Title: "2. Какие Cookie мы используем?",
      sec2List: [
        { strong: "Необходимые Cookie:", text: " Строго необходимы для работы основных функций сайта (например, бронирование, безопасность)." },
        { strong: "Аналитические Cookie:", text: " Используются для понимания того, как посетители используют наш сайт (например, Google Analytics), и для улучшения нашей работы." },
        { strong: "Функциональные Cookie:", text: " Помогают запомнить ваш выбор языка и другие личные настройки." },
        { strong: "Маркетинговые Cookie:", text: " Используются для показа вам более подходящих кампаний и рекламы." }
      ],
      sec3Title: "3. Как управлять Cookie?",
      sec3Text: "Вы можете в любое время удалить cookie или заблокировать их сохранение в настройках вашего браузера. Обратите внимание, что блокировка некоторых cookie может привести к неправильной работе определенных функций сайта.",
      sec4Title: "4. Дополнительная информация",
      sec4Text: "Если у вас возникнут вопросы о нашей Политике Cookie, свяжитесь с нами."
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
            <p>{t.sec1Text}</p>
          </section>

          <section className="bg-stone-50 p-8 rounded-2xl border border-stone-100">
            <h2 className="text-xl font-semibold text-[#00b5d5] mb-4">{t.sec2Title}</h2>
            <ul className="list-disc pl-5 space-y-2">
              {t.sec2List.map((item, index) => (
                <li key={index}>
                  <strong>{item.strong}</strong>{item.text}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-stone-50 p-8 rounded-2xl border border-stone-100">
            <h2 className="text-xl font-semibold text-[#00b5d5] mb-4">{t.sec3Title}</h2>
            <p>{t.sec3Text}</p>
          </section>

          <section className="bg-[#e9f7fa] p-8 rounded-2xl border border-cyan-100 mt-12 text-center">
            <h2 className="text-xl font-semibold text-[#00b5d5] mb-4">{t.sec4Title}</h2>
            <p className="mb-4">{t.sec4Text}</p>
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
