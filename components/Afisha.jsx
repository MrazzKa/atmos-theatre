"use client";

import Image from "next/image";
import Reveal from "./ui/Reveal";
import SectionHeader from "./ui/SectionHeader";
import { shows } from "../lib/data";

const WHATSAPP_PREMIERE =
  "https://wa.me/77762120345?text=Здравствуйте! Хочу купить билет на «В погоне за Дон Жуаном» 27 марта";

const WHATSAPP_SHOWS =
  "https://wa.me/77762120345?text=Здравствуйте! Хочу узнать о ближайших показах";

export default function Afisha() {
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
                <div className="relative h-[170px] overflow-hidden">
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

                  {/* Верхний затемняющий градиент, чтобы бейджи читались на ярких афишах */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/75 via-black/40 to-transparent" />

                  <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-black/80 px-3 py-1.5 text-[0.63rem] font-body uppercase tracking-[0.26em] text-gold shadow-[0_0_18px_rgba(0,0,0,0.8)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    <span>{show.genre}</span>
                  </div>

                  {show.date && (
                    <div className="absolute right-3 top-3 rounded-full border border-gold bg-black/85 px-3 py-1.5 text-[0.63rem] font-body font-semibold uppercase tracking-[0.2em] text-gold shadow-[0_0_22px_rgba(0,0,0,0.9)]">
                      {show.date}
                    </div>
                  )}

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
                  </p>

                  <div className="mt-4">
                    <a
                      href={show.isPremiere ? WHATSAPP_PREMIERE : WHATSAPP_SHOWS}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex w-full items-center justify-center rounded-sm border px-3 py-2 text-[0.7rem] font-medium uppercase tracking-[0.26em] ${
                        show.isPremiere
                          ? "border-gold bg-gold text-dark hover:border-gold-light hover:bg-gold-light"
                          : "border-gold/40 text-gold hover:border-gold hover:bg-gold/10"
                      }`}
                    >
                      {show.isPremiere ? "Купить билет" : "Узнать о показах"}
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

