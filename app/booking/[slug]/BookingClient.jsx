"use client";

import { useState } from "react";
import SeatMap from "@/components/booking/SeatMap";
import BookingSidebar from "@/components/booking/BookingSidebar";
import PaymentStep from "@/components/booking/PaymentStep";
import { PRICE_PER_SEAT } from "@/lib/seatLayout";

export default function BookingClient({
  showSlug,
  showTitle,
  pricePerSeat,
  showDateLabel,
  showTimeLabel,
}) {
  const [selected, setSelected] = useState([]);
  const [step, setStep] = useState("seats"); // "seats" | "payment" | "thanks"
  const [orderId, setOrderId] = useState(null);
  const [orderSeats, setOrderSeats] = useState([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderPhone, setOrderPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  const price = pricePerSeat ?? PRICE_PER_SEAT;

  const removeSeat = (seat) => {
    setSelected((prev) =>
      prev.filter(
        (s) =>
          !(s.row === seat.row && s.seat === seat.seat && s.section === seat.section)
      )
    );
  };

  const handleSubmit = async ({ customerName, customerPhone, seats, paymentPdfFile }) => {
    setLoading(true);
    setCreateError("");
    try {
      let paymentPdfUrl = null;
      if (paymentPdfFile) {
        const formData = new FormData();
        formData.append("file", paymentPdfFile);
        const uploadRes = await fetch("/api/booking/upload-pdf", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json().catch(() => ({}));
        if (!uploadRes.ok) {
          setCreateError(uploadData.error || "Не удалось загрузить PDF");
          return;
        }
        paymentPdfUrl = uploadData.url;
      }

      const res = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          showSlug,
          customerName,
          customerPhone,
          seats,
          ...(paymentPdfUrl && { paymentPdfUrl }),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 409 && data.conflicting) {
          setCreateError("Часть мест уже занята. Обновите выбор.");
          setSelected((prev) =>
            prev.filter(
              (s) =>
                !data.conflicting.some(
                  (c) =>
                    c.row === s.row && c.seat === s.seat && c.section === s.section
                )
            )
          );
        } else {
          setCreateError(data.error || "Ошибка создания заказа");
        }
        return;
      }
      setOrderId(data.orderId);
      setOrderTotal(data.totalAmount);
      setOrderSeats(seats);
      setOrderPhone(customerPhone);
      setStep("payment");
    } finally {
      setLoading(false);
    }
  };

  if (step === "payment" || step === "thanks") {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <p className="text-zinc-400">
            Спектакль: <span className="text-cream">{showTitle}</span>
          </p>
          <div className="mt-6">
            <PaymentStep
              orderId={orderId}
              seats={orderSeats}
              totalAmount={orderTotal}
              customerPhone={orderPhone}
              showTitle={showTitle}
              showDateLabel={showDateLabel}
              showTimeLabel={showTimeLabel}
              onConfirmPayment={() => setStep("payment")}
              onConfirmed={() => setStep("thanks")}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="min-w-0">
        <SeatMap
          showSlug={showSlug}
          selected={selected}
          onSelect={setSelected}
          disabled={loading}
        />
      </div>
      <div className="lg:sticky lg:top-24 lg:self-start">
        <BookingSidebar
          selected={selected}
          onRemoveSeat={removeSeat}
          pricePerSeat={price}
          onSubmit={handleSubmit}
          loading={loading}
          error={createError}
        />
      </div>
    </div>
  );
}
