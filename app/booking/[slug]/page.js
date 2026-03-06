import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import BookingClient from "./BookingClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { title: "Бронирование | ATMOS" };
  }
  const { data } = await supabase
    .from("shows")
    .select("title")
    .eq("slug", params.slug)
    .single();
  return {
    title: data?.title ? `Бронирование — ${data.title} | ATMOS` : "Бронирование | ATMOS",
  };
}

export default async function BookingPage({ params }) {
  const slug = params.slug;
  const { data: show, error } = await supabase
    .from("shows")
    .select("id, slug, title, author, date, time, venue, price, is_active")
    .eq("slug", slug)
    .single();

  if (error || !show || !show.is_active) notFound();

  const dateStr = show.date
    ? new Date(show.date).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";
  const timeStr = show.time ? String(show.time).slice(0, 5) : "19:00";
  const price = show.price ?? 3000;

  return (
    <main className="min-h-screen bg-dark text-cream">
      <Navbar />
      <div className="mx-auto max-w-6xl px-5 pt-28 pb-16 md:px-8 md:pt-32">
        <Link
          href="/"
          className="mb-6 inline-block text-[0.7rem] uppercase tracking-wider text-zinc-400 hover:text-gold"
        >
          ← Назад к афише
        </Link>

        <header className="mb-8">
          <h1 className="font-heading text-2xl md:text-3xl">{show.title}</h1>
          {show.author && (
            <p className="mt-1 text-sm italic text-gold-dark">{show.author}</p>
          )}
          <p className="mt-2 text-sm text-zinc-400">
            {dateStr} · {timeStr}
            {show.venue && ` · ${show.venue}`}
          </p>
          <p className="mt-1 font-body text-[0.75rem] uppercase tracking-wider text-gold">
            {price.toLocaleString("ru")}₸ за место
          </p>
        </header>

        <BookingClient
          showSlug={show.slug}
          showTitle={show.title}
          pricePerSeat={price}
          showDateLabel={dateStr}
          showTimeLabel={timeStr}
        />
      </div>
    </main>
  );
}
