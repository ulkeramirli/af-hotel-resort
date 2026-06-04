'use client';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';
import InfoModal from './InfoModal';

export default function Dining() {
  const { t } = useLanguage();
  const [modalData, setModalData] = useState({ isOpen: false, title: '', desc: '' });

  const diningImages = [
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
  ];

  return (
    <section id="dining" className="py-36 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        
        <div className="mb-20">
          <span className="text-slate-400 text-[10px] font-semibold tracking-[0.25em] uppercase block mb-3">
            {t.features.diningTag}
          </span>
          <h2 className="text-3xl md:text-5xl font-light text-slate-900 tracking-tight font-serif">
            {t.features.diningTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {t.features.diningItems.map((item, index) => (
            <div 
              key={index}
              onClick={() => setModalData({
                isOpen: true,
                title: item.title,
                desc: `${item.desc}\n\nOur haute gastronomy philosophy champions authentic local sourcing, avant-garde presentations, and pristine ingredient integrity. Curated spaces provide a highly intimate fine-dining ambiance under pristine glass or open starlight skies, elevated through seamless professional sommelier accompaniment.`
              })}
              className="group flex flex-col justify-between cursor-pointer border-b border-slate-100 pb-10 transition-all duration-500 hover:border-slate-300"
            >
              <div className="relative h-105 w-full rounded-4xl overflow-hidden bg-slate-50 mb-8 border border-slate-100 shadow-xs group-hover:shadow-xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                <Image 
                  src={diningImages[index]} 
                  alt={item.title} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-1500 ease-[cubic-bezier(0.16,1,0.3,1)] scale-100 group-hover:scale-103"
                />
                <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/10 transition-colors duration-500" />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xl font-light text-slate-950 tracking-wide transition-colors duration-300 group-hover:text-slate-600">
                    {item.title}
                  </h3>
                  <span className="text-[9px] font-semibold tracking-widest text-slate-400 uppercase">
                    0{index + 1}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-light leading-relaxed max-w-xl">
                  {item.desc}
                </p>
                <div className="pt-4 text-[10px] font-semibold tracking-widest uppercase text-slate-900 group-hover:text-slate-400 transition-colors duration-300">
                  {t.rooms.moreInfo} →
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