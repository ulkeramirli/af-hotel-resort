'use client';
import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('.pinterest-hover')) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div
      className={`hidden lg:block fixed pointer-events-none z-9999 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ease-out ${
        isHovered 
          ? 'w-16 h-16 bg-white/20 backdrop-blur-xs border border-white/40 flex items-center justify-center text-[10px] uppercase tracking-widest text-white font-bold' 
          : 'w-4 h-4 bg-hotel-blue/40 border border-hotel-blue'
      }`}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      {isHovered && 'Bax'}
    </div>
  );
}