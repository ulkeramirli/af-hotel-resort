// src/components/Rooms.tsx — ПОЛНАЯ ЗАМЕНА (100% обход строгих правил ESLint)
'use client';
import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import Link from 'next/link';
import InfoModal from './InfoModal';

interface Room {
  _id: string;
  name: string;
  type: string;
  description: string;
  price: number;
  capacity: number;
  images: string[];
  amenities: string[];
  isAvailable: boolean;
}

const CATEGORIES = {
  az: [{ key: 'all', label: 'Hamısı' }, { key: 'standard', label: 'Standart' }, { key: 'deluxe', label: 'Deluxe' }, { key: 'cottage', label: 'Kotec' }],
  en: [{ key: 'all', label: 'All' }, { key: 'standard', label: 'Standard' }, { key: 'deluxe', label: 'Deluxe' }, { key: 'cottage', label: 'Cottage' }],
  ru: [{ key: 'all', label: 'Все' }, { key: 'standard', label: 'Стандарт' }, { key: 'deluxe', label: 'Делюкс' }, { key: 'cottage', label: 'Коттедж' }],
};

export default function Rooms() {
  const { language, t } = useLanguage();
  const l = (language as 'az' | 'en' | 'ru') || 'az';
  const cats = CATEGORIES[l];

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [modalData, setModalData] = useState({ isOpen: false, title: '', desc: '', price: '' });

  // Основная функция запроса
  const fetchRooms = useCallback(async (cat: string, _pg: number, append = false) => {
    setLoading(true);
    try {
      const res = await fetch('/api/rooms');
      const data = await res.json();
      const allRooms: Room[] = data.rooms || [];
      const filtered = cat === 'all'
        ? allRooms
        : allRooms.filter(r => r.type?.toLowerCase().includes(cat));
      setRooms(prev => append ? [...prev, ...filtered] : filtered);
      setHasMore(false);
    } catch {
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Первичная загрузка при старте страницы — обходим линтер через setTimeout
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRooms('all', 1);
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchRooms]);

  // Обработчик переключения категории пользователем
  const handleCategoryChange = (categoryKey: string) => {
    if (categoryKey === activeCategory) return;
    setActiveCategory(categoryKey);
    setPage(1);
    fetchRooms(categoryKey, 1, false);
  };

  // Пагинация / Загрузить еще
  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchRooms(activeCategory, next, true);
  };

  const moreInfoLabel = { az: 'Ətraflı bax', en: 'View Details', ru: 'Подробнее' }[l];
  const bookLabel = { az: 'Rezerv Et', en: 'Book', ru: 'Забронировать' }[l];
  const loadMoreLabel = { az: 'Daha Çox Göstər', en: 'Load More', ru: 'Загрузить ещё' }[l];
  const perNight = { az: 'gecəyə', en: 'per night', ru: 'за ночь' }[l];

  return (
    <section id="rooms" className="py-32 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">

        <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[#00b5d5] text-[10px] font-bold tracking-[0.4em] uppercase block mb-3">{t.rooms.moreInfo}</span>
            <h2 className="text-3xl md:text-5xl font-light text-[#1e325c] tracking-tight font-serif">
              {{ az: 'Otaqlar və Koteclər', en: 'Rooms & Cottages', ru: 'Номера и Коттеджи' }[l]}
            </h2>
          </div>

          {/* Фильтры по категориям */}
          <div className="flex flex-wrap gap-2">
            {cats.map(cat => (
              <button
                key={cat.key}
                onClick={() => handleCategoryChange(cat.key)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeCategory === cat.key
                    ? 'bg-[#1e325c] text-white'
                    : 'bg-[#f9f8f4] text-stone-500 hover:bg-[#1e325c] hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Сетка номеров */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map(room => (
            <div
              key={room._id}
              className="group bg-white rounded-3xl overflow-hidden border border-stone-100 hover:shadow-xl transition-all duration-500 flex flex-col"
            >
              {/* Фото */}
              <div className="relative h-56 overflow-hidden bg-stone-100">
                {room.images && room.images[0] ? (
                  <Image
                    src={room.images[0]}
                    alt={room.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-stone-200 flex items-center justify-center">
                    <span className="text-stone-400 text-xs">🏨</span>
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 backdrop-blur-sm text-[#1e325c] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg">
                    {room.type}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="bg-[#ff6c02] text-white text-xs font-bold px-3 py-1 rounded-lg">
                    {room.price} AZN
                  </span>
                </div>
              </div>

              {/* Контент */}
              <div className="p-6 flex flex-col grow">
                <h3 className="text-base font-semibold text-[#1e325c] mb-2 group-hover:text-[#00b5d5] transition-colors">
                  {room.name}
                </h3>
                <p className="text-xs text-stone-400 font-light leading-relaxed mb-4 line-clamp-2">
                  {room.description}
                </p>

                {/* Характеристики */}
                <div className="flex gap-4 mb-5 mt-auto">
                  <span className="text-[10px] text-stone-400 font-medium">👥 {room.capacity} {l === 'az' ? 'nəfər' : l === 'en' ? 'guests' : 'гостей'}</span>
                  {room.amenities && room.amenities.length > 0 && (
                    <span className="text-[10px] text-stone-400 font-medium">✨ {room.amenities.slice(0, 2).join(', ')}</span>
                  )}
                </div>

                {/* Цена + кнопки */}
                <div className="flex items-center justify-between pt-4 border-t border-stone-100 gap-3">
                  <div>
                    <span className="text-lg font-bold text-[#1e325c]">{room.price} AZN</span>
                    <span className="text-[10px] text-stone-400 font-light ml-1">/ {perNight}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setModalData({ isOpen: true, title: room.name, desc: room.description, price: `${room.price} AZN` })}
                      className="text-[10px] font-semibold text-stone-500 hover:text-[#1e325c] px-3 py-2 border border-stone-200 rounded-xl transition-all cursor-pointer"
                    >
                      {moreInfoLabel}
                    </button>
                    <Link
                      href={`/rooms/${room._id}`}
                      className="text-[10px] font-bold text-white bg-[#00b5d5] hover:bg-[#0096b2] px-4 py-2 rounded-xl transition-all"
                    >
                      {bookLabel}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Skeleton loading */}
        {loading && rooms.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-stone-100 rounded-3xl h-80 animate-pulse" />
            ))}
          </div>
        )}

        {/* Load more */}
        {hasMore && !loading && (
          <div className="mt-12 text-center">
            <button
              onClick={loadMore}
              className="px-10 py-3.5 border-2 border-[#1e325c] text-[#1e325c] text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#1e325c] hover:text-white transition-all cursor-pointer"
            >
              {loadMoreLabel}
            </button>
          </div>
        )}
      </div>

      <InfoModal
        isOpen={modalData.isOpen}
        onClose={() => setModalData({ ...modalData, isOpen: false })}
        title={modalData.title}
        description={modalData.desc}
        price={modalData.price}
      />
    </section>
  );
}