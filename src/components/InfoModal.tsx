'use client';
import { useEffect } from 'react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  price?: string;
}

export default function InfoModal({ isOpen, onClose, title, description, price }: InfoModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xl transition-opacity duration-500 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-xl w-full p-8 md:p-10 relative border border-gray-100 shadow-xl transform transition-all scale-100 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-black text-sm font-light transition-colors p-2 cursor-pointer"
          aria-label="Close"
        >
          ✕
        </button>

        <h3 className="text-xl md:text-2xl font-medium text-slate-900 tracking-tight mb-2 pr-6">
          {title}
        </h3>
        
        {price && (
          <div className="text-sm text-slate-500 font-semibold tracking-wide mb-6">
            {price}
          </div>
        )}

        <div className="text-slate-600 leading-relaxed text-sm font-light border-t border-gray-100 pt-4">
          <p className="whitespace-pre-line">{description}</p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <span className="text-[11px] text-gray-400 tracking-widest uppercase font-medium">AF RESORT</span>
          <a 
            href="#booking" 
            onClick={onClose}
            className="w-full sm:w-auto bg-slate-900 hover:bg-black text-white font-medium uppercase tracking-widest text-[11px] px-8 py-3.5 rounded-xl text-center transition-all duration-300"
          >
            Rezervasiya
          </a>
        </div>
      </div>
    </div>
  );
}