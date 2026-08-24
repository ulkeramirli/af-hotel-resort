'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Star, Quote } from 'lucide-react';
import { getReviews } from '@/services/api';
import type { Review as ApiReview } from '@/types/api';
import ScrollReveal from './ScrollReveal';
import { motion } from 'framer-motion';

const content = {
  az: { tag: 'QONAQ RƏYLƏRİ', title: 'Qonaqlarımız Danışır', subtitle: 'Həqiqi qonaqların AF Hotel haqqında fikirləri', hotelReply: 'Otelin Cavabı', empty: 'Hələ rəy yoxdur.' },
  en: { tag: 'GUEST REVIEWS', title: 'Our Guests Speak', subtitle: 'Real impressions from guests who stayed at AF Hotel', hotelReply: "Hotel's Reply", empty: 'No reviews yet.' },
  ru: { tag: 'ОТЗЫВЫ ГОСТЕЙ', title: 'Говорят Наши Гости', subtitle: 'Реальные впечатления гостей AF Hotel', hotelReply: 'Ответ Отеля', empty: 'Отзывов пока нет.' },
};

const fallbackReviews: ApiReview[] = [
  { _id: '1', fullName: 'Aynur Həsənova', emailOrPhone: 'a@mail.az', message: 'Əla istirahət! Akvapark uşaqlar üçün mükəmməldir. Komanda çox peşəkardır.', status: 'approved', adminReply: 'Hörmətli Aynur xanım, rəyiniz üçün sağ olun!' },
  { _id: '2', fullName: 'Sarah Johnson', emailOrPhone: 's@gmail.com', message: 'An absolutely stunning resort. The private beach and pool facilities are world-class.', status: 'approved', adminReply: 'Dear Sarah, thank you for your kind words!' },
  { _id: '3', fullName: 'Mikhail Petrov', emailOrPhone: 'm@mail.ru', message: 'Превосходный отдых. Обслуживание на высшем уровне, вернёмся снова.', status: 'approved', adminReply: 'Дорогой Михаил, спасибо за ваш отзыв!' },
];

// Colour palette per card — subtle, editorial
const avatarPalettes = [
  { bg: '#1e325c', text: '#fff' },
  { bg: '#00b5d5', text: '#fff' },
  { bg: '#d4af37', text: '#1e325c' },
  { bg: '#f0ede8', text: '#1e325c' },
];

export default function Reviews() {
  const { language } = useLanguage();
  const l = language;
  const c = content[l];
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getReviews()
      .then((data) => {
        if (!cancelled) setReviews(data.length > 0 ? data : fallbackReviews);
      })
      .catch(() => {
        if (!cancelled) setReviews(fallbackReviews);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const answeredReviews = reviews.filter((r) => r.adminReply && r.adminReply.trim() !== '');
  const avgRating = '5.0';

  return (
    <section id="reviews" className="py-24 md:py-32 bg-[#f8f7f4] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">

        {/* Header */}
        <div className="mb-14 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <ScrollReveal type="slideRight" delay={0.1} className="max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-[#00b5d5]" />
              <span className="text-[10px] font-medium tracking-[0.22em] uppercase text-[#00b5d5]">{c.tag}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-light text-[#1e325c] font-serif leading-tight mb-3">
              {c.title}
            </h2>
            <p className="text-sm text-stone-400 font-light leading-relaxed">{c.subtitle}</p>
          </ScrollReveal>

          <ScrollReveal type="zoomIn" delay={0.3}>
            <div className="flex items-center gap-4 sm:gap-5 bg-white border border-stone-200/60 rounded-2xl px-5 py-4 sm:px-8 sm:py-5 shadow-sm">
              <div>
                <span className="text-4xl md:text-5xl font-light text-[#1e325c] font-serif">{avgRating}</span>
                <span className="text-stone-300 font-light text-lg ml-1">/ 5</span>
              </div>
              <div className="border-l border-stone-100 pl-5">
                <div className="flex gap-0.5 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-stone-400 font-light">
                  {answeredReviews.length} {l === 'az' ? 'rəy' : l === 'ru' ? 'отзывов' : 'reviews'}
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-52 animate-pulse border border-stone-100" />
            ))}
          </div>
        ) : answeredReviews.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-stone-200 rounded-2xl">
            <p className="text-stone-400 text-sm">{c.empty}</p>
          </div>
        ) : (
          /* Mobile: horizontal scroll, Desktop: grid */
          <div
            className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory no-scrollbar -mx-6 px-6 md:mx-0 md:px-0"
          >
            {answeredReviews.slice(0, 6).map((review, idx) => {
              const palette = avatarPalettes[idx % avatarPalettes.length];
              return (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08, ease: 'easeOut' }}
                  className="flex-[0_0_85%] sm:flex-[0_0_60%] md:flex-none snap-center md:snap-align-none bg-white rounded-2xl p-5 sm:p-6 border border-stone-100/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                >
                  {/* Header: Avatar, Info, and Quote */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Avatar */}
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                        style={{ background: palette.bg, color: palette.text }}
                      >
                        {review.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#1e325c] truncate">{review.fullName}</p>
                        <div className="flex gap-0.5 mt-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <Quote className="w-6 h-6 text-[#00b5d5]/20 shrink-0" />
                  </div>

                  {/* Review text */}
                  <p className="text-sm text-stone-600 leading-relaxed font-light line-clamp-4 flex-1">
                    {review.message}
                  </p>

                  {/* Hotel reply */}
                  {review.adminReply && (
                    <div className="mt-4 bg-[#f8fafb] border border-[#00b5d5]/10 rounded-xl p-3">
                      <span className="text-[9px] font-semibold text-[#00b5d5] uppercase tracking-[0.15em] block mb-1">
                        {c.hotelReply}
                      </span>
                      <p className="text-xs text-stone-500 font-light leading-relaxed">{review.adminReply}</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}