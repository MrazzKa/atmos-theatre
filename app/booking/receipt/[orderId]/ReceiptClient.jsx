"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toPng } from "html-to-image";
import TicketCard from "@/components/booking/TicketCard";

export default function ReceiptClient({ orderId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setError("Нет номера заказа");
      return;
    }
    fetch(`/api/booking/order/${orderId}`)
      .then((res) => {
        if (res.status === 404) throw new Error("Заказ не найден");
        if (!res.ok) throw new Error("Ошибка загрузки");
        return res.json();
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [orderId]);

  const downloadTicket = async (elementId, filename) => {
    const node = document.getElementById(elementId);
    if (!node) return;
    try {
      const dataUrl = await toPng(node, { pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (_) {}
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-gold/10 bg-dark-card py-12 text-center">
        <p className="text-gold/70">Загрузка заказа…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-lg border border-red-900/30 bg-dark-card p-6 text-center">
        <p className="text-red-400">{error || "Заказ не найден"}</p>
        <Link href="/" className="mt-4 inline-block text-sm text-gold hover:underline">
          На главную
        </Link>
      </div>
    );
  }

  const { status, showTitle, showDateLabel, showTimeLabel, seats } = data;
  const shortId = String(orderId).slice(0, 6).toUpperCase();

  if (status === "pending" || status === "expired") {
    return (
      <div className="space-y-4 rounded-lg border border-gold/20 bg-dark-card p-6 md:p-8">
        <h1 className="font-heading text-xl text-gold">
          {status === "expired" ? "Заказ истёк" : "Ожидаем подтверждение оплаты"}
        </h1>
        <p className="text-sm text-zinc-300">
          {status === "expired"
            ? "Время на оплату истекло. Места освобождены. Оформите заказ заново, если хотите купить билеты."
            : "После проверки оплаты администратором здесь появятся ваши билеты. Обычно это занимает 15–30 минут. Сохраните эту страницу в закладки или мы свяжемся с вами по телефону."}
        </p>
        <p className="text-[0.7rem] text-zinc-500">
          Заказ #{shortId}
        </p>
        <Link
          href="/"
          className="inline-block rounded-sm border border-gold bg-gold px-5 py-2 font-body text-[0.7rem] uppercase tracking-wider text-dark hover:bg-gold-light"
        >
          На главную
        </Link>
      </div>
    );
  }

  if (status === "cancelled") {
    return (
      <div className="space-y-4 rounded-lg border border-zinc-700 bg-dark-card p-6 md:p-8">
        <h1 className="font-heading text-xl text-zinc-400">Заказ отменён</h1>
        <p className="text-sm text-zinc-400">
          Этот заказ был отменён. Места освобождены.
        </p>
        <Link href="/" className="inline-block text-sm text-gold hover:underline">
          На главную
        </Link>
      </div>
    );
  }

  if (status === "paid") {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <p className="font-heading text-xl text-gold">✓ Оплата подтверждена. Ваши билеты</p>
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
                await downloadTicket(
                  `ticket-${orderId}-${s.row}-${s.seat}`,
                  `ATMOS-ticket-row-${s.row}-seat-${s.seat}.png`,
                );
              }
            }}
            className="rounded-sm border border-gold/60 px-5 py-2.5 text-[0.7rem] uppercase tracking-wider text-gold hover:border-gold hover:bg-gold/10"
          >
            Скачать все билеты
          </button>
        )}

        <Link
          href="/"
          className="inline-block rounded-sm border border-gold bg-gold px-6 py-2.5 font-body text-[0.7rem] font-medium uppercase tracking-[0.26em] text-dark hover:bg-gold-light"
        >
          Вернуться на главную
        </Link>
      </div>
    );
  }

  return null;
}
