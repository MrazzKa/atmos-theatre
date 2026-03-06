"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const LINKS = [
  { id: "about", label: "О ТЕАТРЕ" },
  { id: "afisha", label: "АФИША" },
  { id: "team", label: "КОМАНДА" },
  { id: "reviews", label: "ОТЗЫВЫ" },
  { id: "news", label: "НОВОСТИ" },
  { id: "contacts", label: "КОНТАКТЫ" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      const scrollY = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${scrollY}px`;
    } else {
      const top = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      if (top) {
        const y = parseInt(top || "0", 10) * -1;
        window.scrollTo(0, Number.isNaN(y) ? 0 : y);
      }
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    };
  }, [open]);

  const handleNavClick = (id) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const offset = rect.top + window.scrollY - 90;
    window.scrollTo({ top: offset, behavior: "smooth" });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-gold/5 bg-[rgba(8,8,8,0.93)]/90 backdrop-blur-xl py-2"
          : "bg-transparent py-4"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 md:px-8">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-3"
        >
          <Image
            src="/images/logo.png"
            alt="ATMOS"
            width={140}
            height={36}
            className="h-9 w-auto drop-shadow-[0_0_18px_rgba(201,168,76,0.2)]"
            priority
          />
        </button>

        <nav className="hidden items-center gap-7 lg:flex">
          {LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleNavClick(link.id)}
              className="nav-link flex items-center gap-2"
            >
              <span>{link.label}</span>
              {link.id === "news" && (
                <span className="rounded-full border border-gold/40 bg-gold/10 px-2 py-[2px] text-[0.55rem] uppercase tracking-[0.22em] text-gold">
                  набор
                </span>
              )}
            </button>
          ))}
        </nav>

        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 bg-black/70 shadow-[0_0_18px_rgba(201,168,76,0.6)] lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
        >
          {open && (
            <span className="burger-orbit absolute inset-[-3px] rounded-full border border-gold/30 border-t-gold/80" />
          )}
          <span
            className={`absolute h-[2px] w-5 rounded-full bg-gold transition-transform duration-300 ${
              open ? "translate-y-0 rotate-45" : "-translate-y-2"
            }`}
          />
          <span
            className={`absolute h-[2px] w-5 rounded-full bg-gold transition-opacity duration-200 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute h-[2px] w-5 rounded-full bg-gold transition-transform duration-300 ${
              open ? "translate-y-0 -rotate-45" : "translate-y-2"
            }`}
          />
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-4 bg-[rgba(8,8,8,0.97)] px-6 text-center backdrop-blur-2xl lg:hidden"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavClick(link.id)}
                className="font-display text-lg tracking-[0.35em] text-cream hover:text-gold"
              >
                {link.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 text-xs uppercase tracking-[0.28em] text-zinc-500"
            >
              закрыть
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

