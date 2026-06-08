'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

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

export default function Rooms() {
  const { lang } = useLanguage();
  const currentLang = (lang as 'az' | 'en' | 'ru') || 'az';
  
  const [activeCategory, setActiveCategory] = useState<'all' | 'standard' | 'deluxe' | 'cottage'>('all');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const roomsData: Room[] = [
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

  const filteredRooms = activeCategory === 'all' 
    ? roomsData 
    : roomsData.filter(room => room.category === activeCategory);

  const tabs = {
    all: { az: 'Hamısı', en: 'All Rooms', ru: 'Все категории' },
    standard: { az: 'Standart', en: 'Standard', ru: 'Стандарт' },
    deluxe: { az: 'Lüks Süitlər', en: 'Suites', ru: 'Люксы' },
    cottage: { az: 'Koteclər', en: 'Cottages', ru: 'Коттеджи' }
  };

  const btnText = { az: 'Ətraflı', en: 'Details', ru: 'Подробнее' }[currentLang];
  const bookText = { az: 'Bu nömrəni bron et', en: 'Reserve This Room', ru: 'Забронировать номер' }[currentLang];
  const quickBookText = { az: 'Bron et', en: 'Book', ru: 'Бронь' }[currentLang];
  const inclTitle = { az: 'Otağın üstünlükləri:', en: 'Room Amenities:', ru: 'В номере имеется:' }[currentLang];

  const openDetails = (room: Room) => {
    setSelectedRoom(room);
    setActiveImgIndex(0);
  };

  const handleRoomSelection = (roomId: string) => {
    const event = new CustomEvent('selectRoomForBooking', { detail: roomId });
    window.dispatchEvent(event);
    setSelectedRoom(null);
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="rooms" className="py-24 bg-white text-stone-900 select-none font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 space-y-12">
        
       {/* zaqolovok */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extralight font-serif text-[#1e325c] tracking-tight leading-tight">
            {currentLang === 'az' ? 'Zəriflik və Rahatlığın Harmoniyası' : currentLang === 'en' ? 'A Sanctuary of Refined Comfort' : 'Искусство Роскошного Отдыха'}
          </h2>
        </div>

       {/* filtri i tabi kartochek */}
        <div className="w-full max-w-2xl mx-auto border-b border-stone-100">
          <div className="flex overflow-x-auto md:flex-wrap md:justify-center items-center gap-x-6 gap-y-2 pb-2 text-[11px] uppercase tracking-widest font-light [ms-overflow-style:none] [&::-webkit-scrollbar]:hidden whitespace-nowrap scroll-smooth scrollbar-none">
            {(['all', 'standard', 'deluxe', 'cottage'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`pb-2 transition-all relative cursor-pointer shrink-0 ${
                  activeCategory === cat 
                    ? 'text-[#00b5d5] font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-[#00b5d5]' 
                    : 'text-stone-400 hover:text-[#00b5d5]'
                }`}
              >
                {tabs[cat][currentLang]}
              </button>
            ))}
          </div>
        </div>

        {/* setka kartochek */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredRooms.map((room) => (
            <div 
              key={room.id} 
              onClick={() => openDetails(room)}
              className="group flex flex-col justify-between bg-white border border-stone-200/50 p-3 pb-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:border-stone-300/80 cursor-pointer transform hover:-translate-y-0.5"
            >
              <div className="space-y-3">
                <div className="overflow-hidden bg-stone-100 aspect-4/3 relative w-full rounded-lg">
                  <Image 
                    src={room.images[0]} 
                    alt={room.title[currentLang]} 
                    fill
                    unoptimized
                    sizes="(max-w-7xl) 25vw, 100vw"
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out" 
                  />
                </div>

                <div className="space-y-1.5 text-left px-1">
                  <h3 className="text-base font-serif text-stone-900 font-light tracking-wide truncate group-hover:text-[#00b5d5] transition-colors">
                    {room.title[currentLang]}
                  </h3>
                  <div className="text-[10px] text-stone-400 uppercase tracking-wider font-light flex items-center space-x-2">
                    <span>{room.size}</span>
                    <span>•</span>
                    <span>{room.capacity[currentLang]}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 pt-3 px-1">
                <div className="h-px bg-stone-100 w-full"></div>
                <div className="flex justify-between items-end">
                  <div className="text-left">
                    <span className="text-[9px] text-stone-400 font-sans uppercase tracking-wider block">From</span>
                    <span className="font-serif text-sm font-semibold text-[#1e325c]">{room.price}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] font-medium text-stone-400 group-hover:text-stone-900 tracking-widest uppercase transition-colors">
                      {btnText}
                    </span>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); 
                        handleRoomSelection(room.id);
                      }}
                      className="text-[10px] font-semibold bg-[#ff6c02] text-white px-2.5 py-1 rounded-md hover:bg-[#e55f00] tracking-wider uppercase cursor-pointer transition-colors shadow-sm"
                    >
                      {quickBookText}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* modalnoye okno */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6 animate-fade-in">
          
          {/* qlavniy vid kartochki na mobile */}
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col lg:grid lg:grid-cols-12 max-h-[88vh] lg:h-[73vh] relative overflow-hidden">
            
            {/* krestik zakritiya */}
              <button 
                 onClick={() => setSelectedRoom(null)}
                 className="absolute top-2.5 right-2.5 z-50 w-9 h-9 lg:w-8 lg:h-8 flex items-center justify-center rounded-full bg-white/95 hover:bg-stone-100 text-[#1e325c] hover:text-[#ff6c02] transition-all cursor-pointer shadow-md border border-stone-200/80"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                 </svg>
              </button>

            {/* vnitrenniy konteyney dla mobilnoqo scrolla */}
            <div className="flex flex-col flex-1 overflow-y-auto lg:overflow-hidden lg:grid lg:grid-cols-12 lg:col-span-12 lg:h-full">

              {/* levaya kolonna: izobrazheniya  */}
              <div className="lg:col-span-6 bg-stone-50 p-5 flex flex-col justify-center shrink-0 lg:h-full border-b lg:border-b-0 lg:border-r border-stone-100">
                <div className="w-full bg-stone-200 relative border border-stone-200/40 rounded-xl overflow-hidden flex-1 aspect-video lg:aspect-[4/3.3] max-h-52 lg:max-h-none">
                  <Image 
                    src={selectedRoom.images[activeImgIndex]} 
                    alt="Room preview" 
                    fill
                    unoptimized
                    sizes="(max-w-5xl) 50vw, 100vw"
                    className="object-cover transition-all duration-300"
                  />
                </div>
                
                <div className="grid grid-cols-4 gap-2 mt-3 shrink-0">
                  {selectedRoom.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImgIndex(idx)}
                      className={`bg-stone-200 cursor-pointer transition-all relative border rounded-lg overflow-hidden aspect-video lg:aspect-[4/3.3] ${
                        activeImgIndex === idx ? 'border-[#ff6c02] scale-[0.98]' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image src={img} alt="Thumbnail" fill unoptimized sizes="10vw" className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* pravaya kolonna: tekst i knopka bronirovaniya */}
              <div className="lg:col-span-6 flex flex-col bg-white flex-1 min-h-0 lg:h-full">
                
                {/* tekst kontenta scrollilsya nezavisemo ot kontenta */}
                <div className="flex-1 lg:overflow-y-auto p-6 md:p-8 space-y-4 text-left pr-6 lg:pr-8">
                  <div className="space-y-1">
                    <span className="text-[9px] text-[#00b5d5] uppercase tracking-widest font-bold block">
                      {tabs[selectedRoom.category][currentLang]}
                    </span>
                    <h3 className="text-xl font-serif text-[#1e325c] font-light leading-tight tracking-wide">
                      {selectedRoom.title[currentLang]}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-4 text-[10px] uppercase tracking-widest font-light text-stone-400 border-y border-stone-100 py-2">
                    <div>Size: <span className="text-stone-800 font-normal">{selectedRoom.size}</span></div>
                    <div>•</div>
                    <div>Occupancy: <span className="text-stone-800 font-normal">{selectedRoom.capacity[currentLang]}</span></div>
                  </div>

                  <p className="text-xs text-stone-500 font-light leading-relaxed font-sans">
                    {selectedRoom.desc[currentLang]}
                  </p>

                  <div className="space-y-2 pt-1">
                    <h4 className="text-[9px] font-bold uppercase tracking-widest text-stone-400">{inclTitle}</h4>
                    <div className="grid grid-cols-1 gap-y-1.5 pt-1">
                      {selectedRoom.includes[currentLang].map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center space-x-2.5 text-xs font-light text-stone-600">
                          <span className="w-1 h-1 bg-[#00b5d5] rounded-full shrink-0"></span>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

               {/* nijnaya chast gde price i bronirovanie, ona otdelena ot teksta i scrollitsya nezavisimo, chtoby price i knopka vsegda byli na vidu  */}
                <div className="border-t border-stone-100 p-6 md:p-8 bg-stone-50/50 shrink-0 mt-auto">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-stone-400 block">Rate per night</span>
                      <span className="text-xl font-serif font-light text-[#1e325c]">{selectedRoom.price}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRoomSelection(selectedRoom.id)}
                    className="w-full bg-[#ff6c02] hover:bg-[#e55f00] text-white rounded-xl font-bold text-xs uppercase text-center py-3.5 transition-colors tracking-widest shadow-md cursor-pointer"
                  >
                    {bookText}
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}
    </section>
  );
}