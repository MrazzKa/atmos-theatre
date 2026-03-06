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
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 pt-16 pb-16 md:px-8 md:pt-20 md:pb-16"
    >
      {/* Orbitals & rays */}
      <motion.div
        style={enableParallax ? { opacity } : {}}
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-[38%] h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/10 md:top-1/2 md:h-[420px] md:w-[420px] [animation:orbitSlow_60s_linear_infinite]" />
        <div className="absolute left-1/2 top-1/2 hidden h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/10/40 md:block md:h-[560px] md:w-[560px] [animation:orbitSlow_90s_linear_infinite_reverse]" />

        <div className="absolute left-1/2 top-[38%] h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.16)_0%,rgba(8,8,8,0)_65%)] md:top-1/2 md:h-[460px] md:w-[460px] [animation:glowPulse_7s_ease-in-out_infinite]" />

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
        <motion.div
          className="mt-6 md:mt-5"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <Image
            src="/images/logo.png"
            alt="ATMOS"
            width={280}
            height={280}
            priority
            quality={100}
            className="h-auto w-[clamp(160px,24vw,240px)] drop-shadow-[0_0_60px_rgba(201,168,76,0.2)] [animation:float-soft_7s_ease-in-out_infinite]"
          />
        </motion.div>

        <motion.div
          className="mt-4"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.4, duration: 1.1 }}
        >
          <div className="mx-auto h-px w-40 origin-center bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        </motion.div>

        <motion.div
          className="mt-[-0.25rem] flex max-w-[22rem] flex-col items-center gap-3 md:mt-7 md:gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="font-heading text-[0.7rem] leading-relaxed italic tracking-[0.12em] text-zinc-400 md:text-sm md:tracking-[0.18em]">
            <span className="block md:inline">молодёжный</span>
            <span className="block md:inline">экспериментальный</span>
            <span className="block md:inline">театр</span>
          </p>
          <p className="font-body text-[0.68rem] uppercase tracking-[0.18em] text-gold-dark md:text-[0.75rem] md:tracking-[0.28em]">
            <span className="block md:inline">ПЕТРОПАВЛОВСК</span>
            <span className="block md:inline">· КАЗАХСТАН</span>
          </p>
        </motion.div>

        <motion.div
          className="mt-8 flex flex-col items-center gap-3 md:gap-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
        >
          <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center md:gap-4 md:rounded-md md:border md:border-gold/20 md:bg-black/70 md:px-6 md:py-4 md:shadow-[0_18px_70px_rgba(0,0,0,0.9)] md:backdrop-blur-md">
            <button
              type="button"
              onClick={scrollToAfisha}
              className="inline-flex flex-1 items-center justify-center rounded-sm border border-gold bg-gold px-6 py-3 font-body text-[0.7rem] font-medium uppercase tracking-[0.28em] text-dark shadow-[0_0_25px_rgba(201,168,76,0.5)] transition hover:bg-gold-light hover:border-gold-light"
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
              className="inline-flex flex-1 items-center justify-center rounded-sm border border-gold/60 px-6 py-2.5 font-body text-[0.7rem] uppercase tracking-[0.26em] text-gold hover:border-gold hover:bg-gold/10"
            >
              НАБОР В ТРУППУ
            </button>
          </div>
        </motion.div>

        <motion.button
          type="button"
          onClick={scrollDown}
          className="mt-6 flex flex-col items-center gap-2 text-[0.62rem] uppercase tracking-[0.26em] text-zinc-500 outline-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8 }}
        >
          <span>ЛИСТАЙТЕ ВНИЗ</span>
          <span className="h-10 w-px origin-top bg-gradient-to-b from-gold/60 to-transparent [animation:scrollLine_1.6s_ease-in-out_infinite]" />
        </motion.button>
      </motion.div>
    </section>
  );
}

