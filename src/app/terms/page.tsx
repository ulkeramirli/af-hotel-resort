'use client';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TermsOfUse() {
  const { language } = useLanguage();
  const currentLang = language;

  const content = {
    az: {
      title: "İstifadə Şərtləri",
      sec1Title: "1. Ümumi Qaydalar",
      sec1Text: "Bu saytdan istifadə etməklə, siz AF Hotel & Aqua Park-ın aşağıda qeyd olunan istifadə şərtləri ilə razılaşırsınız. Saytın məzmunu yalnız məlumatlandırma və rezervasiya məqsədi daşıyır.",
      sec2Title: "2. Müəllif Hüquqları",
      sec2Text: "Saytdakı bütün məzmun, qrafika, loqotiplər və şəkillər AF Hotel & Aqua Park-a məxsusdur və beynəlxalq müəllif hüquqları qanunları ilə qorunur. İcazəsiz istifadəsi qəti qadağandır.",
      sec3Title: "3. İstifadəçinin Öhdəlikləri",
      sec3Desc: "Saytdan istifadə zamanı istifadəçi:",
      sec3List: [
        "Yalnız qanuni məqsədlər üçün istifadə etməyə;",
        "Rezervasiya zamanı doğru və aktual məlumatlar təqdim etməyə;",
        "Saytın işinə zərər verə biləcək hər hansı fəaliyyətdən çəkinməyə borcludur."
      ],
      sec4Title: "4. Məsuliyyətin Məhdudlaşdırılması",
      sec4Text: "AF Hotel saytın kəsintisiz işləməsinə zəmanət vermir və texniki nasazlıqlara, habelə üçüncü tərəf xidmətlərinin (məsələn, ödəniş sistemləri) fəaliyyətinə görə məsuliyyət daşımır.",
      sec5Title: "5. Şərtlərin Dəyişdirilməsi",
      sec5Text: "AF Hotel bu şərtləri əvvəlcədən xəbərdarlıq etmədən dəyişdirmək hüququnu özündə saxlayır. Dəyişikliklər saytda dərc edildiyi andan qüvvəyə minir."
    },
    en: {
      title: "Terms of Use",
      sec1Title: "1. General Rules",
      sec1Text: "By using this site, you agree to the terms of use of AF Hotel & Aqua Park outlined below. The content of the site is for informational and booking purposes only.",
      sec2Title: "2. Copyright",
      sec2Text: "All content, graphics, logos, and images on the site belong to AF Hotel & Aqua Park and are protected by international copyright laws. Unauthorized use is strictly prohibited.",
      sec3Title: "3. User Responsibilities",
      sec3Desc: "When using the site, the user is obliged to:",
      sec3List: [
        "Use it only for lawful purposes;",
        "Provide accurate and up-to-date information during booking;",
        "Refrain from any activity that could damage the site's operation."
      ],
      sec4Title: "4. Limitation of Liability",
      sec4Text: "AF Hotel does not guarantee the uninterrupted operation of the site and is not responsible for technical malfunctions, as well as the operation of third-party services (e.g., payment systems).",
      sec5Title: "5. Modification of Terms",
      sec5Text: "AF Hotel reserves the right to modify these terms without prior notice. Changes take effect from the moment they are published on the site."
    },
    ru: {
      title: "Условия Использования",
      sec1Title: "1. Общие правила",
      sec1Text: "Используя этот сайт, вы соглашаетесь с условиями использования AF Hotel & Aqua Park, изложенными ниже. Содержимое сайта предназначено только для информационных целей и бронирования.",
      sec2Title: "2. Авторские права",
      sec2Text: "Весь контент, графика, логотипы и изображения на сайте принадлежат AF Hotel & Aqua Park и защищены международными законами об авторских правах. Несанкционированное использование строго запрещено.",
      sec3Title: "3. Обязанности пользователя",
      sec3Desc: "При использовании сайта пользователь обязан:",
      sec3List: [
        "Использовать его только в законных целях;",
        "Предоставлять точную и актуальную информацию при бронировании;",
        "Воздерживаться от любых действий, которые могут нанести вред работе сайта."
      ],
      sec4Title: "4. Ограничение ответственности",
      sec4Text: "AF Hotel не гарантирует бесперебойную работу сайта и не несет ответственности за технические сбои, а также за работу сторонних сервисов (например, платежных систем).",
      sec5Title: "5. Изменение условий",
      sec5Text: "AF Hotel оставляет за собой право изменять эти условия без предварительного уведомления. Изменения вступают в силу с момента их публикации на сайте."
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
            <p>{t.sec2Text}</p>
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
            <p>{t.sec4Text}</p>
          </section>

          <section className="bg-stone-50 p-8 rounded-2xl border border-stone-100">
            <h2 className="text-xl font-semibold text-[#00b5d5] mb-4">{t.sec5Title}</h2>
            <p>{t.sec5Text}</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
