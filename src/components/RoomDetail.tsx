// // src/components/RoomDetail.tsx
// 'use client';
// import { useState } from 'react';
// import { useLanguage } from '@/contexts/LanguageContext';
// import Image from 'next/image';
// import Link from 'next/link';
// import { ChevronLeft, ChevronRight, Check, BedDouble, Maximize2, Users, ArrowLeft } from 'lucide-react';

// interface Room {
//   id: string;
//   category: string;
//   title: { az: string; en: string; ru: string };
//   price: string;
//   priceNum: number;
//   size: string;
//   capacity: { az: string; en: string; ru: string };
//   images: string[];
//   desc: { az: string; en: string; ru: string };
//   includes: { az: string[]; en: string[]; ru: string[] };
// }

// interface Props {
//   room: Room;
//   allRooms: Room[];
// }

// const labels = {
//   az: { back: 'Geri', bookNow: 'İndi Rezerv Et', perNight: 'gecəyə', amenities: 'Otaq Xidmətləri', similar: 'Oxşar Otaqlar', size: 'Sahə', capacity: 'Tutum', category: 'Kateqoriya', checkIn: 'Giriş tarixi', checkOut: 'Çıxış tarixi', nights: 'gecə', total: 'Cəmi', book: 'Rezervasiyaya Keç' },
//   en: { back: 'Back', bookNow: 'Book Now', perNight: 'per night', amenities: 'Room Amenities', similar: 'Similar Rooms', size: 'Size', capacity: 'Capacity', category: 'Category', checkIn: 'Check-in', checkOut: 'Check-out', nights: 'nights', total: 'Total', book: 'Proceed to Booking' },
//   ru: { back: 'Назад', bookNow: 'Забронировать', perNight: 'за ночь', amenities: 'Удобства', similar: 'Похожие номера', size: 'Площадь', capacity: 'Вместимость', category: 'Категория', checkIn: 'Дата заезда', checkOut: 'Дата выезда', nights: 'ночей', total: 'Итого', book: 'Перейти к бронированию' },
// };

// export default function RoomDetail({ room, allRooms }: Props) {
//   const { language } = useLanguage();
//   const l = (language as 'az' | 'en' | 'ru') || 'az';
//   const lb = labels[l];

//   const [activeImg, setActiveImg] = useState(0);
//   const [checkIn, setCheckIn] = useState('');
//   const [checkOut, setCheckOut] = useState('');

//   const similar = allRooms.filter(r => r.id !== room.id && r.category === room.category).slice(0, 3);

//   const nights = checkIn && checkOut
//     ? Math.max(0, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
//     : 0;

//   const categoryLabel = { standard: 'Standard', deluxe: 'Deluxe', cottage: 'Cottage' }[room.category] || room.category;

//   return (
//     <div className="min-h-screen bg-[#f9f8f4]">
//       {/* Header простой */}
//       <div className="bg-white border-b border-stone-100 px-6 lg:px-16 py-4 flex items-center gap-4 sticky top-0 z-30">
//         <Link href="/#rooms" className="flex items-center gap-2 text-sm text-stone-500 hover:text-[#1e325c] transition-colors font-medium">
//           <ArrowLeft className="w-4 h-4" />
//           {lb.back}
//         </Link>
//         <span className="text-stone-200">|</span>
//         <span className="text-sm text-[#1e325c] font-medium">{room.title[l]}</span>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 lg:px-16 py-10">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

//           {/* Левая часть — фото + описание */}
//           <div className="lg:col-span-8 space-y-8">

//             {/* Фото слайдер */}
//             <div className="relative rounded-3xl overflow-hidden bg-stone-200" style={{ aspectRatio: '16/9' }}>
//               <Image
//                 src={room.images[activeImg]}
//                 alt={room.title[l]}
//                 fill
//                 sizes="(max-width: 1024px) 100vw, 65vw"
//                 className="object-cover transition-opacity duration-500"
//                 priority
//               />
//               {room.images.length > 1 && (
//                 <>
//                   <button
//                     onClick={() => setActiveImg(i => (i - 1 + room.images.length) % room.images.length)}
//                     className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer"
//                   >
//                     <ChevronLeft className="w-5 h-5 text-[#1e325c]" />
//                   </button>
//                   <button
//                     onClick={() => setActiveImg(i => (i + 1) % room.images.length)}
//                     className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer"
//                   >
//                     <ChevronRight className="w-5 h-5 text-[#1e325c]" />
//                   </button>
//                 </>
//               )}
//               <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
//                 {room.images.map((_, i) => (
//                   <button
//                     key={i}
//                     onClick={() => setActiveImg(i)}
//                     className={`w-2 h-2 rounded-full transition-all cursor-pointer ${i === activeImg ? 'bg-white scale-125' : 'bg-white/50'}`}
//                   />
//                 ))}
//               </div>
//             </div>

//             {/* Миниатюры */}
//             {room.images.length > 1 && (
//               <div className="flex gap-3">
//                 {room.images.map((img, i) => (
//                   <button
//                     key={i}
//                     onClick={() => setActiveImg(i)}
//                     className={`relative w-24 h-16 rounded-xl overflow-hidden cursor-pointer transition-all ${i === activeImg ? 'ring-2 ring-[#00b5d5]' : 'opacity-60 hover:opacity-100'}`}
//                   >
//                     <Image src={img} alt="" fill sizes="96px" className="object-cover" />
//                   </button>
//                 ))}
//               </div>
//             )}

