'use client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useState } from 'react';
import Image from 'next/image';
import ScrollReveal from '@/components/ScrollReveal';

export default function Footer() {
  const { language, t } = useLanguage();
  const currentLang = (language as 'az' | 'en' | 'ru') || 'az';
  const { settings } = useSettings();

  const content = {
    desc: {
      az: 'Novxanı sahilində yerləşən AF Hotel & Aqua Park, Aralıq dənizi üslubunda ailəvi istirahət və unudulmaz dəniz macəraları təklif edir.',
      en: 'Located on the scenic Novkhani coast, AF Hotel & Aqua Park delivers Mediterranean-style family leisure and pristine seaside getaways.',
      ru: 'Расположенный на побережье Новханы, AF Hotel & Aqua Park предлагает семейный отдых в средиземноморском стиле и незабываемые морские приключения.'
    }[currentLang],
    subscribeTitle: { az: 'XÜSUSİ TƏKLİFLƏR', en: 'EXCLUSIVE OFFERS', ru: 'ЗАКРЫТЫЕ АКЦИИ' }[currentLang],
    subscribeDesc: { az: 'Yalnız abunəçilər üçün endirimlər və xəbərlər.', en: 'Subscribe to unlock premium resort updates.', ru: 'Подпишитесь, чтобы получать скрытые скидки.' }[currentLang],
    placeholder: { az: 'E-poçt ünvanınız', en: 'Your email address', ru: 'Ваш email адрес' }[currentLang],
    subBtn: { az: 'Qoşul', en: 'Join', ru: 'ОK' }[currentLang],
    rights: { az: 'Müəllif hüquqları qorunur.', en: 'All rights reserved.', ru: 'Все права защищены.' }[currentLang]
  };

  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubStatus('loading');
    // Simulate API call
    setTimeout(() => {
      setSubStatus('success');
      setEmail('');
      setTimeout(() => setSubStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <footer className="bg-[#e9f7fa] text-stone-600 pt-10 md:pt-16 pb-8 border-t border-cyan-100 relative overflow-hidden select-none text-left">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 space-y-8 md:space-y-12 relative z-10">
        
        {/* qlavnaya panel */}
        <ScrollReveal direction="up" delay={0.1} className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8 border-b border-cyan-100/60 items-start">
          
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
            
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <div className="flex bg-white border border-cyan-100 rounded-lg p-1 focus-within:border-[#00b5d5] transition-all">
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={content.placeholder} className="w-full bg-transparent px-2.5 text-xs font-light text-stone-800 outline-none placeholder-stone-300" disabled={subStatus === 'loading'} />
                <button type="submit" disabled={subStatus === 'loading'} className="bg-[#ff6c02] hover:bg-[#e55f00] text-white font-bold text-[10px] uppercase tracking-wider px-4 py-2 rounded-md transition-colors cursor-pointer shrink-0 disabled:opacity-50">
                  {subStatus === 'loading' ? '...' : content.subBtn}
                </button>
              </div>
              {subStatus === 'success' && <p className="text-[10px] text-emerald-500 font-bold">Successfully subscribed!</p>}
            </form>
          </div>

        </ScrollReveal>

        {/* naviqacionniye ssilki */}
        <ScrollReveal direction="up" delay={0.2} className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
          <div className="space-y-3">
            <h4 className="text-[9px] font-bold uppercase tracking-widest text-stone-400">The Resort</h4>
            <div className="flex flex-col space-y-2 font-light text-stone-600">
              <a href="#about" className="hover:text-[#00b5d5] transition-colors">{ { az: 'Haqqımızda', en: 'About Us', ru: 'О нас' }[currentLang] }</a>
              <a href="#rooms" className="hover:text-[#00b5d5] transition-colors">{t.nav.rooms}</a>
              <a href="#aquapark" className="hover:text-[#00b5d5] transition-colors">{t.nav.aquapark}</a>
              <a href="#restoran" className="hover:text-[#00b5d5] transition-colors">{t.nav.restoran}</a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Experience</h4>
            <div className="flex flex-col space-y-2 font-light text-stone-600">
              <a href="#aquapark" className="hover:text-[#00b5d5] transition-colors">{ { az: 'Su Atvasiya', en: 'Water Slides', ru: 'Водные Горки' }[currentLang] }</a>
              <a href="#restoran" className="hover:text-[#00b5d5] transition-colors">{ { az: 'Hovuz barları', en: 'Poolside Bars', ru: 'Бары у Бассейна' }[currentLang] }</a>
              <a href="#contacts" className="hover:text-[#00b5d5] transition-colors">{ { az: 'Şəxsi Çimərlik', en: 'Private Beach', ru: 'Частный Пляж' }[currentLang] }</a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Hours</h4>
            <div className="space-y-1.5 font-light text-stone-500">
              <p><span className="text-stone-700 font-normal">Reception:</span> {settings?.reception || "24 / 7"}</p>
              <p><span className="text-stone-700 font-normal">Aqua Park:</span> {settings?.aquapark || "09:00 – 20:00"}</p>
              <p><span className="text-stone-700 font-normal">Restoran:</span> {settings?.dining || "08:00 – 23:00"}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Destination</h4>
            <div className="font-light text-stone-500 leading-relaxed space-y-2">
              <p>
                {(settings?.address as any)?.[currentLang] ? (
                  (settings?.address as any)[currentLang].split('\n').map((line: string, i: number) => <span key={i}>{line}<br /></span>)
                ) : (
                  <>Novkhani Beach Road,<br />Baku, Azerbaijan</>
                )}
              </p>
            </div>
          </div>
        </ScrollReveal>

        <div className="pt-6 mt-8 border-t border-cyan-100/60 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-500 font-mono tracking-wider">
          <p>© {new Date().getFullYear()} {((settings?.hotelName as any)?.[currentLang] || "AF HOTEL & AQUA PARK").toUpperCase()}. {content.rights}</p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              {settings?.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Instagram"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white transition-all hover:scale-110 hover:shadow-md"
                  style={{ background: "linear-gradient(135deg, #f58529, #dd2a7b, #8134af)" }}
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}
              {settings?.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Facebook"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white transition-all hover:scale-110 hover:shadow-md"
                  style={{ background: "#1877F2" }}
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
              {settings?.tiktok && (
                <a
                  href={settings.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="TikTok"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white transition-all hover:scale-110 hover:shadow-md"
                  style={{ background: "#010101" }}
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.56V6.79a4.85 4.85 0 01-1.07-.1z"/>
                  </svg>
                </a>
              )}
            </div>
            <div className="flex space-x-4 uppercase font-bold border-l border-stone-200/40 pl-5">
              <a href="#privacy" className="hover:text-[#00b5d5] transition-colors">Privacy</a>
              <a href="#terms" className="hover:text-[#00b5d5] transition-colors">Terms</a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}