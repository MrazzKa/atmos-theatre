"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Reveal from "./ui/Reveal";
import SectionHeader from "./ui/SectionHeader";
import { shows } from "../lib/data";

const INSTAGRAM_DM = "https://ig.me/m/atmos_theatre";

export default function Afisha() {
  const [videoModal, setVideoModal] = useState(null);

  return (
    <section
      id="afisha"
      className="bg-dark-light/95 py-20 text-cream md:py-24"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeader label="АФИША" title="Спектакли ATMOS" />

        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {shows.map((show, index) => (
            <Reveal key={show.id} delay={index * 0.05}>
              <article className="group flex h-full flex-col overflow-hidden rounded-md border border-gold/10 bg-gradient-to-b from-[#151515] to-[#0b0b0b] shadow-[0_22px_70px_rgba(0,0,0,0.75)] transition-transform duration-500 hover:-translate-y-2 hover:border-gold/25">
                <div
                  className="relative h-[170px] overflow-hidden cursor-pointer"
                  onClick={() => show.videoReel && setVideoModal(show)}
                  role={show.videoReel ? "button" : undefined}
                  aria-label={show.videoReel ? `Смотреть ролик: ${show.title}` : undefined}
                >
                  {show.image ? (
                    <Image
                      src={show.image}
                      alt={show.title}
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 768px) 45vw, 100vw"
                      className="object-cover object-center opacity-90 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-[#141414] via-[#101010] to-[#060606]" />
                  )}

                  {show.videoReel && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition opacity duration-300 group-hover:opacity-100">
                      <span className="rounded-full border-2 border-gold bg-gold/20 p-4 text-gold">
                        <svg className="h-10 w-10 ml-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                    </div>
                  )}

                  {/* Верхний затемняющий градиент, чтобы бейджи читались на ярких афишах */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/75 via-black/40 to-transparent" />

                  <div className="absolute inset-x-3 top-3 z-10 flex items-center justify-center gap-2">
                    <div className="inline-flex items-center justify-center rounded-full border border-gold/40 bg-black/80 px-4 py-1.5 text-[0.63rem] font-body uppercase tracking-[0.26em] text-gold shadow-[0_0_18px_rgba(0,0,0,0.8)]">
                      <span className="text-center">{show.genre}</span>
                    </div>
                    {show.date && (
                      <div className="rounded-full border border-gold bg-black/85 px-3 py-1.5 text-[0.63rem] font-body font-semibold uppercase tracking-[0.2em] text-gold shadow-[0_0_22px_rgba(0,0,0,0.9)]">
                        {show.date}
                      </div>
                    )}
                  </div>

                  <div className="pointer-events-none absolute bottom-2 right-3 font-heading text-5xl text-gold/10">
                    {show.num}
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-3 px-4 pb-4 pt-5">
                  <div>
                    <h3 className="font-heading text-xl leading-tight">
                      {show.title}
                    </h3>
                    <p className="mt-1 text-sm italic text-gold-dark">
                      {show.author}
                    </p>
                  </div>

                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[0.7rem] uppercase tracking-[0.22em] text-zinc-400">
                    {show.date && <span>{show.date}</span>}
                    <span>{show.time}</span>
                    <span>{show.location}</span>
                    <span>{show.age}</span>
                  </div>

                  <p className="mt-2 flex-1 text-[0.82rem] leading-relaxed text-zinc-300">
                    {show.description}
                    {show.limitedSeats && (
                      <span className="mt-2 block text-[0.75rem] text-gold/90">
                        Места ограничены ({show.limitedSeats} мест).
                      </span>
                    )}
                  </p>

                  <div className="mt-4 space-y-2">
                    {show.bookingUrl && (
                      <Link
                        href={show.bookingUrl}
                        className="inline-flex w-full items-center justify-center rounded-sm border border-gold bg-gold px-3 py-2 text-[0.7rem] font-medium uppercase tracking-[0.26em] text-dark transition-all duration-150 hover:border-gold-light hover:bg-gold-light hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] active:scale-[0.96] active:shadow-[0_0_28px_rgba(212,175,55,0.55)] active:ring-2 active:ring-gold active:ring-offset-2 active:ring-offset-[#0b0b0b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0b] focus-visible:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                      >
                        Купить билет
                      </Link>
                    )}
                    {show.videoReel && (
                      <button
                        type="button"
                        onClick={() => setVideoModal(show)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-gold/60 px-3 py-2 text-[0.7rem] font-medium uppercase tracking-[0.26em] text-gold transition-all duration-150 hover:border-gold hover:bg-gold/10 hover:shadow-[0_0_18px_rgba(212,175,55,0.25)] active:scale-[0.96] active:shadow-[0_0_26px_rgba(212,175,55,0.45)] active:ring-2 active:ring-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                      >
                        <span className="rounded-full border border-gold p-0.5">
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        </span>
                        Смотреть ролик
                      </button>
                    )}
                    {!show.bookingUrl && (
                      <a
                        href={INSTAGRAM_DM}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center rounded-sm border border-gold/40 px-3 py-2 text-[0.7rem] font-medium uppercase tracking-[0.26em] text-gold transition-all duration-150 hover:border-gold hover:bg-gold/10 hover:shadow-[0_0_18px_rgba(212,175,55,0.25)] active:scale-[0.96] active:shadow-[0_0_26px_rgba(212,175,55,0.45)] active:ring-2 active:ring-gold active:ring-offset-2 active:ring-offset-[#0b0b0b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0b]"
                      >
                        Узнать о показах
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      {videoModal?.videoReel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setVideoModal(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Закрыть видео"
        >
          <div
            className="relative max-h-[85vh] w-full max-w-[min(360px,95vw)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setVideoModal(null)}
              className="absolute -top-10 right-0 text-zinc-400 hover:text-cream"
              aria-label="Закрыть"
            >
              <span className="text-2xl">×</span>
            </button>
            <p className="mb-2 text-center text-sm text-gold">{videoModal.title} · Закусилье</p>
            <video
              src={videoModal.videoReel}
              className="aspect-[9/16] w-full rounded-lg border border-gold/30 object-cover"
              controls
              autoPlay
              muted
              playsInline
            />
          </div>
        </div>
      )}
    </section>
  );
}

