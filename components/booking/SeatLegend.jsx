"use client";

export default function SeatLegend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 text-[0.7rem] uppercase tracking-wider text-zinc-400">
      <span className="flex items-center gap-2">
        <span className="h-6 w-6 rounded-sm border border-zinc-600 bg-zinc-700/80" />
        Свободно
      </span>
      <span className="flex items-center gap-2">
        <span className="h-6 w-6 rounded-sm border border-gold-light bg-gold shadow-[0_0_12px_rgba(201,168,76,0.3)]" />
        Выбрано
      </span>
      <span className="flex items-center gap-2">
        <span className="h-6 w-6 rounded-sm border border-red-800/20 bg-red-900/40 opacity-60" />
        Занято
      </span>
      <span className="flex items-center gap-2">
        <span className="h-6 w-6 rounded-sm border border-zinc-800/30 bg-zinc-900/50 opacity-20" />
        Недоступно
      </span>
    </div>
  );
}
