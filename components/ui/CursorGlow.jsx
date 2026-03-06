"use client";

import { useEffect, useState } from "react";

export default function CursorGlow() {
  const [pos, setPos] = useState({ x: -9999, y: -9999 });

  useEffect(() => {
    const handleMove = (event) => {
      if (window.innerWidth < 768) return;
      setPos({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[40] h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.22)_0%,rgba(201,168,76,0)_70%)] blur-3xl transition-[transform,left,top] duration-150 ease-out max-md:hidden"
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
    />
  );
}

