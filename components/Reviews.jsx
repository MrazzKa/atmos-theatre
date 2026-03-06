"use client";

import { StarIcon } from "@heroicons/react/24/solid";
import Reveal from "./ui/Reveal";
import SectionHeader from "./ui/SectionHeader";
import { reviews } from "../lib/data";

function Stars() {
  return (
    <div className="flex gap-1 text-gold">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} className="h-3.5 w-3.5" />
      ))}
    </div>
  );
}

export default function Reviews() {
  return (
    <section
      id="reviews"
      className="bg-dark-light/95 py-20 text-cream md:py-24"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeader label="ОТЗЫВЫ" title="Зрители о спектаклях ATMOS" />

        <Reveal>
          <div className="no-scrollbar reviews-scroll flex snap-x gap-5 overflow-x-auto pb-2 pt-1">
            {reviews.map((review, index) => (
              <article
                key={index}
                className="min-w-[320px] snap-start rounded-md border border-gold/12 bg-dark-card/90 p-6 shadow-[0_18px_70px_rgba(0,0,0,0.75)] transition-transform duration-300 hover:-translate-y-1 hover:border-gold/25"
              >
                <div className="mb-3 text-gold">
                  <span className="font-heading text-3xl">«</span>
                </div>
                <Stars />
                <p className="mt-4 font-heading text-[0.95rem] italic leading-relaxed text-cream/95">
                  {review.text}
                </p>
                <div className="mt-5 flex items-center justify-between text-[0.75rem] uppercase tracking-[0.22em] text-zinc-400">
                  <span>Зритель</span>
                  <span className="text-gold-dark">{review.show}</span>
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

