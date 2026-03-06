"use client";

import Counter from "./ui/Counter";
import Divider from "./ui/Divider";
import Reveal from "./ui/Reveal";
import SectionHeader from "./ui/SectionHeader";
import { stats } from "../lib/data";

export default function About() {
  return (
    <section
      id="about"
      className="relative mx-auto max-w-5xl px-5 pb-20 pt-20 md:px-8 md:pt-24"
    >
      <SectionHeader
        label="О НАС"
        title={
          <>
            Театр, который{" "}
            <span className="italic text-gold">чувствует</span> время
          </>
        }
      />

      <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-start">
        <Reveal className="space-y-5 text-sm leading-relaxed text-zinc-300 md:text-[0.95rem]">
          <p className="font-body font-light">
            ATMOS — это не просто театр. Это пространство, где молодая энергия
            встречается с вечными вопросами, где эксперимент становится языком,
            а каждый спектакль — приглашением к диалогу.
          </p>
          <p className="font-body font-light">
            Мы создаём атмосферные спектакли, в которых зрители сидят на сцене
            с завязанными глазами в полной темноте — и переживают историю всеми
            чувствами. На нашей сцене оживают Стивен Кинг, Мольер, Зорин и
            новые авторы.
          </p>

          <div className="mt-6 border-l border-gold/40 pl-5 text-sm italic text-gold-light">
            «Ощутила себя призраком во время происходящего. Игра потрясающая.
            Даже запахи!»
          </div>
        </Reveal>

        <Reveal
          delay={0.15}
          className="flex flex-col gap-8 rounded-md border border-gold/8 bg-dark-card/70 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.65)]"
        >
          <div className="space-y-4">
            <p className="font-body text-[0.75rem] uppercase tracking-[0.26em] text-zinc-400">
              ATMOS В ЦИФРАХ
            </p>
            <Divider />
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {stats.map((item) => (
              <Counter
                key={item.label}
                value={item.value}
                suffix={item.suffix}
                label={item.label}
              />
            ))}
          </div>

          <p className="mt-4 text-[0.8rem] text-zinc-400">
            Цифры — лишь начало. Главное — то, что остаётся с вами после
            спектакля: ощущение прикосновения к чему-то живому и очень личному.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

