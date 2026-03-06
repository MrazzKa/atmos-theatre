"use client";

import { motion } from "framer-motion";

export default function SectionHeader({ label, title, className = "" }) {
  return (
    <div className={`mb-10 md:mb-12 ${className}`}>
      <div className="flex items-center justify-start gap-3 md:gap-4">
        <span className="h-px w-10 bg-gold/50 md:w-14" />
        <span className="font-display text-[0.7rem] tracking-[0.3em] text-gold uppercase md:text-xs md:tracking-[0.35em]">
          {label}
        </span>
      </div>
      <motion.h2
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="mt-3 font-heading text-left text-xl leading-snug tracking-[0.06em] md:mt-4 md:text-3xl lg:text-[2.3rem]"
      >
        {title}
      </motion.h2>
    </div>
  );
}

