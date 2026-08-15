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


  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.1 } },
  };

  const child = {
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { ease: "easeOut" as const, duration: 0.45, delay: delay + i * 0.08 },
    }),
    hidden: {
      opacity: 0,
      y: 40,
    },
  };

  // Split by whitespace but keep `<br>` intact.
  const words = text.split(' ').filter(Boolean);

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
          <motion.span custom={index} variants={child} style={{ display: 'inline-block', paddingRight: '0.15em' }}>
            {word}
          </motion.span>
        </span>
      ))}
    </motion.div>
  );
}
