"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";

export default function Counter({ value, suffix = "", label }) {
  const nodeRef = useRef(null);
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node || hasRun) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasRun) {
            setHasRun(true);
            const controls = animate(0, value, {
              duration: 2,
              ease: [0.23, 1, 0.32, 1],
              onUpdate(v) {
                node.textContent = `${Math.round(v)}${suffix}`;
              },
            });
            return () => controls.stop();
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasRun, value, suffix]);

  return (
    <div className="flex flex-col items-start gap-1">
      <span
        ref={nodeRef}
        className="font-heading text-3xl tracking-[0.26em] text-gold md:text-4xl"
      >
        0
      </span>
      <span className="font-body text-xs uppercase tracking-[0.24em] text-zinc-400">
        {label}
      </span>
    </div>
  );
}

