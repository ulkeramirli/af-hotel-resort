// src/app/rooms/[id]/page.tsx
import { notFound } from "next/navigation";
import RoomDetail from "../../../components/RoomDetail";

const ALL_ROOMS = [
  {
    id: 'std-king',
    category: 'standard',
    title: { az: 'Superior King Otağı', en: 'Superior King Room', ru: 'Номер Супериор King' },
    price: '120 AZN',
    priceNum: 120,
    size: '42 m²',
    capacity: { az: '2 Böyük', en: '2 Adults', ru: '2 Взрослых' },
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80',
    ],
    desc: {
      az: 'Minimalist elementlərlə zənginləşdirilmiş klassik dizayn. İşgüzar və ya istirahət məqsədli səyahətlər üçün ideal seçimdir. Geniş pəncərələrdən Xəzər dənizinin möhtəşəm mənzərəsi açılır.',
      en: 'Classic design enriched with minimalist premium elements. An ideal choice for business or leisure travelers. Wide windows reveal stunning views of the Caspian Sea.',
      ru: 'Классический дизайн с минималистичными премиальными элементами. Идеален для деловых и туристических поездок. Широкие окна открывают потрясающий вид на Каспийское море.',
    },
    includes: {
      az: ['King-size yataq', 'Premium Wi-Fi', 'Mərmər vanna otağı', 'Nespresso maşını', 'Smart TV 55"', 'Mini-bar', 'Kondisioner', 'Təhlükəsizlik seyfi'],
      en: ['King-size bed', 'Premium Wi-Fi', 'Marble bathroom', 'Nespresso machine', 'Smart TV 55"', 'Mini-bar', 'Air conditioning', 'Safety deposit box'],
      ru: ['Кровать King-size', 'Премиум Wi-Fi', 'Мраморная ванная', 'Кофемашина Nespresso', 'Smart TV 55"', 'Мини-бар', 'Кондиционер', 'Сейф'],
    },
  },
  {
    id: 'std-twin',
    category: 'standard',
    title: { az: 'Superior Twin Otağı', en: 'Superior Twin Room', ru: 'Номер Супериор Twin' },
    price: '135 AZN',
    priceNum: 135,
    size: '45 m²',
    capacity: { az: '2 Böyük', en: '2 Adults', ru: '2 Взрослых' },
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80',
    ],
    desc: {
      az: 'İki ədəd geniş təkli yataq və funksional iş zonası ilə təmin olunmuş lüks qonaqlıq təcrübəsi.',
      en: 'A luxury stay featuring two spacious twin beds and a highly functional work area.',
      ru: 'Роскошное пространство с двумя раздельными кроватями и функциональной рабочей зоной.',
    },
    includes: {
      az: ['2 ədəd təkli yataq', 'Yüksək sürətli Wi-Fi', 'İş masası', 'Mini-bar', 'Smart TV', 'Kondisioner'],
      en: ['2 Twin beds', 'High-speed Wi-Fi', 'Work desk', 'Mini-bar', 'Smart TV', 'Air conditioning'],
      ru: ['2 Раздельные кровати', 'Высокоскоростной Wi-Fi', 'Рабочий стол', 'Мини-бар', 'Smart TV', 'Кондиционер'],
    },
  },
  {
    id: 'dlx-sea',
    category: 'deluxe',
    title: { az: 'Dəniz Mənzərəli Deluxe', en: 'Deluxe Ocean Suite', ru: 'Делюкс с видом на море' },
    price: '240 AZN',
    priceNum: 240,
    size: '68 m²',
    capacity: { az: '3 Böyük', en: '3 Adults', ru: '3 Взрослых' },
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
    ],
    desc: {
      az: 'Xəzər dənizinin sonsuz üfüqlərinə açılan panoram pəncərələr və geniş fərdi istirahət terası.',
      en: 'Panoramic windows facing the Caspian Sea and a vast private terrace for ultimate relaxation.',
      ru: 'Панорамные окна с видом на Каспийское море и просторная частная терраса.',
    },
    includes: {
      az: ['Panoramik dəniz mənzərəsi', 'Xüsusi geniş terasa', 'Ağıllı ev sistemi', 'Jacuzzi', 'Premium mini-bar', 'Butler xidməti'],
      en: ['Panoramic sea view', 'Private large terrace', 'Smart home system', 'Jacuzzi', 'Premium mini-bar', 'Butler service'],
      ru: ['Панорамный вид на море', 'Большая терраса', 'Умный дом', 'Джакузи', 'Премиум mini-bar', 'Батлер-сервис'],
    },
  },
  {
    id: 'dlx-family',
    category: 'deluxe',
    title: { az: 'Premium Ailəvi Süit', en: 'Premium Family Suite', ru: 'Семейный Люкс' },
    price: '280 AZN',
    priceNum: 280,
    size: '75 m²',
    capacity: { az: '4 Böyük', en: '4 Adults', ru: '4 Взрослых' },
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    ],
    desc: {
      az: 'Uşaqları ilə səyahət edən ailələr üçün xüsusi planlaşdırılmış geniş iki otaqlı lüks süit.',
      en: 'Spacious two-room suite designed for families with children.',
      ru: 'Двухкомнатный люкс, разработанный специально для семей с детьми.',
    },
    includes: {
      az: ['2 ayrı otaq', 'Uşaq çarpayısı (istəklə)', 'Geniş eyvan', 'Oyun konsolu', 'Ailə mini-bar', 'Smart TV × 2'],
      en: ['Two separate rooms', 'Baby cot (on request)', 'Large balcony', 'Gaming console', 'Family mini-bar', 'Smart TV × 2'],
      ru: ['Две изолированные комнаты', 'Детская кроватка', 'Большой балкон', 'Мини-бар', 'Smart TV × 2'],
    },
  },
  {
    id: 'cot-duplex',
    category: 'cottage',
    title: { az: 'Ailəvi Kotec', en: 'Family Cottage', ru: 'Семейный Коттедж' },
    price: '450 AZN',
    priceNum: 450,
    size: '140 m²',
    capacity: { az: '5 Böyük', en: '5 Adults', ru: '5 Взрослых' },
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    ],
    desc: {
      az: 'Tam məxfilik təmin edən iki mərtəbəli villa. Şəxsi bağçası, mətbəxi və ailəvi şam yeməyi zonası mövcuddur.',
      en: 'Two-story villa providing absolute privacy with a private garden, full kitchen, and dining area.',
      ru: 'Двухэтажная вилла для полного уединения с садом, кухней и обеденной зоной.',
    },
    includes: {
      az: ['2 Mərtəbəli villa', 'Tam mətbəx', 'Şəxsi həyət + manqal', 'Paltaryuyan maşın', 'Parklanma yeri', '3 yataq otağı'],
      en: ['2-Story villa', 'Full kitchen', 'Private yard + BBQ', 'Washing machine', 'Parking spot', '3 Bedrooms'],
      ru: ['2 этажа', 'Полная кухня', 'Двор + мангал', 'Стиральная машина', 'Парковка', '3 Спальни'],
    },
  },
  {
    id: 'cot-presidential',
    category: 'cottage',
    title: { az: 'Prezident Rezidensiyası', en: 'Presidential Villa', ru: 'Президентская Вилла' },
    price: '750 AZN',
    priceNum: 750,
    size: '220 m²',
    capacity: { az: '6 Böyük', en: '6 Adults', ru: '6 Взрослых' },
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80',
    ],
    desc: {
      az: 'Qapalı çimərlik zonasına çıxışı olan ultra-lüks fərdi rezidensiya. Fərdi hovuz və 24/7 butler xidməti.',
      en: 'Ultra-luxury beachfront villa with private pool and 24/7 dedicated butler service.',
      ru: 'Вилла высшего класса с выходом на пляж, личным бассейном и батлером 24/7.',
    },
    includes: {
      az: ['Çimərliyə birбаşa çıxış', 'Şəxsi hovuz + Jacuzzi', '24/7 Butler', 'Hava limanı transferi', 'Şef aşpaz', '4 yataq otağı'],
      en: ['Direct beach access', 'Private pool + Jacuzzi', '24/7 Butler', 'Airport transfer', 'Personal chef', '4 Bedrooms'],
      ru: ['Выход к морю', 'Бассейн + Джакузи', 'Батлер 24/7', 'Трансфер из аэропорта', 'Личный повар', '4 Спальни'],
    },
  },
];

export async function generateStaticParams() {
  return ALL_ROOMS.map(r => ({ id: r.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const room = ALL_ROOMS.find(r => r.id === id);
  if (!room) return { title: 'Room not found' };
  return {
    title: `${room.title.en} — AF Hotel & Aqua Park`,
    description: room.desc.en,
  };
}

export default async function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const room = ALL_ROOMS.find(r => r.id === id);
  if (!room) notFound();
  
  return <RoomDetail room={room} allRooms={ALL_ROOMS} />;
}