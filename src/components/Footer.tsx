'use client';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';

export default function Footer() {
  const { lang, t } = useLanguage();
  const currentLang = (lang as 'az' | 'en' | 'ru') || 'az';

  const content = {
    desc: {
      az: 'Novxanı sahilində yerləşən AF Hotel & Aqua Park, Aralıq dənizi üslubunda ailəvi istirahət və unudulmaz dəniz macəraları təklif edir.',
      en: 'Located on the scenic Novkhani coast, AF Hotel & Aqua Park delivers Mediterranean-style family leisure and pristine seaside getaways.',
      ru: 'Расположенный на побережье Новханы, AF Hotel & Aqua Park предлагает семейный отдых в средиземноморском стиле и незабываемые морские приключения.'
    }[currentLang],
    subscribeTitle: { az: 'XÜSUSİ TƏKLİFLƏR', en: 'EXCLUSIVE OFFERS', ru: 'ЗАКРЫТЫЕ АКЦИИ' }[currentLang],
    subscribeDesc: { az: 'Yalnız abunəçilər üçün endirimlər və xəbərlər.', en: 'Subscribe to unlock premium resort updates.', ru: 'Подпишитесь, чтобы получать скрытые скидки.' }[currentLang],
    placeholder: { az: 'E-poçt ünvanınız', en: 'Your email address', ru: 'Ваш email адрес' }[currentLang],
    subBtn: { az: 'Qoşul', en: 'Join', ru: 'ОK' }[currentLang]
  };

  return (
    <footer className="bg-[#e9f7fa] text-stone-600 pt-16 pb-8 border-t border-cyan-100 relative overflow-hidden select-none text-left">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 space-y-12 relative z-10">
        
        {/* qlavnaya panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8 border-b border-cyan-100/60 items-start">
          
          <div className="lg:col-span-6 space-y-4">
           {/* loqotip iz headera */}
            <div className="h-12 pb-4 relative flex items-center">
              <Image
                src="/loqo-af.png"
                alt="AF Hotel & Resort"
                width={160}
                height={80}
                priority
                className="w-24 h-auto sm:w-28 md:w-36 object-contain"
              />
            </div>
            <p className="text-xs text-stone-500 font-light leading-relaxed max-w-sm">
              {content.desc}
            </p>
          </div>

          <div className="lg:col-span-6 space-y-2 lg:text-right w-full lg:max-w-xs lg:ml-auto">
            <h4 className="text-[9px] font-bold uppercase tracking-widest text-[#00b5d5]">{content.subscribeTitle}</h4>
            <p className="text-[11px] text-stone-400 font-light">{content.subscribeDesc}</p>
            
            <div className="flex bg-white border border-cyan-100 rounded-lg p-1 focus-within:border-[#00b5d5] transition-all">
              <input type="email" placeholder={content.placeholder} className="w-full bg-transparent px-2.5 text-xs font-light text-stone-800 outline-none placeholder-stone-300" />
              <button className="bg-[#ff6c02] hover:bg-[#e55f00] text-white font-bold text-[10px] uppercase tracking-wider px-4 py-2 rounded-md transition-colors cursor-pointer shrink-0">
                {content.subBtn}
              </button>
            </div>
          </div>

        </div>

        {/* naviqacionniye ssilki */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
          <div className="space-y-3">
            <h4 className="text-[9px] font-bold uppercase tracking-widest text-stone-400">The Resort</h4>
            <div className="flex flex-col space-y-2 font-light text-stone-600">
              <a href="#about" className="hover:text-[#00b5d5] transition-colors">{ { az: 'Haqqımızda', en: 'About Us', ru: 'О нас' }[currentLang] }</a>
              <a href="#rooms" className="hover:text-[#00b5d5] transition-colors">{t.nav.rooms}</a>
              <a href="#aquapark" className="hover:text-[#00b5d5] transition-colors">{t.nav.aquapark}</a>
              <a href="#dining" className="hover:text-[#00b5d5] transition-colors">{t.nav.dining}</a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Experience</h4>
            <div className="flex flex-col space-y-2 font-light text-stone-600">
              <a href="#aquapark" className="hover:text-[#00b5d5] transition-colors">{ { az: 'Su Atvasiya', en: 'Water Slides', ru: 'Водные Горки' }[currentLang] }</a>
              <a href="#dining" className="hover:text-[#00b5d5] transition-colors">{ { az: 'Hovuz barları', en: 'Poolside Bars', ru: 'Бары у Бассейна' }[currentLang] }</a>
              <a href="#contacts" className="hover:text-[#00b5d5] transition-colors">{ { az: 'Şəxsi Çimərlik', en: 'Private Beach', ru: 'Частный Пляж' }[currentLang] }</a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Hours</h4>
            <div className="space-y-1.5 font-light text-stone-500">
              <p><span className="text-stone-700 font-normal">Reception:</span> 24 / 7</p>
              <p><span className="text-stone-700 font-normal">Aqua Park:</span> 09:00 – 20:00</p>
              <p><span className="text-stone-700 font-normal">Dining:</span> 08:00 – 23:00</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Destination</h4>
            <p className="font-light text-stone-500 leading-relaxed">
              Novkhani Beach Road,<br />
              Baku, Azerbaijan
            </p>
          </div>
        </div>

        {/* kopirayder */}
        <div className="pt-6 border-t border-cyan-100/60 flex flex-col md:flex-row justify-between items-center gap-3 text-[9px] text-stone-400 font-mono tracking-wider">
          <p>© {new Date().getFullYear()} AF HOTEL & AQUA PARK. All rights reserved.</p>
          <div className="flex space-x-4 uppercase font-bold">
            <a href="#privacy" className="hover:text-[#00b5d5] transition-colors">Privacy</a>
            <a href="#terms" className="hover:text-[#00b5d5] transition-colors">Terms</a>
          </div>
        </div>

      </div>
    </footer>
  );
}