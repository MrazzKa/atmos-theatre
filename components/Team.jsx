"use client";

import Reveal from "./ui/Reveal";
import SectionHeader from "./ui/SectionHeader";
import { team } from "../lib/data";

export default function Team() {
  return (
    <section
      id="team"
      className="mx-auto max-w-5xl px-5 py-20 md:px-8 md:py-24"
    >
      <SectionHeader label="КОМАНДА" title="Те, кто создают ATMOS" />

      <Reveal>
        <div className="grid auto-rows-fr grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {team.map((member, index) => (
            <div
              key={member.name}
              className="flex flex-col items-center gap-3 rounded-md border border-gold/10 bg-dark-card/80 p-4 text-center shadow-[0_18px_60px_rgba(0,0,0,0.7)] transition duration-400 hover:border-gold hover:shadow-[0_0_32px_rgba(201,168,76,0.32)] hover:-translate-y-1.5"
              style={{ transitionDelay: `${index * 40}ms` }}
            >
              <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full border border-gold/20 bg-gradient-to-br from-[#15120d] via-[#080808] to-[#050505] text-gold shadow-[0_0_26px_rgba(201,168,76,0.18)]">
                <span className="font-heading text-2xl">
                  {member.photo ? (
                    // В будущем можно подставить Image
                    " "
                  ) : (
                    member.name.charAt(0)
                  )}
                </span>
              </div>
              <div className="space-y-1">
                <p className="font-heading text-[0.95rem] leading-snug">
                  {member.name}
                </p>
                <p className="font-display text-[0.7rem] uppercase tracking-[0.24em] text-gold-dark">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

