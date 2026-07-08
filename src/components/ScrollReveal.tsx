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
        hidden: { opacity: 0, scale: 0.82 },
        visible: { opacity: 1, scale: 1,
          transition: { type: 'spring', stiffness: 130, damping: 18, mass: 0.8 } }
      };
    case 'flipUp':
      return {
        hidden: { opacity: 0, rotateX: -90, y: 60, transformPerspective: 1200, scale: 0.9 },
        visible: { opacity: 1, rotateX: 0, y: 0, transformPerspective: 1200, scale: 1,
          transition: { type: 'spring', stiffness: 100, damping: 15, mass: 1 } }
      };
    case 'dropIn':
      return {
        hidden: { opacity: 0, y: -100, scale: 1.1, rotateZ: 5 },
        visible: { opacity: 1, y: 0, scale: 1, rotateZ: 0,
          transition: { type: 'spring', stiffness: 250, damping: 15, bounce: 0.6 } }
      };
    case 'slideLeft':
      return {
        hidden: { opacity: 0, x: 120, filter: 'blur(10px)', skewX: 10 },
        visible: { opacity: 1, x: 0, filter: 'blur(0px)', skewX: 0,
          transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
      };
    case 'slideRight':
      return {
        hidden: { opacity: 0, x: -120, filter: 'blur(10px)', skewX: -10 },
        visible: { opacity: 1, x: 0, filter: 'blur(0px)', skewX: 0,
          transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
      };
    case 'revealClip':
      return {
        hidden: { opacity: 0, clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)', y: 50 },
        visible: { opacity: 1, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', y: 0,
          transition: { duration: 1.2, ease: [0.77, 0, 0.18, 1] } }
      };
    case 'fadeDown':
      return {
        hidden: { opacity: 0, y: -60, scale: 0.9, filter: 'blur(10px)' },
        visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
          transition: { type: 'spring', stiffness: 100, damping: 20 } }
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
          y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
          x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
          scale: 0.97,
        },
        visible: {
          opacity: 1, y: 0, x: 0, scale: 1,
          transition: { type: 'spring', stiffness: 90, damping: 18, mass: 0.9 }
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
      viewport={{ once: true, margin: '0px' }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
});

ScrollReveal.displayName = 'ScrollReveal';
export default ScrollReveal;