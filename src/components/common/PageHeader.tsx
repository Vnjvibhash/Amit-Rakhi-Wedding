import React from 'react';
import { motion } from 'framer-motion';
import { FloralDivider, MandalaSpinner } from './MandalaArtwork';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ eyebrow, title, subtitle }) => (
  <section className="relative overflow-hidden bg-royal-gradient text-ivory-pure pt-28 pb-16 sm:pt-32 sm:pb-20 px-4">
    <div className="absolute -top-24 -left-24 opacity-30">
      <MandalaSpinner className="w-72 h-72 text-gold-300" />
    </div>
    <div className="absolute -bottom-24 -right-24 opacity-25">
      <MandalaSpinner className="w-80 h-80 text-gold-300" />
    </div>
    <div className="relative z-10 max-w-4xl mx-auto text-center">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-xs sm:text-sm uppercase tracking-[0.28em] text-gold-300 mb-2"
      >
        {eyebrow}
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold text-ivory-pure tracking-wide"
      >
        {title}
      </motion.h1>
      <FloralDivider dark />
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.16 }}
          className="max-w-2xl mx-auto text-sm sm:text-base text-beige-soft/90 leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  </section>
);

