"use client";

import { useState } from "react";

const PHONE_REG = /^\+7\d{10}$/;

/** Форматирует ввод как +7 (XXX) XXX-XX-XX. Пользователь вводит только цифры. */
function formatPhoneDisplay(v) {
  let digits = v.replace(/\D/g, "");
  // Если в поле уже наш формат (+7 ...), первая 7 — от префикса, не от пользователя: не считаем её
  if (v.trim().startsWith("+7")) {
    if (digits.startsWith("7")) digits = digits.slice(1);
  } else {
    // Вставка/ввод без +7: 8 или 7 в начале — код страны
    if (digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"))) digits = digits.slice(1);
    if (digits.length === 1 && (digits === "7" || digits === "8")) return "+7 (";
  }
  if (digits.length > 10) digits = digits.slice(0, 10);
  if (digits.length === 0) return "+7 (";
  if (digits.length <= 3) return `+7 (${digits}`;
  if (digits.length <= 6) return `+7 (${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8, 10)}`;
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
  const digitsOnly = phone.replace(/\D/g, "");
  const hasEleven = digitsOnly.length === 11 && (digitsOnly.startsWith("7") || digitsOnly.startsWith("8"));
  const nationalTen = hasEleven ? digitsOnly.slice(1) : digitsOnly.slice(-10);
  const phoneValid = nationalTen.length === 10;
  const formValid =
    selected.length > 0 &&
    name.trim().length >= 2 &&
    phoneValid;

  const handlePhoneChange = (e) => {
    setPhone(formatPhoneDisplay(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formValid || loading) return;
    const digits = phone.replace(/\D/g, "");
    const ten = digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8")) ? digits.slice(1) : digits.slice(-10);
    onSubmit({
      customerName: name.trim(),
      customerPhone: ten.length === 10 ? `+7${ten}` : phone.trim(),
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
                inputMode="numeric"
                autoComplete="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="+7 (700) 123-45-67"
                className="mt-1 w-full rounded border border-zinc-600 bg-zinc-800/50 px-3 py-2 text-cream placeholder-zinc-500 focus:border-gold/50 focus:outline-none"
                required
              />
              <p className="mt-1 text-[0.65rem] text-zinc-500">
                Введите цифры номера — формат подставится сам
              </p>
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
