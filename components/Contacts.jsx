"use client";

import { contacts } from "../lib/data";
import Reveal from "./ui/Reveal";

const INSTAGRAM_DM = "https://ig.me/m/atmos_theatre";

function IconCircle({ children, href, label }) {
  const content = (
    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/25 text-gold transition hover:-translate-y-1 hover:bg-gold hover:text-dark">
      {children}
    </div>
  );
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="inline-block"
      >
        {content}
      </a>
    );
  }
  return content;
}

export default function Contacts() {
  return (
    <section
      id="contacts"
      className="bg-dark-light/95 py-20 text-cream md:py-24"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 md:flex-row md:px-8">
        <div className="flex-1">
          <div className="mb-8">
            <p className="font-display text-[0.8rem] uppercase tracking-[0.35em] text-gold">
              КОНТАКТЫ
            </p>
            <h2 className="mt-3 font-heading text-2xl tracking-[0.06em] md:text-[2rem]">
              Как нас найти
            </h2>
          </div>

          <Reveal className="space-y-5 text-sm text-zinc-200">
            <div>
              <p className="text-[0.8rem] uppercase tracking-[0.26em] text-zinc-500">
                Площадка
              </p>
              <p className="mt-1 font-heading text-lg text-cream">
                {contacts.venue}
              </p>
              <p className="mt-1 text-zinc-400">{contacts.address}</p>
            </div>

            <div>
              <p className="text-[0.8rem] uppercase tracking-[0.26em] text-zinc-500">
                Связаться
              </p>
              <p className="mt-1">
                Телефон / WhatsApp:{" "}
                <a
                  href={`tel:${contacts.phone.replace(/\s/g, "")}`}
                  className="text-gold hover:text-gold-light"
                >
                  {contacts.phone}
                </a>
              </p>
              <p className="mt-1 text-zinc-400">
                Художественный руководитель: {contacts.director}
              </p>
              <p className="mt-1 text-[0.8rem] text-zinc-400">
                Для связи по спектаклям пишите нам в Instagram Direct.
              </p>
            </div>

            <div className="pt-2">
              <p className="mb-3 text-[0.8rem] uppercase tracking-[0.26em] text-zinc-500">
                Соцсети
              </p>
              <div className="flex flex-wrap gap-3">
                <IconCircle href={contacts.instagram} label="Instagram">
                  {/* Instagram glyph */}
                  <span className="text-xs">IG</span>
                </IconCircle>
                <IconCircle href={contacts.tiktok} label="TikTok">
                  <span className="text-xs">TT</span>
                </IconCircle>
                <IconCircle href={contacts.whatsapp} label="WhatsApp">
                  <span className="text-xs">WA</span>
                </IconCircle>
                <IconCircle href={contacts.gis} label="2GIS">
                  <span className="text-xs">2G</span>
                </IconCircle>
              </div>
            </div>

            <div className="pt-4">
              <a
                href={INSTAGRAM_DM}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-sm border border-gold px-6 py-2.5 font-body text-[0.7rem] uppercase tracking-[0.26em] text-gold transition hover:bg-gold hover:text-dark"
              >
                Задать вопрос
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal
          delay={0.12}
          className="flex-1 rounded-md border border-gold/18 bg-gradient-to-br from-[#15120f] via-[#0d0d0d] to-[#050505] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.85)]"
        >
          <p className="text-[0.8rem] uppercase tracking-[0.26em] text-zinc-500">
            КАРТА
          </p>
          <p className="mt-2 text-sm text-zinc-200">
            Откройте нас в 2GIS, чтобы проложить маршрут до Qyzyljar Creative
            Centre.
          </p>
          <a
            href={contacts.gis}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center justify-between rounded-md border border-gold/25 bg-black/40 px-4 py-3 text-sm text-cream hover:border-gold hover:bg-black/60"
          >
            <span className="flex flex-col">
              <span className="text-[0.75rem] uppercase tracking-[0.24em] text-gold">
                ОТКРЫТЬ В 2GIS
              </span>
              <span className="text-[0.82rem] text-zinc-300">
                Маршрут до Qyzyljar Creative Centre
              </span>
            </span>
            <span className="ml-3 text-lg">📍</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}

