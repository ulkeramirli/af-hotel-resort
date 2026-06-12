'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import { Star } from 'lucide-react';

interface Review {
  id: number;
  userName: string;
  userImage: string;
  comment: string;
  rating: number;
  replyText: string | null;
}

const content = {
  az: {
    tag: 'QONAQ RƏYLƏRİ',
    title: 'Qonaqlarımız Danışır',
    subtitle: 'Həqiqi qonaqların AF Hotel haqqında fikirləri',
    hotelReply: 'Otelin Cavabı',
    empty: 'Hələ rəy yoxdur.',
  },
  en: {
    tag: 'GUEST REVIEWS',
    title: 'Our Guests Speak',
    subtitle: 'Real impressions from guests who stayed at AF Hotel',
    hotelReply: "Hotel's Reply",
    empty: 'No reviews yet.',
  },
  ru: {
    tag: 'ОТЗЫВЫ ГОСТЕЙ',
    title: 'Говорят Наши Гости',
    subtitle: 'Реальные впечатления гостей, останавливавшихся в AF Hotel',
    hotelReply: 'Ответ Отеля',
    empty: 'Отзывов пока нет.',
  },
};

// Fallback отзывы если БД пустая
const mockReviews: Review[] = [
  {
    id: 1,
    userName: 'Aynur Həsənova',
    userImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80',
    comment: 'Əla istirahət! Akvapark uşaqlar üçün mükəmməldir. Otaqlar çox səliqəli və geniş idi. Mütləq yenidən gələcəyik!',
    rating: 5,
    replyText: 'Hörmətli Aynur xanım, rəyiniz üçün çox sağ olun! Sizi yenidən görməyə şad olacağıq.',
  },
  {
    id: 2,
    userName: 'Дмитрий Соколов',
    userImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80',
    comment: 'Прекрасный отель у моря. Персонал очень внимательный, кухня великолепная. Вид из номера просто завораживает.',
    rating: 5,
    replyText: 'Дорогой Дмитрий, благодарим за тёплые слова! Ждём вас снова.',
  },
  {
    id: 3,
    userName: 'Elçin Məmmədov',
    userImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80',
    comment: 'Ailə ilə çox yaxşı keçirdik. Hovuz böyük və təmiz. Xidmət yüksək səviyyədə. Restoran da çox ləziz idi.',
    rating: 4,
    replyText: null,
  },
  {
    id: 4,
    userName: 'Sarah Johnson',
    userImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80',
    comment: 'Amazing beach resort! The aqua park was incredible for the whole family. Clean rooms, friendly staff. Will definitely return!',
    rating: 5,
    replyText: 'Dear Sarah, thank you so much for your kind words! We look forward to welcoming you back.',
  },
  {
    id: 5,
    userName: 'Günel Əliyeva',
    userImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80',
    comment: 'Toy münasibəti ilə qaldıq. Hər şey mükəmməl idi. Personalın münasibəti xüsusilə çox xoş təəssürat buraxdı.',
    rating: 5,
    replyText: 'Hörmətli Günel xanım, xüsusi günüzü bizimlə bölüşdüyünüz üçün çox minnətdarıq!',
  },
  {
    id: 6,
    userName: 'Михаил Петров',
    userImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80',
    comment: 'Отличный отдых! Детям очень понравился аквапарк. Питание на высшем уровне. Рекомендую всем!',
    rating: 4,
    replyText: null,
  },
];

export default function Reviews() {
  const { language } = useLanguage();
  const currentLang = (language as 'az' | 'en' | 'ru') || 'az';
  const c = content[currentLang];

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => {
        setReviews(Array.isArray(data) && data.length > 0 ? data : mockReviews);
        setLoading(false);
      })
      .catch(() => {
        setReviews(mockReviews);
        setLoading(false);
      });
  }, []);

  // Средний рейтинг
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <section id="reviews" className="py-32 bg-white scroll-mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">

        {/* Заголовок */}
        <div className="mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <span className="text-[#00b5d5] text-[10px] font-bold tracking-[0.4em] uppercase block mb-3">
              {c.tag}
            </span>
            <h2 className="text-3xl md:text-5xl font-light text-[#1e325c] tracking-tight font-serif">
              {c.title}
            </h2>
            <p className="text-sm text-stone-400 font-light mt-3">{c.subtitle}</p>
          </div>

          {/* Средний рейтинг */}
          <div className="flex items-center gap-4 bg-[#f9f8f4] rounded-2xl px-8 py-5 shrink-0">
            <div>
              <span className="text-5xl font-bold text-[#1e325c] font-serif">{avgRating}</span>
              <div className="flex gap-0.5 mt-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-[#1e325c] uppercase tracking-wider">Google</p>
              <p className="text-xs text-stone-400 font-light mt-0.5">{reviews.length} rəy</p>
            </div>
          </div>
        </div>

        {/* Карточки отзывов */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-[#f9f8f4] rounded-2xl p-6 animate-pulse h-48" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map(review => (
              <div
                key={review.id}
                className="bg-[#f9f8f4] rounded-2xl p-6 space-y-4 hover:shadow-md transition-shadow duration-300 border border-stone-100"
              >
                {/* Автор */}
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                    <Image
                      src={review.userImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
                      alt={review.userName}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1e325c]">{review.userName}</p>
                    <div className="flex gap-0.5 mt-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200 fill-stone-200'}`}
                        />
                      ))}
                    </div>
                  </div>
                  {/* Google icon */}
                  <div className="ml-auto">
                    <svg width="18" height="18" viewBox="0 0 24 24" className="opacity-40">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </div>
                </div>

                {/* Текст отзыва */}
                <p className="text-xs text-stone-600 font-light leading-relaxed line-clamp-4">
                  {review.comment}
                </p>

                {/* Ответ отеля */}
                {review.replyText && (
                  <div className="bg-white border border-[#00b5d5]/20 rounded-xl p-3 space-y-1">
                    <span className="text-[10px] font-bold text-[#00b5d5] uppercase tracking-wider">
                      {c.hotelReply}
                    </span>
                    <p className="text-xs text-stone-500 font-light leading-relaxed">
                      {review.replyText}
                    </p>
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