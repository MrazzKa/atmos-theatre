"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toPng } from "html-to-image";
import { KASPI_PAY_URL } from "@/lib/seatLayout";
import TicketCard from "@/components/booking/TicketCard";

const HOLD_MINUTES = 30;

export default function PaymentStep({
  orderId,
  seats,
  totalAmount,
  customerPhone,
  showTitle,
  showDateLabel,
  showTimeLabel,
  onConfirmPayment,
  onConfirmed,
}) {
  const [step, setStep] = useState("payment"); // "payment" | "thanks"
  const [confirming, setConfirming] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(HOLD_MINUTES * 60);
  const [createdAt] = useState(() => Date.now());

  useEffect(() => {
    const end = createdAt + HOLD_MINUTES * 60 * 1000;
    const tick = () => {
      const left = Math.max(0, Math.floor((end - Date.now()) / 1000));
      setSecondsLeft(left);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [createdAt]);

  const mm = Math.floor(secondsLeft / 60);
  const ss = secondsLeft % 60;
  const timerStr = `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;

  const downloadTicket = async (elementId, filename) => {
    const node = document.getElementById(elementId);
    if (!node) return;
    try {
      const dataUrl = await toPng(node, { pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      // ignore download errors
    }
  };

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      const res = await fetch("/api/booking/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      if (res.ok) {
        onConfirmPayment?.();
        setStep("thanks");
        onConfirmed?.();
      }
    } finally {
      setConfirming(false);
    }
  };

  if (step === "thanks") {
    const grouped = seats
      .slice()
      .sort((a, b) => a.row - b.row || a.seat - b.seat)
      .reduce((acc, s) => {
        const existing = acc.find((a) => a.row === s.row);
        if (existing) existing.seats.push(s.seat);
        else acc.push({ row: s.row, seats: [s.seat] });
        return acc;
      }, []);
    const placesStr = grouped
      .map((a) => `Ряд ${a.row}, места ${a.seats.join(", ")}`)
      .join("; ");

    const shortId = String(orderId).slice(0, 6).toUpperCase();

    return (
      <div className="space-y-6 rounded-lg border border-gold/20 bg-dark-card p-6 md:p-8">
        <div className="text-center">
          <p className="font-heading text-xl text-gold">✓ Ваши билеты готовы!</p>
          <p className="mt-2 text-sm text-zinc-300">
            Сохраните билеты — они понадобятся на входе.
          </p>
        </div>

        <div className="space-y-6">
          {seats
            .slice()
            .sort((a, b) => a.row - b.row || a.seat - b.seat)
            .map((s, index) => {
              const elementId = `ticket-${orderId}-${s.row}-${s.seat}`;
              const ticketNumber = `${shortId}-${index + 1}`;
              return (
                <div key={elementId} className="space-y-3">
                  <TicketCard
                    id={elementId}
                    showTitle={showTitle}
                    date={showDateLabel}
                    time={showTimeLabel}
                    row={s.row}
                    seat={s.seat}
                    ticketNumber={ticketNumber}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      downloadTicket(
                        elementId,
                        `ATMOS-ticket-row-${s.row}-seat-${s.seat}.png`,
                      )
                    }
                    className="inline-flex items-center justify-center rounded-sm border border-gold px-4 py-2 text-[0.7rem] uppercase tracking-[0.24em] text-gold hover:bg-gold hover:text-dark"
                  >
                    Скачать билет
                  </button>
                </div>
              );
            })}
        </div>

        {seats.length > 1 && (
          <button
            type="button"
            onClick={async () => {
              for (const s of seats) {
                const elementId = `ticket-${orderId}-${s.row}-${s.seat}`;
                // eslint-disable-next-line no-await-in-loop
                await downloadTicket(
                  elementId,
                  `ATMOS-ticket-row-${s.row}-seat-${s.seat}.png`,
                );
              }
            }}
            className="mt-2 inline-flex items-center justify-center rounded-sm border border-gold/60 px-5 py-2.5 text-[0.7rem] uppercase tracking-[0.24em] text-gold hover:border-gold hover:bg-gold/10"
          >
            Скачать все билеты
          </button>
        )}

        <p className="text-sm text-zinc-300">
          Мы проверим оплату и свяжемся с вами по номеру {customerPhone}.
        </p>

        <Link
          href="/"
          className="inline-block rounded-sm border border-gold bg-gold px-6 py-2.5 font-body text-[0.7rem] font-medium uppercase tracking-[0.26em] text-dark hover:bg-gold-light"
        >
          Вернуться на главную
        </Link>
      </div>
    );
  }

  const shortId = String(orderId).slice(0, 8);

  return (
    <div className="rounded-lg border border-gold/10 bg-dark-card p-6 md:p-8">
      <p className="text-[0.7rem] uppercase tracking-wider text-zinc-500">
        Заказ #{shortId}
      </p>
      <ul className="mt-2 text-sm text-zinc-300">
        {seats
          .slice()
          .sort((a, b) => a.row - b.row || a.seat - b.seat)
          .map((s, i) => (
            <li key={i}>
              Ряд {s.row}, место {s.seat}
            </li>
          ))}
      </ul>
      <p className="mt-4 font-heading text-3xl text-gold">
        {totalAmount.toLocaleString("ru")}₸
      </p>
      <p className="mt-1 text-[0.7rem] text-zinc-500">
        Заказ удерживается 30 минут. Осталось: {timerStr}
      </p>

      <ol className="mt-6 list-decimal space-y-2 pl-5 text-sm text-zinc-300">
        <li>Нажмите кнопку ниже — откроется Kaspi</li>
        <li>Введите точную сумму: {totalAmount.toLocaleString("ru")}₸</li>
        <li>Оплатите</li>
        <li>Вернитесь и нажмите «Я оплатил»</li>
      </ol>

      <div className="mt-6 flex flex-col gap-3">
        <a
          href={KASPI_PAY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-sm border border-gold bg-gold px-6 py-4 font-body text-[0.75rem] font-medium uppercase tracking-wider text-dark hover:bg-gold-light"
        >
          <span className="inline-block h-6 w-6 rounded bg-[#e21a1a]" title="Kaspi" />
          Оплатить через Kaspi
        </a>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={confirming}
          className="rounded-sm border border-gold/60 px-6 py-3 font-body text-[0.7rem] uppercase tracking-wider text-gold hover:border-gold hover:bg-gold/10 disabled:opacity-50"
        >
          {confirming ? "Отправка…" : "Я оплатил"}
        </button>
      </div>
    </div>
  );
}
