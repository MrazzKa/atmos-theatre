"use client";

export default function Divider({ className = "" }) {
  return (
    <div
      className={`flex items-center justify-center gap-2 text-gold/40 ${className}`}
    >
      <span className="h-px w-8 bg-gold/20" />
      <span className="h-1 w-1 rotate-45 border border-gold/40" />
      <span className="h-px w-8 bg-gold/20" />
    </div>
  );
}

