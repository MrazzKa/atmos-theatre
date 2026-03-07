import Link from "next/link";
import Navbar from "@/components/Navbar";
import ReceiptClient from "./ReceiptClient";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return { title: "Статус заказа | ATMOS" };
}

export default function ReceiptPage({ params }) {
  const orderId = params?.orderId ?? null;
  return (
    <main className="min-h-screen bg-dark text-cream">
      <Navbar />
      <div className="mx-auto max-w-2xl px-5 pt-28 pb-16 md:px-8 md:pt-32">
        <Link
          href="/"
          className="mb-6 inline-block text-[0.7rem] uppercase tracking-wider text-zinc-400 hover:text-gold"
        >
          ← На главную
        </Link>
        <ReceiptClient orderId={orderId} />
      </div>
    </main>
  );
}
