'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { getReviews } from '@/services/api';
import type { Review as ApiReview } from '@/types/api';

const content = {
  az: { tag: 'QONAQ RƏYLƏRİ', title: 'Qonaqlarımız Danışır', subtitle: 'Həqiqi qonaqların AF Hotel haqqında fikirləri', hotelReply: 'Otelin Cavabı', empty: 'Hələ rəy yoxdur.' },
  en: { tag: 'GUEST REVIEWS', title: 'Our Guests Speak', subtitle: 'Real impressions from guests who stayed at AF Hotel', hotelReply: "Hotel's Reply", empty: 'No reviews yet.' },
  ru: { tag: 'ОТЗЫВЫ ГОСТЕЙ', title: 'Говорят Наши Гости', subtitle: 'Реальные впечатления гостей AF Hotel', hotelReply: 'Ответ Отеля', empty: 'Отзывов пока нет.' },
};

const fallbackReviews: ApiReview[] = [
  { id: '1', userName: 'Aynur Həsənova', userImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80', userEmail: 'a@mail.az', comment: 'Əla istirahət! Akvapark uşaqlar üçün mükəmməldir.', rating: 5, replyText: 'Hörmətli Aynur xanım, rəyiniz üçün sağ olun!' },
  { id: '2', userName: 'Sarah Johnson', userImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80', userEmail: 's@gmail.com', comment: 'Amazing beach resort!', rating: 5, replyText: 'Dear Sarah, thank you!' },
];

export default function Reviews() {
  const { language } = useLanguage();
  const l = (language as 'az' | 'en' | 'ru') || 'az';
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

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <section id="reviews" className="py-32 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <span className="text-[#00b5d5] text-[10px] font-bold tracking-[0.4em] uppercase block mb-3">{c.tag}</span>
            <h2 className="text-3xl md:text-5xl font-light text-[#1e325c] font-serif">{c.title}</h2>
            <p className="text-sm text-stone-400 mt-3">{c.subtitle}</p>
          </div>
          <div className="flex items-center gap-4 bg-[#f9f8f4] rounded-2xl px-8 py-5">
            <span className="text-5xl font-bold text-[#1e325c] font-serif">{avgRating}</span>
            <div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-stone-400 mt-1">{reviews.length} rəy</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#f9f8f4] rounded-2xl h-48 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-[#f9f8f4] rounded-2xl p-6 border border-stone-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <Image src={review.userImage} alt={review.userName} fill sizes="40px" className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1e325c]">{review.userName}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed line-clamp-4">{review.comment}</p>
                {review.replyText && (
                  <div className="mt-4 bg-white border border-[#00b5d5]/20 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-[#00b5d5] uppercase">{c.hotelReply}</span>
                    <p className="text-xs text-stone-500 mt-1">{review.replyText}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}