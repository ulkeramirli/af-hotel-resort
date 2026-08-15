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


  // Split by whitespace but keep `<br>` intact.
  const words = text.split(' ').filter(Boolean);

  return (
    <div
      style={{ display: 'flex', flexWrap: 'wrap', justifyContent: center ? 'center' : 'flex-start' }}
      className={className}
    >
      {words.map((word, index) => {
        if (word === '<br>' || word === '<br/>' || word === '<br />') {
          return <div key={index} className="w-full h-0" />;
        }
        return (
          <span key={index} style={{ display: 'inline-block', paddingRight: '0.25em' }}>
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ ease: "easeOut", duration: 0.45, delay: delay + index * 0.08 }}
              style={{ display: 'inline-block', paddingRight: '0.15em' }}
            >
              {word}
            </motion.span>
          </span>
        );
      })}
    </div>
  );
}
