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
      style={{ display: 'flex', flexDirection: 'column', alignItems: center ? 'center' : 'flex-start' }}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px" }}
      className={className}
    >
      {text.split('<br>').map((line, lineIndex) => {
        const words = line.split(' ').filter(Boolean);
        return (
          <div key={lineIndex} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: center ? 'center' : 'flex-start', width: '100%' }}>
            {words.map((word, wordIndex) => (
              <span key={`${lineIndex}-${wordIndex}`} style={{ display: 'inline-block', paddingRight: '0.25em' }}>
                <motion.span variants={child} style={{ display: 'inline-block', paddingRight: '0.15em' }}>
                  {word}
                </motion.span>
              </span>
            ))}
          </div>
        );
      })}
    </motion.div>
  );
}
