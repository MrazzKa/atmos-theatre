"use client";

import { useEffect, useState } from "react";
import { seatLayout } from "@/lib/seatLayout";
import SeatLegend from "./SeatLegend";

function seatKey(row, seat, section) {
  return `${row}-${seat}-${section}`;
}

export default function SeatMap({ showSlug, selected, onSelect, disabled }) {
  const [blockedSet, setBlockedSet] = useState(new Set());
  const [bookedSet, setBookedSet] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!showSlug) return;
    setLoading(true);
    setError(null);
    fetch(`/api/booking/seats?showSlug=${encodeURIComponent(showSlug)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Не удалось загрузить места");
        return res.json();
      })
      .then((data) => {
        setBlockedSet(
          new Set(data.blocked.map((b) => seatKey(b.row, b.seat, b.section)))
        );
        setBookedSet(
          new Set(data.booked.map((b) => seatKey(b.row, b.seat, b.section)))
        );
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [showSlug]);

  const selectedSet = new Set(
    selected.map((s) => seatKey(s.row, s.seat, s.section))
  );

  const getSeatState = (row, seat, section) => {
    const key = seatKey(row, seat, section);
    if (blockedSet.has(key)) return "blocked";
    if (bookedSet.has(key)) return "booked";
    if (selectedSet.has(key)) return "selected";
    return "available";
  };

  const handleSeatClick = (row, seat, section) => {
    if (disabled) return;
    const state = getSeatState(row, seat, section);
    if (state === "blocked" || state === "booked") return;
    if (state === "selected") {
      onSelect(selected.filter((s) => !(s.row === row && s.seat === seat && s.section === section)));
    } else {
      onSelect([...selected, { row, seat, section }]);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-lg border border-gold/10 bg-dark-card py-12">
        <p className="text-gold/70">Загрузка карты зала…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-lg border border-red-900/30 bg-dark-card py-12">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <SeatLegend />
      <div className="mt-4 md:mt-6">
        <div className="mx-auto w-full max-w-4xl rounded-lg border border-gold/10 bg-dark-card p-4 md:p-6">
          <div className="mx-auto max-w-[680px] sm:max-w-[720px]">
            {/* Сцена */}
            <div className="mb-6 rounded border border-gold/20 bg-gold/10 py-3 text-center font-body text-[0.7rem] uppercase tracking-[0.2em] text-gold/80">
              СЦЕНА
            </div>

            {/* Ряды */}
            <div className="flex flex-col gap-3">
              {seatLayout.map(({ row, left, center, right }) => {
                return (
                  <div key={row} className="flex items-center gap-2 md:gap-4">
                    <span className="w-6 shrink-0 text-right text-[0.55rem] text-zinc-500 md:text-[0.7rem]">
                      {row}
                    </span>
                    <div className="flex flex-1 items-center justify-center gap-1 xs:gap-2 md:gap-4">
                      {left.length > 0 && (
                        <div className="flex gap-[2px] xs:gap-0.5 md:gap-1">
                          {left.map((seat) => {
                            const state = getSeatState(row, seat, "left");
                            return (
                              <button
                                key={`left-${row}-${seat}`}
                                type="button"
                                title={`Ряд ${row}, Место ${seat}`}
                                onClick={() => handleSeatClick(row, seat, "left")}
                                className={`h-5 w-5 shrink-0 rounded-sm border text-[0.45rem] transition xs:h-6 xs:w-6 xs:text-[0.5rem] md:h-7 md:w-7 md:text-[0.6rem] lg:h-8 lg:w-8 ${
                                  state === "available"
                                    ? "border-zinc-600 bg-zinc-700/80 hover:border-emerald-600 hover:bg-emerald-800/60 cursor-pointer"
                                    : state === "selected"
                                    ? "scale-110 border-gold-light bg-gold shadow-[0_0_12px_rgba(201,168,76,0.3)] cursor-pointer"
                                    : state === "booked"
                                    ? "cursor-not-allowed border-red-800/20 bg-red-900/40 opacity-60"
                                    : "cursor-not-allowed border-zinc-800/30 bg-zinc-900/50 opacity-20"
                                }`}
                              >
                                {seat}
                              </button>
                            );
                          })}
                        </div>
                      )}
                      {center.length > 0 && (
                        <div className="flex gap-[2px] xs:gap-0.5 md:gap-1">
                          {center.map((seat) => {
                            const state = getSeatState(row, seat, "center");
                            return (
                              <button
                                key={`center-${row}-${seat}`}
                                type="button"
                                title={`Ряд ${row}, Место ${seat}`}
                                onClick={() => handleSeatClick(row, seat, "center")}
                                className={`h-5 w-5 shrink-0 rounded-sm border text-[0.45rem] transition xs:h-6 xs:w-6 xs:text-[0.5rem] md:h-7 md:w-7 md:text-[0.6rem] lg:h-8 lg:w-8 ${
                                  state === "available"
                                    ? "border-zinc-600 bg-zinc-700/80 hover:border-emerald-600 hover:bg-emerald-800/60 cursor-pointer"
                                    : state === "selected"
                                    ? "scale-110 border-gold-light bg-gold shadow-[0_0_12px_rgba(201,168,76,0.3)] cursor-pointer"
                                    : state === "booked"
                                    ? "cursor-not-allowed border-red-800/20 bg-red-900/40 opacity-60"
                                    : "cursor-not-allowed border-zinc-800/30 bg-zinc-900/50 opacity-20"
                                }`}
                              >
                                {seat}
                              </button>
                            );
                          })}
                        </div>
                      )}
                      {right.length > 0 && (
                        <div className="flex gap-[2px] xs:gap-0.5 md:gap-1">
                          {right.map((seat) => {
                            const state = getSeatState(row, seat, "right");
                            return (
                              <button
                                key={`right-${row}-${seat}`}
                                type="button"
                                title={`Ряд ${row}, Место ${seat}`}
                                onClick={() => handleSeatClick(row, seat, "right")}
                                className={`h-5 w-5 shrink-0 rounded-sm border text-[0.45rem] transition xs:h-6 xs:w-6 xs:text-[0.5rem] md:h-7 md:w-7 md:text-[0.6rem] lg:h-8 lg:w-8 ${
                                  state === "available"
                                    ? "border-zinc-600 bg-zinc-700/80 hover:border-emerald-600 hover:bg-emerald-800/60 cursor-pointer"
                                    : state === "selected"
                                    ? "scale-110 border-gold-light bg-gold shadow-[0_0_12px_rgba(201,168,76,0.3)] cursor-pointer"
                                    : state === "booked"
                                    ? "cursor-not-allowed border-red-800/20 bg-red-900/40 opacity-60"
                                    : "cursor-not-allowed border-zinc-800/30 bg-zinc-900/50 opacity-20"
                                }`}
                              >
                                {seat}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
