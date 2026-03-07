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
  showTitle,
  showDateLabel,
  showTimeLabel,
  onConfirmPayment,
  onConfirmed,
}) {
  const [step, setStep] = useState("payment"); // "payment" | "thanks"
  const [confirming, setConfirming] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [attachError, setAttachError] = useState("");
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
    if (!pdfFile) return;
    setConfirming(true);
    setAttachError("");
    try {
      const formData = new FormData();
      formData.append("file", pdfFile);
      const attachRes = await fetch(`/api/booking/order/${orderId}/attach-payment-pdf`, {
        method: "POST",
        body: formData,
      });
      const attachData = await attachRes.json().catch(() => ({}));
      if (!attachRes.ok) {
        setAttachError(attachData.error || "Не удалось загрузить PDF");
        return;
      }

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
    const receiptUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/booking/receipt/${orderId}`
        : `/booking/receipt/${orderId}`;

    return (
      <div className="space-y-6 rounded-lg border border-gold/20 bg-dark-card p-6 md:p-8">
        <div className="text-center">
          <p className="font-heading text-xl text-gold">✓ Заявка принята</p>
          <p className="mt-2 text-sm text-zinc-300">
            Мы проверим оплату (обычно 15–30 минут) и подтвердим заказ. После этого билеты можно будет скачать по ссылке ниже.
          </p>
        </div>

        <p className="text-sm text-zinc-400">
          Сохраните ссылку — по ней вы сможете проверить статус заказа и скачать билеты после подтверждения администратором.
        </p>

        <div className="rounded border border-gold/30 bg-black/30 px-4 py-3">
          <p className="text-[0.65rem] uppercase tracking-wider text-zinc-500">
            Ссылка на ваш заказ
          </p>
          <a
            href={receiptUrl}
            className="mt-1 block break-all font-body text-sm text-gold hover:underline"
          >
            {receiptUrl}
          </a>
          <Link
            href={receiptUrl}
            className="mt-3 inline-block rounded-sm border border-gold px-4 py-2 text-[0.7rem] uppercase tracking-wider text-gold hover:bg-gold hover:text-dark"
          >
            Открыть страницу заказа
          </Link>
        </div>

        <p className="text-sm text-zinc-300">
          Мы свяжемся с вами по номеру {customerPhone}, если потребуется уточнение.
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
        <li>Оплатите и сохраните скрин или чек в PDF</li>
        <li>Вернитесь сюда, приложите PDF и нажмите «Я оплатил»</li>
      </ol>

      <div className="mt-6 flex flex-col gap-4">
        <a
          href={KASPI_PAY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-sm border border-gold bg-gold px-6 py-4 font-body text-[0.75rem] font-medium uppercase tracking-wider text-dark hover:bg-gold-light"
        >
          <span className="inline-block h-6 w-6 rounded bg-[#e21a1a]" title="Kaspi" />
          Оплатить через Kaspi
        </a>

        <div>
          <label htmlFor="payment-pdf" className="block text-[0.7rem] uppercase tracking-wider text-zinc-500">
            Подтверждение оплаты (PDF)
          </label>
          <input
            id="payment-pdf"
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => {
              setPdfFile(e.target.files?.[0] || null);
              setAttachError("");
            }}
            className="mt-1 w-full rounded border border-zinc-600 bg-zinc-800/50 px-3 py-2 text-cream file:mr-2 file:rounded file:border-0 file:bg-gold/20 file:px-2 file:py-1 file:text-[0.7rem] file:text-gold"
          />
          <p className="mt-1 text-[0.65rem] text-zinc-500">
            Приложите скрин или чек оплаты — после этого станет доступна кнопка «Я оплатил»
          </p>
        </div>

        {attachError && <p className="text-sm text-red-400">{attachError}</p>}

        <button
          type="button"
          onClick={handleConfirm}
          disabled={!pdfFile || confirming}
          className="rounded-sm border border-gold/60 px-6 py-3 font-body text-[0.7rem] uppercase tracking-wider text-gold hover:border-gold hover:bg-gold/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {confirming ? "Отправка…" : "Я оплатил"}
        </button>
      </div>
    </div>
  );
}