//             {/* Заголовок и характеристики */}
//             <div>
//               <span className="text-[10px] font-bold text-[#00b5d5] uppercase tracking-widest">{categoryLabel}</span>
//               <h1 className="text-3xl md:text-4xl font-light text-[#1e325c] font-serif mt-2 mb-6">{room.title[l]}</h1>

//               <div className="grid grid-cols-3 gap-4 mb-8">
//                 {[
//                   { icon: <Maximize2 className="w-5 h-5" />, label: lb.size, val: room.size },
//                   { icon: <Users className="w-5 h-5" />, label: lb.capacity, val: room.capacity[l] },
//                   { icon: <BedDouble className="w-5 h-5" />, label: lb.category, val: categoryLabel },
//                 ].map((item, i) => (
//                   <div key={i} className="bg-white rounded-2xl p-4 border border-stone-100 text-center">
//                     <div className="text-[#00b5d5] flex justify-center mb-2">{item.icon}</div>
//                     <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">{item.label}</p>
//                     <p className="text-sm font-semibold text-[#1e325c] mt-1">{item.val}</p>
//                   </div>
//                 ))}
//               </div>

//               <p className="text-sm text-stone-600 font-light leading-relaxed">{room.desc[l]}</p>
//             </div>

//             {/* Удобства */}
//             <div className="bg-white rounded-2xl p-6 border border-stone-100">
//               <h3 className="text-base font-semibold text-[#1e325c] mb-5">{lb.amenities}</h3>
//               <div className="grid grid-cols-2 gap-3">
//                 {room.includes[l].map((item, i) => (
//                   <div key={i} className="flex items-center gap-2.5">
//                     <div className="w-5 h-5 bg-[#00b5d5]/10 rounded-full flex items-center justify-center shrink-0">
//                       <Check className="w-3 h-3 text-[#00b5d5]" />
//                     </div>
//                     <span className="text-xs text-stone-700 font-medium">{item}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Похожие номера */}
//             {similar.length > 0 && (
//               <div>
//                 <h3 className="text-base font-semibold text-[#1e325c] mb-5">{lb.similar}</h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                   {similar.map(r => (
//                     <Link key={r.id} href={`/rooms/${r.id}`} className="group bg-white rounded-2xl overflow-hidden border border-stone-100 hover:shadow-md transition-all">
//                       <div className="relative h-36 overflow-hidden">
//                         <Image src={r.images[0]} alt={r.title[l]} fill sizes="300px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
//                       </div>
//                       <div className="p-3">
//                         <p className="text-xs font-semibold text-[#1e325c] line-clamp-1">{r.title[l]}</p>
//                         <p className="text-xs text-[#00b5d5] font-bold mt-1">{r.price} <span className="text-stone-400 font-normal">/ {lb.perNight}</span></p>
//                       </div>
//                     </Link>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Правая часть — карточка бронирования */}
//           <div className="lg:col-span-4">
//             <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6 sticky top-24 space-y-5">
//               <div>
//                 <span className="text-3xl font-bold text-[#1e325c]">{room.price}</span>
//                 <span className="text-sm text-stone-400 font-light ml-1">/ {lb.perNight}</span>
//               </div>

//               <div className="space-y-3">
//                 <div>
//                   <label className="text-[10px] font-bold text-[#00b5d5] uppercase tracking-wider block mb-1">{lb.checkIn}</label>
//                   <input
//                     type="date"
//                     value={checkIn}
//                     onChange={e => setCheckIn(e.target.value)}
//                     min={new Date().toISOString().split('T')[0]}
//                     className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm font-medium text-[#1e325c] focus:outline-none focus:border-[#00b5d5] transition-colors cursor-pointer"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-[10px] font-bold text-[#00b5d5] uppercase tracking-wider block mb-1">{lb.checkOut}</label>
//                   <input
//                     type="date"
//                     value={checkOut}
//                     onChange={e => setCheckOut(e.target.value)}
//                     min={checkIn || new Date().toISOString().split('T')[0]}
//                     className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm font-medium text-[#1e325c] focus:outline-none focus:border-[#00b5d5] transition-colors cursor-pointer"
//                   />
//                 </div>
//               </div>

//               {nights > 0 && (
//                 <div className="bg-[#f9f8f4] rounded-xl p-4 space-y-2 border border-stone-100">
//                   <div className="flex justify-between text-xs">
//                     <span className="text-stone-500">{room.price} × {nights} {lb.nights}</span>
//                     <span className="font-semibold text-[#1e325c]">{room.priceNum * nights} AZN</span>
//                   </div>
//                   <div className="border-t border-stone-200 pt-2 flex justify-between">
//                     <span className="text-sm font-bold text-[#1e325c]">{lb.total}</span>
//                     <span className="text-sm font-bold text-[#00b5d5]">{room.priceNum * nights} AZN</span>
//                   </div>
//                 </div>
//               )}

//               <a
//                 href={`/#booking?room=${room.category}&checkIn=${checkIn}&checkOut=${checkOut}`}
//                 className="block w-full bg-[#ff6c02] hover:bg-[#e55f00] text-white text-xs font-bold uppercase tracking-widest py-4 rounded-xl text-center transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
//               >
//                 {lb.bookNow}
//               </a>

//               <p className="text-[10px] text-stone-400 text-center font-light">
//                 AF Hotel & Aqua Park · Novxanı, Bakı
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }