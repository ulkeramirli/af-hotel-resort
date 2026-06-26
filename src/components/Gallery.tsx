// 'use client';
// import { useState, useEffect, useCallback } from 'react';
// import { useLanguage } from '@/context/LanguageContext';
// import Image from 'next/image';
// import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

// const galleryData = {
//   az: { tag: 'FOTOQALEREYASl', title: 'Anlarınızı Kəşf Edin', all: 'Hamısı', categories: ['Otaqlar', 'Akvapark', 'Restoran', 'Sahil'] },
//   en: { tag: 'GALLERY', title: 'Discover Your Moments', all: 'All', categories: ['Rooms', 'Aqua Park', 'Restoran', 'Beach'] },
//   ru: { tag: 'ГАЛЕРЕЯ', title: 'Откройте Ваши Моменты', all: 'Все', categories: ['Номера', 'Аквапарк', 'Ресторан', 'Пляж'] },
// };

// const photos = [
//   { id: 1, src: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80', cat: 0, aspect: 'wide' },
//   { id: 2, src: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80', cat: 0, aspect: 'tall' },
//   { id: 3, src: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80', cat: 0, aspect: 'square' },
//   { id: 4, src: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80', cat: 1, aspect: 'wide' },
//   { id: 5, src: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=80', cat: 1, aspect: 'square' },
//   { id: 6, src: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80', cat: 1, aspect: 'tall' },
//   { id: 7, src: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80', cat: 2, aspect: 'wide' },
//   { id: 8, src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80', cat: 2, aspect: 'square' },
//   { id: 9, src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', cat: 3, aspect: 'wide' },
//   { id: 10, src: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80', cat: 3, aspect: 'tall' },
//   { id: 11, src: 'https://images.unsplash.com/photo-1540541338537-1220059ddafd?auto=format&fit=crop&w=1200&q=80', cat: 3, aspect: 'square' },
//   { id: 12, src: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80', cat: 0, aspect: 'square' },
// ];

// export default function Gallery() {
//   const { lang } = useLanguage();
//   const currentLang = (lang as 'az' | 'en' | 'ru') || 'az';
//   const c = galleryData[currentLang];

//   const [activeTab, setActiveTab] = useState(-1);
//   const [lightbox, setLightbox] = useState<number | null>(null);

//   const filtered = activeTab === -1 ? photos : photos.filter(p => p.cat === activeTab);

//   const openLightbox = (id: number) => {
//     setLightbox(id);
//   };

//   const closeLightbox = useCallback(() => {
//     setLightbox(null);
//   }, []);

//   useEffect(() => {
//     if (lightbox !== null) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = '';
//     }
//     return () => {
//       document.body.style.overflow = '';
//     };
//   }, [lightbox]);

//   const goPrev = useCallback(() => {
//     if (lightbox === null) return;
//     const idx = filtered.findIndex(p => p.id === lightbox);
//     setLightbox(filtered[(idx - 1 + filtered.length) % filtered.length].id);
//   }, [lightbox, filtered]);

//   const goNext = useCallback(() => {
//     if (lightbox === null) return;
//     const idx = filtered.findIndex(p => p.id === lightbox);
//     setLightbox(filtered[(idx + 1) % filtered.length].id);
//   }, [lightbox, filtered]);

//   useEffect(() => {
//     const handleKey = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') closeLightbox();
//       if (e.key === 'ArrowLeft') goPrev();
//       if (e.key === 'ArrowRight') goNext();
//     };
//     window.addEventListener('keydown', handleKey);
//     return () => window.removeEventListener('keydown', handleKey);
//   }, [closeLightbox, goPrev, goNext]);

//   const currentPhoto = lightbox !== null ? photos.find(p => p.id === lightbox) : null;
//   const currentIndex = lightbox !== null ? filtered.findIndex(p => p.id === lightbox) : -1;

//   return (
//     <section id="gallery" className="py-32 bg-[#f9f8f4] scroll-mt-20 overflow-hidden">
//       <div className="max-w-7xl mx-auto px-6 lg:px-16">

