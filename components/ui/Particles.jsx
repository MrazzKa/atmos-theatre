"use client";

const PARTICLES = Array.from({ length: 18 }).map((_, index) => {
  const left = 5 + ((index * 7.3) % 90);
  const delay = (index * 1.7) % 16;
  const duration = 14 + ((index * 3.1) % 16);
  const size = 1 + ((index * 0.37) % 1.5);
  return { id: index, left, delay, duration, size };
});

export default function Particles() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-10"
    >
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-gold opacity-0"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animation: `particleUp ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

