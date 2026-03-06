"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { KASPI_PAY_URL } from "@/lib/seatLayout";

const HOLD_MINUTES = 30;

export default function PaymentStep({
  orderId,
  seats,
  totalAmount,
  customerPhone,
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
    const placesStr = seats
      .reduce((acc, s) => {
        const key = s.row;
        const existing = acc.find((a) => a.row === key);
        if (existing) existing.seats.push(s.seat);
        else acc.push({ row: key, seats: [s.seat] });
        return acc;
      }, [])
      .map((a) => `Ряд ${a.row}, места ${a.seats.join(", ")}`)
      .join("; ");

    return (
      <div className="rounded-lg border border-gold/20 bg-dark-card p-6 text-center md:p-8">
        <p className="font-heading text-xl text-gold">✓ Спасибо! Ваш заказ принят.</p>
        <p className="mt-3 text-sm text-zinc-300">
          Мы проверим оплату и свяжемся с вами по номеру {customerPhone}.
        </p>
        <p className="mt-2 text-sm text-zinc-400">Ваши места: {placesStr}</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-sm border border-gold bg-gold px-6 py-2.5 font-body text-[0.7rem] font-medium uppercase tracking-[0.26em] text-dark hover:bg-gold-light"
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
