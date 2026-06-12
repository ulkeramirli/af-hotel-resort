'use client';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import InfoModal from './InfoModal';

export default function Aquapark() {
  const { t } = useLanguage();
  const [modalData, setModalData] = useState({ isOpen: false, title: '', desc: '' });

  const aquaImages = [
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80',
  ];

  return (
    <section id="aquapark" className="py-36 bg-slate-50/50 border-t border-b border-slate-100 scroll-mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        
        <div className="mb-20 text-center md:text-left">
          <span className="text-slate-400 text-[10px] font-semibold tracking-[0.25em] uppercase block mb-3">
            {t.features.aquaTag}
          </span>
          <h2 className="text-3xl md:text-5xl font-light text-slate-900 tracking-tight font-serif">
            {t.features.aquaTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.features.aquaItems.map((item, index) => (
            <div 
              key={index} 
              onClick={() => setModalData({
                isOpen: true,
                title: item.title,
                desc: `${item.desc}\n\nDesigned as a monolithic leisure park integrated flawlessly into the Caspian coastline. Features advanced hydro-engineered structures, exceptional architectural layouts, clean automated multi-stage deep water filtrations, private cabana services, and constant safety observation by fully accredited experts.`
              })}
              className="bg-white rounded-[28px] overflow-hidden border border-slate-100 hover:border-slate-300 shadow-xs hover:shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col h-full cursor-pointer group transform hover:-translate-y-2"
            >
              <div className="relative h-72 w-full overflow-hidden bg-slate-50">
                <Image 
                  src={aquaImages[index]} 
                  alt={item.title} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-1200 ease-[cubic-bezier(0.16,1,0.3,1)] scale-100 group-hover:scale-103"
                />
                <div className="absolute inset-0 bg-slate-950/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <div className="p-8 flex flex-col grow justify-between space-y-6">
                <div className="space-y-3">
                  <h3 className="text-base font-medium text-slate-950 tracking-wide transition-colors duration-300 group-hover:text-slate-600">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                
                <div className="pt-2 flex items-center text-[10px] font-semibold tracking-widest uppercase text-slate-900 border-t border-slate-50 group-hover:text-slate-400 transition-colors duration-300">
                  <span>{t.rooms.moreInfo}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      <InfoModal 
        isOpen={modalData.isOpen}
        onClose={() => setModalData({ ...modalData, isOpen: false })}
        title={modalData.title}
        description={modalData.desc}
      />
    </section>
  );
}