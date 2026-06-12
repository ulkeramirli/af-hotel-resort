"use client";
import { useState, useEffect } from "react";

export default function FloatingActions() {
  const [show, setShow] = useState(false);

  // const bookLabel = { az: 'Rezerv Et', en: 'Book Now', ru: 'Забронировать' }[currentLang];

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-2.5 transition-all duration-500 transform ${
        show
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      {/* Sticky кнопка бронирования */}
      {/* <a
        href="#booking"
        className="flex items-center gap-2 bg-[#ff6c02] hover:bg-[#e55f00] text-white text-[11px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path d="M6 2a1 1 0 000 2h1v1a1 1 0 001 1h4a1 1 0 001-1V4h1a1 1 0 100-2H6zm2 3V4h4v1H8zm-5 4a2 2 0 012-2h10a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V9zm2 1v5h10V10H5z"/>
        </svg>
        {bookLabel}
      </a> */}

      {/* WhatsApp */}
      <a
        href="https://wa.me/994124483030"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#25D366] text-white border border-[#24a754] w-11 h-11 rounded-xl shadow-md flex items-center justify-center transition-all hover:bg-[#22c35d] hover:scale-105"
        title="WhatsApp"
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      {/* Телефон */}
      <a
        href="tel:+994124483030"
        className="bg-white text-[#1e325c] border border-stone-200 w-11 h-11 rounded-xl shadow-md flex items-center justify-center transition-all hover:border-[#00b5d5] hover:text-[#00b5d5] hover:scale-105"
        title="Call"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-1C7.82 18 2 12.18 2 5V3z" />
        </svg>
      </a>

      {/* Наверх */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="bg-[#1e325c] hover:bg-[#0d1b3a] text-white w-11 h-11 rounded-xl shadow-md flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
        title="Top"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 15.75l7.5-7.5 7.5 7.5"
          />
        </svg>
      </button>
    </div>
  );
}
