"use client";

import clsx from "clsx";

export default function TicketCard({
  id,
  showTitle,
  date,
  time,
  row,
  seat,
  ticketNumber,
}) {
  return (
    <div
      id={id}
      className="relative w-full max-w-[800px] overflow-hidden rounded-xl border border-gold/25 bg-gradient-to-br from-[#191310] via-[#090909] to-[#050505] px-5 py-4 text-cream shadow-[0_24px_80px_rgba(0,0,0,0.85)] sm:px-7 sm:py-5 md:px-10 md:py-6"
    >
      {/* Декоративные лучи */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 top-0 h-full w-40 bg-[radial-gradient(circle_at_top,rgba(201,168,76,0.32),transparent_60%)] opacity-60" />
        <div className="absolute -right-10 bottom-0 h-full w-40 bg-[radial-gradient(circle_at_bottom,rgba(201,168,76,0.28),transparent_60%)] opacity-60" />
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gold/25 to-transparent opacity-50" />
      </div>

      <div className="relative flex h-[220px] items-stretch gap-4 sm:h-[240px] md:h-[260px]">
        {/* Левая полоса */}
        <div className="flex w-10 items-center justify-between border-r border-gold/30 bg-black/40 px-1 py-3 sm:w-12 sm:px-1.5 md:w-14">
          <div
            className="text-[0.6rem] tracking-[0.24em] text-zinc-300"
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          >
            Атмосферный театр ATMOS
          </div>
        </div>

        {/* Центральная часть */}
        <div className="flex flex-1 flex-col justify-between py-2 sm:py-3 md:py-4">
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.28em] text-gold/70">
              АТМОСФЕРНЫЙ ТЕАТР
            </p>
            <h2 className="mt-1 font-display text-lg uppercase tracking-[0.35em] text-cream sm:text-xl">
              ATMOS
            </h2>

            <p className="mt-4 font-heading text-lg italic text-cream sm:text-xl md:text-2xl">
              «{showTitle}»
            </p>
            <p className="mt-1 text-[0.7rem] uppercase tracking-[0.26em] text-zinc-400">
              БИЛЕТ №{ticketNumber}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="rounded border border-zinc-500/70 bg-black/40 px-3 py-2 text-center">
                <div className="text-[0.55rem] uppercase tracking-[0.26em] text-zinc-400">
                  Ряд
                </div>
                <div className="mt-1 font-display text-xl text-cream">{row}</div>
              </div>
              <div className="rounded border border-zinc-500/70 bg-black/40 px-3 py-2 text-center">
                <div className="text-[0.55rem] uppercase tracking-[0.26em] text-zinc-400">
                  Место
                </div>
                <div className="mt-1 font-display text-xl text-cream">
                  {seat}
                </div>
              </div>
            </div>

            <div className="flex flex-col text-[0.78rem] text-zinc-300 sm:text-[0.82rem]">
              <span>
                Дата <span className="text-cream">{date}</span>
              </span>
              <span>
                Начало <span className="text-cream">{time}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Правая полоса */}
        <div className="flex w-9 items-center justify-between border-l border-gold/30 bg-black/40 px-1 py-3 sm:w-11 sm:px-1.5 md:w-12">
          <div
            className="text-[0.55rem] tracking-[0.24em] text-zinc-300"
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          >
            Qyzyljar Creative Centre
          </div>
        </div>
      </div>
    </div>
  );
}

