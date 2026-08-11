'use client';

import Image from "next/image";
import { motion } from "framer-motion";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  imagePath: string;
  /** Style variant for unique look per page */
  variant?: 'rooms' | 'aquapark' | 'wonderland' | 'restoran' | 'about' | 'contacts' | 'default';
  containImage?: boolean;
}

const gradients: Record<string, string> = {
  rooms:     'from-stone-900/45 via-stone-900/15 to-transparent',
  aquapark:  'from-stone-900/45 via-stone-900/15 to-transparent',
  wonderland:'from-stone-900/45 via-stone-900/15 to-transparent',
  restoran:  'from-stone-900/45 via-stone-900/15 to-transparent',
  about:     'from-stone-900/45 via-stone-900/15 to-transparent',
  contacts:  'from-stone-900/45 via-stone-900/15 to-transparent',
  default:   'from-stone-900/45 via-stone-900/15 to-transparent',
};

const accentColors: Record<string, string> = {
  rooms:     'text-[#00b5d5] border-[#00b5d5]/50',
  aquapark:  'text-cyan-300 border-cyan-300/50',
  wonderland:'text-purple-300 border-purple-300/50',
  restoran:  'text-amber-300 border-amber-300/50',
  about:     'text-[#00b5d5] border-[#00b5d5]/50',
  contacts:  'text-[#00b5d5] border-[#00b5d5]/50',
  default:   'text-[#00b5d5] border-[#00b5d5]/50',
};

const decorativeElements: Record<string, React.ReactNode> = {
  rooms: (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 1.2 }}
      className="absolute right-12 bottom-12 hidden lg:flex flex-col items-end gap-1"
    >
      <div className="text-white/20 text-[80px] font-serif leading-none select-none">★</div>
    </motion.div>
  ),
  aquapark: (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="absolute inset-0 pointer-events-none"
    >
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -15, 0], opacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
          className="absolute w-2 h-2 rounded-full bg-cyan-300/30"
          style={{ left: `${15 + i * 14}%`, bottom: `${20 + (i % 3) * 15}%` }}
        />
      ))}
    </motion.div>
  ),
  wonderland: (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
      className="absolute top-1/2 right-16 -translate-y-1/2 text-6xl select-none pointer-events-none hidden lg:block"
    >
      <motion.span
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="block"
      >🎡</motion.span>
    </motion.div>
  ),
  restoran: (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
      className="absolute top-1/2 right-16 -translate-y-1/2 hidden lg:block pointer-events-none"
    >
      <div className="w-20 h-20 rounded-full border border-amber-300/30 flex items-center justify-center">
        <div className="text-4xl select-none">🍽️</div>
      </div>
    </motion.div>
  ),
  default: null,
};

export default function PageHero({ title, subtitle, imagePath, variant = 'default', containImage = false, imageClassName = "object-cover object-center" }: PageHeroProps & { imageClassName?: string }) {
  const grad = gradients[variant] || gradients.default;
  const accent = accentColors[variant] || accentColors.default;
  const deco = decorativeElements[variant] || null;

  return (
    <div className="relative w-full h-[65vh] md:h-auto md:aspect-video min-h-100 flex items-end justify-start overflow-hidden bg-stone-900">
      {/* Background Image — Ken Burns zoom */}
      <div className="absolute inset-0 w-full h-full">
        <motion.div
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full relative"
        >
          {containImage ? (
            <>
              {/* Blurred background + Light Gray Tulle */}
              <div className="absolute inset-0 overflow-hidden">
                <Image src={imagePath} alt="Background" fill priority sizes="100vw" className="object-cover blur-2xl opacity-70 scale-125" />
                <div className="absolute inset-0 bg-stone-200/50" />
              </div>
              {/* Foreground Image */}
              <Image src={imagePath} alt={title} fill priority sizes="100vw" className="relative z-10 object-contain object-center drop-shadow-xl" />
            </>
          ) : (
            <Image
              src={imagePath}
              alt={title}
              fill
              priority
              sizes="100vw"
              className={imageClassName}
            />
          )}
        </motion.div>

        {/* Thin gray tulle over the whole image for readability */}
        <div className="absolute inset-0 bg-stone-900/15" />
        {/* Left-side dark gradient for text readability */}
        <div className={`absolute inset-0 bg-linear-to-r ${grad}`} />
        {/* Bottom dark fade (more concentrated at the bottom for text) */}
        <div className="absolute inset-0 bg-linear-to-t from-stone-900/60 via-stone-900/10 to-transparent" />
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_60%,rgba(0,0,0,0.2)_100%)]" />
      </div>

      {/* Decorative element per page */}
      {deco}

      {/* Content — bottom left aligned (editorial style) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-16 pb-10 md:pb-16 pt-24">
        {/* Animated accent line + subtitle */}
        {subtitle && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" as const, delay: 0.3 }}
            className={`flex items-center gap-3 mb-5`}
          >
            <div className={`w-10 h-px border-t ${accent}`} />
            <span className={`text-xs font-bold uppercase tracking-[0.35em] drop-shadow-md py-1 leading-normal ${accent.split(' ')[0]}`}>
              {subtitle}
            </span>
          </motion.div>
        )}

        {/* Big serif title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium text-white drop-shadow-2xl tracking-tight leading-none max-w-3xl"
        >
          {title}
        </motion.h1>

        {/* Bottom accent bar */}
        <motion.div
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" as const, delay: 0.6 }}
          className={`mt-6 w-16 h-0.5 ${accent.split(' ')[0].replace('text-', 'bg-')}`}
          style={{ background: variant === 'wonderland' ? '#a855f7' : variant === 'restoran' ? '#f59e0b' : '#00b5d5' }}
        />
      </div>
    </div>
  );
}
