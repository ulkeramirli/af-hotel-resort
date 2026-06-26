'use client';
import { motion, Variants } from 'framer-motion';
import { ReactNode, forwardRef } from 'react';

export type AnimationType =
  | 'fadeUp'       // smooth fade + rise
  | 'fadeDown'
  | 'slideLeft'    // bold horizontal slide
  | 'slideRight'
  | 'zoomIn'       // scale pop from center
  | 'flipUp'       // rotateX 3D flip
  | 'dropIn'       // drops with bounce
  | 'revealClip'   // clip-path curtain reveal
  | 'none';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'; // legacy support
  delay?: number;
  type?: AnimationType;
}

const getVariants = (type: AnimationType, direction: string): Variants => {
  switch (type) {
    case 'zoomIn':
      return {
        hidden: { opacity: 0, scale: 0.7, filter: 'blur(12px)' },
        visible: { opacity: 1, scale: 1, filter: 'blur(0px)',
          transition: { duration: 0.9, ease: [0.34, 1.56, 0.64, 1] } }
      };
    case 'flipUp':
      return {
        hidden: { opacity: 0, rotateX: 60, y: 40, transformPerspective: 800 },
        visible: { opacity: 1, rotateX: 0, y: 0, transformPerspective: 800,
          transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] } }
      };
    case 'dropIn':
      return {
        hidden: { opacity: 0, y: -80, scale: 0.9 },
        visible: { opacity: 1, y: 0, scale: 1,
          transition: { type: 'spring', stiffness: 200, damping: 18 } }
      };
    case 'slideLeft':
      return {
        hidden: { opacity: 0, x: 100, filter: 'blur(6px)' },
        visible: { opacity: 1, x: 0, filter: 'blur(0px)',
          transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }
      };
    case 'slideRight':
      return {
        hidden: { opacity: 0, x: -100, filter: 'blur(6px)' },
        visible: { opacity: 1, x: 0, filter: 'blur(0px)',
          transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }
      };
    case 'revealClip':
      return {
        hidden: { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
        visible: { opacity: 1, clipPath: 'inset(0 0% 0 0)',
          transition: { duration: 1.1, ease: [0.77, 0, 0.18, 1] } }
      };
    case 'fadeDown':
      return {
        hidden: { opacity: 0, y: -50, scale: 0.95, filter: 'blur(8px)' },
        visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
          transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
      };
    case 'none':
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.6 } }
      };
    default: // fadeUp
      return {
        hidden: {
          opacity: 0,
          y: direction === 'up' ? 50 : direction === 'down' ? -50 : 0,
          x: direction === 'left' ? 50 : direction === 'right' ? -50 : 0,
          scale: 0.95,
          filter: 'blur(8px)'
        },
        visible: {
          opacity: 1, y: 0, x: 0, scale: 1, filter: 'blur(0px)',
          transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
        }
      };
  }
};

const ScrollReveal = forwardRef<HTMLDivElement, ScrollRevealProps>(({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  type = 'fadeUp',
}, ref) => {
  const baseVariants = getVariants(type, direction);

  // Inject delay into the transition
  const variants: Variants = {
    hidden: baseVariants.hidden,
    visible: {
      ...(baseVariants.visible as object),
      transition: {
        ...((baseVariants.visible as any).transition || {}),
        delay,
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
});

ScrollReveal.displayName = 'ScrollReveal';
export default ScrollReveal;