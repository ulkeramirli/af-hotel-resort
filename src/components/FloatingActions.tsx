'use client';
import { useState, useEffect } from 'react';

export default function FloatingActions() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`fixed bottom-6 right-6 z-40 flex flex-col space-y-2.5 transition-all duration-500 transform ${
      show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
    }`}>
      <a 
        href="tel:+994124483030" 
        className="bg-[#25D366] text-white border border-[#24a754] w-11 h-11 rounded-xl shadow-xs flex items-center justify-center transition-colors hover:bg-[#22c35d]"
        title="Call"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-1C7.82 18 2 12.18 2 5V3z"/>
        </svg>
      </a>

      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="bg-[#1e325c] hover:bg-[#0d1b3a] text-white w-11 h-11 rounded-xl shadow-xs flex items-center justify-center transition-colors cursor-pointer"
        title="Top"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
        </svg>
      </button>
    </div>
  );
}