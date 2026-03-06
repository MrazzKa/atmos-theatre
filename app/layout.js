import "./globals.css";
import { Cinzel, Cormorant_Garamond, Raleway } from "next/font/google";
import CursorGlow from "../components/ui/CursorGlow";
import Particles from "../components/ui/Particles";

const display = Cinzel({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const heading = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-heading",
  display: "swap",
});

const body = Raleway({
  subsets: ["latin", "latin-ext"],
  weight: ["200", "300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: "ATMOS — молодёжный экспериментальный театр",
  description:
    "ATMOS — молодёжный экспериментальный театр в Петропавловске. Атмосферные спектакли, полное погружение в историю и живая молодая труппа.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body
        className={`${display.variable} ${heading.variable} ${body.variable} bg-dark text-cream antialiased`}
      >
        <CursorGlow />
        <Particles />
        {children}
      </body>
    </html>
  );
}
