import { NextResponse } from 'next/server';

interface Room {
  id: string;
  category: 'standard' | 'deluxe' | 'cottage';
  title: { az: string; en: string; ru: string };
  price: string;
  size: string;
  capacity: { az: string; en: string; ru: string };
  images: string[];
  desc: { az: string; en: string; ru: string };
  includes: { az: string[]; en: string[]; ru: string[] };
}

// Имитация базы данных (Mock DB) на 500+ комнат
const ALL_ROOMS_FROM_DB: Room[] = [
  {
    id: 'std-king',
    category: 'standard',
    title: { az: 'Superior King Otağı', en: 'Superior King Room', ru: 'Номер Супериор King' },
    price: '120 AZN',
    size: '42 m²',
    capacity: { az: '2 Böyük', en: '2 Adults', ru: '2 Взрослых' },
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80'
    ],
    desc: {
      az: 'Minimalist elementlərlə zənginləşdirilmiş klassik dizayn. İşgüzar və ya istirahət məqsədli səyahətlər üçün ideal seçimdir.',
      en: 'Classic design enriched with minimalist premium elements. An ideal choice for business or leisure travelers.',
      ru: 'Классический дизайн, обогащенный премиальными элементами минимализма. Идеальный выбор для отдыха и уединения.'
    },
    includes: {
      az: ['King-size yataq', 'Premium Wi-Fi', 'Mərmər vanna otağı', 'Nespresso maşını'],
      en: ['King-size bed', 'Premium Wi-Fi', 'Marble bathroom', 'Nespresso machine'],
      ru: ['Кровать King-size', 'Премиум Wi-Fi', 'Мраморная ванная', 'Кофемашина Nespresso']
    }
  },
  {
    id: 'std-twin',
    category: 'standard',
    title: { az: 'Superior Twin Otağı', en: 'Superior Twin Room', ru: 'Номер Супериор Twin' },
    price: '135 AZN',
    size: '45 m²',
    capacity: { az: '2 Böyük', en: '2 Adults', ru: '2 Взрослых' },
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80'
    ],
    desc: {
      az: 'İki ədəd geniş təkli yataq və funksional iş zonası ilə təmin olunmuş lüks qonaqlıq təcrübəsi.',
      en: 'A luxury stay experience featuring two spacious twin beds and a highly functional work area.',
      ru: 'Роскошное пространство с двумя раздельными кроватями и функциональной зоной для работы или отдыха.'
    },
    includes: {
      az: ['İki ədəd geniş təkli yataq', 'Yüksək sürətli internet', 'İş masası', 'Mini-bar'],
      en: ['2 Twin beds', 'High-speed internet', 'Work desk', 'Mini-bar'],
      ru: ['2 Раздельные кровати', 'Высокоскоростной интернет', 'Рабочий стол', 'Мини-бар']
    }
  },
  {
    id: 'std-comfort',
    category: 'standard',
    title: { az: 'Classic Comfort Otağı', en: 'Classic Comfort Room', ru: 'Номер Классик Комфорт' },
    price: '110 AZN',
    size: '38 m²',
    capacity: { az: '2 Böyük', en: '2 Adults', ru: '2 Взрослых' },
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80'
    ],
    desc: {
      az: 'Sakit tonlarda dizayn edilmiş, ailəvi qonaqlıq və ya tək səyahət edənlər üçün ideal minimalist otaq.',
      en: 'Designed in calm pastel tones, an ideal minimalist room for solo travelers or couples.',
      ru: 'Выполненный в спокойных пастельных тонах, этот номер идеален для спокойного отдыха после насыщенного дня.'
    },
    includes: {
      az: ['Geniş çarpayı', 'Yüksək sürətli Wi-Fi', 'Smart TV', 'Çay dəsti'],
      en: ['Queen-size bed', 'High-speed Wi-Fi', 'Smart TV', 'Tea & Coffee setup'],
      ru: ['Удобная кровать', 'Высокоскоростной Wi-Fi', 'Smart TV', 'Чайный набор']
    }
  },
  {
    id: 'dlx-sea',
    category: 'deluxe',
    title: { az: 'Dəniz Mənzərəli Deluxe', en: 'Deluxe Ocean Suite', ru: 'Делюкс Суит с видом на море' },
    price: '240 AZN',
    size: '68 m²',
    capacity: { az: '3 Böyük', en: '3 Adults', ru: '3 Взрослых' },
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80'
    ],
    desc: {
      az: 'Xəzər dənizinin sonsuz üfüqlərinə açılan panoram pəncərələr və geniş fərdi istirahət terası.',
      en: 'Panoramic windows looking out to the endless horizons of the Caspian Sea and a vast private terrace.',
      ru: 'Панорамные окна во всю стену, открывающие вид на бескрайнее море, и просторная частная терраса.'
    },
    includes: {
      az: ['Panoramik Dəniz mənzərəsi', 'Xüsusi böyük terasa', 'Ağıllı ev sistemi'],
      en: ['Panoramic Sea View', 'Private large terrace', 'Smart home automation'],
      ru: ['Панорамный вид на море', 'Большая терраса', 'Система Умный Дом']
    }
  },
  {
    id: 'dlx-executive',
    category: 'deluxe',
    title: { az: 'Executive Panoramik', en: 'Executive Panoramic', ru: 'Панорамный Люкс' },
    price: '310 AZN',
    size: '85 m²',
    capacity: { az: '3 Böyük', en: '3 Adults', ru: '3 Взрослых' },
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80'
    ],
    desc: {
      az: 'Müstəqil qonaq otağı, dəрин vanna və ekskluziv dizayn elementləri ilə zəngin fərdi rezidensia hissi.',
      en: 'Separate living room, deep soaking bathtub, and custom designer touches for an elite residential feel.',
      ru: 'Изолированная гостиная, глубокая отдельно стоящая ванная комната и утонченные дизайнерские акценты.'
    },
    includes: {
      az: ['Ayrı qonaq otağı', 'Mərmər dərin vanna', 'Geyim otağı'],
      en: ['Separate living area', 'Deep soaking tub', 'Walk-in closet'],
      ru: ['Отдельная гостиная', 'Глубокая ванна', 'Гардеробная комната']
    }
  },
  {
    id: 'dlx-family',
    category: 'deluxe',
    title: { az: 'Premium Ailəvi Süit', en: 'Premium Family Suite', ru: 'Премиум Семейный Люкс' },
    price: '280 AZN',
    size: '75 m²',
    capacity: { az: '4 Böyük', en: '4 Adults', ru: '4 Взрослых' },
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
    ],
    desc: {
      az: 'Uşaqları ilə səyahət edən ailələr üçün xüsusi olaraq planlaşdırılmış geniş iki otaqlı lüks süit.',
      en: 'Spacious two-room luxury suite designed especially for families traveling with children.',
      ru: 'Двухкомнатный номер повышенного комфорта, идеально спланированный для семейного отдыха с детьми.'
    },
    includes: {
      az: ['İki ayrı otaq', 'Uşaq çarpayısı (istəklə)', 'Geniş eyvan', 'Oyun konsolu (istəklə)'],
      en: ['Two separate rooms', 'Baby cot (on request)', 'Large balcony', 'Gaming console'],
      ru: ['Две изолированные комнаты', 'Детская кроватка', 'Большой балкон', 'Игровая приставка']
    }
  },
  {
    id: 'cot-duplex',
    category: 'cottage',
    title: { az: 'Ailəvi Kotec', en: 'Family Cottage', ru: 'Семейный Коттедж' },
    price: '450 AZN',
    size: '140 m²',
    capacity: { az: '5 Böyük', en: '5 Adults', ru: '5 Взрослых' },
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    desc: {
      az: 'Tam məxfilik təmin edən iki mərtəbəli villa. Şəxsi bağçası, mətbəxi və ailəvi şam yeməyi zonası mövcuddur.',
      en: 'A two-story villa providing absolute privacy. Features a private garden, fully-equipped kitchen, and dining area.',
      ru: 'Двухэтажная вилла для абсолютного уединения. Собственный ухоженный сад, кухня и просторная обеденная зона.'
    },
    includes: {
      az: ['2 Mərtəbəli villa', 'Tam təchizli mətbəx', 'Şəxsi həyət və manqal', 'Paltaryuyan maşın'],
      en: ['2-Story villa layout', 'Full built-in kitchen', 'Private yard & BBQ', 'Washing machine'],
      ru: ['2 уровня / этажа', 'Встроенная кухня', 'Свой дворик и мангал', 'Стиральная машина']
    }
  },
  {
    id: 'cot-presidential',
    category: 'cottage',
    title: { az: 'Prezident Rezidensiyası', en: 'Presidential Villa', ru: 'Президентская Вилла' },
    price: '750 AZN',
    size: '220 m²',
    capacity: { az: '6 Böyük', en: '6 Adults', ru: '6 Взрослых' },
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80'
    ],
    desc: {
      az: 'Qapalı çimərlik zonasına çıxışı olan ultra-lüks fərdi rezidensiya. Fərdi hovuz və 24/7 batler xidməti.',
      en: 'Ultra-luxury beachfront villa with direct private beach access, a personal pool, and 24/7 dedicated butler service.',
      ru: 'Вилла высшего класса с выходом на закрытый пляж, собственным бассейном и круглосуточным обслуживанием батлера.'
    },
    includes: {
      az: ['Çimərliyə birbaşa çıxış', 'Şəxsi hovuz / Cakuzi', '24/7 Şəxsi Butler', 'Hava limanı transferi'],
      en: ['Direct beach access', 'Private pool & jacuzzi', '24/7 Personal Butler', 'VIP Airport transfer'],
      ru: ['Прямой выход к морю', 'Личный бассейн и джакузи', 'Батлер-сервис 24/7', 'VIP-Трансфер']
    }
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '8', 10);
    const category = searchParams.get('category') || 'all';

    let filteredRooms = ALL_ROOMS_FROM_DB;
    if (category !== 'all') {
      filteredRooms = ALL_ROOMS_FROM_DB.filter(room => room.category === category);
    }

    const total = filteredRooms.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const itemsForPage = filteredRooms.slice(startIndex, endIndex);

    return NextResponse.json({
      rooms: itemsForPage,
      hasMore: endIndex < total,
      total
    });
  } catch (error) {
    console.error('API Rooms Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}