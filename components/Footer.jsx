import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-gold/10 bg-black/60 py-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-[0.75rem] text-zinc-500 md:flex-row md:px-8">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo-white.png"
            alt="ATMOS"
            width={80}
            height={24}
            className="h-6 w-auto opacity-40"
          />
          <span className="hidden text-[0.75rem] uppercase tracking-[0.22em] text-zinc-500 md:inline">
            ATMOS · молодёжный экспериментальный театр
          </span>
        </div>
        <p className="text-[0.72rem] text-zinc-600">
          © {new Date().getFullYear()} ATMOS. Все права защищены.
        </p>
      </div>
    </footer>
  );
}

