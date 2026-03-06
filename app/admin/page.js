"use client";

import { useEffect, useState, useCallback } from "react";

const STATUS_LABELS = {
  pending: "🟡 Ожидает",
  paid: "🟢 Оплачено",
  cancelled: "🔴 Отменён",
  expired: "⏳ Истёк",
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [savedPassword, setSavedPassword] = useState("");
  const [orders, setOrders] = useState([]);
  const [seatsByOrder, setSeatsByOrder] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState(""); // '' | pending | paid | cancelled | expired

  const fetchOrders = useCallback(async (pwd) => {
    const p = pwd ?? savedPassword;
    if (!p) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/orders?password=${encodeURIComponent(p)}`);
      if (res.status === 401) {
        setError("Неверный пароль");
        setOrders([]);
        setSeatsByOrder({});
        return;
      }
      if (!res.ok) throw new Error("Ошибка загрузки");
      const data = await res.json();
      setOrders(data.orders || []);
      setSeatsByOrder(data.seatsByOrder || {});
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [savedPassword]);

  useEffect(() => {
    if (!savedPassword) return;
    fetchOrders();
  }, [savedPassword, fetchOrders]);

  useEffect(() => {
    if (!savedPassword) return;
    const id = setInterval(() => fetchOrders(), 30000);
    return () => clearInterval(id);
  }, [savedPassword, fetchOrders]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!password.trim()) return;
    setSavedPassword(password.trim());
  };

  const handleConfirm = async (orderId) => {
    try {
      const res = await fetch("/api/admin/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, password: savedPassword }),
      });
      if (res.ok) fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = async (orderId) => {
    if (!confirm("Отменить заказ? Места будут освобождены.")) return;
    try {
      const res = await fetch("/api/admin/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, password: savedPassword }),
      });
      if (res.ok) fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredOrders = filter
    ? orders.filter((o) => o.status === filter)
    : orders;

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    paid: orders.filter((o) => o.status === "paid").length,
    free: orders.reduce((acc, o) => acc + (seatsByOrder[o.id]?.length || 0), 0),
  };

  if (!savedPassword) {
    return (
      <main className="min-h-screen bg-dark text-cream px-5 py-24">
        <div className="mx-auto max-w-sm">
          <h1 className="font-heading text-xl text-gold">Админ-панель</h1>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label htmlFor="admin-pw" className="block text-sm text-zinc-400">
                Пароль
              </label>
              <input
                id="admin-pw"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded border border-zinc-600 bg-zinc-800/50 px-3 py-2 text-cream focus:border-gold/50 focus:outline-none"
                autoFocus
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-sm border border-gold bg-gold px-4 py-2 font-body text-[0.7rem] uppercase tracking-wider text-dark hover:bg-gold-light"
            >
              Войти
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-dark text-cream px-5 py-12 md:px-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-heading text-2xl text-gold">Заказы</h1>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded border border-gold/10 bg-dark-card p-4">
            <p className="text-[0.7rem] uppercase text-zinc-500">Всего заказов</p>
            <p className="font-heading text-xl text-gold">{stats.total}</p>
          </div>
          <div className="rounded border border-gold/10 bg-dark-card p-4">
            <p className="text-[0.7rem] uppercase text-zinc-500">Ожидают оплаты</p>
            <p className="font-heading text-xl text-gold">{stats.pending}</p>
          </div>
          <div className="rounded border border-gold/10 bg-dark-card p-4">
            <p className="text-[0.7rem] uppercase text-zinc-500">Оплачено</p>
            <p className="font-heading text-xl text-emerald-400">{stats.paid}</p>
          </div>
          <div className="rounded border border-gold/10 bg-dark-card p-4">
            <p className="text-[0.7rem] uppercase text-zinc-500">Свободно мест</p>
            <p className="font-heading text-xl text-zinc-300">{stats.free}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter("")}
            className={`rounded border px-3 py-1.5 text-[0.7rem] uppercase tracking-wider ${
              !filter ? "border-gold bg-gold/20 text-gold" : "border-zinc-600 text-zinc-400 hover:text-cream"
            }`}
          >
            Все
          </button>
          {["pending", "paid", "cancelled", "expired"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={`rounded border px-3 py-1.5 text-[0.7rem] uppercase tracking-wider ${
                filter === s ? "border-gold bg-gold/20 text-gold" : "border-zinc-600 text-zinc-400 hover:text-cream"
              }`}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        {loading && orders.length === 0 ? (
          <p className="mt-8 text-zinc-500">Загрузка…</p>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-lg border border-gold/10 bg-dark-card">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-gold/10 text-[0.7rem] uppercase tracking-wider text-zinc-500">
                  <th className="p-3">Имя</th>
                  <th className="p-3">Телефон</th>
                  <th className="p-3">Места</th>
                  <th className="p-3">Сумма</th>
                  <th className="p-3">Статус</th>
                  <th className="p-3">Дата</th>
                  <th className="p-3">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((o) => {
                  const show = o.shows;
                  const seats = seatsByOrder[o.id] || [];
                  const placesStr = seats
                    .reduce((acc, s) => {
                      const key = s.row;
                      const ex = acc.find((a) => a.row === key);
                      if (ex) ex.seats.push(s.seat);
                      else acc.push({ row: key, seats: [s.seat] });
                      return acc;
                    }, [])
                    .map((a) => `Ряд ${a.row}: ${a.seats.join(", ")}`)
                    .join("; ");
                  const dateStr = o.created_at
                    ? new Date(o.created_at).toLocaleString("ru-RU", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "";
                  return (
                    <tr key={o.id} className="border-b border-zinc-800/50">
                      <td className="p-3 text-cream">{o.customer_name}</td>
                      <td className="p-3 text-zinc-300">{o.customer_phone}</td>
                      <td className="p-3 text-zinc-400">{placesStr || "—"}</td>
                      <td className="p-3 text-gold">{o.total_amount?.toLocaleString("ru")}₸</td>
                      <td className="p-3">{STATUS_LABELS[o.status] ?? o.status}</td>
                      <td className="p-3 text-zinc-500">{dateStr}</td>
                      <td className="p-3">
                        {o.status === "pending" && (
                          <span className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleConfirm(o.id)}
                              className="text-emerald-400 hover:text-emerald-300"
                              title="Подтвердить"
                            >
                              ✓ Подтвердить
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCancel(o.id)}
                              className="text-red-400 hover:text-red-300"
                              title="Отменить"
                            >
                              ✗ Отменить
                            </button>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filteredOrders.length === 0 && !loading && (
          <p className="mt-8 text-zinc-500">Нет заказов</p>
        )}
      </div>
    </main>
  );
}
