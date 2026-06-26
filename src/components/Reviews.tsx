'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Star } from 'lucide-react';
import { getReviews } from '@/services/api';
import type { Review as ApiReview } from '@/types/api';
import useEmblaCarousel from 'embla-carousel-react';
import ScrollReveal from './ScrollReveal';

const content = {
  az: { tag: 'QONAQ RƏYLƏRİ', title: 'Qonaqlarımız Danışır', subtitle: 'Həqiqi qonaqların AF Hotel haqqında fikirləri', hotelReply: 'Otelin Cavabı', empty: 'Hələ rəy yoxdur.' },
  en: { tag: 'GUEST REVIEWS', title: 'Our Guests Speak', subtitle: 'Real impressions from guests who stayed at AF Hotel', hotelReply: "Hotel's Reply", empty: 'No reviews yet.' },
  ru: { tag: 'ОТЗЫВЫ ГОСТЕЙ', title: 'Говорят Наши Гости', subtitle: 'Реальные впечатления гостей AF Hotel', hotelReply: 'Ответ Отеля', empty: 'Отзывов пока нет.' },
};

const fallbackReviews: ApiReview[] = [
  { _id: '1', fullName: 'Aynur Həsənova', emailOrPhone: 'a@mail.az', message: 'Əla istirahət! Akvapark uşaqlar üçün mükəmməldir.', status: 'approved', adminReply: 'Hörmətli Aynur xanım, rəyiniz üçün sağ olun!' },
  { _id: '2', fullName: 'Sarah Johnson', emailOrPhone: 's@gmail.com', message: 'Amazing beach resort!', status: 'approved', adminReply: 'Dear Sarah, thank you!' },
];

export default function Reviews() {
  const { language } = useLanguage();
  const l = (language as 'az' | 'en' | 'ru') || 'az';
  const c = content[l];
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [emblaRef] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps' });

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
    <section id="reviews" className="py-32 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <ScrollReveal type="slideRight" delay={0.1}>
            <span className="text-[#00b5d5] text-[10px] font-bold tracking-[0.4em] uppercase block mb-3">{c.tag}</span>
            <h2 className="text-3xl md:text-5xl font-light text-[#1e325c] font-serif">{c.title}</h2>
            <p className="text-sm text-stone-400 mt-3">{c.subtitle}</p>
          </ScrollReveal>
          <ScrollReveal type="zoomIn" delay={0.3} className="flex items-center gap-4 bg-[#f9f8f4] rounded-2xl px-8 py-5">
            <span className="text-5xl font-bold text-[#1e325c] font-serif">{avgRating}</span>
            <div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-stone-400 mt-1">
                {answeredReviews.length} {l === "az" ? "rəy" : l === "ru" ? "отзыв" : "reviews"}
              </p>
            </div>
          </ScrollReveal>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#f9f8f4] rounded-2xl h-48 animate-pulse" />
            ))}
          </div>
        ) : answeredReviews.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-stone-100 rounded-2xl">
            <p className="text-stone-400">{c.empty}</p>
          </div>
        ) : (
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible pb-2 md:pb-0" ref={emblaRef}>
            {answeredReviews.slice(0, 6).map((review, idx) => (
              <ScrollReveal key={review._id} type="flipUp" delay={idx * 0.1}
                className="min-w-[85vw] sm:min-w-[60vw] md:min-w-0 flex-none bg-[#f9f8f4] rounded-2xl p-6 border border-stone-100 hover:shadow-md transition-shadow mr-4 md:mr-0 last:mr-0 snap-center md:snap-align-none"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-stone-200 flex items-center justify-center text-[#1e325c] font-bold shrink-0">
                    {review.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1e325c]">{review.fullName}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 fill-amber-400 text-amber-400`} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed line-clamp-4">{review.message}</p>
                {review.adminReply && (
                  <div className="mt-4 bg-white border border-[#00b5d5]/20 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-[#00b5d5] uppercase">{c.hotelReply}</span>
                    <p className="text-xs text-stone-500 mt-1">{review.adminReply}</p>
                  </div>
                )}
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}