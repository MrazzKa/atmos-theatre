"use client";

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
      className="relative flex w-full max-w-[800px] overflow-hidden rounded-lg border border-gold/20 bg-[#0c0b09] text-white shadow-xl"
      style={{ aspectRatio: "800/280", minHeight: "240px" }}
    >
      {/* Левая заглушка — чёрная, вертикальный текст */}
      <div className="flex w-12 shrink-0 items-center justify-center rounded-l-md bg-black py-4 sm:w-14">
        <div
          className="text-[0.55rem] leading-tight tracking-wider text-white/90"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)" }}
        >
          Атмосферный театр &quot;ATMOS&quot;
          <br />
          (г. Петропавловск, ул. Жабаева, 195)
        </div>
      </div>

      {/* Пунктир */}
      <div className="w-px shrink-0 border-l border-dashed border-white/30" />

      {/* Центральная часть — градиент и лучи */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        {/* Золотые диагональные лучи */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -left-20 -top-10 h-48 w-48 opacity-40"
            style={{
              background: "linear-gradient(135deg, rgba(201,168,76,0.35) 0%, transparent 60%)",
            }}
          />
          <div
            className="absolute -right-10 top-1/2 h-40 w-40 -translate-y-1/2 opacity-30"
            style={{
              background: "linear-gradient(225deg, rgba(201,168,76,0.3) 0%, transparent 60%)",
            }}
          />
        </div>

        <div className="relative flex flex-1 flex-col justify-between px-4 py-4 sm:px-6 sm:py-5">
          {/* Верхняя чёрная планка */}
          <div className="flex justify-center">
            <div className="rounded-md bg-black px-4 py-1.5">
              <span className="font-display text-[0.65rem] uppercase tracking-[0.3em] text-white sm:text-[0.7rem]">
                АТМОСФЕРНЫЙ ТЕАТР &quot;ATMOS&quot;
              </span>
            </div>
          </div>

          {/* Название спектакля в кавычках */}
          <p className="text-center font-heading text-xl italic text-white sm:text-2xl md:text-3xl">
            «{showTitle}»
          </p>

          {/* Тонкая линия */}
          <div className="mx-auto h-px w-3/4 max-w-xs bg-white/40" />

          {/* БИЛЕТ № и блоки Ряд/Место */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-heading text-base text-white sm:text-lg">
                БИЛЕТ №{ticketNumber}
              </span>
              <div className="flex gap-2">
                <div className="rounded-md border border-white/50 bg-black/60 px-3 py-2 text-center">
                  <div className="text-[0.5rem] uppercase tracking-wider text-white/70">Ряд</div>
                  <div className="mt-0.5 font-display text-lg text-white">{row}</div>
                </div>
                <div className="rounded-md border border-white/50 bg-black/60 px-3 py-2 text-center">
                  <div className="text-[0.5rem] uppercase tracking-wider text-white/70">Место</div>
                  <div className="mt-0.5 font-display text-lg text-white">{seat}</div>
                </div>
              </div>
            </div>
            <p className="text-[0.7rem] text-white/90 sm:text-[0.75rem]">
              Дата {date} / Начало {time}
            </p>
          </div>
        </div>
      </div>

      {/* Пунктир */}
      <div className="w-px shrink-0 border-l border-dashed border-white/30" />

      {/* Правая заглушка */}
      <div className="flex w-10 shrink-0 items-center justify-center rounded-r-md bg-black py-4 sm:w-12">
        <div
          className="text-[0.5rem] leading-tight tracking-wider text-white/90"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)" }}
        >
          Qyzyljar Creative Centre
        </div>
      </div>
    </div>
  );
}
