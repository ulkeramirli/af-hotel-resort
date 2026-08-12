'use client';
import { motion } from 'framer-motion';
import React from 'react';

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  center?: boolean;
}

export default function TextReveal({ text, className = '', delay = 0, center = false }: TextRevealProps) {
  // Split text by any whitespace to handle non-breaking spaces safely.
  const words = text.split(' ').filter(Boolean);

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: delay * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: { ease: "easeOut" as const, duration: 0.45 },
    },
    hidden: {
      opacity: 0,
      y: 40,
    },
  };

  return (
    <motion.div
      style={{ display: 'flex', flexWrap: 'wrap', justifyContent: center ? 'center' : 'flex-start' }}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px" }}
      className={className}
    >
      {words.map((word, index) => (
        <span key={index} style={{ display: 'inline-block', paddingRight: '0.25em' }}>
          <motion.span variants={child} style={{ display: 'inline-block', paddingRight: '0.15em' }}>
            {word}
          </motion.span>
        </span>
      ))}
    </motion.div>
  );
}
