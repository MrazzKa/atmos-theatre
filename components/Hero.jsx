"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const [enableParallax, setEnableParallax] = useState(false);

  useEffect(() => {
    const update = () => {
      if (typeof window === "undefined") return;
      setEnableParallax(window.innerWidth >= 768);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const scrollToAfisha = () => {
    const el = document.getElementById("afisha");
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const offset = rect.top + window.scrollY - 90;
    window.scrollTo({ top: offset, behavior: "smooth" });
  };

  const scrollDown = () => {
    const el = document.getElementById("about") ?? document.getElementById("afisha");
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const offset = rect.top + window.scrollY - 90;
    window.scrollTo({ top: offset, behavior: "smooth" });
  };

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 pt-18 pb-16 md:px-8 md:pt-22 md:pb-16"
    >
      {/* Background depth: subtle radial gradient so hero isn't flat */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_45%,rgba(26,22,18,0.95)_0%,rgba(12,10,8,0.98)_50%,#080808_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_42%,rgba(201,168,76,0.04)_0%,transparent_60%)]" />
      </div>

      {/* Orbitals & rays */}
      <motion.div
        style={enableParallax ? { opacity } : {}}
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-[38%] h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/10 md:top-1/2 md:h-[460px] md:w-[460px] [animation:orbitSlow_60s_linear_infinite]" />
        <div className="absolute left-1/2 top-1/2 hidden h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/10/40 md:block md:h-[580px] md:w-[580px] [animation:orbitSlow_90s_linear_infinite_reverse]" />

        <div className="absolute left-1/2 top-[38%] h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.14)_0%,rgba(8,8,8,0)_65%)] md:top-1/2 md:h-[490px] md:w-[490px] [animation:glowPulse_7s_ease-in-out_infinite]" />

        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-[38%] h-[10vh] w-px origin-top bg-gradient-to-b from-gold/20 to-transparent md:top-1/2 md:h-[18vh]"
            style={{
              transform: `rotate(${(360 / 28) * i}deg)`,
              animation: "glowPulse 4s ease-in-out infinite",
              animationDelay: `${(i * 0.18).toFixed(2)}s`,
            }}
          />
        ))}
      </motion.div>

      <motion.div
        style={enableParallax ? { y, opacity } : {}}
        className="relative z-10 flex flex-col items-center text-center"
      >
        {/* Logo with soft glow layer */}
        <motion.div
          className="relative mt-6 md:mt-5"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center opacity-60"
            aria-hidden="true"
          >
            <div className="h-[clamp(180px,28vw,280px)] w-[clamp(180px,28vw,280px)] rounded-full bg-gold/10 blur-[60px] [animation:glowPulse_7s_ease-in-out_infinite]" />
          </div>
          <Image
            src="/images/logo.png"
            alt="ATMOS"
            width={280}
            height={280}
            priority
            quality={100}
            className="relative h-auto w-[clamp(160px,24vw,240px)] drop-shadow-[0_0_50px_rgba(201,168,76,0.25)] [animation:float-soft_7s_ease-in-out_infinite]"
          />
        </motion.div>

        {/* Double line — театральный акцент */}
        <motion.div
          className="mt-6 flex flex-col items-center gap-1"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.4, duration: 1.1 }}
        >
          <div className="h-px w-44 origin-center bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
          <div className="h-px w-32 origin-center bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        </motion.div>

        <motion.div
          className="mt-5 flex max-w-[22rem] flex-col items-center gap-3 md:mt-6 md:gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
        >
          <p className="font-heading text-[0.72rem] leading-relaxed italic tracking-[0.14em] text-zinc-400 md:text-sm md:tracking-[0.2em]">
            <span className="block md:inline">молодёжный</span>
            <span className="block md:inline">экспериментальный</span>
            <span className="block md:inline">театр</span>
          </p>
          <p className="font-body text-[0.68rem] uppercase tracking-[0.2em] text-gold-dark/90 md:text-[0.75rem] md:tracking-[0.28em]">
            <span className="block md:inline">ПЕТРОПАВЛОВСК</span>
            <span className="block md:inline">· КАЗАХСТАН</span>
          </p>
        </motion.div>

        <motion.div
          className="mt-12 flex flex-col items-center gap-3 md:mt-10 md:gap-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center md:gap-4 md:rounded-lg md:border md:border-gold/25 md:bg-black/60 md:px-6 md:py-4 md:shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_0_1px_rgba(201,168,76,0.08)] md:backdrop-blur-md transition-shadow duration-300 hover:shadow-[0_24px_70px_rgba(0,0,0,0.85),0_0_30px_rgba(201,168,76,0.06)]">
            <button
              type="button"
              onClick={scrollToAfisha}
              className="inline-flex flex-1 items-center justify-center rounded-sm border border-gold bg-gradient-to-b from-gold to-gold-dark px-6 py-3 font-body text-[0.7rem] font-medium uppercase tracking-[0.28em] text-dark shadow-[0_0_30px_rgba(201,168,76,0.4)] transition hover:from-gold-light hover:to-gold hover:shadow-[0_0_40px_rgba(201,168,76,0.5)]"
            >
              СМОТРЕТЬ АФИШУ
            </button>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("news");
                if (!el) return;
                const rect = el.getBoundingClientRect();
                const offset = rect.top + window.scrollY - 90;
                window.scrollTo({ top: offset, behavior: "smooth" });
              }}
              className="inline-flex flex-1 items-center justify-center rounded-sm border border-gold/60 px-6 py-2.5 font-body text-[0.7rem] uppercase tracking-[0.26em] text-gold transition hover:border-gold hover:bg-gold/10 hover:shadow-[0_0_20px_rgba(201,168,76,0.15)]"
            >
              НАБОР В ТРУППУ
            </button>
          </div>
        </motion.div>

        <motion.button
          type="button"
          onClick={scrollDown}
          className="mt-8 flex flex-col items-center gap-2.5 text-[0.62rem] uppercase tracking-[0.26em] text-zinc-500 outline-none transition-colors hover:text-zinc-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.85 }}
        >
          <span>ЛИСТАЙТЕ ВНИЗ</span>
          <span className="h-8 w-px origin-top bg-gradient-to-b from-gold/50 to-transparent [animation:scrollLine_1.6s_ease-in-out_infinite]" />
        </motion.button>
      </motion.div>
    </section>
  );
}

