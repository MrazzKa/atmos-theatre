"use client";

import { useState } from "react";

const PHONE_REG = /^\+7\d{10}$/;

function formatPhone(v) {
  const digits = v.replace(/\D/g, "").slice(-10);
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `+7 ${digits}`;
  if (digits.length <= 6) return `+7 ${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `+7 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

export default function BookingSidebar({
  selected,
  onRemoveSeat,
  pricePerSeat,
  onSubmit,
  loading,
  error,
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const total = selected.length * pricePerSeat;
  const phoneNormalized = phone.replace(/\D/g, "");
  const phoneValid = phoneNormalized.length === 10 && phoneNormalized.startsWith("7");
  const fullPhone = phoneValid ? `+7${phoneNormalized}` : phone;
  const formValid =
    selected.length > 0 &&
    name.trim().length >= 2 &&
    (fullPhone.match(PHONE_REG) || (phoneNormalized.length === 10 && fullPhone.startsWith("+7")));

  const handlePhoneChange = (e) => {
    const v = e.target.value;
    setPhone(formatPhone(v));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formValid || loading) return;
    const normalized = phone.replace(/\D/g, "").slice(-10);
    onSubmit({
      customerName: name.trim(),
      customerPhone: normalized.length === 10 ? `+7${normalized}` : phone.trim(),
      seats: selected,
    });
  };

  return (
    <div className="rounded-lg border border-gold/10 bg-dark-card p-4 md:p-5 md:sticky md:top-24">
      <h3 className="font-heading text-lg text-gold">Ваш заказ</h3>

      {selected.length === 0 ? (
        <p className="mt-3 text-sm text-zinc-400">
          Выберите места на карте зала
        </p>
      ) : (
        <>
          <ul className="mt-3 space-y-1.5">
            {selected
              .slice()
              .sort((a, b) => a.row - b.row || a.seat - b.seat)
              .map((s, i) => (
                <li
                  key={`${s.row}-${s.seat}-${s.section}-${i}`}
                  className="flex items-center justify-between text-sm text-zinc-300"
                >
                  <span>
                    Ряд {s.row}, место {s.seat}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveSeat(s)}
                    className="text-red-400 hover:text-red-300"
                    aria-label="Убрать"
                  >
                    ×
                  </button>
                </li>
              ))}
          </ul>

          <p className="mt-4 font-body text-[0.75rem] uppercase tracking-wider text-zinc-400">
            Итого: {selected.length} × {pricePerSeat.toLocaleString("ru")}₸ ={" "}
            <span className="text-gold">{total.toLocaleString("ru")}₸</span>
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="booking-name" className="block text-[0.7rem] uppercase tracking-wider text-zinc-500">
                Имя
              </label>
              <input
                id="booking-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Алия"
                className="mt-1 w-full rounded border border-zinc-600 bg-zinc-800/50 px-3 py-2 text-cream placeholder-zinc-500 focus:border-gold/50 focus:outline-none"
                required
              />
            </div>
            <div>
              <label htmlFor="booking-phone" className="block text-[0.7rem] uppercase tracking-wider text-zinc-500">
                Телефон
              </label>
              <input
                id="booking-phone"
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="+7 700 123 4567"
                className="mt-1 w-full rounded border border-zinc-600 bg-zinc-800/50 px-3 py-2 text-cream placeholder-zinc-500 focus:border-gold/50 focus:outline-none"
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}
            <button
              type="submit"
              disabled={!formValid || loading}
              className="w-full rounded-sm border border-gold bg-gold px-4 py-3 font-body text-[0.7rem] font-medium uppercase tracking-[0.26em] text-dark transition hover:border-gold-light hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Отправка…" : "Перейти к оплате"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