//         <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
//           <div>
//             <span className="text-[#00b5d5] text-[10px] font-bold tracking-[0.4em] uppercase block mb-3">
//               {c.tag}
//             </span>
//             <h2 className="text-3xl md:text-5xl font-light text-[#1e325c] tracking-tight font-serif">
//               {c.title}
//             </h2>
//           </div>

//           <div className="flex flex-wrap gap-2">
//             <button
//               onClick={() => setActiveTab(-1)}
//               className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
//                 activeTab === -1
//                   ? 'bg-[#1e325c] text-white'
//                   : 'bg-white text-stone-500 border border-stone-200 hover:border-[#00b5d5] hover:text-[#00b5d5]'
//               }`}
//             >
//               {c.all}
//             </button>
//             {c.categories.map((cat, i) => (
//               <button
//                 key={i}
//                 onClick={() => setActiveTab(i)}
//                 className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
//                   activeTab === i
//                     ? 'bg-[#1e325c] text-white'
//                     : 'bg-white text-stone-500 border border-stone-200 hover:border-[#00b5d5] hover:text-[#00b5d5]'
//                 }`}
//               >
//                 {cat}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Masonry grid */}
//         <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
//           {filtered.map((photo) => (
//             <div
//               key={photo.id}
//               onClick={() => openLightbox(photo.id)}
//               className="relative break-inside-avoid overflow-hidden rounded-2xl cursor-pointer group bg-stone-100"
//               style={{ aspectRatio: photo.aspect === 'wide' ? '4/3' : photo.aspect === 'tall' ? '3/4' : '1/1' }}
//             >
//               <Image
//                 src={photo.src}
//                 alt={`AF Hotel photo ${photo.id}`}
//                 fill
//                 sizes="(max-width: 768px) 50vw, 25vw"
//                 className="object-cover transition-transform duration-700 group-hover:scale-105"
//               />
//               <div className="absolute inset-0 bg-[#1e325c]/0 group-hover:bg-[#1e325c]/30 transition-all duration-300 flex items-center justify-center">
//                 <ZoomIn className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Lightbox */}
//       {lightbox !== null && currentPhoto && (
//         <div
//           className="fixed inset-0 z-200 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
//           onClick={closeLightbox}
//         >
//           <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white/60 text-xs font-medium tracking-widest">
//             {currentIndex + 1} / {filtered.length}
//           </div>

//           <button
//             onClick={closeLightbox}
//             className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer z-10"
//           >
//             <X className="w-5 h-5" />
//           </button>

//           <button
//             onClick={(e) => { e.stopPropagation(); goPrev(); }}
//             className="absolute left-4 md:left-8 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer z-10"
//           >
//             <ChevronLeft className="w-6 h-6" />
//           </button>

//           <div
//             className="relative w-full max-w-5xl max-h-[85vh] rounded-2xl overflow-hidden"
//             onClick={(e) => e.stopPropagation()}
//             style={{ aspectRatio: '16/10' }}
//           >
//             <Image
//               src={currentPhoto.src}
//               alt={`AF Hotel photo ${currentPhoto.id}`}
//               fill
//               sizes="90vw"
//               className="object-contain"
//               priority
//             />
//           </div>

//           <button
//             onClick={(e) => { e.stopPropagation(); goNext(); }}
//             className="absolute right-4 md:right-8 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer z-10"
//           >
//             <ChevronRight className="w-6 h-6" />
//           </button>

//           <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] px-4">
//             {filtered.map((p, i) => (
//               <button
//                 key={p.id}
//                 onClick={(e) => { e.stopPropagation(); setLightbox(p.id); }}
//                 className={`relative shrink-0 w-14 h-10 rounded-lg overflow-hidden transition-all cursor-pointer ${
//                   p.id === lightbox ? 'ring-2 ring-white scale-110' : 'opacity-50 hover:opacity-80'
//                 }`}
//               >
//                 <Image src={p.src} alt={`thumb ${i}`} fill sizes="56px" className="object-cover" />
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }