"use client";

import Reveal from "./ui/Reveal";
import SectionHeader from "./ui/SectionHeader";

const WHATSAPP_CASTING =
  "https://wa.me/77762120345?text=Здравствуйте! Хочу узнать о наборе в труппу ATMOS";

export default function News() {
  return (
    <section
      id="news"
      className="mx-auto max-w-4xl px-5 py-20 md:px-8 md:py-24"
    >
      <SectionHeader label="НОВОСТИ" title="Набор в труппу ATMOS" />

      <Reveal>
        <article className="rounded-md border border-gold/15 bg-gradient-to-br from-[#15120f] via-[#0d0d0d] to-[#050505] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.8)] md:p-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-[0.7rem] font-body uppercase tracking-[0.24em] text-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            <span>НАБОР ОТКРЫТ</span>
          </div>
          <p className="font-body text-sm leading-relaxed text-zinc-200 md:text-[0.95rem]">
            Мы открываем двери для новых голосов. Ищем актёров и актрис, которые
            не боятся экспериментировать, мобилографов, готовых ловить магию
            закулисья, и людей, которые чувствуют театр кожей. Если вы хотите
            стать частью труппы ATMOS — напишите нам.
          </p>
          <div className="mt-6">
            <a
              href={WHATSAPP_CASTING}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-sm border border-gold bg-gold px-6 py-2.5 font-body text-[0.7rem] font-medium uppercase tracking-[0.26em] text-dark transition hover:border-gold-light hover:bg-gold-light"
            >
              Написать в WhatsApp
            </a>
          </div>
        </article>
      </Reveal>
    </section>
  );
}

